// analytics/dto/collect-analytics.dto.ts
import { IsString, IsUUID, IsISO8601, ValidateNested, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform, Expose } from 'class-transformer';
export class MetadataDto {
    @ApiProperty({ example: 'Chrome', description: 'Browser used by the user' })
    @IsString({ message: 'browser is required' })
    browser!: string;

    @ApiProperty({ example: 'Windows', description: 'Operating system of the user' })
    @IsString({ message: 'os is required' })
    os!: string;

    @ApiProperty({ example: '1920x1080', description: 'Screen size of the user device' })
    @IsString({ message: 'screenSize is required' })
    screenSize!: string;
}

export class CollectAnalyticsDto {
    @ApiProperty({ example: 'customer123', description: 'Unique customer ID' })
    @IsString({ message: 'customerId is required' })
    customerId!: string;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'App ID (UUID v4)' })
    @IsUUID('4', { message: 'appId must be a valid UUID' })
    appId!: string;

    @ApiProperty({ example: 'button_click', description: 'Event name to collect' })
    @IsString({ message: 'event is required' })
    event!: string;

    @ApiProperty({ example: 'https://example.com/page', description: 'Page URL where event occurred' })
    @IsString({ message: 'url is required' })
    url!: string;

    @ApiProperty({ example: 'https://referrer.com', description: 'Referrer URL', required: false })
    @IsString({ message: 'referrer is required' })
    referrer?: string;

    @ApiProperty({ example: 'Mobile', description: 'Device type' })
    @IsString({ message: 'device is required' })
    device!: string;

    @ApiProperty({ example: '192.168.1.1', description: 'IP address of the user' })
    @IsString({ message: 'ipAddress is required' })
    ipAddress!: string;

    @ApiProperty({ example: '2025-11-15T12:00:00Z', description: 'Event timestamp in ISO8601 format' })
    @IsISO8601({}, { message: 'timestamp is required and must be ISO8601 format' })
    timestamp!: string;

    @ApiProperty({ type: MetadataDto, description: 'Metadata including browser, OS, screen size' })
    @ValidateNested()
    @Type(() => MetadataDto)
    metadata!: MetadataDto;
}
export class EventSummaryQueryDto {
    @ApiPropertyOptional({ example: 'page_view', description: 'Filter by event name' })
    @IsOptional()
    @IsString()
    event?: string;

    @ApiPropertyOptional({ example: '2025-11-01', description: 'Start date (ISO8601 format)' })
    @IsOptional()
    @IsISO8601()
    startDate?: string;

    @ApiPropertyOptional({ example: '2025-11-15', description: 'End date (ISO8601 format)' })
    @IsOptional()
    @IsISO8601()
    endDate?: string;

    @ApiPropertyOptional({ example: '6b091ed9-9db0-4fbc-8f89-dde62eac2fb4', description: 'App ID to filter events' })
    @IsOptional()
    @IsUUID('4')
    appId?: string;
}
export class AnalyticsResponseDto {
    @Expose()
    id!: string;

    @Expose()
    customerId!: string;

    @Expose()
    @Transform(({ obj }) => ({ id: obj.app.id, name: obj.app.name }))
    app!: { id: string; name: string };

    @Expose()
    event!: string;

    @Expose()
    url!: string;

    @Expose()
    referrer?: string;

    @Expose()
    @Transform(({ obj }) => obj.device.name)
    device!: string;

    @Expose()
    @Transform(({ obj }) => obj.browser.name)
    browser!: string;

    @Expose()
    @Transform(({ obj }) => obj.os.name)
    os!: string;

    @Expose()
    screen_size!: string;

    @Expose()
    ip_address!: string;

    @Expose()
    time_stamp!: Date;

    @Expose()
    created_at!: Date;

    @Expose()
    updated_at!: Date;
}
export class GetUserStatsDto {
    @ApiProperty({ example: 'customer-uuid-1234', description: 'Customer ID to fetch analytics for' })
    @IsString({ message: 'userId is required in Query' })
    @Transform(({ value }) => value) // ensures value passes through
    userId!: string;
}