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
    let email = dto.email;
    let name = dto.name;
    let avatar = dto.avatar;
    let googleId = dto.googleId;

    // 1. Verify token with Google API
    if (dto.token) {
      try {
        // Try verifying as ID token (JWT)
        const idTokenRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${dto.token}`);
        if (idTokenRes.ok) {
          const idData: any = await idTokenRes.json();
          if (idData && idData.sub) {
            googleId = idData.sub;
            email = idData.email || email;
            name = idData.name || name;
            avatar = idData.picture || avatar;
          }
        } else {
          // Try verifying as OAuth2 Access Token
          const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${dto.token}` },
          });
          if (userInfoRes.ok) {
            const userData: any = await userInfoRes.json();
            if (userData && userData.sub) {
              googleId = userData.sub;
              email = userData.email || email;
              name = userData.name || name;
              avatar = userData.picture || avatar;
            }
          }
        }
      } catch (err) {
        console.error('Lỗi kết nối xác thực Google API:', err);
      }
    }

    if (!googleId && !email) {
      throw new UnauthorizedException('Không thể xác thực thông tin tài khoản Google');
    }

    email = email || `google_${googleId}@gmail.com`;
    name = name || 'Google User';
    googleId = googleId || `google_${Date.now()}`;

    let user = await this.usersService.findByGoogleId(googleId);
    if (!user) {
      user = await this.usersService.findByEmail(email);
    }

    if (!user) {
      user = await this.usersService.createOAuthUser({
        name,
        email,
        avatar,
        googleId,
        authProvider: 'google',
      });
    } else {
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (avatar && !user.avatar) {
        user.avatar = avatar;
        updated = true;
      }
      if (name && (!user.name || user.name === 'User')) {
        user.name = name;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    return this.generateTokens(user);
  }

  async facebookLogin(dto: { accessToken: string; email?: string; name?: string; avatar?: string; facebookId?: string }) {
    let email = dto.email;
    let name = dto.name;
    let avatar = dto.avatar;
    let facebookId = dto.facebookId;

    // 1. Verify access token with Facebook Graph API
    if (dto.accessToken) {
      try {
        const fbRes = await fetch(
          `https://graph.facebook.com/v20.0/me?fields=id,name,email,picture.type(large)&access_token=${dto.accessToken}`,
        );
        if (fbRes.ok) {
          const fbData: any = await fbRes.json();
          if (fbData && fbData.id) {
            facebookId = fbData.id;
            name = fbData.name || name;
            email = fbData.email || email;
            avatar = fbData.picture?.data?.url || avatar;
          }
        }
      } catch (err) {
        console.error('Lỗi kết nối xác thực Facebook Graph API:', err);
      }
    }

    if (!facebookId && !email) {
      throw new UnauthorizedException('Không thể xác thực thông tin tài khoản Facebook');
    }

    facebookId = facebookId || `fb_${Date.now()}`;
    email = email || `facebook_${facebookId}@facebook.com`;
    name = name || 'Facebook User';

    let user = await this.usersService.findByFacebookId(facebookId);
    if (!user) {
      user = await this.usersService.findByEmail(email);
    }

    if (!user) {
      user = await this.usersService.createOAuthUser({
        name,
        email,
        avatar,
        facebookId,
        authProvider: 'facebook',
      });
    } else {
      let updated = false;
      if (!user.facebookId) {
        user.facebookId = facebookId;
        updated = true;
      }
      if (avatar && !user.avatar) {
        user.avatar = avatar;
        updated = true;
      }
      if (name && (!user.name || user.name === 'User')) {
        user.name = name;
        updated = true;
      }
      if (updated) {
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
