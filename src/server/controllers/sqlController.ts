import { Request, Response, NextFunction } from 'express';
import { sqlExecutionService } from '../services/sqlExecutionService';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/auth';

export class SqlController {
  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user?.userId;
      const result = await sqlExecutionService.execute(req.body, userId);

      ApiResponseBuilder.success(res, result, 'SQL statement executed successfully');
    } catch (error) {
      next(error);
    }
  }

  async explain(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await sqlExecutionService.explain(req.body);
      ApiResponseBuilder.success(res, result, 'Query plan generated successfully');
    } catch (error) {
      next(error);
    }
  }

  async format(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = sqlExecutionService.format(req.body);
      ApiResponseBuilder.success(res, result, 'SQL formatted successfully');
    } catch (error) {
      next(error);
    }
  }

  async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = sqlExecutionService.validate(req.body);
      ApiResponseBuilder.success(res, result, 'SQL syntax validated');
    } catch (error) {
      next(error);
    }
  }

  async optimize(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = sqlExecutionService.optimize(req.body);
      ApiResponseBuilder.success(res, result, 'Optimization recommendations generated');
    } catch (error) {
      next(error);
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const databaseId = typeof req.query.databaseId === 'string' ? req.query.databaseId : 'ecommerce_prod';
      const status = await sqlExecutionService.getEngineStatus(databaseId);
      ApiResponseBuilder.success(res, status, 'SQL engine status retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const sqlController = new SqlController();
