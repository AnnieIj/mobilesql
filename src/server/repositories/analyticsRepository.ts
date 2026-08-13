import { db } from '../database/db';
import { Dashboard } from '../types';

export class AnalyticsRepository {
  async getDashboards(userId: string): Promise<Dashboard[]> {
    const list: Dashboard[] = [];
    for (const d of db.dashboards.values()) {
      if (d.userId === userId || d.isPublished) {
        list.push(d);
      }
    }
    return list;
  }

  async getDashboardById(id: string): Promise<Dashboard | null> {
    return db.dashboards.get(id) || null;
  }

  async createDashboard(data: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dashboard> {
    const id = `dash_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const entity: Dashboard = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    db.dashboards.set(id, entity);
    return entity;
  }

  async updateDashboard(id: string, updates: Partial<Dashboard>): Promise<Dashboard | null> {
    const d = db.dashboards.get(id);
    if (!d) return null;

    const updated: Dashboard = {
      ...d,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    db.dashboards.set(id, updated);
    return updated;
  }

  async deleteDashboard(id: string): Promise<boolean> {
    return db.dashboards.delete(id);
  }
}

export const analyticsRepository = new AnalyticsRepository();
