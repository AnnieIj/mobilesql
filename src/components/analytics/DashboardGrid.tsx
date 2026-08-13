import React from 'react';
import { Plus, LayoutGrid, Sparkles } from 'lucide-react';
import { useAnalyticsStore } from '../../stores/useAnalyticsStore';
import { WidgetCard } from './WidgetCard';
import { BIWidget } from '../../types/analytics';

export const DashboardGrid: React.FC = () => {
  const {
    dashboards,
    activeDashboardId,
    setIsAddWidgetModalOpen,
    setIsEditingWidgetModalOpen,
    duplicateWidget,
    deleteWidget,
  } = useAnalyticsStore();

  const dashboard = dashboards.find((d) => d.id === activeDashboardId);

  if (!dashboard) {
    return (
      <div className="p-12 text-center text-[#8A8A90] bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl space-y-3">
        <p>No active dashboard selected.</p>
      </div>
    );
  }

  // Helper for responsive grid span classes based on widget size
  const getSizeClass = (size: BIWidget['size']) => {
    switch (size) {
      case 'small':
        return 'col-span-1 row-span-1';
      case 'medium':
        return 'col-span-1 md:col-span-2 row-span-2';
      case 'wide':
        return 'col-span-1 md:col-span-2 row-span-2';
      case 'tall':
        return 'col-span-1 md:col-span-2 row-span-3';
      case 'full':
        return 'col-span-1 md:col-span-4 row-span-4';
      default:
        return 'col-span-1 md:col-span-2 row-span-2';
    }
  };

  return (
    <div className="space-y-4">
      {/* Dashboard Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl font-mono text-xs text-[#FFFFFF]">
        <div>
          <h2 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-[#62DF7D]" />
            <span>{dashboard.title}</span>
          </h2>
          <p className="text-[11px] text-[#8A8A90]">{dashboard.description}</p>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#8A8A90]">
          <span>Created by: {dashboard.author.name}</span>
          <span>•</span>
          <span>{dashboard.widgets.length} Active Widgets</span>
        </div>
      </div>

      {/* Widgets Responsive Grid */}
      {dashboard.widgets.length === 0 ? (
        <div className="p-12 text-center bg-[#1B1B1E] border border-dashed border-[#2D2D31] rounded-2xl space-y-4 font-mono text-xs text-[#8A8A90]">
          <div className="w-12 h-12 rounded-2xl bg-[#62DF7D]/10 text-[#62DF7D] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#FFFFFF]">Your Dashboard is Empty</h3>
            <p className="max-w-md mx-auto text-[11px]">
              Add KPI Cards, SQL Query Charts, or AI Insights to start building your Business Intelligence board.
            </p>
          </div>
          <button
            onClick={() => setIsAddWidgetModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#62DF7D] text-[#131315] font-bold inline-flex items-center gap-2 cursor-pointer hover:bg-[#52ce6d] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Widget</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px]">
          {dashboard.widgets.map((widget) => (
            <div key={widget.id} className={`${getSizeClass(widget.size)} min-h-[160px]`}>
              <WidgetCard
                widget={widget}
                onEdit={() => setIsEditingWidgetModalOpen(true, widget)}
                onDuplicate={() => duplicateWidget(widget.id)}
                onDelete={() => deleteWidget(widget.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
