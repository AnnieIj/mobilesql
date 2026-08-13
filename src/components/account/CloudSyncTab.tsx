import React from 'react';
import {
  Cloud,
  CloudOff,
  RefreshCw,
  CheckCircle2,
  Database,
  GraduationCap,
  Award,
  BookOpen,
  Terminal,
  MessageSquare,
  FileText,
  Bookmark,
  Briefcase,
  Zap,
  Sliders,
} from 'lucide-react';
import { useAccountStore } from '../../stores/useAccountStore';
import { useUIStore } from '../../stores/useUIStore';

export const CloudSyncTab: React.FC = () => {
  const { addToast } = useUIStore();
  const { sync, updateSync, triggerCloudSync } = useAccountStore();

  const handleManualSync = () => {
    triggerCloudSync();
    addToast({ title: 'Cloud Sync Initiated', message: 'Synchronizing all 14 asset stores with cloud database...', type: 'info' });
  };

  const ASSETS_TO_SYNC = [
    { name: 'SQL Playground Queries', count: '18 saved queries', icon: <Terminal className="w-4 h-4 text-[#62DF7D]" /> },
    { name: 'Academy Progress', count: '12 completed topics', icon: <GraduationCap className="w-4 h-4 text-[#3B82F6]" /> },
    { name: 'XP & Daily Streak', count: '4,250 XP • 14 Days', icon: <Zap className="w-4 h-4 text-[#F59E0B]" /> },
    { name: 'SQL Certificates', count: '1 Verified Badge', icon: <Award className="w-4 h-4 text-[#A855F7]" /> },
    { name: 'Portfolio Projects', count: '3 Published Workspaces', icon: <Briefcase className="w-4 h-4 text-[#62DF7D]" /> },
    { name: 'AI Conversations', count: '24 Thread Logs', icon: <MessageSquare className="w-4 h-4 text-[#3B82F6]" /> },
    { name: 'Notes & Documentation', count: '8 Markdown Pages', icon: <FileText className="w-4 h-4 text-[#F59E0B]" /> },
    { name: 'Challenge History', count: '45 Solved Puzzles', icon: <CheckCircle2 className="w-4 h-4 text-[#62DF7D]" /> },
    { name: 'Interview History & Resume', count: 'Mock Score: 94/100', icon: <BookOpen className="w-4 h-4 text-[#A855F7]" /> },
    { name: 'Bookmarks & Settings', count: 'Fully Configured', icon: <Bookmark className="w-4 h-4 text-[#3B82F6]" /> },
  ];

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF]">
      {/* Cloud Status Banner */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-1 ${
              sync.status === 'syncing'
                ? 'bg-[#3B82F6]/15 border-[#3B82F6]/40 text-[#3B82F6] animate-pulse'
                : sync.status === 'offline'
                ? 'bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]'
                : 'bg-[#62DF7D]/15 border-[#62DF7D]/40 text-[#62DF7D]'
            }`}
          >
            {sync.status === 'offline' ? <CloudOff className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#FFFFFF]">Enterprise Cloud Synchronization</h3>
              <span
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                  sync.status === 'syncing'
                    ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40'
                    : sync.status === 'offline'
                    ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                    : 'bg-[#62DF7D]/20 text-[#62DF7D] border border-[#62DF7D]/40'
                }`}
              >
                {sync.status === 'syncing' ? 'SYNCING...' : sync.status === 'offline' ? 'OFFLINE WASM' : 'IN SYNC'}
              </span>
            </div>
            <p className="text-xs text-[#8A8A90] font-mono mt-1">
              Last full asset sync completed at <span className="text-[#62DF7D] font-bold">{sync.lastSyncedAt}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleManualSync}
          disabled={sync.status === 'syncing'}
          className="px-4 py-2.5 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-mono text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${sync.status === 'syncing' ? 'animate-spin' : ''}`} />
          {sync.status === 'syncing' ? 'Syncing Cloud Storage...' : 'Sync All Assets Now'}
        </button>
      </div>

      {/* Sync Strategy Settings */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <Sliders className="w-4 h-4 text-[#3B82F6]" /> Real-Time Sync Strategy & Conflict Resolution
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <label className="p-3.5 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-center justify-between cursor-pointer hover:border-[#3B82F6]">
            <div>
              <p className="font-bold text-[#FFFFFF]">Background Sync</p>
              <p className="text-[10px] text-[#8A8A90]">Auto-persist changes periodically</p>
            </div>
            <input
              type="checkbox"
              checked={sync.autoSync}
              onChange={(e) => updateSync({ autoSync: e.target.checked })}
              className="w-4 h-4 accent-[#3B82F6]"
            />
          </label>

          <label className="p-3.5 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-center justify-between cursor-pointer hover:border-[#3B82F6]">
            <div>
              <p className="font-bold text-[#FFFFFF]">Optimistic UI Updates</p>
              <p className="text-[10px] text-[#8A8A90]">Render changes prior to network ACK</p>
            </div>
            <input
              type="checkbox"
              checked={sync.optimisticUpdates}
              onChange={(e) => updateSync({ optimisticUpdates: e.target.checked })}
              className="w-4 h-4 accent-[#3B82F6]"
            />
          </label>

          <div className="p-3.5 rounded-xl bg-[#131315] border border-[#2D2D31]">
            <label className="font-bold text-[#FFFFFF] block mb-1">Conflict Resolution:</label>
            <select
              value={sync.conflictResolution}
              onChange={(e) => updateSync({ conflictResolution: e.target.value as any })}
              className="w-full bg-[#1B1B1E] border border-[#2D2D31] rounded-lg p-1.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="server-wins">Server State Overwrites (Recommended)</option>
              <option value="client-wins">Local Browser Overwrites</option>
              <option value="merge">Smart Timestamp 3-Way Merge</option>
            </select>
          </div>
        </div>
      </div>

      {/* Synchronized User Assets Inventory Grid */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <Database className="w-4 h-4 text-[#62DF7D]" /> Synchronized Asset Inventory (14 Modules)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {ASSETS_TO_SYNC.map((asset, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-center justify-between hover:border-[#62DF7D]/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1B1B1E] border border-[#2D2D31] flex items-center justify-center shrink-0">
                  {asset.icon}
                </div>
                <div>
                  <p className="font-bold text-[#FFFFFF] text-[11px]">{asset.name}</p>
                  <p className="text-[10px] text-[#8A8A90]">{asset.count}</p>
                </div>
              </div>

              <CheckCircle2 className="w-4 h-4 text-[#62DF7D] shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
