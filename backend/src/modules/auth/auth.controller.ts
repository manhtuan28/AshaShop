import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công và nhận Token' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập hệ thống' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công và nhận Token' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Làm mới Access Token bằng Refresh Token' })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Yêu cầu mã xác thực đặt lại mật khẩu' })
  @ApiResponse({ status: 200, description: 'Gửi mã xác thực thành công' })
  forgotPassword(@Body() forgotPasswordDto: { email: string }) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu mới bằng mã xác thực' })
  @ApiResponse({ status: 200, description: 'Đặt lại mật khẩu thành công' })
  resetPassword(@Body() resetPasswordDto: { email: string; token: string; newPassword: string }) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('oauth/google')
  @ApiOperation({ summary: 'Đăng nhập / Đăng ký qua Google' })
  @ApiResponse({ status: 200, description: 'Đăng nhập Google thành công và nhận Token' })
  googleLogin(@Body() googleDto: { token: string; email?: string; name?: string; avatar?: string; googleId?: string }) {
    return this.authService.googleLogin(googleDto);
  }

  @Post('oauth/facebook')
  @ApiOperation({ summary: 'Đăng nhập / Đăng ký qua Facebook' })
  @ApiResponse({ status: 200, description: 'Đăng nhập Facebook thành công và nhận Token' })
  facebookLogin(@Body() facebookDto: { accessToken: string; email?: string; name?: string; avatar?: string; facebookId?: string }) {
    return this.authService.facebookLogin(facebookDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất khỏi hệ thống' })
  logout(@CurrentUser() user: any) {
    return this.authService.logout(user._id || user.userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin người dùng đang đăng nhập' })
  getMe(@CurrentUser() user: any) {
    return user;
  }
}
