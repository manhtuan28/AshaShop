import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Order,
  OrderDocument,
  OrderStatus,
  PaymentStatus,
} from './schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { RedisService } from '../redis/redis.service';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly redisService: RedisService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto): Promise<OrderDocument> {
    let orderItemsToProcess: Array<{
      productId: string;
      quantity: number;
      selectedAttributes?: any;
    }> = [];

    if (dto.items && dto.items.length > 0) {
      orderItemsToProcess = dto.items.map((it: any) => ({
        productId: String(it.productId || it.product || (typeof it.product === 'object' ? it.product._id : '')),
        quantity: it.quantity,
        selectedAttributes: it.selectedAttributes,
      }));
    } else {
      const cart = await this.cartModel.findOne({ user: userId });
      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Giỏ hàng trống, không thể tạo đơn hàng');
      }
      orderItemsToProcess = cart.items.map((item) => ({
        productId: item.product.toString(),
        quantity: item.quantity,
        selectedAttributes: item.selectedAttributes,
      }));
    }

    const orderItems = [];
    let calculatedTotal = 0;

    for (const item of orderItemsToProcess) {
      const product = await this.productModel.findById(item.productId);
      if (!product) {
        throw new NotFoundException(`Sản phẩm với ID ${item.productId} không tồn tại`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Sản phẩm "${product.name}" chỉ còn ${product.stock} trong kho, không đủ số lượng đặt (${item.quantity})`,
        );
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      const image =
        product.images && product.images.length > 0
          ? product.images[0]
          : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';

      orderItems.push({
        product: product._id,
        name: product.name,
        image,
        price: product.price,
        quantity: item.quantity,
        selectedAttributes: item.selectedAttributes || {},
      });

      calculatedTotal += product.price * item.quantity;
    }

    const shippingFee = calculatedTotal > 500000 ? 0 : 30000;
    const finalTotalPrice = calculatedTotal + shippingFee;

    const newOrder = new this.orderModel({
      user: userId,
      items: orderItems,
      shippingAddress: dto.shippingAddress,
      paymentMethod: dto.paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING,
      totalPrice: finalTotalPrice,
      shippingFee,
    });

    const savedOrder = await newOrder.save();

    // Clear cart and product cache
    await this.cartModel.findOneAndUpdate({ user: userId }, { items: [], totalPrice: 0 });
    await this.redisService.del(`cart:${userId}`);
    await this.redisService.delPattern('products:*');

    return savedOrder;
  }

  async getUserOrders(userId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getOrderById(orderId: string, userId: string, role: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(orderId).populate('user', 'name email phone').exec();
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    const orderUser = order.user as any;
    const orderUserId = orderUser?._id ? orderUser._id.toString() : orderUser?.toString();

    if (role !== UserRole.ADMIN && orderUserId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem đơn hàng này');
    }

    return order;
  }

  async getAllOrders(status?: OrderStatus, page = 1, limit = 20) {
    const filter: Record<string, any> = {};
    if (status) {
      filter.orderStatus = status;
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto): Promise<OrderDocument> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    if (dto.orderStatus) {
      order.orderStatus = dto.orderStatus;
      if (dto.orderStatus === OrderStatus.DELIVERED) {
        order.paymentStatus = PaymentStatus.PAID;
      }
    }

    if (dto.paymentStatus) {
      order.paymentStatus = dto.paymentStatus;
    }

    return order.save();
  }

  async cancelOrder(orderId: string, userId: string, role: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    const isOwner = (order.user as any).toString() === userId;
    if (!isOwner && role !== UserRole.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền hủy đơn hàng này');
    }

    if (order.orderStatus !== OrderStatus.PENDING) {
      throw new BadRequestException('Chỉ có thể hủy đơn hàng ở trạng thái Chờ xử lý (PENDING)');
    }

    // Restore stock
    for (const item of order.items) {
      await this.productModel.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.orderStatus = OrderStatus.CANCELLED;
    const updated = await order.save();

    await this.redisService.delPattern('products:*');
    return updated;
  }

  async getAdminStats() {
    const totalOrders = await this.orderModel.countDocuments();
    const pendingOrders = await this.orderModel.countDocuments({ orderStatus: OrderStatus.PENDING });
    const deliveredOrders = await this.orderModel.countDocuments({ orderStatus: OrderStatus.DELIVERED });

    const totalRevenueResult = await this.orderModel.aggregate([
      { $match: { orderStatus: { $ne: OrderStatus.CANCELLED } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;
    const totalProducts = await this.productModel.countDocuments();

    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue,
      totalProducts,
    };
  }
}
