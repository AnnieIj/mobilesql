import React, { useMemo } from 'react';
import {
  Sparkles,
  Flame,
  Terminal,
  BookOpen,
  Bot,
  Zap,
  TrendingUp,
  Quote,
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/Feedback';
import { HERO_MOTIVATION_QUOTES } from '../../data/dashboardData';

export const HeroWelcomeSection: React.FC = () => {
  const { setActiveTab, setCopilotOpen, addToast } = useUIStore();
  const { user } = useAuthStore();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const randomQuote = useMemo(() => {
    const idx = Math.floor(Math.random() * HERO_MOTIVATION_QUOTES.length);
    return HERO_MOTIVATION_QUOTES[idx];
  }, []);

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1B1B1E] via-[#131315] to-[#0D0D0F] border border-[#2D2D31] shadow-2xl overflow-hidden font-sans space-y-6">
      {/* Background Matrix Emerald Ambient Glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#62DF7D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Greeting Bar */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="emerald" icon={<Sparkles className="w-3.5 h-3.5 text-[#62DF7D]" />}>
              {greeting}, {user?.name || 'Engineer'}
            </Badge>
            <span className="text-xs font-mono text-[#8A8A90]">SQL Engineer • LVL {user?.level || 1}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#FFFFFF]">
            Ready to optimize your next production database query?
          </h1>

          {/* Motivation Quote */}
          <div className="flex items-start gap-2 pt-1 text-xs text-[#C8C8CC] italic leading-relaxed bg-[#1B1B1E]/60 p-3 rounded-xl border border-[#2D2D31]/80">
            <Quote className="w-4 h-4 text-[#62DF7D] shrink-0 mt-0.5" />
            <span>&quot;{randomQuote}&quot;</span>
          </div>
        </div>

        {/* Gamification Stats Card */}
        <div className="p-4 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-3 min-w-[280px] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#F59E0B]">
              <Flame className="w-4 h-4 fill-current animate-pulse" />
              <span className="font-bold">{user?.streakDays || 1} Day Streak</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs text-[#62DF7D]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Top 5% Learner</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-[#8A8A90]">
              <span>Level {user?.level || 1} Progression</span>
              <span className="text-[#62DF7D] font-bold">
                {(user?.xp || 0).toLocaleString()} / {(user?.nextLevelXp || 1000).toLocaleString()} XP
              </span>
            </div>
            <ProgressBar
              value={Math.min(100, Math.round(((user?.xp || 0) / (user?.nextLevelXp || 1000)) * 100))}
              height="md"
              color="emerald"
              showValue={false}
            />
          </div>

          <p className="text-[10px] text-[#8A8A90] font-mono text-right">
            +{Math.max(0, (user?.nextLevelXp || 1000) - (user?.xp || 0)).toLocaleString()} XP needed for Level {(user?.level || 1) + 1}
          </p>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="relative z-10 flex flex-wrap items-center gap-3 pt-2 border-t border-[#2D2D31]/80">
        <Button
          variant="glow"
          leftIcon={<BookOpen className="w-4 h-4 text-[#131315]" />}
          onClick={() => {
            setActiveTab('academy');
            addToast({ title: 'Academy', message: 'Continuing PostgreSQL Mastery module.', type: 'info' });
          }}
        >
          Continue Learning
        </Button>

        <Button
          variant="secondary"
          leftIcon={<Terminal className="w-4 h-4 text-[#62DF7D]" />}
          onClick={() => {
            setActiveTab('playground');
            addToast({ title: 'SQL Playground', message: 'In-memory WASM SQLite workbench loaded.', type: 'info' });
          }}
        >
          Open Playground
        </Button>

        <Button
          variant="outline"
          leftIcon={<Bot className="w-4 h-4 text-[#3B82F6]" />}
          onClick={() => setCopilotOpen(true)}
        >
          Ask AI Mentor
        </Button>
      </div>
    </div>
  );
};
