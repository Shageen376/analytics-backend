import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { App } from './entities/app.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { Key } from './entities/key.entity';
import { Device } from './entities/device.entity';
import { Browser } from './entities/browser.entity';
import { OS } from './entities/os.entity';
import { Analytics } from './entities/analytics.entity';
import { SeederModule } from './modules/seeder/seeder.module';
import { AuthModule } from './modules/auth/auth.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 100, // EACH IP: max 100 requests per minute globally
    }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')!, 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, App, Key, Device, Browser, OS, Analytics],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    SeederModule,
    AuthModule,
    AnalyticsModule
  ],
})
export class AppModule { }
