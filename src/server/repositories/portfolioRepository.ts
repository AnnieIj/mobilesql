import { db } from '../database/db';
import { PortfolioProject } from '../types';

export class PortfolioRepository {
  async getProjects(userId?: string): Promise<PortfolioProject[]> {
    const list: PortfolioProject[] = [];
    for (const p of db.portfolioProjects.values()) {
      if (!userId || p.userId === userId) {
        list.push(p);
      }
    }
    return list;
  }

  async createProject(data: Omit<PortfolioProject, 'id' | 'viewsCount' | 'likesCount' | 'createdAt' | 'updatedAt'>): Promise<PortfolioProject> {
    const id = `port_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const entity: PortfolioProject = {
      ...data,
      id,
      viewsCount: 0,
      likesCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    db.portfolioProjects.set(id, entity);
    return entity;
  }

  async deleteProject(id: string): Promise<boolean> {
    return db.portfolioProjects.delete(id);
  }
}

export const portfolioRepository = new PortfolioRepository();
