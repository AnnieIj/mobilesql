import db from '../client';
import { handleDatabaseError } from '../dbErrors';
import { WidgetType } from '@prisma/client';

export class AnalyticsPrismaRepository {
  async createDashboard(userId: string, data: { title: string; description?: string; theme?: any }) {
    try {
      const publicShareToken = `dash_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return await db.analyticsDashboard.create({
        data: {
          userId,
          title: data.title,
          description: data.description,
          layout: [],
          publicShareToken,
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'AnalyticsDashboard');
    }
  }

  async getUserDashboards(userId: string) {
    try {
      return await db.analyticsDashboard.findMany({
        where: { userId },
        include: { widgets: true },
        orderBy: { updatedAt: 'desc' },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'AnalyticsDashboard');
    }
  }

  async addWidgetToDashboard(dashboardId: string, widgetData: { title: string; type: string; query: string; configJson: any }) {
    try {
      const typeMap: Record<string, WidgetType> = {
        'kpi': 'KPI_CARD',
        'bar': 'BAR_CHART',
        'line': 'LINE_CHART',
        'pie': 'PIE_CHART',
        'table': 'DATA_TABLE',
      };

      return await db.analyticsWidget.create({
        data: {
          dashboardId,
          title: widgetData.title,
          type: typeMap[widgetData.type] || 'BAR_CHART',
          query: widgetData.query,
          configJson: widgetData.configJson,
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'AnalyticsWidget');
    }
  }
}

export const analyticsPrismaRepository = new AnalyticsPrismaRepository();
