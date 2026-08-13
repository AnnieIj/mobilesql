import React, { useState, useEffect } from 'react';
import { X, Sparkles, LayoutGrid, Database, BarChart2 } from 'lucide-react';
import { useAnalyticsStore } from '../../stores/useAnalyticsStore';
import {
  ChartType,
  KpiMetricType,
  WidgetSize,
  DataSourceType,
} from '../../types/analytics';

export const AddEditWidgetModal: React.FC = () => {
  const {
    isAddWidgetModalOpen,
    isEditingWidgetModalOpen,
    selectedWidgetForEdit,
    setIsAddWidgetModalOpen,
    setIsEditingWidgetModalOpen,
    addWidget,
    updateWidget,
  } = useAnalyticsStore();

  const isOpen = isAddWidgetModalOpen || isEditingWidgetModalOpen;

  // Form State
  const [title, setTitle] = useState('New Metric Visualizer');
  const [type, setType] = useState<'kpi' | 'chart' | 'table'>('kpi');
  const [size, setSize] = useState<WidgetSize>('small');
  const [dataSourceType, setDataSourceType] = useState<DataSourceType>('sql_playground');

  // KPI Specific state
  const [metricType, setMetricType] = useState<KpiMetricType>('revenue');
  const [kpiLabel, setKpiLabel] = useState('Total Revenue');
  const [kpiValue, setKpiValue] = useState(154200);
  const [kpiUnit, setKpiUnit] = useState('$');
  const [kpiChange, setKpiChange] = useState(14.8);
  const [statusColor, setStatusColor] = useState<'green' | 'red' | 'amber' | 'blue' | 'purple'>('green');

  // Chart Specific state
  const [chartType, setChartType] = useState<ChartType>('column');
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    if (selectedWidgetForEdit) {
      setTitle(selectedWidgetForEdit.title);
      setType(selectedWidgetForEdit.type as 'kpi' | 'chart' | 'table');
      setSize(selectedWidgetForEdit.size);
      setDataSourceType(selectedWidgetForEdit.dataSourceType);

      if (selectedWidgetForEdit.kpiConfig) {
        setMetricType(selectedWidgetForEdit.kpiConfig.metricType);
        setKpiLabel(selectedWidgetForEdit.kpiConfig.label);
        setKpiValue(selectedWidgetForEdit.kpiConfig.value);
        setKpiUnit(selectedWidgetForEdit.kpiConfig.unit);
        setKpiChange(selectedWidgetForEdit.kpiConfig.changePercent);
        setStatusColor(selectedWidgetForEdit.kpiConfig.statusColor);
      }

      if (selectedWidgetForEdit.chartConfig) {
        setChartType(selectedWidgetForEdit.chartConfig.chartType);
        setShowLegend(selectedWidgetForEdit.chartConfig.showLegend);
        setShowGrid(selectedWidgetForEdit.chartConfig.showGrid);
      }
    } else {
      // Default reset
      setTitle('New Business Metric Visualizer');
      setType('kpi');
      setSize('small');
      setDataSourceType('sql_playground');
      setMetricType('revenue');
      setKpiLabel('Total Sales');
      setKpiValue(184200);
      setKpiUnit('$');
      setKpiChange(12.4);
      setStatusColor('green');
      setChartType('column');
    }
  }, [selectedWidgetForEdit, isAddWidgetModalOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsAddWidgetModalOpen(false);
    setIsEditingWidgetModalOpen(false, null);
  };

  const handleSave = () => {
    const kpiConfigData =
      type === 'kpi'
        ? {
            metricType,
            label: kpiLabel,
            value: Number(kpiValue),
            unit: kpiUnit,
            changePercent: Number(kpiChange),
            comparisonPeriod: 'vs Prev Month' as const,
            statusColor,
            iconName: 'Activity',
            sparklineData: [100, 120, 130, 140, 150, Number(kpiValue)],
          }
        : undefined;

    const chartConfigData =
      type === 'chart'
        ? {
            chartType,
            xAxisKey: 'name',
            yAxisKeys: ['sales', 'profit'],
            colorPalette: ['#62DF7D', '#3B82F6', '#8B5CF6', '#F59E0B'],
            showLegend,
            showTooltip: true,
            showGrid,
          }
        : undefined;

    if (selectedWidgetForEdit) {
      updateWidget(selectedWidgetForEdit.id, {
        title,
        type,
        size,
        dataSourceType,
        kpiConfig: kpiConfigData,
        chartConfig: chartConfigData,
      });
    } else {
      addWidget({
        title,
        type,
        size,
        dataSourceId: 'sql_playground',
        dataSourceType,
        position: { x: 0, y: 0, w: 1, h: 1 },
        kpiConfig: kpiConfigData,
        chartConfig: chartConfigData,
      });
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131315]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl font-mono text-xs text-[#FFFFFF]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2D2D31]">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-[#62DF7D]" />
            <h3 className="text-sm font-bold text-[#FFFFFF]">
              {selectedWidgetForEdit ? 'Edit BI Widget' : 'Add New Widget'}
            </h3>
          </div>
          <button onClick={handleClose} className="p-1 text-[#8A8A90] hover:text-[#FFFFFF] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
          {/* Widget Title */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#8A8A90] uppercase tracking-wider font-bold">Widget Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
            />
          </div>

          {/* Widget Category Type */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#8A8A90] uppercase tracking-wider font-bold">Widget Visual Mode</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setType('kpi')}
                className={`p-2.5 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  type === 'kpi'
                    ? 'bg-[#62DF7D] text-[#131315] border-[#62DF7D]'
                    : 'bg-[#131315] border-[#2D2D31] text-[#8A8A90]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> KPI Card
              </button>
              <button
                onClick={() => {
                  setType('chart');
                  if (size === 'small') setSize('medium');
                }}
                className={`p-2.5 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  type === 'chart'
                    ? 'bg-[#62DF7D] text-[#131315] border-[#62DF7D]'
                    : 'bg-[#131315] border-[#2D2D31] text-[#8A8A90]'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" /> 15-Type Chart
              </button>
              <button
                onClick={() => setType('table')}
                className={`p-2.5 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  type === 'table'
                    ? 'bg-[#62DF7D] text-[#131315] border-[#62DF7D]'
                    : 'bg-[#131315] border-[#2D2D31] text-[#8A8A90]'
                }`}
              >
                <Database className="w-3.5 h-3.5" /> Data Table
              </button>
            </div>
          </div>

          {/* Widget Size Grid Span */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#8A8A90] uppercase tracking-wider font-bold">Grid Layout Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as WidgetSize)}
              className="w-full px-3 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D] cursor-pointer"
            >
              <option value="small">Small (1x1 Grid Card)</option>
              <option value="medium">Medium (2x2 Grid Panel)</option>
              <option value="wide">Wide (2x2 Wide Span)</option>
              <option value="tall">Tall (2x3 Vertical Span)</option>
              <option value="full">Full Screen (4x4 Dashboard Board)</option>
            </select>
          </div>

          {/* Connected Data Source */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#8A8A90] uppercase tracking-wider font-bold">SQL Dataset Connection</label>
            <select
              value={dataSourceType}
              onChange={(e) => setDataSourceType(e.target.value as DataSourceType)}
              className="w-full px-3 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D] cursor-pointer"
            >
              <option value="sql_playground">SQL Playground Query Stream</option>
              <option value="ai_generated">AI Dataset Generator Output</option>
              <option value="csv">Imported CSV File Dataset</option>
              <option value="json">Imported JSON API Endpoint</option>
            </select>
          </div>

          {/* KPI Configuration Details */}
          {type === 'kpi' && (
            <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-3">
              <span className="text-[10px] font-bold text-[#62DF7D] uppercase tracking-wider">
                KPI Card Settings
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#8A8A90]">Metric Type</label>
                  <select
                    value={metricType}
                    onChange={(e) => setMetricType(e.target.value as KpiMetricType)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1B1B1E] border border-[#2D2D31] text-[#FFFFFF]"
                  >
                    <option value="revenue">Revenue</option>
                    <option value="orders">Orders</option>
                    <option value="customers">Customers</option>
                    <option value="profit">Profit</option>
                    <option value="growth">Growth</option>
                    <option value="conversion">Conversion Rate</option>
                    <option value="active_users">Active Users</option>
                    <option value="inventory">Inventory</option>
                    <option value="churn">Churn Rate</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#8A8A90]">Unit Symbol</label>
                  <input
                    type="text"
                    value={kpiUnit}
                    onChange={(e) => setKpiUnit(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1B1B1E] border border-[#2D2D31] text-[#FFFFFF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#8A8A90]">Current Value</label>
                  <input
                    type="number"
                    value={kpiValue}
                    onChange={(e) => setKpiValue(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1B1B1E] border border-[#2D2D31] text-[#FFFFFF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#8A8A90]">Growth Trend (%)</label>
                  <input
                    type="number"
                    value={kpiChange}
                    onChange={(e) => setKpiChange(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1B1B1E] border border-[#2D2D31] text-[#FFFFFF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Chart Configuration Details */}
          {type === 'chart' && (
            <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-3">
              <span className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-wider">
                15 Chart Types Selection
              </span>
              <div className="space-y-2">
                <label className="text-[10px] text-[#8A8A90]">Chart Type</label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as ChartType)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] text-[#FFFFFF] font-bold cursor-pointer"
                >
                  <option value="bar">Bar Chart (Horizontal)</option>
                  <option value="column">Column Chart (Vertical)</option>
                  <option value="line">Line Trend Chart</option>
                  <option value="area">Area Trend Chart</option>
                  <option value="pie">Pie Chart Breakdown</option>
                  <option value="donut">Donut Ring Summary</option>
                  <option value="scatter">Scatter Plot Correlation</option>
                  <option value="bubble">Bubble Chart 3D Metric</option>
                  <option value="treemap">Treemap Rectangles</option>
                  <option value="heatmap">Density Heatmap (2D)</option>
                  <option value="funnel">Conversion Funnel Stages</option>
                  <option value="waterfall">Waterfall Cash/ARR Bridge</option>
                  <option value="sankey">Sankey Channel Flow</option>
                  <option value="radar">Radar Multi-Axis Scorecard</option>
                  <option value="gauge">Target Speedometer Gauge</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-[11px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLegend}
                    onChange={(e) => setShowLegend(e.target.checked)}
                    className="rounded text-[#62DF7D]"
                  />
                  <span>Show Chart Legend</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded text-[#62DF7D]"
                  />
                  <span>Show Grid Lines</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2D2D31]">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-[#131315] text-[#8A8A90] hover:text-[#FFFFFF] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#62DF7D] text-[#131315] font-bold cursor-pointer hover:bg-[#52ce6d] transition-all"
          >
            {selectedWidgetForEdit ? 'Save Changes' : 'Create Widget'}
          </button>
        </div>
      </div>
    </div>
  );
};
