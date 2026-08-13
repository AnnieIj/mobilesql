import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Zap,
  Package,
  UserMinus,
  Percent,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
} from 'lucide-react';
import { KPIConfig } from '../../types/analytics';

interface KpiCardWidgetProps {
  config: KPIConfig;
  onDrillDown?: () => void;
}

export const KpiCardWidget: React.FC<KpiCardWidgetProps> = ({ config, onDrillDown }) => {
  const getIcon = () => {
    switch (config.metricType) {
      case 'revenue':
      case 'profit':
        return DollarSign;
      case 'orders':
        return ShoppingBag;
      case 'customers':
      case 'active_users':
        return Users;
      case 'growth':
        return TrendingUp;
      case 'conversion':
        return Zap;
      case 'inventory':
        return Package;
      case 'churn':
        return UserMinus;
      default:
        return Activity;
    }
  };

  const IconComponent = getIcon();
  const isPositive = config.changePercent >= 0;

  const getStatusBgClass = () => {
    switch (config.statusColor) {
      case 'green':
        return 'border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]';
      case 'red':
        return 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]';
      case 'amber':
        return 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]';
      case 'purple':
        return 'border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#8B5CF6]';
      default:
        return 'border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#3B82F6]';
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D]/40 transition-all group relative">
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${getStatusBgClass()}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-[#8A8A90] uppercase tracking-wider truncate max-w-[140px]">
            {config.label}
          </span>
        </div>

        {onDrillDown && (
          <button
            onClick={onDrillDown}
            title="Drill-down insights"
            className="opacity-0 group-hover:opacity-100 p-1 text-[#8A8A90] hover:text-[#FFFFFF] hover:bg-[#2D2D31] rounded-md transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="my-2 space-y-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] font-mono tracking-tight flex items-baseline gap-1">
          {config.unit === '$' && <span className="text-lg text-[#8A8A90]">{config.unit}</span>}
          <span>{config.value.toLocaleString()}</span>
          {config.unit !== '$' && <span className="text-xs text-[#8A8A90] font-normal">{config.unit}</span>}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${
              isPositive ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {Math.abs(config.changePercent)}%
          </span>
          <span className="text-[10px] text-[#8A8A90] truncate">{config.comparisonPeriod}</span>
        </div>
      </div>

      {/* Mini Sparkline Bar Chart */}
      {config.sparklineData && config.sparklineData.length > 0 && (
        <div className="pt-2 flex items-end gap-1 h-8 w-full border-t border-[#2D2D31]/50">
          {config.sparklineData.map((val, idx) => {
            const maxVal = Math.max(...config.sparklineData!);
            const heightPct = Math.max(15, Math.round((val / maxVal) * 100));
            return (
              <div
                key={idx}
                className="flex-1 bg-[#2D2D31] hover:bg-[#62DF7D] rounded-t transition-all"
                style={{ height: `${heightPct}%` }}
                title={`Period ${idx + 1}: ${val}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
