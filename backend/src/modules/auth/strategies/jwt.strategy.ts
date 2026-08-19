import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret', 'super_secret_jwt_key_ashashop_2026_dev_mode'),
    });
  }

  async validate(payload: JwtPayload) {
    let user = null;
    try {
      user = await this.usersService.findById(payload.sub);
    } catch (e) {
      // If ID changed after db seed, fallback to email
      if (payload.email) {
        user = await this.usersService.findByEmail(payload.email);
      }
    }

    if (!user && payload.email) {
      user = await this.usersService.findByEmail(payload.email);
    }

    if (!user) {
      throw new UnauthorizedException('Phiên đăng nhập đã hết hạn hoặc không tìm thấy tài khoản. Vui lòng đăng nhập lại.');
    }

    return {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    };
  }
}
