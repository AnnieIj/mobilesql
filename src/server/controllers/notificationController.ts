import { Response, NextFunction } from 'express';
import { notificationService } from '../services/notificationService';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/auth';

export class NotificationController {
  static async getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const list = await notificationService.getNotifications(userId);
      return ApiResponseBuilder.success(res, list, 'User notifications fetched.');
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      await notificationService.markAsRead(id, userId);
      return ApiResponseBuilder.success(res, null, 'Notification marked as read.');
    } catch (error) {
      next(error);
    }
  }
}
