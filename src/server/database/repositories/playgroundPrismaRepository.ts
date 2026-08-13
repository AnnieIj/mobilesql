import db from '../client';
import { handleDatabaseError } from '../dbErrors';
import { SqlDialect } from '@prisma/client';

export class PlaygroundPrismaRepository {
  // --- SAVED QUERIES ---
  async saveQuery(userId: string, data: { title: string; description?: string; query: string; dialect: string; tags?: string[] }) {
    try {
      const dialectMap: Record<string, SqlDialect> = {
        PostgreSQL: 'POSTGRESQL',
        MySQL: 'MYSQL',
        SQLite: 'SQLITE',
        'SQL Server': 'SQL_SERVER',
      };

      return await db.savedQuery.create({
        data: {
          userId,
          title: data.title,
          description: data.description,
          query: data.query,
          dialect: dialectMap[data.dialect] || 'POSTGRESQL',
          tags: data.tags || [],
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'SavedQuery');
    }
  }

  async getUserSavedQueries(userId: string) {
    try {
      return await db.savedQuery.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'SavedQuery');
    }
  }

  async deleteSavedQuery(id: string, userId: string) {
    try {
      return await db.savedQuery.deleteMany({
        where: { id, userId },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'SavedQuery');
    }
  }

  // --- QUERY HISTORY & METRICS ---
  async logQueryExecution(data: {
    userId: string;
    query: string;
    dialect: string;
    status: 'success' | 'error';
    executionTimeMs: number;
    rowCount: number;
    errorMessage?: string;
  }) {
    try {
      const dialectMap: Record<string, SqlDialect> = {
        PostgreSQL: 'POSTGRESQL',
        MySQL: 'MYSQL',
        SQLite: 'SQLITE',
        'SQL Server': 'SQL_SERVER',
      };

      return await db.queryHistory.create({
        data: {
          userId: data.userId,
          query: data.query,
          dialect: dialectMap[data.dialect] || 'POSTGRESQL',
          status: data.status,
          executionTimeMs: data.executionTimeMs,
          rowCount: data.rowCount,
          errorMessage: data.errorMessage,
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'QueryHistory');
    }
  }

  async getUserQueryHistory(userId: string, limit: number = 50) {
    try {
      return await db.queryHistory.findMany({
        where: { userId },
        orderBy: { executedAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      throw handleDatabaseError(error, 'QueryHistory');
    }
  }

  // --- FAVORITES & TEMPLATES ---
  async toggleFavoriteQuery(userId: string, queryId: string) {
    try {
      const existing = await db.savedQuery.findFirst({ where: { id: queryId, userId } });
      if (!existing) throw new Error('Query not found.');

      return await db.savedQuery.update({
        where: { id: queryId },
        data: { isFavorite: !existing.isFavorite },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'SavedQuery');
    }
  }

  async getSQLTemplates() {
    try {
      return await db.sQLTemplate.findMany({
        orderBy: { category: 'asc' },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'SQLTemplate');
    }
  }
}

export const playgroundPrismaRepository = new PlaygroundPrismaRepository();
