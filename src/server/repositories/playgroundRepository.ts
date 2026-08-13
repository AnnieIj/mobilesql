import { db } from '../database/db';
import { SavedQuery, QueryHistoryItem } from '../types';

export class PlaygroundRepository {
  async getSavedQueries(userId: string): Promise<SavedQuery[]> {
    const list: SavedQuery[] = [];
    for (const q of db.savedQueries.values()) {
      if (q.userId === userId) {
        list.push(q);
      }
    }
    return list;
  }

  async saveQuery(data: Omit<SavedQuery, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedQuery> {
    const id = `sq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const entity: SavedQuery = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    db.savedQueries.set(id, entity);
    return entity;
  }

  async deleteSavedQuery(id: string, userId: string): Promise<boolean> {
    const q = db.savedQueries.get(id);
    if (!q || q.userId !== userId) return false;
    return db.savedQueries.delete(id);
  }

  async addQueryHistory(data: Omit<QueryHistoryItem, 'id' | 'executedAt'>): Promise<QueryHistoryItem> {
    const id = `qh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const entity: QueryHistoryItem = {
      ...data,
      id,
      executedAt: new Date().toISOString(),
    };

    db.queryHistory.set(id, entity);
    return entity;
  }

  async getQueryHistory(userId: string, limit: number = 50): Promise<QueryHistoryItem[]> {
    const list: QueryHistoryItem[] = [];
    for (const q of db.queryHistory.values()) {
      if (q.userId === userId) {
        list.push(q);
      }
    }
    return list.sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()).slice(0, limit);
  }
}

export const playgroundRepository = new PlaygroundRepository();
