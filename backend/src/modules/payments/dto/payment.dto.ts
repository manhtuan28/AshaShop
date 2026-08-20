import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '../../orders/schemas/order.schema';

export class CreatePaymentUrlDto {
  @ApiProperty({ example: '6543210fedcba9876543210b', description: 'ID của đơn hàng' })
  @IsString()
  @IsNotEmpty({ message: 'Mã đơn hàng không được để trống' })
  orderId: string;

  @ApiPropertyOptional({ example: 'http://localhost:3000/payment/vnpay-return' })
  @IsOptional()
  @IsString()
  returnUrl?: string;
}

export class VerifyPaymentDto {
  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.VNPAY })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ example: { vnp_ResponseCode: '00', vnp_TxnRef: '6543210fedcba9876543210b' } })
  @IsNotEmpty()
  params: Record<string, any>;
}
