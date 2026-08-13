import { Response, NextFunction } from 'express';
import { portfolioService } from '../services/portfolioService';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/auth';

export class PortfolioController {
  static async getProjects(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.query.userId ? String(req.query.userId) : req.user?.userId;
      const projects = await portfolioService.getProjects(userId);
      return ApiResponseBuilder.success(res, projects, 'Portfolio projects retrieved.');
    } catch (error) {
      next(error);
    }
  }

  static async createProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const project = await portfolioService.createProject({ ...req.body, userId });
      return ApiResponseBuilder.success(res, project, 'Portfolio project created.', 201);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await portfolioService.deleteProject(id);
      return ApiResponseBuilder.success(res, null, 'Portfolio project deleted.');
    } catch (error) {
      next(error);
    }
  }

  static async getCertificates(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const certificates = await portfolioService.getCertificates(userId);
      return ApiResponseBuilder.success(res, certificates, 'User certificates retrieved.');
    } catch (error) {
      next(error);
    }
  }
}
