import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentUrlDto, VerifyPaymentDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaymentMethod } from '../orders/schemas/order.schema';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo URL thanh toán trực tuyến (VNPAY, MoMo, PayPal)' })
  @ApiResponse({ status: 201, description: 'URL thanh toán được tạo thành công' })
  async createPaymentUrl(
    @CurrentUser() user: any,
    @Body() dto: CreatePaymentUrlDto,
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    return this.paymentsService.createPaymentUrl(
      user._id || user.userId,
      dto,
      ipAddr,
    );
  }

  @Post('verify')
  @ApiOperation({ summary: 'Xác minh kết quả giao dịch thanh toán từ cổng thanh toán' })
  @ApiResponse({ status: 200, description: 'Kết quả xác minh thanh toán' })
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(dto);
  }

  @Get('vnpay-verify')
  @ApiOperation({ summary: 'Xác minh thanh toán VNPAY qua query parameters' })
  async vnpayVerify(@Query() query: Record<string, any>) {
    return this.paymentsService.verifyPayment({
      method: PaymentMethod.VNPAY,
      params: query,
    });
  }

  @Get('momo-verify')
  @ApiOperation({ summary: 'Xác minh thanh toán MoMo qua query parameters' })
  async momoVerify(@Query() query: Record<string, any>) {
    return this.paymentsService.verifyPayment({
      method: PaymentMethod.MOMO,
      params: query,
    });
  }

  @Get('paypal-verify')
  @ApiOperation({ summary: 'Xác minh thanh toán PayPal qua query parameters' })
  async paypalVerify(@Query() query: Record<string, any>) {
    return this.paymentsService.verifyPayment({
      method: PaymentMethod.PAYPAL,
      params: query,
    });
  }
}
