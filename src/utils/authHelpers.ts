import { AuthRequest } from '../types';
import { ErrorMessage } from '../constants/errorMessages';

export class AuthenticationError extends Error {
  constructor(message: string = ErrorMessage.USER_NOT_AUTHENTICATED) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export function getAuthenticatedUser(req: AuthRequest) {
  if (!req.user) {
    throw new AuthenticationError(ErrorMessage.USER_NOT_AUTHENTICATED);
  }
  return req.user;
}

export function getAuthenticatedUserId(req: AuthRequest): number {
  const user = getAuthenticatedUser(req);
  return user.id;
}

export function getAuthenticatedUserWithDevice(req: AuthRequest) {
  const user = getAuthenticatedUser(req);
  if (!user.deviceId) {
    throw new AuthenticationError(ErrorMessage.DEVICE_ID_MISSING);
  }
  return {
    userId: user.id,
    deviceId: user.deviceId
  };
}
