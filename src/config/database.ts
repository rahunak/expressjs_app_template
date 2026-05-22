import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';
import { RefreshToken } from '../entities/RefreshToken';
import { File } from '../entities/File';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'express_app_db',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, RefreshToken, File],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
  charset: 'utf8mb4',
  poolSize: 5
});

export const connectDB = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('MySQL connected successfully');
  } catch (error) {
    console.error('Unable to connect to database:', (error as Error).message);
    process.exit(1);
  }
};
