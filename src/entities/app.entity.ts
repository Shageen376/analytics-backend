import { Entity, Index, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Analytics } from './analytics.entity';

@Entity()
@Index(['user'])
@Index(['name', 'user'], { unique: true }) // app name must be unique per user
export class App {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => User, user => user.apps)
  user!: User;

  @OneToMany(() => Analytics, analytics => analytics.app)
  analytics!: Analytics[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
