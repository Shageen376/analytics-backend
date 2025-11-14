import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { App } from './app.entity';
import { Key } from './key.entity';
import { Analytics } from './analytics.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @OneToMany(() => App, app => app.user)
  apps!: App[];

  @OneToOne(() => Key, key => key.user)
  key!: Key;

  @OneToMany(() => Analytics, analytics => analytics.user)
  analytics!: Analytics[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
