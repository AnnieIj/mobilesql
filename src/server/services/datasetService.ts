import { datasetRepository } from '../repositories/datasetRepository';
import { Dataset } from '../types';

export class DatasetService {
  async getDatasets(userId: string): Promise<Dataset[]> {
    return datasetRepository.getDatasets(userId);
  }

  async getDatasetById(id: string): Promise<Dataset | null> {
    return datasetRepository.getDatasetById(id);
  }

  async createDataset(data: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dataset> {
    return datasetRepository.createDataset(data);
  }

  async deleteDataset(id: string): Promise<boolean> {
    return datasetRepository.deleteDataset(id);
  }
}

export const datasetService = new DatasetService();
