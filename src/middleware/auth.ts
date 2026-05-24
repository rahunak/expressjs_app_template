import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt';
import { AuthRequest, TokenPayload } from '../types';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
      return;
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, jwtConfig.jwtSecret) as TokenPayload;

    (req as AuthRequest).user = {
      id: decoded.userId,
      identifier: decoded.identifier,
      deviceId: decoded.deviceId
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          message: 'Access token expired'
        });
        return;
      }

      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
          success: false,
          message: 'Invalid access token'
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

export default authMiddleware;
