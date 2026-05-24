import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    identifier: string;
    deviceId: string;
  };
}

export interface TokenPayload {
  userId: number;
  identifier: string;
  deviceId: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface FileAttributes {
  id: number;
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  path: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginationResult<T> {
  files: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
