import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User';

@Entity('refresh_tokens')
@Index(['token'])
@Index(['userId', 'deviceId'])
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500, unique: true, nullable: false })
  token: string;

  @Column({ name: 'user_id', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'device_id', type: 'varchar', length: 255, nullable: false, comment: 'Unique device identifier' })
  deviceId: string;

  @Column({ name: 'is_valid', type: 'boolean', default: true })
  isValid: boolean;

  @Column({ name: 'expires_at', type: 'datetime', nullable: false })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
