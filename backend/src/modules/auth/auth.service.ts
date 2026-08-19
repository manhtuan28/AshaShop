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

  async forgotPassword(dto: { email: string }) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return {
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được xử lý.',
      };
    }

    // Generate 6-digit OTP code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.usersService.setResetToken(dto.email, resetCode, expires);

    return {
      success: true,
      message: 'Mã xác thực đặt lại mật khẩu đã được gửi đến email của bạn.',
      resetCode, // Included for easy development/testing verification
    };
  }

  async resetPassword(dto: { email: string; token: string; newPassword: string }) {
    await this.usersService.verifyAndResetPassword(dto.email, dto.token, dto.newPassword);
    return {
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.',
    };
  }

  async googleLogin(dto: { token: string; email?: string; name?: string; avatar?: string; googleId?: string }) {
    const email = dto.email || `google_user_${Date.now()}@gmail.com`;
    const name = dto.name || 'Google User';
    const googleId = dto.googleId || dto.token.slice(0, 30);

    let user = await this.usersService.findByGoogleId(googleId);
    if (!user) {
      user = await this.usersService.findByEmail(email);
    }

    if (!user) {
      user = await this.usersService.createOAuthUser({
        name,
        email,
        avatar: dto.avatar,
        googleId,
        authProvider: 'google',
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        if (dto.avatar) user.avatar = dto.avatar;
        await user.save();
      }
    }

    return this.generateTokens(user);
  }

  async facebookLogin(dto: { accessToken: string; email?: string; name?: string; avatar?: string; facebookId?: string }) {
    const email = dto.email || `facebook_user_${Date.now()}@facebook.com`;
    const name = dto.name || 'Facebook User';
    const facebookId = dto.facebookId || dto.accessToken.slice(0, 30);

    let user = await this.usersService.findByFacebookId(facebookId);
    if (!user) {
      user = await this.usersService.findByEmail(email);
    }

    if (!user) {
      user = await this.usersService.createOAuthUser({
        name,
        email,
        avatar: dto.avatar,
        facebookId,
        authProvider: 'facebook',
      });
    } else {
      if (!user.facebookId) {
        user.facebookId = facebookId;
        if (dto.avatar) user.avatar = dto.avatar;
        await user.save();
      }
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
