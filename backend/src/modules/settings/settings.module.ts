import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from './schemas/setting.schema';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),
    RedisModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
