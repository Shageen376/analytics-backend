// analytics/dto/collect-analytics.dto.ts
import { IsString, IsUUID, IsISO8601, ValidateNested } from 'class-validator';
import { Type, Transform, Expose } from 'class-transformer';

export class MetadataDto {
    @IsString({ message: 'browser is required' })
    browser!: string;

    @IsString({ message: 'os is required' })
    os!: string;

    @IsString({ message: 'screenSize is required' })
    screenSize!: string;
}
export class CollectAnalyticsDto {
    @IsString({ message: 'customerId is required' })
    customerId!: string;

    @IsUUID('4', { message: 'appId must be a valid UUID' })
    appId!: string;

    @IsString({ message: 'event is required' })
    event!: string;

    @IsString({ message: 'url is required' })
    url!: string;

    @IsString({ message: 'referrer is required' })
    referrer?: string;

    @IsString({ message: 'device is required' })
    device!: string;

    @IsString({ message: 'ipAddress is required' })
    ipAddress!: string;

    @IsISO8601({}, { message: 'timestamp is required and must be ISO8601 format' })
    timestamp!: string;

    @ValidateNested()
    @Type(() => MetadataDto)
    metadata!: MetadataDto;
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
  @IsString({ message: 'userId is required in Query' })
  @Transform(({ value }) => value) // ensures value passes through
  userId!: string;
}