import { Controller, Post, Get, Body, Query, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CollectAnalyticsDto, GetUserStatsDto, EventSummaryQueryDto } from '../../dto/analytics.dto';
import { AnalyticsResponseDto, EventSummaryApiResponseDto, UserStatsResponseDto } from '../../swagger dto/analytics-response.dto';
import { ApiKeyGuard } from '../../gaurds/api-key-gaurds';

@ApiTags('Analytics')
@ApiHeader({
	name: 'x-api-key',
	description: 'User API key to authenticate the request',
	required: true,
})
@Controller('analytics')
@UseGuards(ApiKeyGuard)
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) { }
	
	@Post('collect')
	@Throttle({ default: { limit: 5, ttl: 60 } })
	@ApiOperation({ summary: 'Collect analytics event for a given app' })
	@ApiResponse({
		status: 201,
		description: 'Analytics collected successfully',
		type: AnalyticsResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Validation failed or app not found',
	})
	async collect(@Req() req, @Body() dto: CollectAnalyticsDto) {
		return this.analyticsService.collect(dto, req.user);
	}

	@Get('event-summary')
	@Throttle({ default: { limit: 20, ttl: 60 } })
	@ApiOperation({ summary: 'Get summary of events for a given app and date range' })
	@ApiResponse({ status: 200, description: 'Event summary retrieved successfully', type: EventSummaryApiResponseDto })
	@ApiResponse({ status: 400, description: 'Invalid query parameters or app not found' })
	async getEventSummary(@Query() query: EventSummaryQueryDto) {
		return this.analyticsService.getEventSummary(query);
	}

	@Get('user-stats')
	@Throttle({ default: { limit: 10, ttl: 60 } })
	@ApiOperation({ summary: 'Get analytics for a specific user across apps' })
	@ApiResponse({ status: 200, description: 'User analytics retrieved successfully', type: UserStatsResponseDto })
	@ApiResponse({ status: 400, description: 'Invalid userId or no apps associated with API key' })
	async getUserStats(
		@Query(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) query: GetUserStatsDto,
		@Req() req
	) {
		return this.analyticsService.getUserStats(query.userId, req.userApps);
	}

}
