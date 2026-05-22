import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User';

@Entity('files')
@Index(['userId'])
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, comment: 'Original file name' })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  extension: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 100, nullable: false })
  mimeType: string;

  @Column({ type: 'int', nullable: false, comment: 'File size in bytes' })
  size: number;

  @Column({ type: 'varchar', length: 500, nullable: false, comment: 'File path on disk' })
  path: string;

  @Column({ name: 'user_id', type: 'int', nullable: false })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
