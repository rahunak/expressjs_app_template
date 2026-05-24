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

