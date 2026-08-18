import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsMongoId, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @ApiProperty({ example: '6543210fedcba9876543210b', description: 'ID của sản phẩm' })
  @IsMongoId({ message: 'Product ID không hợp lệ' })
  @IsNotEmpty({ message: 'Product ID không được để trống' })
  productId: string;

  @ApiProperty({ example: 1, description: 'Số lượng thêm vào giỏ' })
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({ example: { color: 'Đen', size: 'XL' } })
  @IsOptional()
  selectedAttributes?: Record<string, any>;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: '6543210fedcba9876543210b', description: 'ID của sản phẩm' })
  @IsMongoId({ message: 'Product ID không hợp lệ' })
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, description: 'Số lượng mới (bằng 0 sẽ xóa sản phẩm)' })
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(0, { message: 'Số lượng tối thiểu là 0' })
  @Type(() => Number)
  quantity: number;
}
