import { Request } from 'express';
import { AppDataSource } from '../config/database';
import { User, RefreshToken } from '../entities';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry, generateDeviceId } from '../utils/tokenUtils';
import { TokenPair } from '../types';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';
import { ErrorMessage } from '../constants/errorMessages';

class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

  async signup(identifier: string, password: string, req: Request): Promise<TokenPair> {
    const existingUser = await this.userRepository.findOne({ where: { identifier } });

    if (existingUser) {
      throw new ConflictError(ErrorMessage.USER_ALREADY_EXISTS);
    }

    const user = this.userRepository.create({ identifier, password });
    await this.userRepository.save(user);

    const deviceId = generateDeviceId(req);
    const accessToken = generateAccessToken(user.id, user.identifier, deviceId);
    const refreshToken = generateRefreshToken();
    const expiresAt = getRefreshTokenExpiry();

    const token = this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      deviceId,
      expiresAt,
      isValid: true
    });
    await this.refreshTokenRepository.save(token);

    return { accessToken, refreshToken };
  }

  async signin(identifier: string, password: string, req: Request): Promise<TokenPair> {
    const user = await this.userRepository.findOne({ where: { identifier } });

    if (!user) {
      throw new UnauthorizedError(ErrorMessage.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedError(ErrorMessage.INVALID_CREDENTIALS);
    }

    const deviceId = generateDeviceId(req);
    const accessToken = generateAccessToken(user.id, user.identifier, deviceId);
    const refreshToken = generateRefreshToken();
    const expiresAt = getRefreshTokenExpiry();

    const token = this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      deviceId,
      expiresAt,
      isValid: true
    });
    await this.refreshTokenRepository.save(token);

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(oldRefreshToken: string, req: Request): Promise<TokenPair> {
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: oldRefreshToken, isValid: true },
      relations: { user: true }
    });

    if (!tokenRecord) {
      throw new UnauthorizedError(ErrorMessage.INVALID_REFRESH_TOKEN);
    }

    if (new Date() > tokenRecord.expiresAt) {
      tokenRecord.isValid = false;
      await this.refreshTokenRepository.save(tokenRecord);
      throw new UnauthorizedError(ErrorMessage.REFRESH_TOKEN_EXPIRED);
    }

    tokenRecord.isValid = false;
    await this.refreshTokenRepository.save(tokenRecord);

    const user = await this.userRepository.findOne({ where: { id: tokenRecord.userId } });

    if (!user) {
      throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);
    }

    const deviceId = generateDeviceId(req);
    const accessToken = generateAccessToken(user.id, user.identifier, deviceId);
    const newRefreshToken = generateRefreshToken();
    const expiresAt = getRefreshTokenExpiry();

    const token = this.refreshTokenRepository.create({
      token: newRefreshToken,
      userId: user.id,
      deviceId,
      expiresAt,
      isValid: true
    });
    await this.refreshTokenRepository.save(token);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: number, deviceId: string): Promise<{ message: string }> {
    await this.refreshTokenRepository.update(
      { userId, deviceId, isValid: true },
      { isValid: false }
    );

    return { message: 'Logged out successfully' };
  }

  async getUserInfo(userId: number): Promise<{ id: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        identifier: true
      }
    });

    if (!user) {
      throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);
    }

    return { id: user.identifier };
  }
}

export default new AuthService();
