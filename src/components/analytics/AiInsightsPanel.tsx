import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  PlusCircle,
  Clock,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useAnalyticsStore } from '../../stores/useAnalyticsStore';
import { ChartType } from '../../types/analytics';

export const AiInsightsPanel: React.FC = () => {
  const { insightsList, addWidget, dashboards, activeDashboardId } = useAnalyticsStore();
  const currentDashboard = dashboards.find((d) => d.id === activeDashboardId);

  const handleApplyRecommendedChart = (chartType?: ChartType) => {
    if (!chartType || !currentDashboard) return;

    addWidget({
      title: `AI Suggested ${chartType.toUpperCase()} Visualizer`,
      type: 'chart',
      size: 'medium',
      dataSourceId: 'sql_playground',
      dataSourceType: 'sql_playground',
      position: { x: 0, y: 0, w: 2, h: 2 },
      chartConfig: {
        chartType,
        xAxisKey: 'name',
        yAxisKeys: ['sales', 'profit'],
        colorPalette: ['#62DF7D', '#3B82F6', '#8B5CF6'],
        showLegend: true,
        showTooltip: true,
        showGrid: true,
      },
    });
  };

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40';
      case 'medium':
        return 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40';
      default:
        return 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40';
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#FFFFFF]">
      {/* AI Intelligence Header Banner */}
      <div className="bg-gradient-to-r from-[#1B1B1E] via-[#1F2937] to-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-3 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 text-[#62DF7D] font-bold text-sm">
          <Sparkles className="w-5 h-5" />
          <span>Gemini AI Business Intelligence & Anomaly Engine</span>
        </div>
        <p className="text-xs text-[#8A8A90] max-w-2xl">
          Automated time-series anomaly detection, seasonality recognition, growth opportunity identification, and intelligent chart layout recommendations for <strong>{currentDashboard?.title || 'Active Dashboard'}</strong>.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1">
          <span className="flex items-center gap-1.5 text-[#62DF7D]">
            <Zap className="w-3.5 h-3.5" /> 94.2% Anomaly Precision
          </span>
          <span className="text-[#8A8A90]">•</span>
          <span className="text-[#3B82F6]">4 Insights Generated</span>
          <span className="text-[#8A8A90]">•</span>
          <span className="text-[#8B5CF6]">Auto-Scanned 12s ago</span>
        </div>
      </div>

      {/* Insights Stream Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insightsList.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D]/50 transition-all space-y-3 flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getImpactBadge(
                    item.impact
                  )}`}
                >
                  {item.impact} Impact • {item.type.toUpperCase()}
                </span>
                <span className="text-[10px] text-[#8A8A90] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.confidenceScore}% Confidence
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
                {item.type === 'anomaly' && <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />}
                {item.type === 'trend' && <TrendingUp className="w-4 h-4 text-[#62DF7D] shrink-0" />}
                {item.type === 'chart_recommendation' && <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0" />}
                <span>{item.title}</span>
              </h4>

              <p className="text-[11px] text-[#8A8A90] leading-relaxed">{item.description}</p>
            </div>

            {/* Actionable Suggestion Box */}
            {item.suggestedAction && (
              <div className="p-3 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2 mt-2">
                <div className="flex items-center justify-between text-[10px] text-[#62DF7D] font-bold">
                  <span>AI Recommended Action:</span>
                </div>
                <p className="text-[11px] text-[#FFFFFF]">{item.suggestedAction}</p>

                {item.recommendedChartType && (
                  <button
                    onClick={() => handleApplyRecommendedChart(item.recommendedChartType)}
                    className="w-full py-2 rounded-lg bg-[#62DF7D] text-[#131315] font-bold flex items-center justify-center gap-1.5 hover:bg-[#52ce6d] transition-all cursor-pointer mt-2 text-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Apply Recommended {item.recommendedChartType.toUpperCase()} Chart</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
