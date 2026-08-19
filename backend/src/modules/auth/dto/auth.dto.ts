import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Họ và tên' })
  @IsString({ message: 'Tên phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email đăng ký' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Đường ABC, Hà Nội' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email đăng nhập' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Refresh Token' })
  @IsString()
  @IsNotEmpty({ message: 'Refresh token không được để trống' })
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email cần đặt lại mật khẩu' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email của tài khoản' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Mã xác thực OTP hoặc Reset Token' })
  @IsString()
  @IsNotEmpty({ message: 'Mã xác thực không được để trống' })
  token: string;

  @ApiProperty({ example: 'newPassword123', description: 'Mật khẩu mới' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
  newPassword: string;
}

export class GoogleLoginDto {
  @ApiProperty({ example: 'google_id_token_here', description: 'Google ID Token hoặc Token từ Google SDK' })
  @IsNotEmpty({ message: 'Google token không được để trống' })
  token: string;

  @ApiPropertyOptional({ example: 'user@gmail.com' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'https://avatar.url' })
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ example: 'google_123456789' })
  @IsOptional()
  googleId?: string;
}

export class FacebookLoginDto {
  @ApiProperty({ example: 'facebook_access_token_here', description: 'Facebook Access Token' })
  @IsNotEmpty({ message: 'Facebook token không được để trống' })
  accessToken: string;

  @ApiPropertyOptional({ example: 'user@facebook.com' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Nguyễn Văn B' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'https://avatar.url' })
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ example: 'fb_123456789' })
  @IsOptional()
  facebookId?: string;
}
