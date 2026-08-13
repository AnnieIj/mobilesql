import React from 'react';
import { Award, Clock, CheckCircle2, ChevronRight, Building2, Flame } from 'lucide-react';
import type { SQLChallenge } from '../../data/challengesData';
import { useChallengeStore } from '../../stores/useChallengeStore';

interface ChallengeCardProps {
  challenge: SQLChallenge;
  onSelect: (challengeId: string) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onSelect }) => {
  const { solvedChallengeIds } = useChallengeStore();

  const isSolved = solvedChallengeIds.includes(challenge.id);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-[#62DF7D]/15 text-[#62DF7D] border-[#62DF7D]/30';
      case 'Intermediate':
        return 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30';
      case 'Advanced':
        return 'bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/30';
      case 'Pro Architect':
        return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';
      default:
        return 'bg-[#8A8A90]/15 text-[#8A8A90] border-[#2D2D31]';
    }
  };

  return (
    <div
      onClick={() => onSelect(challenge.id)}
      className="bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D] rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all group cursor-pointer shadow-lg hover:shadow-2xl"
    >
      {/* Top Meta Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase ${getDifficultyColor(
                challenge.difficulty
              )}`}
            >
              {challenge.difficulty}
            </span>
            <span className="text-xs font-mono text-[#8A8A90] font-medium">
              {challenge.category}
            </span>
          </div>

          {isSolved && (
            <span className="flex items-center gap-1 text-xs font-mono text-[#62DF7D] font-bold">
              <CheckCircle2 className="w-4 h-4" /> Solved
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#FFFFFF] group-hover:text-[#62DF7D] transition-colors">
          {challenge.title}
        </h3>

        {/* Company Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {challenge.companyTags.map((comp) => (
            <span
              key={comp}
              className="px-2 py-0.5 rounded bg-[#131315] border border-[#2D2D31] text-[10px] font-mono text-[#8A8A90] flex items-center gap-1"
            >
              <Building2 className="w-3 h-3 text-[#62DF7D]" /> {comp}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Metrics & Trigger */}
      <div className="pt-3 border-t border-[#2D2D31]/60 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3 text-[#8A8A90]">
          <span className="flex items-center gap-1 text-[#62DF7D] font-bold">
            <Award className="w-3.5 h-3.5" /> +{challenge.pointsReward} Pts
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {challenge.estimatedTimeMins}m
          </span>
          <span>{challenge.passRatePercentage}% Pass</span>
        </div>

        <div className="p-1.5 rounded-lg bg-[#131315] group-hover:bg-[#62DF7D] text-[#8A8A90] group-hover:text-[#131315] transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
