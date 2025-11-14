// analytics/dto/collect-analytics.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsISO8601, IsObject } from 'class-validator';

export class CollectAnalyticsDto {
    @IsNotEmpty()
    @IsString()
    event!: string;

    @IsNotEmpty()
    @IsString()
    url!: string;

    @IsOptional()
    @IsString()
    referrer?: string;

    @IsNotEmpty()
    @IsString()
    device!: string;

    @IsNotEmpty()
    @IsString()
    ipAddress!: string;

    @IsNotEmpty()
    @IsISO8601()
    timestamp!: string;

    @IsObject()
    metadata!: {
        browser: string;
        os: string;
        screenSize: string;
        appName: string;
    };
}

