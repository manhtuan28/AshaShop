import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../schemas/order.schema';

export class ShippingAddressDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty({ message: 'Tên người nhận không được để trống' })
  fullName: string;

  @ApiProperty({ example: '0987654321' })
  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @ApiProperty({ example: 'Số 12, Ngõ 34 Đường Láng' })
  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ nhận hàng không được để trống' })
  address: string;

  @ApiProperty({ example: 'Hà Nội' })
  @IsString()
  @IsNotEmpty({ message: 'Tỉnh/Thành phố không được để trống' })
  city: string;

  @ApiPropertyOptional({ example: 'Giao giờ hành chính' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class OrderItemInputDto {
  @ApiPropertyOptional({ example: '6543210fedcba9876543210b' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({ example: '6543210fedcba9876543210b' })
  @IsOptional()
  @IsString()
  product?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({ example: { color: 'Đen' } })
  @IsOptional()
  selectedAttributes?: Record<string, any>;
}

export class CreateOrderDto {
  @ApiProperty({ type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  @IsNotEmpty()
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.COD })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ type: [OrderItemInputDto], description: 'Danh sách sản phẩm (nếu bỏ trống sẽ lấy từ giỏ hàng hiện tại)' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items?: OrderItemInputDto[];
}

export class UpdateOrderStatusDto {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus?: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
