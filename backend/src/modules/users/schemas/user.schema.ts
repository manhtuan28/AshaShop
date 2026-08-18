import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: any) => {
      delete ret.password;
      delete ret.refreshToken;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: UserRole.CUSTOMER, enum: UserRole })
  role: UserRole;

  @Prop({ trim: true, default: '' })
  phone: string;

  @Prop({ trim: true, default: '' })
  address: string;

  @Prop({ default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' })
  avatar: string;

  @Prop({ default: null })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
