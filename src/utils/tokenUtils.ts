import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Request } from 'express';
import jwtConfig from '../config/jwt';
import { TokenPayload } from '../types';

export const generateAccessToken = (userId: number, identifier: string, deviceId: string): string => {
  const payload: TokenPayload = { userId, identifier, deviceId };
  return jwt.sign(payload, jwtConfig.jwtSecret, { expiresIn: jwtConfig.jwtExpiresIn } as jwt.SignOptions);
};

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const getRefreshTokenExpiry = (): Date => {
  const duration = jwtConfig.refreshTokenExpiresIn;
  const match = duration.match(/^(\d+)([dhms])$/);

  if (!match) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return new Date(Date.now() + value * multipliers[unit]);
};

export const generateDeviceId = (req: Request): string => {
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.ip || req.socket.remoteAddress || '';
  return crypto.createHash('sha256').update(`${userAgent}-${ip}`).digest('hex');
};
