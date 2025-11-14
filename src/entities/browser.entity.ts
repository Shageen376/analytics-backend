import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Analytics } from './analytics.entity';

@Entity()
export class Browser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string; // e.g., Chrome, Edge, Firefox

  @OneToMany(() => Analytics, analytics => analytics.browser)
  analytics!: Analytics[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
