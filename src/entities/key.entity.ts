import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Key {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  secret_key!: string;

  @OneToOne(() => User, user => user.key, { onDelete: 'CASCADE' })
  @JoinColumn() // Owner side of OneToOne
  user!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
