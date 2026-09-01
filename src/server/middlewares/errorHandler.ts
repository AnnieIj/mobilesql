import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError && err.statusCode < 500) {
    logger.warn(`[API Client ${err.statusCode}] ${req.method} ${req.originalUrl}: ${err.message}`);
    return ApiResponseBuilder.error(res, err.message, err.statusCode, (err as any).errors);
  }

  logger.error(`[API Error 500] ${req.method} ${req.originalUrl}: ${err.message}`, {
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });

  if (err instanceof AppError) {
    return ApiResponseBuilder.error(res, err.message, err.statusCode, (err as any).errors);
  }

  return ApiResponseBuilder.error(res, 'Internal Server Error', 500);
};
