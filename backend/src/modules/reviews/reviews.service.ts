import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Order, OrderDocument, OrderStatus } from '../orders/schemas/order.schema';
import { CreateReviewDto } from './dto/review.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Tạo đánh giá mới cho sản phẩm
   */
  async create(userId: string, dto: CreateReviewDto): Promise<ReviewDocument> {
    const product = await this.productModel.findById(dto.productId);
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa (nếu có orderId cụ thể hoặc chung)
    const existingFilter: any = {
      user: new Types.ObjectId(userId),
      product: new Types.ObjectId(dto.productId),
    };
    if (dto.orderId) {
      existingFilter.order = new Types.ObjectId(dto.orderId);
    }

    let review = await this.reviewModel.findOne(existingFilter);
    if (review) {
      // Cập nhật lại đánh giá nếu đã tồn tại
      review.rating = dto.rating;
      review.comment = dto.comment;
      if (dto.images) review.images = dto.images;
      if (dto.selectedAttributes) review.selectedAttributes = dto.selectedAttributes;
      await review.save();
    } else {
      review = new this.reviewModel({
        user: new Types.ObjectId(userId),
        product: new Types.ObjectId(dto.productId),
        order: dto.orderId ? new Types.ObjectId(dto.orderId) : null,
        rating: dto.rating,
        comment: dto.comment,
        images: dto.images || [],
        selectedAttributes: dto.selectedAttributes || {},
      });
      await review.save();
    }

    // Tính lại rating trung bình và số lượng đánh giá cho sản phẩm
    await this.recalculateProductRating(dto.productId);

    // Xóa cache danh sách sản phẩm
    await this.redisService.del(`reviews:product:${dto.productId}`);
    await this.redisService.delPattern('products:*');

    return review.populate([
      { path: 'user', select: 'name avatar' },
      { path: 'product', select: 'name slug images price' },
    ]);
  }

  /**
   * Tính lại rating trung bình cho sản phẩm
   */
  private async recalculateProductRating(productId: string): Promise<void> {
    const reviews = await this.reviewModel.find({ product: new Types.ObjectId(productId) });
    if (reviews.length === 0) {
      await this.productModel.findByIdAndUpdate(productId, {
        rating: 5,
        numReviews: 0,
      });
      return;
    }

    const totalScore = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalScore / reviews.length;

    await this.productModel.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
    });
  }

  /**
   * Lấy tất cả đánh giá của người dùng hiện tại
   */
  async getMyReviews(userId: string): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('product', 'name slug images price originalPrice category')
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Lấy danh sách sản phẩm từ các đơn hàng đã nhận thành công để người dùng đánh giá
   */
  async getPurchasedProductsForReview(userId: string) {
    // 1. Lấy tất cả đơn hàng đã giao thành công (DELIVERED) của user
    const orders = await this.orderModel
      .find({
        user: new Types.ObjectId(userId),
        orderStatus: OrderStatus.DELIVERED,
      })
      .sort({ createdAt: -1 })
      .exec();

    // 2. Lấy tất cả đánh giá hiện có của user
    const userReviews = await this.reviewModel
      .find({ user: new Types.ObjectId(userId) })
      .exec();

    const reviewMap = new Map<string, ReviewDocument>();
    userReviews.forEach(r => {
      const key = `${r.product.toString()}_${r.order ? r.order.toString() : ''}`;
      reviewMap.set(key, r);
      // Map theo productId nữa nếu không có order
      if (!reviewMap.has(r.product.toString())) {
        reviewMap.set(r.product.toString(), r);
      }
    });

    const pendingReviewItems: any[] = [];
    const reviewedItems: any[] = [];

    for (const order of orders) {
      for (const item of order.items) {
        const prodId = item.product ? item.product.toString() : '';
        const orderId = order._id.toString();
        const specificKey = `${prodId}_${orderId}`;
        const existingReview = reviewMap.get(specificKey) || reviewMap.get(prodId);

        const itemPayload = {
          orderId: order._id,
          orderCreatedAt: (order as any).createdAt,
          productId: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          selectedAttributes: item.selectedAttributes || {},
          isReviewed: !!existingReview,
          review: existingReview || null,
        };

        if (existingReview) {
          reviewedItems.push(itemPayload);
        } else {
          pendingReviewItems.push(itemPayload);
        }
      }
    }

    return {
      pending: pendingReviewItems,
      reviewed: reviewedItems,
      totalPending: pendingReviewItems.length,
      totalReviewed: reviewedItems.length,
    };
  }

  /**
   * Lấy danh sách đánh giá của 1 sản phẩm
   */
  async getByProduct(productId: string): Promise<ReviewDocument[]> {
    const cacheKey = `reviews:product:${productId}`;
    const cached = await this.redisService.get<ReviewDocument[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const reviews = await this.reviewModel
      .find({ product: new Types.ObjectId(productId) })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .exec();

    await this.redisService.set(cacheKey, reviews, 300); // cache 5m
    return reviews;
  }
}
