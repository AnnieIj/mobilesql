import { Response, NextFunction } from 'express';
import { playgroundService } from '../services/playgroundService';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/auth';

export class PlaygroundController {
  static async getSavedQueries(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const queries = await playgroundService.getSavedQueries(userId);
      return ApiResponseBuilder.success(res, queries, 'Saved SQL queries fetched.');
    } catch (error) {
      next(error);
    }
  }

  static async saveQuery(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const query = await playgroundService.saveQuery({ ...req.body, userId });
      return ApiResponseBuilder.success(res, query, 'SQL query saved successfully.', 201);
    } catch (error) {
      next(error);
    }
  }

  static async deleteSavedQuery(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      await playgroundService.deleteSavedQuery(id, userId);
      return ApiResponseBuilder.success(res, null, 'Saved query deleted.');
    } catch (error) {
      next(error);
    }
  }

  static async getQueryHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const history = await playgroundService.getQueryHistory(userId);
      return ApiResponseBuilder.success(res, history, 'Query execution history fetched.');
    } catch (error) {
      next(error);
    }
  }

  static async logExecution(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const item = await playgroundService.logQueryExecution({ ...req.body, userId });
      return ApiResponseBuilder.success(res, item, 'Query execution logged.', 201);
    } catch (error) {
      next(error);
    }
  }
}
