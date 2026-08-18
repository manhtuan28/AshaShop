import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Thời trang Nam', description: 'Tên danh mục' })
  @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name: string;

  @ApiPropertyOptional({ example: 'thoi-trang-nam', description: 'Slug định danh đường dẫn (tự tạo nếu trống)' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Các sản phẩm thời trang dành cho nam giới' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...', description: 'Hình ảnh danh mục' })
  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Thời trang Nam Cao Cấp' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'thoi-trang-nam-cao-cap' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Mô tả mới' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  image?: string;
}
