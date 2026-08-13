import { analyticsRepository } from '../repositories/analyticsRepository';
import { Dashboard } from '../types';

export class AnalyticsService {
  async getDashboards(userId: string): Promise<Dashboard[]> {
    return analyticsRepository.getDashboards(userId);
  }

  async getDashboardById(id: string): Promise<Dashboard | null> {
    return analyticsRepository.getDashboardById(id);
  }

  async createDashboard(data: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dashboard> {
    return analyticsRepository.createDashboard(data);
  }

  async updateDashboard(id: string, updates: Partial<Dashboard>): Promise<Dashboard | null> {
    return analyticsRepository.updateDashboard(id, updates);
  }

  async deleteDashboard(id: string): Promise<boolean> {
    return analyticsRepository.deleteDashboard(id);
  }
}

export const analyticsService = new AnalyticsService();
