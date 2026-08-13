import { playgroundRepository } from '../repositories/playgroundRepository';
import { SavedQuery, QueryHistoryItem } from '../types';

export class PlaygroundService {
  async getSavedQueries(userId: string): Promise<SavedQuery[]> {
    return playgroundRepository.getSavedQueries(userId);
  }

  async saveQuery(data: Omit<SavedQuery, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedQuery> {
    return playgroundRepository.saveQuery(data);
  }

  async deleteSavedQuery(id: string, userId: string): Promise<boolean> {
    return playgroundRepository.deleteSavedQuery(id, userId);
  }

  async logQueryExecution(data: Omit<QueryHistoryItem, 'id' | 'executedAt'>): Promise<QueryHistoryItem> {
    return playgroundRepository.addQueryHistory(data);
  }

  async getQueryHistory(userId: string, limit: number = 50): Promise<QueryHistoryItem[]> {
    return playgroundRepository.getQueryHistory(userId, limit);
  }
}

export const playgroundService = new PlaygroundService();
