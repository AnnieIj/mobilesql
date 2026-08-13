import React from 'react';
import { Flame, Trophy, CheckCircle2, Target, Sparkles } from 'lucide-react';
import { useChallengeStore } from '../../stores/useChallengeStore';
import { SQL_CHALLENGES } from '../../data/challengesData';

export const ChallengeHeaderStats: React.FC = () => {
  const { totalPoints, streakDays, solvedChallengeIds } = useChallengeStore();

  const totalCount = SQL_CHALLENGES.length;
  const solvedCount = solvedChallengeIds.length;
  const solvedRatioPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-[#1B1B1E] border-b border-[#2D2D31] p-4 font-sans select-none space-y-3">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#62DF7D]/15 border border-[#62DF7D]/40 flex items-center justify-center text-[#62DF7D]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#FFFFFF]">Daily SQL Performance Arena</h1>
              <span className="px-2 py-0.5 rounded bg-[#62DF7D]/15 text-[#62DF7D] font-mono text-[10px] font-bold">
                LeetCode FAANG Mode
              </span>
            </div>
            <p className="text-xs text-[#8A8A90]">
              Solve real-world SQL challenges from Amazon, Google, Meta & Stripe
            </p>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-3">
          {/* Solved Progress */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono text-[#FFFFFF]">
            <CheckCircle2 className="w-4 h-4 text-[#62DF7D]" />
            <span>
              {solvedCount}/{totalCount} Solved ({solvedRatioPercent}%)
            </span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono text-[#F59E0B] font-bold">
            <Flame className="w-4 h-4 fill-[#F59E0B]" />
            <span>{streakDays} Day Streak</span>
          </div>

          {/* Points */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono text-[#62DF7D] font-bold">
            <Trophy className="w-4 h-4 text-[#62DF7D]" />
            <span>{totalPoints} Arena Pts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
