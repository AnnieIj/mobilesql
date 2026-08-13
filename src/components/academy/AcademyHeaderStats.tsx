import React from 'react';
import { Flame, Zap, Award, Search, Sparkles, BookMarked } from 'lucide-react';
import { useAcademyStore } from '../../stores/useAcademyStore';

export const AcademyHeaderStats: React.FC = () => {
  const { totalXp, streakDays, searchQuery, setSearchQuery, bookmarkedLessonIds } =
    useAcademyStore();

  const currentLevel = Math.floor(totalXp / 250) + 1;
  const xpIntoLevel = totalXp % 250;
  const levelProgressPercent = Math.round((xpIntoLevel / 250) * 100);

  return (
    <div className="bg-[#1B1B1E] border-b border-[#2D2D31] p-4 font-sans select-none space-y-3">
      {/* Top Banner Stats Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Title & Level Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#62DF7D]/15 border border-[#62DF7D]/40 flex items-center justify-center text-[#62DF7D] font-mono font-bold text-base shadow-md">
            L{currentLevel}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#FFFFFF]">SQL Academy</h1>
              <span className="px-2 py-0.5 rounded bg-[#62DF7D]/15 text-[#62DF7D] font-mono text-[10px] font-bold">
                Duolingo-Grade Engine
              </span>
            </div>
            <p className="text-xs text-[#8A8A90]">
              Level {currentLevel} • {xpIntoLevel}/250 XP to Next Level
            </p>
          </div>
        </div>

        {/* Level Progress Bar & Gamification Badges */}
        <div className="flex items-center gap-4">
          {/* Level Progress Bar */}
          <div className="hidden lg:flex flex-col space-y-1 w-44">
            <div className="flex justify-between text-[10px] font-mono text-[#8A8A90]">
              <span>Level Progress</span>
              <span>{levelProgressPercent}%</span>
            </div>
            <div className="w-full bg-[#131315] rounded-full h-2 overflow-hidden border border-[#2D2D31]">
              <div
                className="bg-[#62DF7D] h-full transition-all duration-300 rounded-full"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono text-[#F59E0B] font-bold">
            <Flame className="w-4 h-4 fill-[#F59E0B]" />
            <span>{streakDays} Day Streak</span>
          </div>

          {/* XP Total Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono text-[#62DF7D] font-bold">
            <Zap className="w-4 h-4 fill-[#62DF7D]" />
            <span>{totalXp} XP</span>
          </div>

          {/* Bookmarks */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono text-[#8A8A90]">
            <BookMarked className="w-4 h-4 text-[#62DF7D]" />
            <span>{bookmarkedLessonIds.length} Bookmarks</span>
          </div>
        </div>
      </div>

      {/* Global Lesson Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8A8A90] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search lessons, concepts, SQL keywords (e.g., Window Functions, JOINs, Indexes, CTEs)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl pl-9 pr-3 py-2 text-xs text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D]"
        />
      </div>
    </div>
  );
};
