import React, { useState } from 'react';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  ChevronRight,
  Database,
  Award,
  Building2,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { EnterpriseProject } from '../../data/portfolioProjectsData';
import { usePortfolioStore } from '../../stores/usePortfolioStore';

interface PortfolioCardProps {
  project: EnterpriseProject;
  onSelect: (projectId: string) => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, onSelect }) => {
  const { completedProjectIds, completedObjectiveIds } = usePortfolioStore();
  const [showErdModal, setShowErdModal] = useState(false);

  const isCompleted = completedProjectIds.includes(project.id);
  const completedObjCount = project.objectives.filter((obj) =>
    completedObjectiveIds.includes(obj.id)
  ).length;

  const totalObjs = project.objectives.length;
  const progressPercent = Math.round((completedObjCount / totalObjs) * 100);

  return (
    <div className="bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D] rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all group shadow-xl">
      {/* Top Meta Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#131315] border border-[#2D2D31] text-[#62DF7D] font-mono text-xs font-bold flex items-center justify-center">
              {project.companyLogoText}
            </span>
            <span className="text-xs font-mono font-bold text-[#FFFFFF]">{project.companyName}</span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-[#131315] border border-[#2D2D31] text-[10px] font-mono text-[#62DF7D] font-bold">
            {project.industry}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#FFFFFF] group-hover:text-[#62DF7D] transition-colors leading-snug">
          {project.title}
        </h3>

        <p className="text-xs text-[#8A8A90] line-clamp-2 leading-relaxed font-sans">
          {project.companyDescription}
        </p>

        {/* Progress Bar */}
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between text-[#8A8A90]">
            <span>Objectives Done</span>
            <span className="text-[#62DF7D] font-bold">
              {completedObjCount}/{totalObjs} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-[#131315] h-1.5 rounded-full overflow-hidden border border-[#2D2D31]">
            <div
              className="bg-[#62DF7D] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Details & Action */}
      <div className="pt-3 border-t border-[#2D2D31]/60 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3 text-[#8A8A90]">
          <span className="flex items-center gap-1 text-[#62DF7D] font-bold">
            <Award className="w-3.5 h-3.5" /> +{project.xpReward} XP
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {project.estimatedHours}h Est.
          </span>
        </div>

        <button
          onClick={() => onSelect(project.id)}
          className="px-3 py-1.5 rounded-xl bg-[#131315] group-hover:bg-[#62DF7D] text-[#8A8A90] group-hover:text-[#131315] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>Open Studio</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
