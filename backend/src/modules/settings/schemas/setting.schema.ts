import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ required: true, unique: true, default: 'site_config' })
  key: string;

  @Prop({ type: Object, required: true })
  data: Record<string, any>;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
