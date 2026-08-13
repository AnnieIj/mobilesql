import { SQLDialect } from './index';

export type ChartType =
  | 'bar'
  | 'column'
  | 'line'
  | 'area'
  | 'pie'
  | 'donut'
  | 'scatter'
  | 'bubble'
  | 'treemap'
  | 'heatmap'
  | 'funnel'
  | 'waterfall'
  | 'sankey'
  | 'radar'
  | 'gauge';

export type KpiMetricType =
  | 'revenue'
  | 'orders'
  | 'customers'
  | 'profit'
  | 'growth'
  | 'conversion'
  | 'active_users'
  | 'inventory'
  | 'churn';

export type DashboardTheme =
  | 'midnight_neon'
  | 'emerald_dark'
  | 'slate_executive'
  | 'monokai_cyber'
  | 'solarized_amber';

export type WidgetSize = 'small' | 'medium' | 'wide' | 'tall' | 'full'; // small=1x1, medium=2x2, wide=4x2, tall=2x4, full=4x4

export type DataSourceType = 'sql_playground' | 'ai_generated' | 'csv' | 'json' | 'portfolio';

export interface KPIConfig {
  metricType: KpiMetricType;
  label: string;
  value: number;
  unit: string; // '$', '%', 'k', 'items', etc.
  changePercent: number; // e.g. +14.2 or -3.5
  comparisonPeriod: 'vs Prev Month' | 'vs Prev Quarter' | 'vs Prev Year';
  statusColor: 'green' | 'red' | 'amber' | 'blue' | 'purple';
  iconName: string; // Lucide icon name
  sparklineData?: number[];
}

export interface ChartConfig {
  chartType: ChartType;
  xAxisKey: string;
  yAxisKeys: string[];
  colorPalette: string[];
  showLegend: boolean;
  showTooltip: boolean;
  showGrid: boolean;
  isStacked?: boolean;
  sortDirection?: 'asc' | 'desc' | 'none';
  customGoal?: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
  w: number; // cols out of 4 or 12
  h: number; // rows
}

export interface WidgetFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
  value: string | number | string[];
}

export interface BIWidget {
  id: string;
  title: string;
  type: 'kpi' | 'chart' | 'table' | 'ai-insight';
  size: WidgetSize;
  position: WidgetPosition;
  dataSourceId: string;
  dataSourceType: DataSourceType;
  rawSql?: string;
  kpiConfig?: KPIConfig;
  chartConfig?: ChartConfig;
  tableData?: Record<string, unknown>[];
  filters?: WidgetFilter[];
  updatedAt: string;
}

export interface DateRangeFilter {
  preset: 'today' | '7d' | '30d' | '90d' | 'ytd' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface GlobalFilterState {
  dateRange: DateRangeFilter;
  searchQuery: string;
  category: string;
  numericRange: [number, number];
  hierarchy: {
    region: string;
    country: string;
    store: string;
  };
}

export interface AnalyticsDashboard {
  id: string;
  title: string;
  description: string;
  theme: DashboardTheme;
  widgets: BIWidget[];
  globalFilters: GlobalFilterState;
  createdAt: string;
  updatedAt: string;
  refreshInterval: number; // in seconds, 0 = off
  isPublished: boolean;
  publicShareToken?: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tags: string[];
  stars: number;
  clonesCount: number;
}

export interface AIInsightItem {
  id: string;
  dashboardId: string;
  widgetId?: string;
  type: 'trend' | 'anomaly' | 'outlier' | 'seasonality' | 'opportunity' | 'chart_recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidenceScore: number; // 0 - 100
  suggestedAction?: string;
  recommendedChartType?: ChartType;
  createdAt: string;
}

export interface ExportReportConfig {
  id: string;
  dashboardId: string;
  title: string;
  format: 'pdf' | 'excel' | 'csv';
  includeAiSummary: boolean;
  includeRawTables: boolean;
  paperOrientation: 'portrait' | 'landscape';
  paperSize: 'a4' | 'letter';
  scheduledAutoExport: boolean;
  exportInterval: 'daily' | 'weekly' | 'monthly' | 'none';
}

export interface MarketplaceTemplate {
  id: string;
  title: string;
  description: string;
  category: 'SaaS' | 'E-Commerce' | 'Financial' | 'DevOps' | 'Executive' | 'Healthcare';
  dashboard: AnalyticsDashboard;
  stars: number;
  clones: number;
  author: string;
  avatar: string;
  updatedAt: string;
  previewImageBg: string; // css gradient or accent color
}
