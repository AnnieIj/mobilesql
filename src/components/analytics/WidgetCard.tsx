import React, { useState } from 'react';
import {
  MoreVertical,
  Copy,
  Edit2,
  Trash2,
  Maximize2,
  Database,
  Sparkles,
  FileSpreadsheet,
  X,
  Filter,
} from 'lucide-react';
import { BIWidget } from '../../types/analytics';
import { KpiCardWidget } from './KpiCardWidget';
import { ChartRenderer } from './ChartRenderer';

interface WidgetCardProps {
  widget: BIWidget;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onResize?: (size: BIWidget['size']) => void;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  widget,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [drillDownData, setDrillDownData] = useState<Record<string, unknown> | null>(null);

  const getSourceBadge = () => {
    switch (widget.dataSourceType) {
      case 'sql_playground':
        return { label: 'SQL Query', icon: Database, color: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/30' };
      case 'ai_generated':
        return { label: 'AI Dataset', icon: Sparkles, color: 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/30' };
      default:
        return { label: 'CSV / Data', icon: FileSpreadsheet, color: 'text-[#62DF7D] bg-[#62DF7D]/10 border-[#62DF7D]/30' };
    }
  };

  const badge = getSourceBadge();
  const SourceIcon = badge.icon;

  return (
    <div className="h-full flex flex-col bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 shadow-xl hover:border-[#62DF7D]/50 transition-all relative group">
      {/* Widget Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2D2D31]/60 mb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-xs text-[#FFFFFF] truncate font-sans">{widget.title}</span>
          <span
            className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-mono shrink-0 ${badge.color}`}
          >
            <SourceIcon className="w-3 h-3" />
            <span>{badge.label}</span>
          </span>
        </div>

        {/* Header Action Tools */}
        <div className="flex items-center gap-1 relative shrink-0">
          <button
            onClick={() => setDrillDownData({ widgetTitle: widget.title, type: widget.type, source: widget.dataSourceType })}
            title="Drill-down view"
            className="p-1 text-[#8A8A90] hover:text-[#FFFFFF] hover:bg-[#2D2D31] rounded-lg transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-[#8A8A90] hover:text-[#FFFFFF] hover:bg-[#2D2D31] rounded-lg transition-all cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Context Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-7 z-30 w-44 bg-[#131315] border border-[#2D2D31] rounded-xl shadow-2xl p-1.5 space-y-1 font-mono text-xs">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit();
                }}
                className="w-full px-2.5 py-1.5 rounded-lg text-left text-[#FFFFFF] hover:bg-[#2D2D31] flex items-center gap-2 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Edit Widget</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDuplicate();
                }}
                className="w-full px-2.5 py-1.5 rounded-lg text-left text-[#FFFFFF] hover:bg-[#2D2D31] flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#62DF7D]" />
                <span>Duplicate</span>
              </button>
              <div className="border-t border-[#2D2D31] my-1" />
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete();
                }}
                className="w-full px-2.5 py-1.5 rounded-lg text-left text-[#EF4444] hover:bg-[#EF4444]/10 flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Widget Body Content */}
      <div className="flex-1 min-h-[160px] relative">
        {widget.type === 'kpi' && widget.kpiConfig ? (
          <KpiCardWidget
            config={widget.kpiConfig}
            onDrillDown={() =>
              setDrillDownData({
                metric: widget.kpiConfig?.label,
                value: widget.kpiConfig?.value,
                unit: widget.kpiConfig?.unit,
                trend: widget.kpiConfig?.changePercent,
              })
            }
          />
        ) : widget.chartConfig ? (
          <ChartRenderer
            config={widget.chartConfig}
            onDrillDown={(dataPoint) => setDrillDownData(dataPoint)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-[#8A8A90] font-mono">
            Custom SQL Data Table
          </div>
        )}
      </div>

      {/* Interactive Drill-down Modal View */}
      {drillDownData && (
        <div className="fixed inset-0 z-50 bg-[#131315]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D2D31]">
              <div className="flex items-center gap-2 text-[#62DF7D] font-bold text-sm">
                <Filter className="w-4 h-4" />
                <span>Drill-Through Detail View</span>
              </div>
              <button
                onClick={() => setDrillDownData(null)}
                className="p-1 text-[#8A8A90] hover:text-[#FFFFFF] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
              <span className="text-[10px] text-[#8A8A90] uppercase tracking-wider">Inspected Data Segment</span>
              <pre className="text-xs text-[#62DF7D] overflow-x-auto whitespace-pre-wrap font-mono">
                {JSON.stringify(drillDownData, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#8A8A90]">Connected SQL Source: {widget.dataSourceType}</span>
              <button
                onClick={() => setDrillDownData(null)}
                className="px-4 py-2 rounded-xl bg-[#62DF7D] text-[#131315] font-bold cursor-pointer hover:bg-[#52ce6d]"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
