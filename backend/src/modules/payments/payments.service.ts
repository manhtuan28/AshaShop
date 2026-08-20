import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Order,
  OrderDocument,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '../orders/schemas/order.schema';
import { VnPayService } from './services/vnpay.service';
import { MomoService } from './services/momo.service';
import { PaypalService } from './services/paypal.service';
import { CreatePaymentUrlDto, VerifyPaymentDto } from './dto/payment.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly vnpayService: VnPayService,
    private readonly momoService: MomoService,
    private readonly paypalService: PaypalService,
    private readonly redisService: RedisService,
  ) {}

  async createPaymentUrl(
    userId: string,
    dto: CreatePaymentUrlDto,
    ipAddr: string,
  ): Promise<{ paymentUrl: string; orderId: string; method: PaymentMethod }> {
    const order = await this.orderModel.findById(dto.orderId);
    if (!order) {
      throw new NotFoundException(`Đơn hàng #${dto.orderId} không tồn tại`);
    }

    if (order.user.toString() !== userId && userId !== 'admin') {
      throw new BadRequestException('Bạn không có quyền thanh toán cho đơn hàng này');
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Đơn hàng này đã được thanh toán');
    }

    let paymentUrl = '';

    switch (order.paymentMethod) {
      case PaymentMethod.VNPAY: {
        paymentUrl = this.vnpayService.createPaymentUrl(order, ipAddr, dto.returnUrl);
        break;
      }
      case PaymentMethod.MOMO: {
        const momoResult = await this.momoService.createPaymentUrl(order, dto.returnUrl);
        paymentUrl = momoResult.payUrl;
        break;
      }
      case PaymentMethod.PAYPAL: {
        const paypalResult = await this.paypalService.createPaymentUrl(order, dto.returnUrl);
        paymentUrl = paypalResult.payUrl;
        break;
      }
      case PaymentMethod.BANK_TRANSFER:
      case PaymentMethod.COD:
      default: {
        paymentUrl = dto.returnUrl || `http://localhost:3000/orders`;
        break;
      }
    }

    return {
      paymentUrl,
      orderId: order._id.toString(),
      method: order.paymentMethod,
    };
  }

  async verifyPayment(dto: VerifyPaymentDto): Promise<{
    success: boolean;
    orderId: string;
    message: string;
    order?: OrderDocument;
  }> {
    let isSuccess = false;
    let orderId = '';
    let message = '';

    switch (dto.method) {
      case PaymentMethod.VNPAY: {
        const result = this.vnpayService.verifyReturn(dto.params);
        isSuccess = result.isSuccess;
        orderId = result.orderId;
        message = result.message;
        break;
      }
      case PaymentMethod.MOMO: {
        const result = this.momoService.verifyReturn(dto.params);
        isSuccess = result.isSuccess;
        orderId = result.orderId;
        message = result.message;
        break;
      }
      case PaymentMethod.PAYPAL: {
        const result = this.paypalService.verifyReturn(dto.params);
        isSuccess = result.isSuccess;
        orderId = result.orderId;
        message = result.message;
        break;
      }
      default: {
        orderId = dto.params.orderId;
        isSuccess = true;
        message = 'Thanh toán thành công';
      }
    }

    if (!orderId) {
      return {
        success: false,
        orderId: '',
        message: message || 'Không tìm thấy mã đơn hàng trong dữ liệu phản hồi từ cổng thanh toán',
      };
    }

    const order = await this.orderModel.findById(orderId);
    if (!order) {
      return {
        success: false,
        orderId,
        message: `Không tìm thấy đơn hàng #${orderId} trong hệ thống`,
      };
    }

    if (isSuccess) {
      order.paymentStatus = PaymentStatus.PAID;
      order.orderStatus = OrderStatus.CONFIRMED;
      await order.save();
      await this.redisService.del('orders:admin:stats');
      this.logger.log(`Xác thực thanh toán THÀNH CÔNG cho đơn hàng #${orderId} qua ${dto.method}`);
    } else {
      order.paymentStatus = PaymentStatus.FAILED;
      await order.save();
      this.logger.warn(`Xác thực thanh toán THẤT BẠI cho đơn hàng #${orderId} qua ${dto.method}: ${message}`);
    }

    return {
      success: isSuccess,
      orderId: order._id.toString(),
      message,
      order,
    };
  }
}
