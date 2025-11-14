import { Controller, Post, Get, Body, Query, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AnalyticsService } from './analytics.service';
import { CollectAnalyticsDto } from '../../dto/analytics.dto';
import { ApiKeyGuard } from '../../gaurds/api-key-gaurds';

@Controller('analytics')
@UseGuards(ApiKeyGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Post('collect')
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async collect(@Req() req, @Body() dto: CollectAnalyticsDto) {
    return this.analyticsService.collect(req.user, dto);
  }

  @Get('event-summary')
  @Throttle({ default: { limit: 20, ttl: 60 } })
  async getEventSummary(
    @Req() req,
    @Query('event') event?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('app_id') appId?: string,
  ) {
    return this.analyticsService.getEventSummary(req.user, { event, startDate, endDate, appId });
  }

  @Get('user-stats')
  @Throttle({ default: { limit: 10, ttl: 60 } })
  async getUserStats(@Req() req, @Query('userId') userId: string) {
    const user = req.user;
    return this.analyticsService.getUserStats(user, userId);
  }
}
