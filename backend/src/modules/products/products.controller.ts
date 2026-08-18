import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  QueryProductDto,
  UpdateProductDto,
} from './dto/product.dto';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Products & Categories')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ================= CATEGORIES =================

  @Get('categories')
  @ApiOperation({ summary: 'Lấy danh sách tất cả danh mục (có Cache Redis)' })
  findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Tạo danh mục mới' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.productsService.createCategory(dto);
  }

  @Get('categories/:slug')
  @ApiOperation({ summary: 'Lấy chi tiết danh mục theo slug' })
  findCategoryBySlug(@Param('slug') slug: string) {
    return this.productsService.findCategoryBySlug(slug);
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Cập nhật danh mục' })
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.productsService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Xóa danh mục' })
  deleteCategory(@Param('id') id: string) {
    return this.productsService.deleteCategory(id);
  }

  // ================= PRODUCTS =================

  @Get('featured')
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm nổi bật (Featured Products)' })
  findFeatured() {
    return this.productsService.findFeatured();
  }

  @Get()
  @ApiOperation({ summary: 'Tìm kiếm, lọc danh mục, lọc giá & phân trang sản phẩm' })
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm theo Slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm theo ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Tạo sản phẩm mới' })
  @ApiResponse({ status: 201, description: 'Tạo thành công' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Cập nhật thông tin sản phẩm' })
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Xóa sản phẩm' })
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
