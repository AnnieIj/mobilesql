import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Tv,
  Clock,
  LayoutGrid,
  RefreshCw,
} from 'lucide-react';
import { useAnalyticsStore } from '../../stores/useAnalyticsStore';
import { WidgetCard } from './WidgetCard';

export const ExecutiveModeOverlay: React.FC = () => {
  const {
    dashboards,
    activeDashboardId,
    executiveModeOpen,
    executiveSlideIndex,
    toggleExecutiveMode,
    setExecutiveSlideIndex,
  } = useAnalyticsStore();

  const [isPlaying, setIsPlaying] = useState(true);
  const [countdown, setCountdown] = useState(10);

  const dashboard = dashboards.find((d) => d.id === activeDashboardId);

  useEffect(() => {
    if (!executiveModeOpen || !isPlaying || !dashboard || dashboard.widgets.length === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Advance slide
          setExecutiveSlideIndex((executiveSlideIndex + 1) % dashboard.widgets.length);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [executiveModeOpen, isPlaying, executiveSlideIndex, dashboard, setExecutiveSlideIndex]);

  if (!executiveModeOpen || !dashboard) return null;

  const currentWidget = dashboard.widgets[executiveSlideIndex] || dashboard.widgets[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0C] text-[#FFFFFF] font-mono flex flex-col justify-between p-6 select-none overflow-hidden animate-fadeIn">
      {/* Top Presentation Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2D2D31]/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#FFFFFF]">{dashboard.title}</h1>
            <p className="text-xs text-[#8A8A90]">Executive Kiosk Presentation Mode • MobileSQL BI</p>
          </div>
        </div>

        {/* Slideshow Control Tools */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs">
            <Clock className="w-4 h-4 text-[#62DF7D]" />
            <span>Auto-Rotate: {countdown}s</span>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] text-[#FFFFFF] cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-[#F59E0B]" /> : <Play className="w-4 h-4 text-[#62DF7D]" />}
          </button>

          <button
            onClick={() => toggleExecutiveMode(false)}
            className="p-2.5 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444] hover:bg-[#EF4444]/30 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Focus Visualizer Slide */}
      <div className="flex-1 my-6 flex items-center justify-center relative">
        {currentWidget ? (
          <div className="w-full max-w-5xl h-[520px]">
            <WidgetCard
              widget={currentWidget}
              onEdit={() => {}}
              onDuplicate={() => {}}
              onDelete={() => {}}
            />
          </div>
        ) : (
          <div className="text-center text-[#8A8A90] space-y-2">
            <LayoutGrid className="w-12 h-12 mx-auto" />
            <p>No widgets to display in kiosk mode.</p>
          </div>
        )}
      </div>

      {/* Bottom Kiosk Slides Navigation Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-[#2D2D31]/80">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const prev = (executiveSlideIndex - 1 + dashboard.widgets.length) % dashboard.widgets.length;
              setExecutiveSlideIndex(prev);
              setCountdown(10);
            }}
            className="p-2 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-[#8A8A90]">
            Widget {executiveSlideIndex + 1} of {dashboard.widgets.length}
          </span>
          <button
            onClick={() => {
              const next = (executiveSlideIndex + 1) % dashboard.widgets.length;
              setExecutiveSlideIndex(next);
              setCountdown(10);
            }}
            className="p-2 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail Selector Dots */}
        <div className="flex items-center gap-2">
          {dashboard.widgets.map((w, idx) => (
            <button
              key={w.id}
              onClick={() => {
                setExecutiveSlideIndex(idx);
                setCountdown(10);
              }}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === executiveSlideIndex ? 'w-8 bg-[#62DF7D]' : 'w-2.5 bg-[#2D2D31] hover:bg-[#8A8A90]'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#62DF7D]">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Live Data Stream Connected</span>
        </div>
      </div>
    </div>
  );
};
