import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Analytics } from './analytics.entity';

@Entity()
export class OS {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string; // e.g., Windows, Android, iOS

  @OneToMany(() => Analytics, analytics => analytics.os)
  analytics!: Analytics[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
