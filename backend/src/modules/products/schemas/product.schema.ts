import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0, default: null })
  originalPrice?: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Category.name, required: true })
  category: Category;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ default: 5, min: 0, max: 5 })
  rating: number;

  @Prop({ default: 0, min: 0 })
  numReviews: number;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ type: Object, default: {} })
  attributes?: Record<string, any>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 'text', description: 'text' });
