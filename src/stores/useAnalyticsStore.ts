import { create } from 'zustand';
import {
  AnalyticsDashboard,
  BIWidget,
  AIInsightItem,
  MarketplaceTemplate,
  DashboardTheme,
  GlobalFilterState,
  ChartType,
  KpiMetricType,
  KPIConfig,
  ChartConfig,
} from '../types/analytics';
import {
  SAMPLE_DASHBOARDS,
  MARKETPLACE_TEMPLATES,
  generateAiInsightsForDashboard,
  getChartDataForType,
} from '../services/analyticsEngine';

export type AnalyticsSubTab =
  | 'builder'
  | 'kpis'
  | 'charts'
  | 'reports'
  | 'ai-insights'
  | 'executive'
  | 'marketplace'
  | 'sql-profiler';

interface AnalyticsState {
  dashboards: AnalyticsDashboard[];
  activeDashboardId: string;
  activeSubTab: AnalyticsSubTab;

  // Modals & Panels
  executiveModeOpen: boolean;
  executiveSlideIndex: number;
  isAddWidgetModalOpen: boolean;
  isEditingWidgetModalOpen: boolean;
  selectedWidgetForEdit: BIWidget | null;
  isShareModalOpen: boolean;
  isReportModalOpen: boolean;

  // Marketplace & Insights
  marketplaceTemplates: MarketplaceTemplate[];
  insightsList: AIInsightItem[];

  // Actions
  setActiveSubTab: (subTab: AnalyticsSubTab) => void;
  setActiveDashboardId: (id: string) => void;
  createDashboard: (title: string, description: string, theme?: DashboardTheme) => string;
  updateDashboard: (id: string, updates: Partial<AnalyticsDashboard>) => void;
  deleteDashboard: (id: string) => void;
  duplicateDashboard: (id: string) => void;
  setDashboardTheme: (theme: DashboardTheme) => void;

  // Widget Actions
  addWidget: (widget: Omit<BIWidget, 'id' | 'updatedAt'>) => void;
  updateWidget: (widgetId: string, updates: Partial<BIWidget>) => void;
  deleteWidget: (widgetId: string) => void;
  duplicateWidget: (widgetId: string) => void;
  reorderWidgets: (widgets: BIWidget[]) => void;

  // Filter Actions
  updateGlobalFilters: (filters: Partial<GlobalFilterState>) => void;

  // Executive Mode
  toggleExecutiveMode: (open?: boolean) => void;
  setExecutiveSlideIndex: (index: number) => void;

  // Modal Triggers
  setIsAddWidgetModalOpen: (open: boolean) => void;
  setIsEditingWidgetModalOpen: (open: boolean, widget?: BIWidget | null) => void;
  setIsShareModalOpen: (open: boolean) => void;
  setIsReportModalOpen: (open: boolean) => void;

  // Marketplace
  cloneTemplate: (templateId: string) => void;
  publishDashboardToMarketplace: (dashboardId: string) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  dashboards: SAMPLE_DASHBOARDS,
  activeDashboardId: SAMPLE_DASHBOARDS[0].id,
  activeSubTab: 'builder',

  executiveModeOpen: false,
  executiveSlideIndex: 0,
  isAddWidgetModalOpen: false,
  isEditingWidgetModalOpen: false,
  selectedWidgetForEdit: null,
  isShareModalOpen: false,
  isReportModalOpen: false,

  marketplaceTemplates: MARKETPLACE_TEMPLATES,
  insightsList: generateAiInsightsForDashboard(SAMPLE_DASHBOARDS[0]),

  setActiveSubTab: (subTab) => set({ activeSubTab: subTab }),

  setActiveDashboardId: (id) => {
    const target = get().dashboards.find((d) => d.id === id);
    if (target) {
      set({
        activeDashboardId: id,
        insightsList: generateAiInsightsForDashboard(target),
      });
    }
  },

  createDashboard: (title, description, theme = 'emerald_dark') => {
    const newId = `dash_${Date.now()}`;
    const newDashboard: AnalyticsDashboard = {
      id: newId,
      title: title || 'New Custom BI Dashboard',
      description: description || 'Interactive SQL query visualizations and KPI cards.',
      theme,
      refreshInterval: 0,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        name: 'You (Current User)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        role: 'Data Analyst',
      },
      tags: ['Custom', 'SQL'],
      stars: 1,
      clonesCount: 0,
      globalFilters: {
        dateRange: { preset: '30d' },
        searchQuery: '',
        category: 'All',
        numericRange: [0, 100000],
        hierarchy: { region: 'All', country: 'All', store: 'All' },
      },
      widgets: [
        {
          id: `w_kpi_${Date.now()}`,
          title: 'Total Revenue',
          type: 'kpi',
          size: 'small',
          position: { x: 0, y: 0, w: 1, h: 1 },
          dataSourceId: 'sql_playground',
          dataSourceType: 'sql_playground',
          updatedAt: new Date().toISOString(),
          kpiConfig: {
            metricType: 'revenue',
            label: 'Total Sales',
            value: 254800,
            unit: '$',
            changePercent: 12.5,
            comparisonPeriod: 'vs Prev Month',
            statusColor: 'green',
            iconName: 'DollarSign',
            sparklineData: [120, 140, 180, 210, 240, 254],
          },
        },
        {
          id: `w_chart_${Date.now()}`,
          title: 'Sales Growth Column Chart',
          type: 'chart',
          size: 'medium',
          position: { x: 1, y: 0, w: 2, h: 2 },
          dataSourceId: 'sql_playground',
          dataSourceType: 'sql_playground',
          updatedAt: new Date().toISOString(),
          chartConfig: {
            chartType: 'column',
            xAxisKey: 'name',
            yAxisKeys: ['sales', 'profit'],
            colorPalette: ['#62DF7D', '#3B82F6'],
            showLegend: true,
            showTooltip: true,
            showGrid: true,
          },
        },
      ],
    };

    set((state) => ({
      dashboards: [newDashboard, ...state.dashboards],
      activeDashboardId: newId,
      insightsList: generateAiInsightsForDashboard(newDashboard),
    }));

    return newId;
  },

  updateDashboard: (id, updates) => {
    set((state) => ({
      dashboards: state.dashboards.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d)),
    }));
  },

  deleteDashboard: (id) => {
    set((state) => {
      const filtered = state.dashboards.filter((d) => d.id !== id);
      const nextId = filtered[0]?.id || '';
      return {
        dashboards: filtered,
        activeDashboardId: nextId,
      };
    });
  },

  duplicateDashboard: (id) => {
    const target = get().dashboards.find((d) => d.id === id);
    if (!target) return;

    const dupId = `dash_${Date.now()}`;
    const duplicated: AnalyticsDashboard = {
      ...target,
      id: dupId,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      dashboards: [duplicated, ...state.dashboards],
      activeDashboardId: dupId,
    }));
  },

  setDashboardTheme: (theme) => {
    const activeId = get().activeDashboardId;
    get().updateDashboard(activeId, { theme });
  },

  addWidget: (widgetData) => {
    const activeId = get().activeDashboardId;
    const target = get().dashboards.find((d) => d.id === activeId);
    if (!target) return;

    const newWidget: BIWidget = {
      ...widgetData,
      id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      updatedAt: new Date().toISOString(),
    };

    const updatedWidgets = [...target.widgets, newWidget];
    get().updateDashboard(activeId, { widgets: updatedWidgets });
  },

  updateWidget: (widgetId, updates) => {
    const activeId = get().activeDashboardId;
    const target = get().dashboards.find((d) => d.id === activeId);
    if (!target) return;

    const updatedWidgets = target.widgets.map((w) =>
      w.id === widgetId ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
    );

    get().updateDashboard(activeId, { widgets: updatedWidgets });
  },

  deleteWidget: (widgetId) => {
    const activeId = get().activeDashboardId;
    const target = get().dashboards.find((d) => d.id === activeId);
    if (!target) return;

    const updatedWidgets = target.widgets.filter((w) => w.id !== widgetId);
    get().updateDashboard(activeId, { widgets: updatedWidgets });
  },

  duplicateWidget: (widgetId) => {
    const activeId = get().activeDashboardId;
    const target = get().dashboards.find((d) => d.id === activeId);
    if (!target) return;

    const targetWidget = target.widgets.find((w) => w.id === widgetId);
    if (!targetWidget) return;

    const dupWidget: BIWidget = {
      ...targetWidget,
      id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `${targetWidget.title} (Copy)`,
      position: {
        ...targetWidget.position,
        x: (targetWidget.position.x + 1) % 4,
      },
      updatedAt: new Date().toISOString(),
    };

    get().updateDashboard(activeId, { widgets: [...target.widgets, dupWidget] });
  },

  reorderWidgets: (widgets) => {
    const activeId = get().activeDashboardId;
    get().updateDashboard(activeId, { widgets });
  },

  updateGlobalFilters: (filters) => {
    const activeId = get().activeDashboardId;
    const target = get().dashboards.find((d) => d.id === activeId);
    if (!target) return;

    get().updateDashboard(activeId, {
      globalFilters: { ...target.globalFilters, ...filters },
    });
  },

  toggleExecutiveMode: (open) => {
    set((state) => ({
      executiveModeOpen: open !== undefined ? open : !state.executiveModeOpen,
      executiveSlideIndex: 0,
    }));
  },

  setExecutiveSlideIndex: (index) => set({ executiveSlideIndex: index }),

  setIsAddWidgetModalOpen: (open) => set({ isAddWidgetModalOpen: open }),

  setIsEditingWidgetModalOpen: (open, widget = null) =>
    set({ isEditingWidgetModalOpen: open, selectedWidgetForEdit: widget }),

  setIsShareModalOpen: (open) => set({ isShareModalOpen: open }),

  setIsReportModalOpen: (open) => set({ isReportModalOpen: open }),

  cloneTemplate: (templateId) => {
    const tmpl = get().marketplaceTemplates.find((t) => t.id === templateId);
    if (!tmpl) return;

    const clonedId = `dash_cloned_${Date.now()}`;
    const clonedDashboard: AnalyticsDashboard = {
      ...tmpl.dashboard,
      id: clonedId,
      title: `${tmpl.title} (Cloned)`,
      clonesCount: tmpl.clones + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      dashboards: [clonedDashboard, ...state.dashboards],
      activeDashboardId: clonedId,
      activeSubTab: 'builder',
      marketplaceTemplates: state.marketplaceTemplates.map((t) =>
        t.id === templateId ? { ...t, clones: t.clones + 1 } : t
      ),
    }));
  },

  publishDashboardToMarketplace: (dashboardId) => {
    const target = get().dashboards.find((d) => d.id === dashboardId);
    if (!target) return;

    get().updateDashboard(dashboardId, { isPublished: true });

    const newTemplate: MarketplaceTemplate = {
      id: `tmpl_pub_${Date.now()}`,
      title: target.title,
      description: target.description,
      category: 'SaaS',
      dashboard: target,
      stars: 1,
      clones: 0,
      author: target.author.name,
      avatar: target.author.avatar,
      updatedAt: 'Just now',
      previewImageBg: 'from-[#065F46] to-[#042F2E]',
    };

    set((state) => ({
      marketplaceTemplates: [newTemplate, ...state.marketplaceTemplates],
    }));
  },
}));
