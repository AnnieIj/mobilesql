import React from 'react';
import {
  Flame,
  Zap,
  Award,
  Keyboard,
  Sparkles,
  Play,
  HelpCircle,
  Coins,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { usePlaygroundStore } from '../../stores/usePlaygroundStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/Feedback';

interface HeaderStatsProps {
  onOpenShortcuts: () => void;
  onOpenTemplates: () => void;
}

export const PlaygroundHeaderStats: React.FC<HeaderStatsProps> = ({
  onOpenShortcuts,
  onOpenTemplates,
}) => {
  const { user } = useAuthStore();
  const { isExerciseActive, stopExercise } = usePlaygroundStore();

  return (
    <div className="bg-[#1B1B1E] border-b border-[#2D2D31] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
      {/* Left: User Level & XP Meter */}
      <div className="flex items-center gap-3">
        <Badge variant="emerald" icon={<Sparkles className="w-3.5 h-3.5 text-[#62DF7D]" />}>
          LVL {user?.level || 1} Architect
        </Badge>

        <div className="hidden sm:flex items-center gap-2 min-w-[160px]">
          <div className="w-full space-y-0.5">
            <div className="flex justify-between text-[10px] font-mono text-[#8A8A90]">
              <span>XP Progress</span>
              <span className="text-[#62DF7D] font-bold">{(user?.xp || 100).toLocaleString()} / {(user?.nextLevelXp || 1500).toLocaleString()}</span>
            </div>
            <ProgressBar value={Math.min(100, Math.round(((user?.xp || 100) / (user?.nextLevelXp || 1500)) * 100))} height="sm" color="emerald" showValue={false} />
          </div>
        </div>

        {/* Streak & Accuracy Badges */}
        <div className="flex items-center gap-2 font-mono">
          <span className="flex items-center gap-1 text-[#F59E0B] font-bold bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/30">
            <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
            {user?.streakDays || 1}d Streak
          </span>

          <span className="hidden md:flex items-center gap-1 text-[#62DF7D] font-bold bg-[#62DF7D]/10 px-2 py-0.5 rounded border border-[#62DF7D]/30">
            <Zap className="w-3.5 h-3.5" />
            98.4% Acc.
          </span>

          <span className="hidden lg:flex items-center gap-1 text-[#3B82F6] font-bold bg-[#3B82F6]/10 px-2 py-0.5 rounded border border-[#3B82F6]/30">
            <Coins className="w-3.5 h-3.5" />
            1,250 Coins
          </span>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2">
        {isExerciseActive && (
          <Button
            size="sm"
            variant="danger"
            onClick={stopExercise}
            className="text-[11px] font-mono"
          >
            Exit Exercise Mode
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#62DF7D]" />}
          onClick={onOpenTemplates}
          className="text-xs"
        >
          SQL Starter Templates
        </Button>

        <Button
          size="sm"
          variant="ghost"
          leftIcon={<Keyboard className="w-3.5 h-3.5 text-[#8A8A90]" />}
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (Ctrl+/)"
          className="text-xs font-mono"
        >
          <span className="hidden sm:inline">Shortcuts</span>
        </Button>
      </div>
    </div>
  );
};
