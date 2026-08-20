import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, IsArray } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: '6a8655c49db8d218d427601f', description: 'ID của sản phẩm' })
  @IsNotEmpty({ message: 'productId không được để trống' })
  @IsString()
  productId: string;

  @ApiPropertyOptional({ example: '6a8655c49db8d218d4276020', description: 'ID của đơn hàng liên quan' })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5, description: 'Số sao đánh giá (1-5)' })
  @IsNumber({}, { message: 'Điểm đánh giá phải là số từ 1 đến 5' })
  @Min(1, { message: 'Đánh giá tối thiểu là 1 sao' })
  @Max(5, { message: 'Đánh giá tối đa là 5 sao' })
  rating: number;

  @ApiProperty({ example: 'Sản phẩm rất đẹp, đúng mô tả, chất vải dày dặn đường may tỉ mỉ!', description: 'Nội dung nhận xét' })
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập nội dung đánh giá' })
  comment: string;

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/...'], description: 'Ảnh feedback thực tế' })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ example: { Size: 'M', MauSac: 'Đỏ' }, description: 'Thuộc tính sản phẩm đã mua' })
  @IsOptional()
  selectedAttributes?: Record<string, any>;
}
