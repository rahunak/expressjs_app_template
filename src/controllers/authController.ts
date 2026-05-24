import { Response, NextFunction } from 'express';
import authService from '../services/authService';
import { AuthRequest } from '../types';
import { getAuthenticatedUserId, getAuthenticatedUserWithDevice } from '../utils/authHelpers';

class AuthController {
  async signup(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, password } = req.body;

      const tokens = await authService.signup(id, password, req);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  }

  async signin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, password } = req.body;

      const tokens = await authService.signin(id, password, req);

      res.status(200).json({
        success: true,
        message: 'Signed in successfully',
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const tokens = await authService.refreshAccessToken(refreshToken, req);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, deviceId } = getAuthenticatedUserWithDevice(req);

      await authService.logout(userId, deviceId);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getInfo(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getAuthenticatedUserId(req);

      const userInfo = await authService.getUserInfo(userId);

      res.status(200).json({
        success: true,
        data: userInfo
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
