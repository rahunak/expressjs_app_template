export enum ErrorMessage {
  USER_NOT_AUTHENTICATED = 'User not authenticated. This route requires authentication.',
  DEVICE_ID_MISSING = 'Device ID is missing from authentication context',
  INVALID_CREDENTIALS = 'Invalid credentials',
  INVALID_REFRESH_TOKEN = 'Invalid or expired refresh token',
  REFRESH_TOKEN_EXPIRED = 'Refresh token expired',
  UNAUTHORIZED = 'Unauthorized',

  USER_ALREADY_EXISTS = 'User already exists',
  USER_NOT_FOUND = 'User not found',

  FILE_NOT_FOUND = 'File not found',
  FILE_NOT_FOUND_ON_DISK = 'File not found on disk',

  VALIDATION_FAILED = 'Validation failed',
  INVALID_EMAIL_OR_PHONE = 'ID must be a valid email or phone number',

  NOT_FOUND = 'Not found',
  RESOURCE_ALREADY_EXISTS = 'Resource already exists'
}
