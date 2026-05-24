import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ErrorMessage } from '../constants/errorMessages';

export const validationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  next();
};

export const validateSignup: ValidationChain[] = [
  body('id')
    .trim()
    .notEmpty()
    .withMessage('ID is required')
    .custom((value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;

      if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        throw new Error(ErrorMessage.INVALID_EMAIL_OR_PHONE);
      }
      return true;
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

export const validateSignin: ValidationChain[] = [
  body('id')
    .trim()
    .notEmpty()
    .withMessage('ID is required'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];

export const validateRefreshToken: ValidationChain[] = [
  body('refreshToken')
    .trim()
    .notEmpty()
    .withMessage('Refresh token is required')
];
