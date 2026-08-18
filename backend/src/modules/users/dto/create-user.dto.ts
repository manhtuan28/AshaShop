import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Họ và tên người dùng' })
  @IsString({ message: 'Tên phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Địa chỉ Email' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.CUSTOMER, description: 'Vai trò người dùng' })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role không hợp lệ' })
  role?: UserRole;

  @ApiPropertyOptional({ example: '0987654321', description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Đường ABC, Hà Nội', description: 'Địa chỉ' })
  @IsOptional()
  @IsString()
  address?: string;
}
