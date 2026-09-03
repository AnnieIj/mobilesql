import { Response, NextFunction } from 'express';
import { analyticsService } from '../services/analyticsService';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/auth';
import { NotFoundError } from '../utils/errors';

export class AnalyticsController {
  static async getDashboards(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const dashboards = await analyticsService.getDashboards(userId);
      return ApiResponseBuilder.success(res, dashboards, 'Analytics dashboards fetched.');
    } catch (error) {
      next(error);
    }
  }

  static async getDashboardById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dashboard = await analyticsService.getDashboardById(id);
      if (!dashboard) {
        throw new NotFoundError(`Dashboard with ID '${id}' not found.`);
      }
      return ApiResponseBuilder.success(res, dashboard, 'Dashboard details fetched.');
    } catch (error) {
      next(error);
    }
  }

  static async createDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const dashboard = await analyticsService.createDashboard({ ...req.body, userId });
      return ApiResponseBuilder.success(res, dashboard, 'Dashboard created successfully.', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await analyticsService.updateDashboard(id, req.body);
      return ApiResponseBuilder.success(res, updated, 'Dashboard updated successfully.');
    } catch (error) {
      next(error);
    }
  }

  static async deleteDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await analyticsService.deleteDashboard(id);
      return ApiResponseBuilder.success(res, null, 'Dashboard deleted successfully.');
    } catch (error) {
      next(error);
    }
  }
}
