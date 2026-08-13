import React from 'react';
import { KpiCardWidget } from './KpiCardWidget';
import { KPIConfig } from '../../types/analytics';

export const KpiShowcaseTab: React.FC = () => {
  const kpiConfigs: KPIConfig[] = [
    {
      metricType: 'revenue',
      label: 'Monthly Recurring Revenue',
      value: 482910,
      unit: '$',
      changePercent: 18.4,
      comparisonPeriod: 'vs Prev Month',
      statusColor: 'green',
      iconName: 'DollarSign',
      sparklineData: [320, 340, 380, 410, 440, 482],
    },
    {
      metricType: 'orders',
      label: 'Processed Orders',
      value: 12840,
      unit: 'orders',
      changePercent: 8.2,
      comparisonPeriod: 'vs Prev Month',
      statusColor: 'green',
      iconName: 'ShoppingBag',
      sparklineData: [1100, 1150, 1200, 1220, 1260, 1284],
    },
    {
      metricType: 'customers',
      label: 'Active Paid Accounts',
      value: 4290,
      unit: 'accounts',
      changePercent: 12.1,
      comparisonPeriod: 'vs Prev Month',
      statusColor: 'blue',
      iconName: 'Users',
      sparklineData: [3100, 3400, 3700, 3950, 4100, 4290],
    },
    {
      metricType: 'profit',
      label: 'Gross Profit Margin',
      value: 142800,
      unit: '$',
      changePercent: 22.5,
      comparisonPeriod: 'vs Prev Month',
      statusColor: 'green',
      iconName: 'DollarSign',
      sparklineData: [100, 110, 125, 130, 138, 142.8],
    },
    {
      metricType: 'growth',
      label: 'Net Revenue Retention',
      value: 124.8,
      unit: '%',
      changePercent: 3.2,
      comparisonPeriod: 'vs Prev Month',
      statusColor: 'purple',
      iconName: 'TrendingUp',
      sparklineData: [118, 119, 121, 122, 123, 124.8],
    },
    {
      metricType: 'conversion',
      label: 'Checkout Conversion',
      value: 3.82,
      unit: '%',
      changePercent: 0.4,
      comparisonPeriod: 'vs Prev Month',
      statusColor: 'blue',
      iconName: 'Zap',
      sparklineData: [3.2, 3.4, 3.5, 3.6, 3.75, 3.82],
    },
    {
      metricType: 'active_users',
      label: 'Daily Active Users (DAU)',
      value: 18450,
      unit: 'DAU',
      changePercent: 15.2,
      comparisonPeriod: 'vs Prev Month',
      statusColor: 'green',
      iconName: 'Users',
      sparklineData: [1200, 1400, 1550, 1680, 1750, 1845],
    },
    {
      metricType: 'inventory',
      label: 'Warehouse Stock Units',
      value: 85400,
      unit: 'items',
      changePercent: -2.1,
      comparisonPeriod: 'vs Prev Month',
      statusColor: 'amber',
      iconName: 'Package',
      sparklineData: [920, 900, 880, 870, 860, 854],
    },
    {
      metricType: 'churn',
      label: 'Monthly Logo Churn',
      value: 1.24,
      unit: '%',
      changePercent: -0.3,
      comparisonPeriod: 'vs Prev Month',
      statusColor: 'green',
      iconName: 'UserMinus',
      sparklineData: [2.1, 1.8, 1.6, 1.5, 1.3, 1.24],
    },
  ];

  return (
    <div className="space-y-6 font-mono text-xs text-[#FFFFFF]">
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-2">
        <h2 className="text-sm font-bold text-[#FFFFFF]">KPI Metric Command Cards Gallery (9 Metrics)</h2>
        <p className="text-xs text-[#8A8A90]">
          Standardized C-Suite executive key performance indicator cards with trend direction, period comparisons, conditional color coding, and sparklines.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {kpiConfigs.map((config, idx) => (
          <div key={idx} className="h-44">
            <KpiCardWidget config={config} />
          </div>
        ))}
      </div>
    </div>
  );
};
