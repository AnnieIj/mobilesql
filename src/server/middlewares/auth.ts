import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { JWTPayload, UserRole } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid Authorization bearer token.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = AuthUtils.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return next(new UnauthorizedError('Invalid or expired authentication token.'));
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access denied. Requires one of roles: ${roles.join(', ')}`));
    }

    next();
  };
};

export const optionalAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = AuthUtils.verifyAccessToken(token);
    } catch {
      // Ignore invalid optional tokens
    }
  }
  next();
};
