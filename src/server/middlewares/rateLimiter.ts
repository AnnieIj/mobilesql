import { Request, Response, NextFunction } from 'express';
import { ApiResponseBuilder } from '../utils/apiResponse';

interface RequestLog {
  count: number;
  resetTime: number;
}

const requestMap = new Map<string, RequestLog>();

// Periodic memory cleanup of expired IP keys to prevent memory leak in long-lived container
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function purgeExpiredRecords(now: number) {
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    lastCleanup = now;
    for (const [ip, log] of requestMap.entries()) {
      if (now > log.resetTime) {
        requestMap.delete(ip);
      }
    }
  }
}

export const rateLimiter = (maxRequests: number = 300, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const rawIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '127.0.0.1';
    const ip = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(',')[0].trim();
    const now = Date.now();

    purgeExpiredRecords(now);

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
      res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      return ApiResponseBuilder.error(res, 'Rate limit exceeded. Please try again later.', 429);
    }

    next();
  };
};
