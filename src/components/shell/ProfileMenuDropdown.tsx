import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { Avatar, ProgressBar } from '../ui';

export const ProfileMenuDropdown: React.FC = () => {
  const { isProfileMenuOpen, setProfileMenuOpen, setActiveTab, addToast } = useUIStore();

  if (!isProfileMenuOpen) return null;

  const handleAction = (tab: any, label: string) => {
    setActiveTab(tab);
    addToast({
      title: label,
      message: `Switched view to ${label}.`,
      type: 'info',
    });
    setProfileMenuOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="absolute right-3 top-full mt-2 w-72 bg-[#131315] border border-[#2D2D31] rounded-2xl shadow-2xl z-50 overflow-hidden font-sans select-none animate-in fade-in zoom-in-95 duration-150">
        {/* User Card Summary */}
        <div className="p-4 bg-[#1B1B1E] border-b border-[#2D2D31] space-y-3">
          <div className="flex items-center gap-3">
            <Avatar
              name="Alex Quan"
              avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              level={12}
              status="online"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-[#FFFFFF] truncate">Alex Quan</p>
                <ShieldCheck className="w-3.5 h-3.5 text-[#62DF7D] shrink-0" />
              </div>
              <p className="text-[11px] text-[#8A8A90] truncate">alex.quan@mobilesql.io</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#62DF7D]/20 text-[#62DF7D] rounded border border-[#62DF7D]/30">
                  LVL 12
                </span>
                <span className="text-[10px] text-[#C8C8CC] font-mono">SQL Engineer</span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-[#8A8A90]">
              <span>Level 12 Progress</span>
              <span className="text-[#62DF7D] font-bold">3,450 / 5,000 XP</span>
            </div>
            <ProgressBar value={69} height="sm" color="emerald" />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#2D2D31]/60">
            <div className="flex items-center gap-1.5 text-[11px] text-[#C8C8CC]">
              <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>14 Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#C8C8CC]">
              <Zap className="w-3.5 h-3.5 text-[#62DF7D]" />
              <span>98.4% Accuracy</span>
            </div>
          </div>
        </div>

        {/* Menu Actions */}
        <div className="p-1.5 space-y-0.5">
          <button
            onClick={() => handleAction('profile', 'View Profile')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#C8C8CC] hover:text-[#FFFFFF] hover:bg-[#1B1B1E] transition-colors text-left"
          >
            <User className="w-4 h-4 text-[#62DF7D]" />
            <span>View Profile</span>
          </button>

          <button
            onClick={() => handleAction('analytics', 'Statistics')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#C8C8CC] hover:text-[#FFFFFF] hover:bg-[#1B1B1E] transition-colors text-left"
          >
            <BarChart2 className="w-4 h-4 text-[#3B82F6]" />
            <span>Statistics</span>
          </button>

          <button
            onClick={() => handleAction('achievements', 'Achievements')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#C8C8CC] hover:text-[#FFFFFF] hover:bg-[#1B1B1E] transition-colors text-left"
          >
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            <span>Achievements</span>
          </button>

          <button
            onClick={() => handleAction('certificates', 'Certificates')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#C8C8CC] hover:text-[#FFFFFF] hover:bg-[#1B1B1E] transition-colors text-left"
          >
            <Award className="w-4 h-4 text-[#22C55E]" />
            <span>Certificates</span>
          </button>

          <button
            onClick={() => handleAction('portfolio', 'Portfolio')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#C8C8CC] hover:text-[#FFFFFF] hover:bg-[#1B1B1E] transition-colors text-left"
          >
            <FolderGit2 className="w-4 h-4 text-[#3B82F6]" />
            <span>Portfolio</span>
          </button>

          <div className="my-1 border-t border-[#2D2D31]/60" />

          <button
            onClick={() => handleAction('settings', 'Settings')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#C8C8CC] hover:text-[#FFFFFF] hover:bg-[#1B1B1E] transition-colors text-left"
          >
            <Settings className="w-4 h-4 text-[#8A8A90]" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              addToast({ title: 'Logged Out', message: 'You have been logged out safely.', type: 'info' });
              setProfileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-[#EF4444]" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </AnimatePresence>
  );
};
