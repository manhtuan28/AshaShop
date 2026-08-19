import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email.toLowerCase() });
    if (existingUser) {
      throw new BadRequestException('Email này đã được đăng ký');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = new this.userModel({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
    });

    return newUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async findByFacebookId(facebookId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ facebookId }).exec();
  }

  async createOAuthUser(data: {
    name: string;
    email: string;
    avatar?: string;
    googleId?: string;
    facebookId?: string;
    authProvider: 'google' | 'facebook';
  }): Promise<UserDocument> {
    const randomPass = Math.random().toString(36).slice(-10) + '!@#$';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPass, salt);

    const newUser = new this.userModel({
      name: data.name,
      email: data.email.toLowerCase(),
      avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      password: hashedPassword,
      googleId: data.googleId || null,
      facebookId: data.facebookId || null,
      authProvider: data.authProvider,
      role: 'customer',
    });

    return newUser.save();
  }

  async setResetToken(email: string, token: string, expires: Date): Promise<UserDocument | null> {
    const hashedToken = await bcrypt.hash(token, 8);
    return this.userModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordExpires: expires,
        },
      },
      { new: true },
    ).exec();
  }

  async verifyAndResetPassword(email: string, token: string, newPass: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      email: email.toLowerCase(),
      resetPasswordExpires: { $gt: new Date() },
    }).exec();

    if (!user || !user.resetPasswordToken) {
      throw new BadRequestException('Mã xác thực không hợp lệ hoặc đã hết hạn.');
    }

    const isMatch = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isMatch) {
      throw new BadRequestException('Mã xác thực không chính xác.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return true;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.findById(id);

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    Object.assign(user, updateUserDto);
    return user.save();
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    if (refreshToken) {
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashedRefreshToken });
    } else {
      await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Không tìm thấy người dùng để xóa');
    }
    return { message: 'Xóa người dùng thành công' };
  }
}
