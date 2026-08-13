import React, { useState } from 'react';
import {
  ShieldCheck,
  Sliders,
  Cloud,
  Download,
  Bell,
  User,
  Settings,
  Shield,
  KeyRound,
  LogOut,
  Sparkles,
  Database,
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { SecurityCenter } from '../account/SecurityCenter';
import { UserPreferencesTab } from '../account/UserPreferencesTab';
import { CloudSyncTab } from '../account/CloudSyncTab';
import { AccountExportPrivacyTab } from '../account/AccountExportPrivacyTab';
import { NotificationCenterTab } from '../account/NotificationCenterTab';

type SettingsTab = 'security' | 'preferences' | 'sync' | 'export' | 'notifications';

export const SettingsView: React.FC = () => {
  const { setAuthModalOpen } = useUIStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('security');

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-[#FFFFFF] select-none">
      {/* Enterprise Account Header */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#62DF7D] shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#62DF7D] rounded-full border-2 border-[#131315] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#FFFFFF]">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#62DF7D]/20 text-[#62DF7D] border border-[#62DF7D]/40 font-mono text-[10px] font-bold">
                Level {user.level} {user.division}
              </span>
            </div>
            <p className="text-xs text-[#8A8A90] font-mono">{user.email} • {user.title}</p>
          </div>
        </div>

        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-mono text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
        >
          <User className="w-4 h-4" /> Account Switch / Auth SSO
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 font-mono text-xs border-b border-[#2D2D31] no-scrollbar">
        {[
          { id: 'security', label: 'Account Security', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'preferences', label: 'User Preferences', icon: <Sliders className="w-4 h-4" /> },
          { id: 'sync', label: 'Cloud Synchronization', icon: <Cloud className="w-4 h-4" /> },
          { id: 'export', label: 'Data Export & Privacy', icon: <Download className="w-4 h-4" /> },
          { id: 'notifications', label: 'Notification Center', icon: <Bell className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#62DF7D] text-[#131315] shadow-lg'
                : 'bg-[#1B1B1E] border border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF] hover:border-[#62DF7D]/40'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">
        {activeTab === 'security' && <SecurityCenter />}
        {activeTab === 'preferences' && <UserPreferencesTab />}
        {activeTab === 'sync' && <CloudSyncTab />}
        {activeTab === 'export' && <AccountExportPrivacyTab />}
        {activeTab === 'notifications' && <NotificationCenterTab />}
      </div>
    </main>
  );
};
