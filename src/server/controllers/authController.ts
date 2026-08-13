import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/auth';

export class AuthController {
  private static getRequestMeta(req: Request) {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    return { ipAddress, userAgent };
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const meta = AuthController.getRequestMeta(req);
      const result = await authService.register(req.body, meta);
      return ApiResponseBuilder.success(res, result, 'User registered successfully. Verification token generated.', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const meta = AuthController.getRequestMeta(req);
      const result = await authService.login(req.body, meta);
      return ApiResponseBuilder.success(res, result, 'User authenticated successfully.');
    } catch (error) {
      next(error);
    }
  }

  static async guest(req: Request, res: Response, next: NextFunction) {
    try {
      const meta = AuthController.getRequestMeta(req);
      const result = await authService.guestLogin(req.body?.displayName, meta);
      return ApiResponseBuilder.success(res, result, 'Guest session initialized successfully.', 201);
    } catch (error) {
      next(error);
    }
  }

  static async oauth(req: Request, res: Response, next: NextFunction) {
    try {
      const meta = AuthController.getRequestMeta(req);
      const result = await authService.oauthLogin(req.body, meta);
      return ApiResponseBuilder.success(res, result, 'OAuth login completed successfully.');
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const meta = AuthController.getRequestMeta(req);
      const tokens = await authService.refreshToken(req.body.refreshToken, meta);
      return ApiResponseBuilder.success(res, tokens, 'Access token refreshed successfully.');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const meta = AuthController.getRequestMeta(req);
      const refreshToken = req.body?.refreshToken;
      const userId = req.user?.userId || '';
      await authService.logout(refreshToken, userId, meta);
      return ApiResponseBuilder.success(res, null, 'Logged out successfully.');
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const meta = AuthController.getRequestMeta(req);
      const result = await authService.forgotPassword(req.body.email, meta);
      return ApiResponseBuilder.success(
        res,
        result,
        'If an account exists with this email, a password reset token has been dispatched.'
      );
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const meta = AuthController.getRequestMeta(req);
      await authService.resetPassword(req.body.token, req.body.newPassword, meta);
      return ApiResponseBuilder.success(res, null, 'Password reset completed successfully. Please login with your new credentials.');
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const meta = AuthController.getRequestMeta(req);
      await authService.verifyEmail(req.body.token, meta);
      return ApiResponseBuilder.success(res, null, 'Email address verified successfully.');
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const meta = AuthController.getRequestMeta(req);
      const userId = req.user!.userId;
      await authService.changePassword(userId, req.body.currentPassword, req.body.newPassword, meta);
      return ApiResponseBuilder.success(res, null, 'Password changed successfully. Active sessions updated.');
    } catch (error) {
      next(error);
    }
  }

  static async changeEmail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const meta = AuthController.getRequestMeta(req);
      const userId = req.user!.userId;
      const result = await authService.changeEmail(userId, req.body.currentPassword, req.body.newEmail, meta);
      return ApiResponseBuilder.success(res, result, 'Email updated. A verification token has been generated for the new email address.');
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await authService.getCurrentUser(userId);
      return ApiResponseBuilder.success(res, user, 'Current user profile retrieved.');
    } catch (error) {
      next(error);
    }
  }
}
