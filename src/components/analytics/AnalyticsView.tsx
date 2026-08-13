import React from 'react';
import {
  LayoutDashboard,
  Activity,
  BarChart2,
  Sparkles,
  FileText,
  Globe,
  Terminal,
} from 'lucide-react';
import { useAnalyticsStore, AnalyticsSubTab } from '../../stores/useAnalyticsStore';
import { DashboardFiltersBar } from './DashboardFiltersBar';
import { DashboardGrid } from './DashboardGrid';
import { KpiShowcaseTab } from './KpiShowcaseTab';
import { ChartsShowcaseTab } from './ChartsShowcaseTab';
import { AiInsightsPanel } from './AiInsightsPanel';
import { ReportBuilderView } from './ReportBuilderView';
import { BiMarketplaceTab } from './BiMarketplaceTab';
import { SqlPerformanceTab } from './SqlPerformanceTab';
import { AddEditWidgetModal } from './AddEditWidgetModal';
import { ExecutiveModeOverlay } from './ExecutiveModeOverlay';
import { DashboardShareModal } from './DashboardShareModal';

export const AnalyticsView: React.FC = () => {
  const { activeSubTab, setActiveSubTab } = useAnalyticsStore();

  const NAV_TABS: Array<{ id: AnalyticsSubTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'builder', label: 'BI Dashboard Builder', icon: LayoutDashboard },
    { id: 'kpis', label: 'KPI Cards (9)', icon: Activity },
    { id: 'charts', label: '15 Charts Library', icon: BarChart2 },
    { id: 'ai-insights', label: 'AI Anomaly Insights', icon: Sparkles },
    { id: 'reports', label: 'Report Builder', icon: FileText },
    { id: 'marketplace', label: 'Marketplace', icon: Globe },
    { id: 'sql-profiler', label: 'SQL Profiler', icon: Terminal },
  ];

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF] relative pb-16">
      {/* Sub-Tab Navigation Header Bar */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-xl font-mono text-xs">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap text-[11px] ${
                isActive
                  ? 'bg-[#62DF7D] text-[#131315] shadow-lg'
                  : 'text-[#8A8A90] hover:text-[#FFFFFF] hover:bg-[#131315]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Active Sub-Tab View Content */}
      {activeSubTab === 'builder' && (
        <div className="space-y-6">
          <DashboardFiltersBar />
          <DashboardGrid />
        </div>
      )}

      {activeSubTab === 'kpis' && <KpiShowcaseTab />}
      {activeSubTab === 'charts' && <ChartsShowcaseTab />}
      {activeSubTab === 'ai-insights' && <AiInsightsPanel />}
      {activeSubTab === 'reports' && <ReportBuilderView />}
      {activeSubTab === 'marketplace' && <BiMarketplaceTab />}
      {activeSubTab === 'sql-profiler' && <SqlPerformanceTab />}

      {/* Global Modals & Overlay Mode */}
      <AddEditWidgetModal />
      <ExecutiveModeOverlay />
      <DashboardShareModal />
    </div>
  );
};
