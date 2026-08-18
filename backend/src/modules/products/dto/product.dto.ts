import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Áo Thun Nam Cotton Cao Cấp', description: 'Tên sản phẩm' })
  @IsString()
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name: string;

  @ApiPropertyOptional({ example: 'ao-thun-nam-cotton-cao-cap' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'Chất liệu 100% cotton thoáng mát, co giãn tốt', description: 'Mô tả chi tiết' })
  @IsString()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({ example: 250000, description: 'Giá bán hiện tại (VNĐ)' })
  @IsNumber()
  @Min(0, { message: 'Giá sản phẩm phải lớn hơn hoặc bằng 0' })
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: 350000, description: 'Giá gốc trước khi giảm' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  originalPrice?: number;

  @ApiProperty({ example: '6543210fedcba9876543210a', description: 'ID danh mục sản phẩm' })
  @IsMongoId({ message: 'Category ID không hợp lệ' })
  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  categoryId: string;

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/...'], description: 'Danh sách ảnh sản phẩm' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: 100, description: 'Số lượng tồn kho' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiPropertyOptional({ example: true, description: 'Sản phẩm nổi bật (Featured)' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: { color: 'Đen', size: 'L' } })
  @IsOptional()
  attributes?: Record<string, any>;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Áo Thun Nam Cập Nhật' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'ao-thun-nam-cap-nhat' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 220000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({ example: 350000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  originalPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  attributes?: Record<string, any>;
}

export class QueryProductDto {
  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm (theo tên, mô tả)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Lọc theo Category ID hoặc Slug' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Giá tối thiểu' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Giá tối đa' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Lọc sản phẩm nổi bật (true/false)' })
  @IsOptional()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Sắp xếp theo: price_asc, price_desc, newest, rating' })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({ default: 1, description: 'Trang hiện tại' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12, description: 'Số sản phẩm mỗi trang' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 12;
}
