import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy thông tin giỏ hàng của người dùng hiện tại' })
  getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(user._id || user.userId);
  }

  @Post('add')
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  @ApiResponse({ status: 200, description: 'Đã thêm vào giỏ hàng' })
  addToCart(@CurrentUser() user: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(user._id || user.userId, dto);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Cập nhật số lượng sản phẩm trong giỏ' })
  updateItem(@CurrentUser() user: any, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(user._id || user.userId, dto);
  }

  @Delete('item/:productId')
  @ApiOperation({ summary: 'Xóa 1 sản phẩm khỏi giỏ hàng' })
  removeItem(@CurrentUser() user: any, @Param('productId') productId: string) {
    return this.cartService.removeItem(user._id || user.userId, productId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Xóa sạch tất cả sản phẩm trong giỏ hàng' })
  clearCart(@CurrentUser() user: any) {
    return this.cartService.clearCart(user._id || user.userId);
  }
}
