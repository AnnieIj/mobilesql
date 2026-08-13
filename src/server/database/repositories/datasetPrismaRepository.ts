import db from '../client';
import { handleDatabaseError } from '../dbErrors';

export class DatasetPrismaRepository {
  async createDataset(userId: string, data: { name: string; description: string; category: string; schemaJson: any; isPublic?: boolean }) {
    try {
      return await db.dataset.create({
        data: {
          userId,
          name: data.name,
          description: data.description,
          category: data.category,
          schemaJson: data.schemaJson,
          isPublic: data.isPublic ?? false,
          rowCount: 500,
          tableCount: 2,
          sizeBytes: 102400,
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'Dataset');
    }
  }

  async getUserDatasets(userId: string) {
    try {
      return await db.dataset.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'Dataset');
    }
  }

  async getPublicDatasets() {
    try {
      return await db.dataset.findMany({
        where: { isPublic: true },
        include: {
          user: {
            select: { id: true, name: true, username: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'Dataset');
    }
  }

  async deleteDataset(id: string, userId: string) {
    try {
      return await db.dataset.deleteMany({
        where: { id, userId },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'Dataset');
    }
  }
}

export const datasetPrismaRepository = new DatasetPrismaRepository();
