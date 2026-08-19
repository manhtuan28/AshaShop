import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SettingsService {
  private readonly CACHE_PREFIX = 'settings:';
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    private readonly redisService: RedisService,
  ) {}

  async getSettings(key = 'site_config'): Promise<Record<string, any>> {
    const cacheKey = `${this.CACHE_PREFIX}${key}`;
    const cached = await this.redisService.get<Record<string, any>>(cacheKey);
    if (cached) {
      return cached;
    }

    const setting = await this.settingModel.findOne({ key }).lean().exec();
    const data = setting?.data || {};

    if (data && Object.keys(data).length > 0) {
      await this.redisService.set(cacheKey, data, this.CACHE_TTL);
    }

    return data;
  }

  async updateSettings(data: Record<string, any>, key = 'site_config'): Promise<Record<string, any>> {
    const setting = await this.settingModel.findOneAndUpdate(
      { key },
      { $set: { data } },
      { new: true, upsert: true },
    ).lean().exec();

    const cacheKey = `${this.CACHE_PREFIX}${key}`;
    await this.redisService.set(cacheKey, setting.data, this.CACHE_TTL);

    return setting.data;
  }
}
