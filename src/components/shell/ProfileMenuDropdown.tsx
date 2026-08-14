import React from 'react';
import { AnimatePresence } from 'motion/react';
import {
  User,
  BarChart2,
  Trophy,
  Award,
  FolderGit2,
  Settings,
  LogOut,
  Flame,
  Zap,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { Avatar, ProgressBar } from '../ui';

export const ProfileMenuDropdown: React.FC = () => {
  const { isProfileMenuOpen, setProfileMenuOpen, setActiveTab, addToast } = useUIStore();
  const { user, isDemoMode, logout } = useAuthStore();

  if (!isProfileMenuOpen) return null;

  const handleAction = (tab: any, label: string) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/${tab}`);
    addToast({
      title: label,
      message: `Switched view to ${label}.`,
      type: 'info',
    });
    setProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
  };

  const displayName = user?.name || 'MobileSQL Engineer';
  const displayEmail = user?.email || 'engineer@mobilesql.io';
  const displayLevel = user?.level || 1;
  const displayXp = user?.xp || 100;
  const displayNextXp = user?.nextLevelXp || 1500;
  const xpPercentage = Math.min(100, Math.round((displayXp / displayNextXp) * 100));

  return (
    <AnimatePresence>
      <div className="absolute right-3 top-full mt-2 w-72 bg-[#131315] border border-[#2D2D31] rounded-2xl shadow-2xl z-50 overflow-hidden font-sans select-none animate-in fade-in zoom-in-95 duration-150">
        {/* User Card Summary */}
        <div className="p-4 bg-[#1B1B1E] border-b border-[#2D2D31] space-y-3">
          <div className="flex items-center gap-3">
            <Avatar
              name={displayName}
              avatarUrl={user?.avatarUrl}
              level={displayLevel}
              status="online"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-[#FFFFFF] truncate">{displayName}</p>
                <ShieldCheck className="w-3.5 h-3.5 text-[#62DF7D] shrink-0" />
              </div>
              <p className="text-[11px] text-[#8A8A90] truncate">{displayEmail}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#62DF7D]/20 text-[#62DF7D] rounded border border-[#62DF7D]/30">
                  LVL {displayLevel}
                </span>
                <span className="text-[10px] text-[#C8C8CC] font-mono truncate">
                  {user?.title || 'SQL Practitioner'}
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-[#8A8A90]">
              <span>Level {displayLevel} Progress</span>
              <span className="text-[#62DF7D] font-bold">
                {displayXp.toLocaleString()} / {displayNextXp.toLocaleString()} XP
              </span>
            </div>
            <ProgressBar value={xpPercentage} height="sm" color="emerald" />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#2D2D31]/60">
            <div className="flex items-center gap-1.5 text-[11px] text-[#C8C8CC]">
              <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{user?.streakDays || 1} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#C8C8CC]">
              <Zap className="w-3.5 h-3.5 text-[#62DF7D]" />
              <span>{user?.accuracyPercentage || 99.2}% Accuracy</span>
            </div>
          </div>

          {isDemoMode && (
            <div className="px-2 py-1 bg-[#A855F7]/15 border border-[#A855F7]/30 rounded-lg text-[10px] font-mono text-[#A855F7] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Demo Persona Active</span>
            </div>
          )}
        </div>

        {/* Menu Actions */}
        <div className="p-1.5 space-y-0.5">
          <button
            onClick={() => handleAction('profile', 'View Profile')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#C8C8CC] hover:text-[#FFFFFF] hover:bg-[#1B1B1E] transition-colors text-left cursor-pointer"
          >
            <User className="w-4 h-4 text-[#62DF7D]" />
            <span>View Profile</span>
          </button>

          <button
            onClick={() => handleAction('analytics', 'Statistics')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#C8C8CC] hover:text-[#FFFFFF] hover:bg-[#1B1B1E] transition-colors text-left cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-[#3B82F6]" />
            <span>Statistics</span>
          </button>

          <button
            onClick={() => handleAction('achievements', 'Achievements')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#C8C8CC] hover:text-[#FFFFFF] hover:bg-[#1B1B1E] transition-colors text-left cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            <span>Achievements</span>
          </button>

          <button
            onClick={() => handleAction('certificates', 'Certificates')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#C8C8CC] hover:text-[#FFFFFF] hover:bg-[#1B1B1E] transition-colors text-left cursor-pointer"
          >
            <Award className="w-4 h-4 text-[#22C55E]" />
            <span>Certificates</span>
          </button>

          <button
            onClick={() => handleAction('portfolio', 'Portfolio')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#C8C8CC] hover:text-[#FFFFFF] hover:bg-[#1B1B1E] transition-colors text-left cursor-pointer"
          >
            <FolderGit2 className="w-4 h-4 text-[#3B82F6]" />
            <span>Portfolio</span>
          </button>

          <div className="my-1 border-t border-[#2D2D31]/60" />

          <button
            onClick={() => handleAction('settings', 'Settings')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#C8C8CC] hover:text-[#FFFFFF] hover:bg-[#1B1B1E] transition-colors text-left cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#8A8A90]" />
            <span>Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#EF4444]" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </AnimatePresence>
  );
};
