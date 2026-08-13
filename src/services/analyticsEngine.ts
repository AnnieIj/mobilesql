import {
  AnalyticsDashboard,
  BIWidget,
  AIInsightItem,
  MarketplaceTemplate,
  KpiMetricType,
  KPIConfig,
  ChartConfig,
} from '../types/analytics';

// Initial pre-configured seed dashboards
export const SAMPLE_DASHBOARDS: AnalyticsDashboard[] = [
  {
    id: 'dash_saas_executive',
    title: 'SaaS Executive Board & Growth BI',
    description: 'Executive financial metrics, active user retention, funnel analysis & MRR expansion.',
    theme: 'emerald_dark',
    refreshInterval: 0,
    isPublished: true,
    publicShareToken: 'pub_saas_exec_9921',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      name: 'Alex Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'VP of Product Analytics',
    },
    tags: ['SaaS', 'Revenue', 'Funnel', 'Executive'],
    stars: 128,
    clonesCount: 340,
    globalFilters: {
      dateRange: { preset: '30d' },
      searchQuery: '',
      category: 'All Plans',
      numericRange: [0, 1000000],
      hierarchy: { region: 'Global', country: 'United States', store: 'All Channels' },
    },
    widgets: [
      {
        id: 'w_kpi_rev',
        title: 'Monthly Recurring Revenue',
        type: 'kpi',
        size: 'small',
        position: { x: 0, y: 0, w: 1, h: 1 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        kpiConfig: {
          metricType: 'revenue',
          label: 'Total MRR',
          value: 482910,
          unit: '$',
          changePercent: 18.4,
          comparisonPeriod: 'vs Prev Month',
          statusColor: 'green',
          iconName: 'DollarSign',
          sparklineData: [320, 340, 380, 410, 440, 482],
        },
      },
      {
        id: 'w_kpi_cust',
        title: 'Active Paid Customers',
        type: 'kpi',
        size: 'small',
        position: { x: 1, y: 0, w: 1, h: 1 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        kpiConfig: {
          metricType: 'customers',
          label: 'Active Customers',
          value: 4290,
          unit: 'accounts',
          changePercent: 12.1,
          comparisonPeriod: 'vs Prev Month',
          statusColor: 'blue',
          iconName: 'Users',
          sparklineData: [3100, 3400, 3700, 3950, 4100, 4290],
        },
      },
      {
        id: 'w_kpi_growth',
        title: 'Net Revenue Retention (NRR)',
        type: 'kpi',
        size: 'small',
        position: { x: 2, y: 0, w: 1, h: 1 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        kpiConfig: {
          metricType: 'growth',
          label: 'NRR Rate',
          value: 124.8,
          unit: '%',
          changePercent: 3.2,
          comparisonPeriod: 'vs Prev Month',
          statusColor: 'purple',
          iconName: 'TrendingUp',
          sparklineData: [118, 119, 121, 122, 123, 124.8],
        },
      },
      {
        id: 'w_kpi_churn',
        title: 'Logo Churn Rate',
        type: 'kpi',
        size: 'small',
        position: { x: 3, y: 0, w: 1, h: 1 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        kpiConfig: {
          metricType: 'churn',
          label: 'Monthly Churn',
          value: 1.24,
          unit: '%',
          changePercent: -0.3,
          comparisonPeriod: 'vs Prev Month',
          statusColor: 'green',
          iconName: 'UserMinus',
          sparklineData: [2.1, 1.8, 1.6, 1.5, 1.3, 1.24],
        },
      },
      {
        id: 'w_chart_arr_line',
        title: 'ARR Expansion & Churn Trend (12 Months)',
        type: 'chart',
        size: 'wide',
        position: { x: 0, y: 1, w: 2, h: 2 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        chartConfig: {
          chartType: 'line',
          xAxisKey: 'month',
          yAxisKeys: ['NewARR', 'Expansion', 'Churned'],
          colorPalette: ['#62DF7D', '#3B82F6', '#EF4444'],
          showLegend: true,
          showTooltip: true,
          showGrid: true,
        },
      },
      {
        id: 'w_chart_funnel',
        title: 'GTM Sales Pipeline Conversion Funnel',
        type: 'chart',
        size: 'medium',
        position: { x: 2, y: 1, w: 2, h: 2 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        chartConfig: {
          chartType: 'funnel',
          xAxisKey: 'stage',
          yAxisKeys: ['count'],
          colorPalette: ['#3B82F6', '#8B5CF6', '#EC4899', '#62DF7D'],
          showLegend: false,
          showTooltip: true,
          showGrid: false,
        },
      },
      {
        id: 'w_chart_gauge',
        title: 'Annual Target Performance Meter',
        type: 'chart',
        size: 'small',
        position: { x: 0, y: 3, w: 1, h: 1 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        chartConfig: {
          chartType: 'gauge',
          xAxisKey: 'label',
          yAxisKeys: ['percentage'],
          colorPalette: ['#62DF7D'],
          showLegend: false,
          showTooltip: true,
          showGrid: false,
          customGoal: 85,
        },
      },
      {
        id: 'w_chart_treemap',
        title: 'Customer Segmentation by Plan Size',
        type: 'chart',
        size: 'medium',
        position: { x: 1, y: 3, w: 2, h: 2 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        chartConfig: {
          chartType: 'treemap',
          xAxisKey: 'name',
          yAxisKeys: ['value'],
          colorPalette: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'],
          showLegend: false,
          showTooltip: true,
          showGrid: false,
        },
      },
    ],
  },
  {
    id: 'dash_ecommerce_retail',
    title: 'Omnichannel Retail & Order Intelligence',
    description: 'Order fulfillment velocities, product category revenue, refund rates and heatmap activity.',
    theme: 'midnight_neon',
    refreshInterval: 10,
    isPublished: true,
    publicShareToken: 'pub_ecom_growth_7712',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      name: 'Sofia Chen',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      role: 'Lead BI Architect',
    },
    tags: ['E-Commerce', 'Orders', 'Inventory', 'Heatmap'],
    stars: 94,
    clonesCount: 215,
    globalFilters: {
      dateRange: { preset: '7d' },
      searchQuery: '',
      category: 'Electronics',
      numericRange: [0, 500000],
      hierarchy: { region: 'North America', country: 'USA', store: 'West Coast Hub' },
    },
    widgets: [
      {
        id: 'w_ecom_orders',
        title: 'Total Processed Orders',
        type: 'kpi',
        size: 'small',
        position: { x: 0, y: 0, w: 1, h: 1 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        kpiConfig: {
          metricType: 'orders',
          label: 'Total Orders',
          value: 12840,
          unit: 'orders',
          changePercent: 8.2,
          comparisonPeriod: 'vs Prev Month',
          statusColor: 'green',
          iconName: 'ShoppingBag',
          sparklineData: [1100, 1150, 1200, 1220, 1260, 1284],
        },
      },
      {
        id: 'w_ecom_profit',
        title: 'Gross Margin Profit',
        type: 'kpi',
        size: 'small',
        position: { x: 1, y: 0, w: 1, h: 1 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        kpiConfig: {
          metricType: 'profit',
          label: 'Gross Profit',
          value: 142800,
          unit: '$',
          changePercent: 22.5,
          comparisonPeriod: 'vs Prev Month',
          statusColor: 'green',
          iconName: 'DollarSign',
          sparklineData: [100, 110, 125, 130, 138, 142.8],
        },
      },
      {
        id: 'w_ecom_inventory',
        title: 'Warehouse Stock Level',
        type: 'kpi',
        size: 'small',
        position: { x: 2, y: 0, w: 1, h: 1 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        kpiConfig: {
          metricType: 'inventory',
          label: 'In Stock Items',
          value: 85400,
          unit: 'units',
          changePercent: -2.1,
          comparisonPeriod: 'vs Prev Month',
          statusColor: 'amber',
          iconName: 'Package',
          sparklineData: [920, 900, 880, 870, 860, 854],
        },
      },
      {
        id: 'w_ecom_conv',
        title: 'Checkout Conversion',
        type: 'kpi',
        size: 'small',
        position: { x: 3, y: 0, w: 1, h: 1 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        kpiConfig: {
          metricType: 'conversion',
          label: 'CR Percentage',
          value: 3.82,
          unit: '%',
          changePercent: 0.4,
          comparisonPeriod: 'vs Prev Month',
          statusColor: 'blue',
          iconName: 'Zap',
          sparklineData: [3.2, 3.4, 3.5, 3.6, 3.75, 3.82],
        },
      },
      {
        id: 'w_chart_waterfall',
        title: 'Revenue Bridge & Cost Waterfall',
        type: 'chart',
        size: 'wide',
        position: { x: 0, y: 1, w: 2, h: 2 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        chartConfig: {
          chartType: 'waterfall',
          xAxisKey: 'item',
          yAxisKeys: ['amount'],
          colorPalette: ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'],
          showLegend: false,
          showTooltip: true,
          showGrid: true,
        },
      },
      {
        id: 'w_chart_heatmap',
        title: 'Weekly Order Volume Density Heatmap',
        type: 'chart',
        size: 'medium',
        position: { x: 2, y: 1, w: 2, h: 2 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        chartConfig: {
          chartType: 'heatmap',
          xAxisKey: 'day',
          yAxisKeys: ['density'],
          colorPalette: ['#131315', '#065F46', '#10B981', '#34D399', '#A7F3D0'],
          showLegend: true,
          showTooltip: true,
          showGrid: false,
        },
      },
      {
        id: 'w_chart_sankey',
        title: 'Fulfillment & Logistics Channel Flow',
        type: 'chart',
        size: 'wide',
        position: { x: 0, y: 3, w: 2, h: 2 },
        dataSourceId: 'sql_playground',
        dataSourceType: 'sql_playground',
        updatedAt: new Date().toISOString(),
        chartConfig: {
          chartType: 'sankey',
          xAxisKey: 'source',
          yAxisKeys: ['target', 'value'],
          colorPalette: ['#3B82F6', '#10B981', '#8B5CF6'],
          showLegend: true,
          showTooltip: true,
          showGrid: false,
        },
      },
    ],
  },
];

// Sample AI Insights generator
export function generateAiInsightsForDashboard(dashboard: AnalyticsDashboard): AIInsightItem[] {
  return [
    {
      id: 'ai_ins_1',
      dashboardId: dashboard.id,
      type: 'anomaly',
      title: 'Unexpected Spike in Checkout Drops (+14%)',
      description: 'Cart abandonments increased sharply during peak hours (18:00 - 21:00 UTC) on mobile web sessions.',
      impact: 'high',
      confidenceScore: 94,
      suggestedAction: 'Review Mobile Checkout API latency log or query slow query traces in SQL Lab.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ai_ins_2',
      dashboardId: dashboard.id,
      type: 'trend',
      title: 'Positive Growth in Enterprise Tier Expansion',
      description: 'Enterprise upgrades grew by +28.4% month-over-month, outperforming SMB growth by 3.2x.',
      impact: 'high',
      confidenceScore: 91,
      suggestedAction: 'Consider increasing seat limits on Pro Tier to capture mid-market expansion momentum.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ai_ins_3',
      dashboardId: dashboard.id,
      type: 'chart_recommendation',
      title: 'Suggested Visual: Radar Chart for Multi-Axis SLA Metrics',
      description: 'Your dataset contains 6 correlated performance dimensions suitable for a Radar comparison.',
      impact: 'medium',
      confidenceScore: 88,
      suggestedAction: 'Add a Radar chart widget to compare fulfillment SLA vs server response speed.',
      recommendedChartType: 'radar',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ai_ins_4',
      dashboardId: dashboard.id,
      type: 'seasonality',
      title: 'Quarterly Recurring Peak Patterns Detected',
      description: 'Historic data exhibits an 82% probability of a 35% revenue uptick during the last 2 weeks of Q3.',
      impact: 'medium',
      confidenceScore: 85,
      suggestedAction: 'Prepare inventory buffer allocations prior to September 15th.',
      createdAt: new Date().toISOString(),
    },
  ];
}

// Sample Marketplace Templates
export const MARKETPLACE_TEMPLATES: MarketplaceTemplate[] = [
  {
    id: 'tmpl_saas_health',
    title: 'SaaS Financial & Unit Economics Board',
    description: 'Track CAC, LTV, NRR, Churn, ARR Growth Rate, and Burn Runway for subscription products.',
    category: 'SaaS',
    stars: 284,
    clones: 1420,
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    updatedAt: '2 days ago',
    previewImageBg: 'from-[#065F46] to-[#042F2E]',
    dashboard: SAMPLE_DASHBOARDS[0],
  },
  {
    id: 'tmpl_ecom_growth',
    title: 'Omnichannel E-Commerce & Logistics Hub',
    description: 'Comprehensive fulfillment tracking, channel ROI, refund analytics, and inventory forecasting.',
    category: 'E-Commerce',
    stars: 196,
    clones: 890,
    author: 'Marcus Brody',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    updatedAt: '1 week ago',
    previewImageBg: 'from-[#1E3A8A] to-[#172554]',
    dashboard: SAMPLE_DASHBOARDS[1],
  },
  {
    id: 'tmpl_devops_infra',
    title: 'PostgreSQL Database & Query Latency Monitor',
    description: 'Real-time EXPLAIN execution trees, buffer pool cache hits, slow query traces and index scans.',
    category: 'DevOps',
    stars: 312,
    clones: 2100,
    author: 'System Admin Group',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    updatedAt: 'Yesterday',
    previewImageBg: 'from-[#581C87] to-[#3B0764]',
    dashboard: SAMPLE_DASHBOARDS[0],
  },
];

// Helper to generate dynamic mock chart data for all 15 chart types
export function getChartDataForType(type: string): Record<string, unknown>[] {
  switch (type) {
    case 'bar':
    case 'column':
      return [
        { name: 'North America', sales: 4800, profit: 2100, goal: 4000 },
        { name: 'Europe', sales: 3600, profit: 1400, goal: 3500 },
        { name: 'Asia Pacific', sales: 5200, profit: 2600, goal: 4500 },
        { name: 'Latin America', sales: 2100, profit: 900, goal: 2000 },
        { name: 'Middle East', sales: 1800, profit: 750, goal: 1500 },
      ];

    case 'line':
    case 'area':
      return [
        { month: 'Jan', NewARR: 42, Expansion: 15, Churned: 6 },
        { month: 'Feb', NewARR: 48, Expansion: 18, Churned: 5 },
        { month: 'Mar', NewARR: 55, Expansion: 22, Churned: 7 },
        { month: 'Apr', NewARR: 62, Expansion: 28, Churned: 4 },
        { month: 'May', NewARR: 70, Expansion: 32, Churned: 5 },
        { month: 'Jun', NewARR: 84, Expansion: 40, Churned: 3 },
      ];

    case 'pie':
    case 'donut':
      return [
        { name: 'Enterprise', value: 45 },
        { name: 'Pro Team', value: 30 },
        { name: 'Starter', value: 15 },
        { name: 'Individual', value: 10 },
      ];

    case 'scatter':
      return [
        { x: 12, y: 84, name: 'Prod A', category: 'High Margin' },
        { x: 28, y: 140, name: 'Prod B', category: 'High Margin' },
        { x: 45, y: 210, name: 'Prod C', category: 'Volume Leader' },
        { x: 60, y: 310, name: 'Prod D', category: 'Volume Leader' },
        { x: 80, y: 450, name: 'Prod E', category: 'Flagship' },
      ];

    case 'bubble':
      return [
        { x: 20, y: 60, z: 200, name: 'Group Alpha' },
        { x: 40, y: 120, z: 450, name: 'Group Beta' },
        { x: 65, y: 230, z: 800, name: 'Group Gamma' },
        { x: 85, y: 380, z: 1200, name: 'Group Delta' },
      ];

    case 'treemap':
      return [
        { name: 'Databases', value: 4500, size: 45 },
        { name: 'Storage Buckets', value: 3200, size: 32 },
        { name: 'Compute Nodes', value: 2800, size: 28 },
        { name: 'Networking/CDN', value: 1900, size: 19 },
        { name: 'Security Vault', value: 1200, size: 12 },
      ];

    case 'heatmap':
      return [
        { day: 'Mon', h08: 12, h12: 45, h16: 68, h20: 32 },
        { day: 'Tue', h08: 18, h12: 52, h16: 84, h20: 41 },
        { day: 'Wed', h08: 22, h12: 60, h16: 92, h20: 48 },
        { day: 'Thu', h08: 20, h12: 58, h16: 88, h20: 45 },
        { day: 'Fri', h08: 15, h12: 40, h16: 70, h20: 30 },
      ];

    case 'funnel':
      return [
        { stage: 'Website Visitors', count: 120000, pct: '100%' },
        { stage: 'Product Signups', count: 24000, pct: '20%' },
        { stage: 'Active Trial Users', count: 9600, pct: '8%' },
        { stage: 'Paid Subscribers', count: 3840, pct: '3.2%' },
      ];

    case 'waterfall':
      return [
        { item: 'Starting ARR', amount: 350 },
        { item: 'New Customer ARR', amount: 120 },
        { item: 'Expansion Upgrades', amount: 65 },
        { item: 'Contraction/Downgrades', amount: -25 },
        { item: 'Churn Cancellations', amount: -18 },
        { item: 'Ending ARR', amount: 492 },
      ];

    case 'sankey':
      return [
        { source: 'Organic Search', target: 'Landing Page', value: 4500 },
        { source: 'Paid Ads', target: 'Landing Page', value: 3200 },
        { source: 'Landing Page', target: 'Free Trial', value: 5200 },
        { source: 'Landing Page', target: 'Drop-off', value: 2500 },
        { source: 'Free Trial', target: 'Paid Pro Plan', value: 2100 },
        { source: 'Free Trial', target: 'Paid Enterprise', value: 1100 },
      ];

    case 'radar':
      return [
        { metric: 'Uptime SLA', Enterprise: 99.9, Standard: 99.0 },
        { metric: 'Query Speed', Enterprise: 95, Standard: 78 },
        { metric: 'Support Response', Enterprise: 98, Standard: 65 },
        { metric: 'Feature Adoption', Enterprise: 88, Standard: 72 },
        { metric: 'Security Audit', Enterprise: 100, Standard: 80 },
      ];

    case 'gauge':
      return [
        { label: 'Quarterly Goal Progress', percentage: 78.4 },
      ];

    default:
      return [
        { name: 'A', value: 400 },
        { name: 'B', value: 300 },
        { name: 'C', value: 200 },
        { name: 'D', value: 100 },
      ];
  }
}

// Generate printable HTML string for export service
export function generatePrintableReportHtml(dashboard: AnalyticsDashboard, format: 'pdf' | 'excel' | 'csv'): string {
  if (format === 'csv') {
    let csvContent = `Widget Title,Type,Value/Key,Detail\n`;
    dashboard.widgets.forEach((w) => {
      if (w.kpiConfig) {
        csvContent += `"${w.title}","KPI","${w.kpiConfig.value} ${w.kpiConfig.unit}","${w.kpiConfig.changePercent}% ${w.kpiConfig.comparisonPeriod}"\n`;
      } else {
        csvContent += `"${w.title}","${w.type}","Chart Metric","${w.chartConfig?.chartType || 'Chart'}"\n`;
      }
    });
    return csvContent;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>MobileSQL Executive Report - ${dashboard.title}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #ffffff; color: #111827; padding: 40px; }
          h1 { color: #059669; margin-bottom: 4px; }
          .meta { color: #6B7280; font-size: 14px; margin-bottom: 24px; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px; }
          .card { border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; }
          .card-title { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6B7280; }
          .card-val { font-size: 24px; font-weight: 700; color: #059669; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #E5E7EB; padding: 8px 12px; font-size: 13px; text-align: left; }
          th { background: #F9FAFB; }
        </style>
      </head>
      <body>
        <h1>${dashboard.title}</h1>
        <div class="meta">
          Prepared by MobileSQL BI Studio • Author: ${dashboard.author.name} • Generated: ${new Date().toLocaleDateString()}
        </div>
        <p>${dashboard.description}</p>
        
        <h3>Executive KPI Summary</h3>
        <div class="grid">
          ${dashboard.widgets
            .filter((w) => w.type === 'kpi' && w.kpiConfig)
            .map(
              (w) => `
            <div class="card">
              <div class="card-title">${w.title}</div>
              <div class="card-val">${w.kpiConfig?.unit}${w.kpiConfig?.value.toLocaleString()}</div>
              <div style="font-size: 12px; color: ${w.kpiConfig?.changePercent && w.kpiConfig.changePercent >= 0 ? '#059669' : '#DC2626'}; margin-top: 4px;">
                ${w.kpiConfig?.changePercent && w.kpiConfig.changePercent >= 0 ? '+' : ''}${w.kpiConfig?.changePercent}% ${w.kpiConfig?.comparisonPeriod}
              </div>
            </div>
          `
            )
            .join('')}
        </div>

        <h3>Active Visualization Inventory</h3>
        <table>
          <thead>
            <tr>
              <th>Widget Name</th>
              <th>Type</th>
              <th>Data Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${dashboard.widgets
              .map(
                (w) => `
              <tr>
                <td><strong>${w.title}</strong></td>
                <td>${w.type.toUpperCase()} (${w.chartConfig?.chartType || 'KPI'})</td>
                <td>${w.dataSourceType}</td>
                <td>Active Live Sync</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
}
