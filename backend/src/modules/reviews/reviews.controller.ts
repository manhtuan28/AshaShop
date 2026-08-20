import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gửi đánh giá và bình luận sao cho sản phẩm' })
  @ApiResponse({ status: 201, description: 'Đánh giá đã được lưu thành công' })
  createReview(@CurrentUser() user: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user._id || user.userId, dto);
  }

  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy tất cả đánh giá của tôi' })
  getMyReviews(@CurrentUser() user: any) {
    return this.reviewsService.getMyReviews(user._id || user.userId);
  }

  @Get('purchased-products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm từ các đơn hàng đã mua để đánh giá' })
  getPurchasedProducts(@CurrentUser() user: any) {
    return this.reviewsService.getPurchasedProductsForReview(user._id || user.userId);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Lấy danh sách đánh giá của 1 sản phẩm' })
  getByProduct(@Param('productId') productId: string) {
    return this.reviewsService.getByProduct(productId);
  }
}
