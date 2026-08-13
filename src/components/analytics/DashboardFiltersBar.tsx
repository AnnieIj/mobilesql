import React from 'react';
import {
  Calendar,
  Search,
  Sliders,
  Clock,
  Palette,
  Plus,
  Share2,
  FileText,
  Tv,
} from 'lucide-react';
import { useAnalyticsStore } from '../../stores/useAnalyticsStore';
import { DashboardTheme } from '../../types/analytics';

export const DashboardFiltersBar: React.FC = () => {
  const {
    dashboards,
    activeDashboardId,
    setActiveDashboardId,
    updateGlobalFilters,
    setDashboardTheme,
    updateDashboard,
    setIsAddWidgetModalOpen,
    setIsShareModalOpen,
    setIsReportModalOpen,
    toggleExecutiveMode,
  } = useAnalyticsStore();

  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId);
  const filters = activeDashboard?.globalFilters;

  return (
    <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 space-y-4 shadow-xl font-mono text-xs text-[#FFFFFF]">
      {/* Top Selector & Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2D2D31]/80">
        {/* Dashboard Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={activeDashboardId}
            onChange={(e) => setActiveDashboardId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] font-bold cursor-pointer text-xs focus:outline-none focus:border-[#62DF7D]"
          >
            {dashboards.map((d) => (
              <option key={d.id} value={d.id}>
                📊 {d.title} ({d.widgets.length} Widgets)
              </option>
            ))}
          </select>

          {activeDashboard && (
            <span className="hidden md:inline-block px-2.5 py-1 rounded-full bg-[#62DF7D]/10 text-[#62DF7D] border border-[#62DF7D]/30 text-[10px] font-bold">
              Theme: {activeDashboard.theme.replace('_', ' ').toUpperCase()}
            </span>
          )}
        </div>

        {/* Global Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddWidgetModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#62DF7D] text-[#131315] font-bold flex items-center gap-1.5 hover:bg-[#52ce6d] transition-all cursor-pointer shadow-md text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Widget</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] text-[#FFFFFF] font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
          >
            <FileText className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] text-[#FFFFFF] font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Share</span>
          </button>

          <button
            onClick={() => toggleExecutiveMode(true)}
            className="px-3 py-2 rounded-xl bg-[#8B5CF6] text-[#FFFFFF] font-bold flex items-center gap-1.5 hover:bg-[#7c4dff] transition-all cursor-pointer shadow-md text-xs"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Executive Kiosk Mode</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {/* Date Filter */}
        <div className="space-y-1">
          <span className="text-[10px] text-[#8A8A90] uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#62DF7D]" /> Date Range
          </span>
          <select
            value={filters?.dateRange.preset || '30d'}
            onChange={(e) =>
              updateGlobalFilters({
                dateRange: { preset: e.target.value as 'today' | '7d' | '30d' | '90d' | 'ytd' },
              })
            }
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D] cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="ytd">Year to Date (YTD)</option>
          </select>
        </div>

        {/* Search Query Filter */}
        <div className="space-y-1">
          <span className="text-[10px] text-[#8A8A90] uppercase tracking-wider flex items-center gap-1">
            <Search className="w-3 h-3 text-[#3B82F6]" /> Search Query
          </span>
          <input
            type="text"
            placeholder="Filter records..."
            value={filters?.searchQuery || ''}
            onChange={(e) => updateGlobalFilters({ searchQuery: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D]"
          />
        </div>

        {/* Category Dropdown Filter */}
        <div className="space-y-1">
          <span className="text-[10px] text-[#8A8A90] uppercase tracking-wider flex items-center gap-1">
            <Sliders className="w-3 h-3 text-[#8B5CF6]" /> Category
          </span>
          <select
            value={filters?.category || 'All'}
            onChange={(e) => updateGlobalFilters({ category: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D] cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Enterprise">Enterprise Tier</option>
            <option value="Pro">Pro Subscription</option>
            <option value="Electronics">Electronics</option>
            <option value="Services">Professional Services</option>
          </select>
        </div>

        {/* Regional Hierarchy */}
        <div className="space-y-1">
          <span className="text-[10px] text-[#8A8A90] uppercase tracking-wider flex items-center gap-1">
            🌍 Region
          </span>
          <select
            value={filters?.hierarchy.region || 'Global'}
            onChange={(e) =>
              updateGlobalFilters({
                hierarchy: { ...filters?.hierarchy, region: e.target.value } as { region: string; country: string; store: string },
              })
            }
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D] cursor-pointer"
          >
            <option value="Global">Global All</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe Union</option>
            <option value="Asia Pacific">Asia Pacific</option>
          </select>
        </div>

        {/* Live Auto Refresh Clock */}
        <div className="space-y-1">
          <span className="text-[10px] text-[#8A8A90] uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#F59E0B]" /> Live Refresh
          </span>
          <select
            value={activeDashboard?.refreshInterval || 0}
            onChange={(e) =>
              activeDashboard && updateDashboard(activeDashboard.id, { refreshInterval: Number(e.target.value) })
            }
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D] cursor-pointer"
          >
            <option value={0}>Off (Manual)</option>
            <option value={5}>Every 5s</option>
            <option value={10}>Every 10s</option>
            <option value={30}>Every 30s</option>
            <option value={60}>Every 1 min</option>
          </select>
        </div>

        {/* Dashboard Theme Switcher */}
        <div className="space-y-1">
          <span className="text-[10px] text-[#8A8A90] uppercase tracking-wider flex items-center gap-1">
            <Palette className="w-3 h-3 text-[#EC4899]" /> Theme Style
          </span>
          <select
            value={activeDashboard?.theme || 'emerald_dark'}
            onChange={(e) => setDashboardTheme(e.target.value as DashboardTheme)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D] cursor-pointer"
          >
            <option value="emerald_dark">Emerald Dark</option>
            <option value="midnight_neon">Midnight Neon</option>
            <option value="slate_executive">Slate Executive</option>
            <option value="monokai_cyber">Monokai Cyber</option>
            <option value="solarized_amber">Solarized Amber</option>
          </select>
        </div>
      </div>
    </div>
  );
};
