import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OS } from '../../entities/os.entity';
import { Device } from '../../entities/device.entity';
import { Browser } from '../../entities/browser.entity';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(OS)
    private readonly osRepository: Repository<OS>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(Browser)
    private readonly browserRepository: Repository<Browser>,
  ) {}

  async seed(): Promise<{ message: string }> {
    const insertedItems: string[] = [];
    const osInserted = await this.seedOS();
    const deviceInserted = await this.seedDevices();
    const browserInserted = await this.seedBrowsers();
    insertedItems.push(...osInserted, ...deviceInserted, ...browserInserted);
    const message =
      insertedItems.length > 0
        ? `Seeder executed successfully. Inserted: ${insertedItems.join(', ')}`
        : 'Seeder executed successfully. No new items to insert.';
    this.logger.log(message);
    return { message };
  }

  private async seedOS(): Promise<string[]> {
    const osList = ['Windows', 'MacOS', 'Linux', 'Android', 'iOS'];
    const inserted: string[] = [];

    for (const name of osList) {
      const exists = await this.osRepository.findOne({ where: { name } });
      if (!exists) {
        await this.osRepository.save({ name });
        this.logger.log(`Inserted OS: ${name}`);
        inserted.push(`OS:${name}`);
      }
    }
    return inserted;
  }

  private async seedDevices(): Promise<string[]> {
    const deviceList = ['Mobile', 'Tablet', 'Desktop'];
    const inserted: string[] = [];

    for (const name of deviceList) {
      const exists = await this.deviceRepository.findOne({ where: { name } });
      if (!exists) {
        await this.deviceRepository.save({ name });
        this.logger.log(`Inserted Device: ${name}`);
        inserted.push(`Device:${name}`);
      }
    }
    return inserted;
  }

  private async seedBrowsers(): Promise<string[]> {
    const browserList = ['Chrome', 'Firefox', 'Edge', 'Safari', 'Opera'];
    const inserted: string[] = [];

    for (const name of browserList) {
      const exists = await this.browserRepository.findOne({ where: { name } });
      if (!exists) {
        await this.browserRepository.save({ name });
        this.logger.log(`Inserted Browser: ${name}`);
        inserted.push(`Browser:${name}`);
      }
    }
    return inserted;
  }
}
