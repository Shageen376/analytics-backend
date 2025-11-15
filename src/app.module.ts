import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { App } from './entities/app.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { Device } from './entities/device.entity';
import { Browser } from './entities/browser.entity';
import { OS } from './entities/os.entity';
import { Analytics } from './entities/analytics.entity';
import { AppController } from './app.controller';
import { SeederModule } from './modules/seeder/seeder.module';
import { AuthModule } from './modules/auth/auth.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')!, 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, App, Device, Browser, OS, Analytics],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    SeederModule, AuthModule, AnalyticsModule, AdminModule
  ],
  controllers: [AppController],
})
export class AppModule { }
