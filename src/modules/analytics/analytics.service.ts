import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { ApiResponse } from 'src/common/response';
import { plainToInstance } from 'class-transformer';
import { Analytics } from '../../entities/analytics.entity';
import { User } from '../../entities/user.entity';
import { App } from '../../entities/app.entity';
import { Device } from '../../entities/device.entity';
import { Browser } from '../../entities/browser.entity';
import { OS } from '../../entities/os.entity';
import { CollectAnalyticsDto, AnalyticsResponseDto } from '../../dto/analytics.dto';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Analytics)
        private readonly analyticsRepository: Repository<Analytics>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(App)
        private readonly appRepository: Repository<App>,
        @InjectRepository(Device)
        private readonly deviceRepository: Repository<Device>,
        @InjectRepository(Browser)
        private readonly browserRepository: Repository<Browser>,
        @InjectRepository(OS)
        private readonly osRepository: Repository<OS>,
    ) { }

    async collect(dto: CollectAnalyticsDto, user: User) {
        const app = await this.appRepository.findOne({ where: { id: dto.appId, user: { id: user.id } }, });
        if (!app) return ApiResponse.error('App not found or does not belong to this user');
        let device = await this.deviceRepository.findOne({ where: { name: dto.device } });
        if (!device) device = await this.deviceRepository.save(this.deviceRepository.create({ name: dto.device }));
        let browser = await this.browserRepository.findOne({ where: { name: dto.metadata.browser } });
        if (!browser) browser = await this.browserRepository.save(this.browserRepository.create({ name: dto.metadata.browser }));
        let os = await this.osRepository.findOne({ where: { name: dto.metadata.os } });
        if (!os) os = await this.osRepository.save(this.osRepository.create({ name: dto.metadata.os }));
        const analytics = this.analyticsRepository.create({
            customerId: dto.customerId,
            app,
            event: dto.event,
            url: dto.url,
            referrer: dto.referrer,
            device,
            ip_address: dto.ipAddress,
            time_stamp: new Date(dto.timestamp),
            browser,
            os,
            screen_size: dto.metadata.screenSize,
        });
        await this.analyticsRepository.save(analytics);
        const responseDto = plainToInstance(AnalyticsResponseDto, analytics, { excludeExtraneousValues: true });
        return ApiResponse.success("Analytics Collected Successfully", responseDto);
    }

    async getEventSummary(filters: { event?: string; startDate?: string; endDate?: string; appId?: string }) {
        const { event, startDate, endDate, appId } = filters;
        const where: any = {};
        if (event) where.event = event;
        // Filter by date
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            where.time_stamp = Between(start, end);
        } else if (startDate) {
            const start = new Date(startDate);
            const end = new Date(); // now
            where.time_stamp = Between(start, end);
        } else if (endDate) {
            const start = new Date(0); 
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // include the full end date
            where.time_stamp = Between(start, end);
        }
        // Filter by appId
        if (appId) {
            const app = await this.appRepository.findOne({ where: { id: appId } });
            if (!app) return ApiResponse.error('App not found for the given appId');
            where.app = { id: app.id };
        }
        const events = await this.analyticsRepository.find({ where, relations: ['app', 'device', 'browser', 'os'] });
        if (!events.length)
            return ApiResponse.success('No analytics found for the given filters', {
                event: event || 'all',
                count: 0,
                uniqueUsers: 0,
                deviceData: {},
            });
        const count = events.length;
        const uniqueUsers = new Set(events.map(e => e.customerId)).size;
        const deviceData: Record<string, number> = {};
        for (const e of events) {
            const name = e.device?.name || 'unknown';
            deviceData[name] = (deviceData[name] || 0) + 1;
        }
        return ApiResponse.success('Event summary retrieved successfully', { event: event || 'all', count, uniqueUsers, deviceData, });
    }

    async getUserStats(targetCustomerId: string, appIds: string[]) {
        if (!appIds?.length)
            return ApiResponse.error('No apps associated with this API key');
        const analyticsData = await this.analyticsRepository.find({
            where: { customerId: targetCustomerId, app: { id: In(appIds) } },
            relations: ['device', 'browser', 'os', 'app'],
            order: { time_stamp: 'DESC' },
        });
        if (!analyticsData.length)
            return ApiResponse.success('No analytics found for this user', { userId: targetCustomerId, totalEvents: 0, deviceDetails: {}, ipAddress: null, });
        const totalEvents = analyticsData.length;
        const recentEvent = analyticsData[0];
        const deviceDetails = {
            browser: recentEvent.browser?.name || 'unknown',
            os: recentEvent.os?.name || 'unknown',
        };
        return ApiResponse.success('User analytics retrieved successfully', { userId: targetCustomerId, totalEvents, deviceDetails, ipAddress: recentEvent.ip_address });
    }
}
