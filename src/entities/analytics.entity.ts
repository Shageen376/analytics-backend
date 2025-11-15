import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { App } from './app.entity';
import { Device } from './device.entity';
import { Browser } from './browser.entity';
import { OS } from './os.entity';

@Entity()
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  customerId?: string;

  @ManyToOne(() => App, app => app.analytics)
  app!: App;

  @Column()
  event!: string;

  @Column()
  url!: string;

  @Column()
  referrer?: string;

  @ManyToOne(() => Device, device => device.analytics)
  device!: Device;

  @Column()
  ip_address!: string;

  @Column()
  time_stamp!: Date;

  @ManyToOne(() => Browser, browser => browser.analytics)
  browser!: Browser;

  @ManyToOne(() => OS, os => os.analytics)
  os!: OS;

  @Column()
  screen_size!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

