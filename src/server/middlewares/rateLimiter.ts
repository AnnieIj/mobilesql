import { Request, Response, NextFunction } from 'express';
import { ApiResponseBuilder } from '../utils/apiResponse';

interface RequestLog {
  count: number;
  resetTime: number;
}

const requestMap = new Map<string, RequestLog>();

export const rateLimiter = (maxRequests: number = 200, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || '127.0.0.1';
    const now = Date.now();

    const record = requestMap.get(ip);

    if (!record) {
      requestMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    record.count += 1;

    if (record.count > maxRequests) {
      return ApiResponseBuilder.error(res, 'Rate limit exceeded. Please try again later.', 429);
    }

    next();
  };
};
