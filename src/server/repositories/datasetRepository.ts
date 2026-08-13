import { db } from '../database/db';
import { Dataset } from '../types';

export class DatasetRepository {
  async getDatasets(userId: string): Promise<Dataset[]> {
    const list: Dataset[] = [];
    for (const ds of db.datasets.values()) {
      if (ds.userId === userId || ds.isPublic) {
        list.push(ds);
      }
    }
    return list;
  }

  async getDatasetById(id: string): Promise<Dataset | null> {
    return db.datasets.get(id) || null;
  }

  async createDataset(data: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dataset> {
    const id = `ds_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const entity: Dataset = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    db.datasets.set(id, entity);
    return entity;
  }

  async deleteDataset(id: string): Promise<boolean> {
    return db.datasets.delete(id);
  }
}

export const datasetRepository = new DatasetRepository();
