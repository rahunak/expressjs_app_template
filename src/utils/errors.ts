import { ErrorMessage } from '../constants/errorMessages';

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = ErrorMessage.VALIDATION_FAILED) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = ErrorMessage.UNAUTHORIZED) {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = ErrorMessage.NOT_FOUND) {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = ErrorMessage.RESOURCE_ALREADY_EXISTS) {
    super(message, 409);
  }
}
