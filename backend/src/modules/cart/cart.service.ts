import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly redisService: RedisService,
  ) {}

  private getCacheKey(userId: string): string {
    return `cart:${userId}`;
  }

  async getCart(userId: string): Promise<CartDocument> {
    const cacheKey = this.getCacheKey(userId);
    const cached = await this.redisService.get<CartDocument>(cacheKey);
    if (cached) return cached;

    let cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product')
      .exec();

    if (!cart) {
      cart = await this.cartModel.create({
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }

    this.recalculateTotal(cart);
    await cart.save();
    await this.redisService.set(cacheKey, cart, 300); // 5 min cache
    return cart;
  }

  async addToCart(userId: string, dto: AddToCartDto): Promise<CartDocument> {
    const product = await this.productModel.findById(dto.productId);
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException(`Sản phẩm chỉ còn ${product.stock} trong kho`);
    }

    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new this.cartModel({
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === dto.productId,
    );

    if (existingIndex > -1) {
      const newQuantity = cart.items[existingIndex].quantity + dto.quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException(`Chỉ có thể thêm tối đa ${product.stock} sản phẩm này`);
      }
      cart.items[existingIndex].quantity = newQuantity;
      cart.items[existingIndex].price = product.price;
      if (dto.selectedAttributes) {
        cart.items[existingIndex].selectedAttributes = dto.selectedAttributes;
      }
    } else {
      cart.items.push({
        product: product._id as any,
        quantity: dto.quantity,
        price: product.price,
        selectedAttributes: dto.selectedAttributes || {},
      });
    }

    this.recalculateTotal(cart);
    await cart.save();
    await this.redisService.del(this.getCacheKey(userId));

    return this.getCart(userId);
  }

  async updateItem(userId: string, dto: UpdateCartItemDto): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Giỏ hàng trống');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === dto.productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Sản phẩm không có trong giỏ hàng');
    }

    if (dto.quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await this.productModel.findById(dto.productId);
      if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
      if (product.stock < dto.quantity) {
        throw new BadRequestException(`Sản phẩm chỉ còn ${product.stock} trong kho`);
      }
      cart.items[itemIndex].quantity = dto.quantity;
      cart.items[itemIndex].price = product.price;
    }

    this.recalculateTotal(cart);
    await cart.save();
    await this.redisService.del(this.getCacheKey(userId));

    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string): Promise<CartDocument> {
    return this.updateItem(userId, { productId, quantity: 0 });
  }

  async clearCart(userId: string): Promise<{ message: string }> {
    await this.cartModel.findOneAndUpdate({ user: userId }, { items: [], totalPrice: 0 });
    await this.redisService.del(this.getCacheKey(userId));
    return { message: 'Đã làm trống giỏ hàng' };
  }

  private recalculateTotal(cart: CartDocument): void {
    cart.totalPrice = cart.items.reduce((sum, item) => {
      const price = item.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }
}
