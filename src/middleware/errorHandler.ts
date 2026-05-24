import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  errors?: Array<{ msg: string; path: string; location: string }>;
  code?: string;
}

export const errorHandler = (err: CustomError, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors
    });
    return;
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    res.status(409).json({
      success: false,
      message: 'Resource already exists'
    });
    return;
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File size exceeds limit'
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: err.message
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
