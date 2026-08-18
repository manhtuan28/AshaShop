import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { OrderStatus } from './schemas/order.schema';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới (từ Giỏ hàng hoặc danh sách items)' })
  @ApiResponse({ status: 201, description: 'Đơn hàng được tạo thành công' })
  createOrder(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(user._id || user.userId, dto);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của người dùng hiện tại' })
  getUserOrders(@CurrentUser() user: any) {
    return this.ordersService.getUserOrders(user._id || user.userId);
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '[Admin] Lấy thống kê tổng quan doanh thu & đơn hàng' })
  getAdminStats() {
    return this.ordersService.getAdminStats();
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '[Admin] Lấy tất cả đơn hàng hệ thống (có phân trang & lọc)' })
  getAllOrders(
    @Query('status') status?: OrderStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ordersService.getAllOrders(status, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng theo ID' })
  getOrderById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.getOrderById(id, user._id || user.userId, user.role);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '[Admin] Cập nhật trạng thái đơn hàng và thanh toán' })
  updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(id, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Hủy đơn hàng (người mua chỉ hủy được khi PENDING)' })
  cancelOrder(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.cancelOrder(id, user._id || user.userId, user.role);
  }
}
