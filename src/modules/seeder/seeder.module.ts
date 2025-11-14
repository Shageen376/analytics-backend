import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OS } from '../../entities/os.entity';
import { Device } from '../../entities/device.entity';
import { Browser } from '../../entities/browser.entity';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OS, Device, Browser])],
  providers: [SeederService],
  controllers: [SeederController],
})
export class SeederModule {}
