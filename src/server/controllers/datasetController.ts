import { Response, NextFunction } from 'express';
import { datasetService } from '../services/datasetService';
import { ApiResponseBuilder } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/auth';

export class DatasetController {
  static async getDatasets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const datasets = await datasetService.getDatasets(userId);
      return ApiResponseBuilder.success(res, datasets, 'Datasets fetched successfully.');
    } catch (error) {
      next(error);
    }
  }

  static async getDatasetById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dataset = await datasetService.getDatasetById(id);
      return ApiResponseBuilder.success(res, dataset, 'Dataset details fetched.');
    } catch (error) {
      next(error);
    }
  }

  static async createDataset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const dataset = await datasetService.createDataset({ ...req.body, userId });
      return ApiResponseBuilder.success(res, dataset, 'Dataset created successfully.', 201);
    } catch (error) {
      next(error);
    }
  }

  static async deleteDataset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await datasetService.deleteDataset(id);
      return ApiResponseBuilder.success(res, null, 'Dataset deleted.');
    } catch (error) {
      next(error);
    }
  }
}
