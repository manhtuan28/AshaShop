import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy cấu hình website toàn trang' })
  @ApiResponse({ status: 200, description: 'Lấy cấu hình thành công' })
  async getSettings() {
    const data = await this.settingsService.getSettings();
    return {
      success: true,
      data,
    };
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật cấu hình website toàn trang (Admin)' })
  @ApiResponse({ status: 200, description: 'Cập nhật cấu hình thành công' })
  async updateSettings(@Body() data: Record<string, any>) {
    const updated = await this.settingsService.updateSettings(data);
    return {
      success: true,
      message: 'Cập nhật cấu hình thành công',
      data: updated,
    };
  }
}
