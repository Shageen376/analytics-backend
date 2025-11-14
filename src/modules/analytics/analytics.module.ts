// analytics/analytics.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Analytics } from '../../entities/analytics.entity';
import { User } from '../../entities/user.entity';
import { App } from '../../entities/app.entity';
import { Device } from '../../entities/device.entity';
import { Browser } from '../../entities/browser.entity';
import { OS } from '../../entities/os.entity';
import { Key } from '../../entities/key.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Analytics, User, App, Device, Browser, OS, Key]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
