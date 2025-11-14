import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Analytics } from '../../entities/analytics.entity';
import { User } from '../../entities/user.entity';
import { App } from '../../entities/app.entity';
import { Device } from '../../entities/device.entity';
import { Browser } from '../../entities/browser.entity';
import { OS } from '../../entities/os.entity';
import { CollectAnalyticsDto } from '../../dto/analytics.dto';

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

    async collect(user: User, dto: CollectAnalyticsDto) {
        const app = await this.appRepository.findOne({
            where: { name: dto.metadata.appName, user: { id: user.id } },
            relations: ['user'],
        });
        if (!app) throw new NotFoundException('App not found for this API key');
        let device = await this.deviceRepository.findOne({ where: { name: dto.device } });
        if (!device) device = await this.deviceRepository.save(this.deviceRepository.create({ name: dto.device }));
        let browser = await this.browserRepository.findOne({ where: { name: dto.metadata.browser } });
        if (!browser) browser = await this.browserRepository.save(this.browserRepository.create({ name: dto.metadata.browser }));
        let os = await this.osRepository.findOne({ where: { name: dto.metadata.os } });
        if (!os) os = await this.osRepository.save(this.osRepository.create({ name: dto.metadata.os }));
        const analytics = this.analyticsRepository.create({
            user, app,
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
        return { message: 'Analytics collected successfully', data: analytics };
    }

    async getEventSummary(
        user: User,
        filters: { event?: string; startDate?: string; endDate?: string; appId?: string },
    ) {
        const { event, startDate, endDate, appId } = filters;
        const where: any = {};
        if (event) where.event = event;
        if (startDate && endDate)
            where.time_stamp = Between(new Date(startDate), new Date(endDate));
        else if (startDate)
            where.time_stamp = Between(new Date(startDate), new Date());
        let appIds: string[] = [];
        if (appId) {
            const app = await this.appRepository.findOne({ where: { id: appId, user: { id: user.id } } });
            if (!app) throw new NotFoundException('App not found for this API key');
            appIds = [app.id];
        } else {
            const apps = await this.appRepository.find({ where: { user: { id: user.id } } });
            appIds = apps.map(a => a.id);
        }
        where.app = { id: In(appIds) };
        const events = await this.analyticsRepository.find({
            where,
            relations: ['app', 'device', 'user'],
        });
        if (!events.length)
            return { message: 'No analytics found for given filters' };
        const count = events.length;
        const uniqueUsers = new Set(events.map(e => e.user?.id)).size;
        const deviceData: Record<string, number> = {};
        for (const e of events) {
            const name = e.device?.name || 'unknown';
            deviceData[name] = (deviceData[name] || 0) + 1;
        }
        return { event: event || 'all', count, uniqueUsers, deviceData, };
    }

    async getUserStats(authUser: User, targetUserId: string) {
        const targetUser = await this.userRepository.findOne({ where: { id: targetUserId } });
        if (!targetUser) throw new NotFoundException('User not found');
        const apps = await this.appRepository.find({ where: { user: { id: authUser.id } } });
        const appIds = apps.map(a => a.id);
        const analyticsData = await this.analyticsRepository.find({
            where: {
                user: { id: targetUserId },
                app: { id: In(appIds) },
            },
            relations: ['device', 'browser', 'os'],
            order: { time_stamp: 'DESC' },
        });
        if (!analyticsData.length)
            return { message: 'No analytics found for this user' };
        const totalEvents = analyticsData.length;
        const recentEvent = analyticsData[0];
        const deviceDetails = { browser: recentEvent.browser?.name || 'unknown', os: recentEvent.os?.name || 'unknown' };
        return { userId: targetUserId, totalEvents, deviceDetails, ipAddress: recentEvent.ip_address };
    }
}
