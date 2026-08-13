import { Response, NextFunction } from 'express';
import { academyService } from '../services/academyService';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/auth';

export class AcademyController {
  static async getProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const progressList = await academyService.getAllUserProgress(userId);
      return ApiResponseBuilder.success(res, progressList, 'User academy progress retrieved.');
    } catch (error) {
      next(error);
    }
  }

  static async completeLesson(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { lessonId, score } = req.body;
      const result = await academyService.markLessonCompleted(userId, lessonId, score);
      return ApiResponseBuilder.success(res, result, 'Lesson marked as completed.');
    } catch (error) {
      next(error);
    }
  }
}
