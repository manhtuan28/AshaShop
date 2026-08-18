import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) return null;

    return user;
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    const user = await this.usersService.create(registerDto);
    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    return this.generateTokens(user);
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const refreshSecret = this.configService.get<string>(
        'jwt.refreshSecret',
        'super_secret_refresh_jwt_key_ashashop_2026',
      );

      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
      }

      const isMatch = await bcrypt.compare(dto.refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Refresh token hết hạn hoặc không hợp lệ');
    }
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Đăng xuất thành công' };
  }

  private async generateTokens(user: UserDocument) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const jwtSecret = this.configService.get<string>(
      'jwt.secret',
      'super_secret_jwt_key_ashashop_2026_dev_mode',
    );
    const jwtExpiresIn = this.configService.get<string>('jwt.expiresIn', '1d');

    const refreshSecret = this.configService.get<string>(
      'jwt.refreshSecret',
      'super_secret_refresh_jwt_key_ashashop_2026',
    );
    const refreshExpiresIn = this.configService.get<string>(
      'jwt.refreshExpiresIn',
      '7d',
    );

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: jwtExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });

    // Save hashed refresh token to user
    await this.usersService.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}
