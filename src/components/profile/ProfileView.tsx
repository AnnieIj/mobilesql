import React from 'react';
import {
  Trophy,
  Flame,
  Award,
  BookOpen,
  Terminal,
  UserCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  Building2,
  Calendar,
  Share2,
} from 'lucide-react';
import { useAcademyStore } from '../../stores/useAcademyStore';
import { useChallengeStore } from '../../stores/useChallengeStore';
import { usePlaygroundStore } from '../../stores/usePlaygroundStore';
import { calculateLevel } from '../../gamification/xpEngine';
import { BADGE_DEFINITIONS } from '../../gamification/badgeEngine';

export const ProfileView: React.FC = () => {
  const { totalXp, streakDays, completedLessonIds, bookmarkedLessonIds } = useAcademyStore();
  const { solvedChallengeIds, totalPoints } = useChallengeStore();
  const { savedQueries } = usePlaygroundStore();

  const levelInfo = calculateLevel(totalXp + totalPoints);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-[#FFFFFF] select-none">
      {/* Profile Banner */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 relative overflow-hidden space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#62DF7D]/15 border-2 border-[#62DF7D] flex items-center justify-center text-[#62DF7D] text-2xl font-bold font-mono shadow-lg">
              SQ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#FFFFFF]">SQL Query Architect</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#62DF7D]/20 text-[#62DF7D] text-[10px] font-mono font-bold">
                  {levelInfo.title}
                </span>
              </div>
              <p className="text-xs text-[#8A8A90] font-mono mt-1">
                Member since August 2026 • Pro Database Division
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono text-[#FFFFFF] hover:border-[#62DF7D] transition-colors cursor-pointer flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#62DF7D]" /> Share Profile
            </button>
          </div>
        </div>

        {/* Level & XP Bar */}
        <div className="space-y-2 bg-[#131315] border border-[#2D2D31] p-4 rounded-xl font-mono text-xs">
          <div className="flex justify-between items-center text-[#8A8A90]">
            <span>Level {levelInfo.level}: {levelInfo.title}</span>
            <span className="text-[#62DF7D] font-bold">{levelInfo.currentXp} XP ({levelInfo.progressPercent}%)</span>
          </div>
          <div className="w-full bg-[#232326] h-2.5 rounded-full overflow-hidden border border-[#2D2D31]">
            <div
              className="bg-[#62DF7D] h-full transition-all duration-500 rounded-full"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-1">
          <span className="text-[#8A8A90] text-[10px] uppercase">Daily Streak</span>
          <div className="text-lg font-bold text-[#F59E0B] flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-[#F59E0B]" /> {streakDays} Days
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-1">
          <span className="text-[#8A8A90] text-[10px] uppercase">Lessons Finished</span>
          <div className="text-lg font-bold text-[#62DF7D] flex items-center gap-1.5">
            <BookOpen className="w-5 h-5 text-[#62DF7D]" /> {completedLessonIds.length} Modules
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-1">
          <span className="text-[#8A8A90] text-[10px] uppercase">Arena Solved</span>
          <div className="text-lg font-bold text-[#3B82F6] flex items-center gap-1.5">
            <Trophy className="w-5 h-5 text-[#3B82F6]" /> {solvedChallengeIds.length} Solved
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-1">
          <span className="text-[#8A8A90] text-[10px] uppercase">Saved Snippets</span>
          <div className="text-lg font-bold text-[#A855F7] flex items-center gap-1.5">
            <Terminal className="w-5 h-5 text-[#A855F7]" /> {savedQueries.length} Queries
          </div>
        </div>
      </div>

      {/* Unlocked Badges Section */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
          <Award className="w-4 h-4 text-[#62DF7D]" /> Earned Badges & Achievements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {BADGE_DEFINITIONS.map((badge: { id: string; title: string; description: string }) => {
            const isUnlocked = completedLessonIds.length > 0 || solvedChallengeIds.length > 0;
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  isUnlocked
                    ? 'bg-[#131315] border-[#62DF7D]/40 text-[#FFFFFF]'
                    : 'bg-[#131315]/50 border-[#2D2D31] text-[#8A8A90] opacity-60'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#232326] border border-[#2D2D31] flex items-center justify-center text-[#62DF7D] shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{badge.title}</p>
                  <p className="text-[10px] text-[#8A8A90] truncate">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
