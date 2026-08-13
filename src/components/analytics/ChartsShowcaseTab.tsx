import React from 'react';
import { ChartRenderer } from './ChartRenderer';
import { ChartType, ChartConfig } from '../../types/analytics';

export const ChartsShowcaseTab: React.FC = () => {
  const chartTypes: Array<{ type: ChartType; title: string; description: string }> = [
    { type: 'bar', title: 'Bar Chart (Horizontal)', description: 'Horizontal category comparison' },
    { type: 'column', title: 'Column Chart (Vertical)', description: 'Vertical discrete bar comparison' },
    { type: 'line', title: 'Line Trend Chart', description: 'Continuous time-series trend tracking' },
    { type: 'area', title: 'Area Trend Chart', description: 'Cumulative stacked area volume' },
    { type: 'pie', title: 'Pie Chart Breakdown', description: 'Proportional part-to-whole slice share' },
    { type: 'donut', title: 'Donut Ring Summary', description: 'Segment share with center summary' },
    { type: 'scatter', title: 'Scatter Plot Correlation', description: '2D variable statistical distribution' },
    { type: 'bubble', title: 'Bubble Chart (3D Dimensions)', description: 'X, Y metrics with bubble magnitude Z' },
    { type: 'treemap', title: 'Treemap Rectangles', description: 'Hierarchical structural volume by area' },
    { type: 'heatmap', title: 'Density Heatmap (2D)', description: 'Hourly/Daily transaction density matrix' },
    { type: 'funnel', title: 'Conversion Funnel Stages', description: 'Stage-by-stage drop-off analytics' },
    { type: 'waterfall', title: 'Waterfall Cash/ARR Bridge', description: 'Incremental positive/negative flow' },
    { type: 'sankey', title: 'Sankey Channel Flow', description: 'Directional source to target path flow' },
    { type: 'radar', title: 'Radar Multi-Axis Scorecard', description: 'Multi-dimensional SLA performance rating' },
    { type: 'gauge', title: 'Target Speedometer Gauge', description: 'KPI goal progress meter percentage' },
  ];

  return (
    <div className="space-y-6 font-mono text-xs text-[#FFFFFF]">
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-2">
        <h2 className="text-sm font-bold text-[#FFFFFF]">15 Production Chart Visualizer Gallery</h2>
        <p className="text-xs text-[#8A8A90]">
          Complete library of 15 interactive charts supporting tooltips, legends, drill-down events, and live dataset binding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chartTypes.map((item) => {
          const config: ChartConfig = {
            chartType: item.type,
            xAxisKey: 'name',
            yAxisKeys: ['sales', 'profit'],
            colorPalette: ['#62DF7D', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'],
            showLegend: true,
            showTooltip: true,
            showGrid: true,
          };

          return (
            <div
              key={item.type}
              className="p-4 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-3 shadow-xl hover:border-[#62DF7D]/50 transition-all"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#2D2D31]">
                <div>
                  <h3 className="font-bold text-xs text-[#FFFFFF]">{item.title}</h3>
                  <p className="text-[10px] text-[#8A8A90]">{item.description}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#62DF7D]/10 text-[#62DF7D] text-[10px] font-bold border border-[#62DF7D]/30">
                  {item.type.toUpperCase()}
                </span>
              </div>

              <div className="h-48 pt-2">
                <ChartRenderer config={config} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
