import { ApiProperty } from '@nestjs/swagger';


export class MetadataResponseDto {
    @ApiProperty({ example: 'Chrome' })
    browser: string;

    @ApiProperty({ example: 'Windows' })
    os: string;

    @ApiProperty({ example: '1920x1080' })
    screenSize: string;
}

export class AnalyticsResponseDto {
    @ApiProperty({ example: 'customer123' })
    customerId: string;

    @ApiProperty({ example: 'app-uuid-1234' })
    appId: string;

    @ApiProperty({ example: 'button_click' })
    event: string;

    @ApiProperty({ example: 'https://example.com/page' })
    url: string;

    @ApiProperty({ example: 'https://referrer.com' })
    referrer?: string;

    @ApiProperty({ example: 'Mobile' })
    device: string;

    @ApiProperty({ example: '192.168.1.1' })
    ipAddress: string;

    @ApiProperty({ example: '2025-11-15T12:00:00Z' })
    timestamp: string;

    @ApiProperty({ type: MetadataResponseDto })
    metadata: MetadataResponseDto;
}

export class EventSummaryResponseDto {
  @ApiProperty({ example: 'page_view' })
  event: string;

  @ApiProperty({ example: 15 })
  count: number;

  @ApiProperty({ example: 12 })
  uniqueUsers: number;

  @ApiProperty({
    example: { Mobile: 8, Desktop: 5, Tablet: 2 },
    description: 'Number of events per device type',
  })
  deviceData: Record<string, number>;
}

export class EventSummaryApiResponseDto {
  @ApiProperty({ example: 'Event summary retrieved successfully' })
  message: string;

  @ApiProperty({ type: EventSummaryResponseDto })
  data: EventSummaryResponseDto;
}


export class DeviceDetailsDto {
  @ApiProperty({ example: 'Chrome' })
  browser: string;

  @ApiProperty({ example: 'Windows' })
  os: string;
}

export class UserStatsResponseData {
  @ApiProperty({ example: 'customer-uuid-1234' })
  userId: string;

  @ApiProperty({ example: 15 })
  totalEvents: number;

  @ApiProperty({ type: DeviceDetailsDto })
  deviceDetails: DeviceDetailsDto;

  @ApiProperty({ example: '192.168.0.1', description: 'IP address of most recent event', nullable: true })
  ipAddress: string | null;
}

export class UserStatsResponseDto {
  @ApiProperty({ example: 'User analytics retrieved successfully' })
  message: string;

  @ApiProperty({ type: UserStatsResponseData })
  data: UserStatsResponseData;
}