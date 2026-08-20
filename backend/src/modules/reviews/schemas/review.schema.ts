import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';
import { Order } from '../../orders/schemas/order.schema';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Product.name, required: true })
  product: Product;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Order.name, default: null })
  order?: Order;

  @Prop({ required: true, min: 1, max: 5, default: 5 })
  rating: number;

  @Prop({ required: true, trim: true })
  comment: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Object, default: {} })
  selectedAttributes?: Record<string, any>;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ product: 1, createdAt: -1 });
ReviewSchema.index({ user: 1, createdAt: -1 });
ReviewSchema.index({ user: 1, product: 1 });
