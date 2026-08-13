import React from 'react';
import { Target, Sparkles, Award, UserCheck, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useCareerStore } from '../../stores/useCareerStore';

export const CareerDashboardHeader: React.FC = () => {
  const { jobReadinessScore, atsResumeScore, completedMockInterviews, targetRole, targetCompany } =
    useCareerStore();

  return (
    <div className="bg-[#1B1B1E] border-b border-[#2D2D31] p-4 font-sans select-none space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#62DF7D]/15 border border-[#62DF7D]/40 flex items-center justify-center text-[#62DF7D]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#FFFFFF]">AI Career Coach & Interview Center</h1>
              <span className="px-2 py-0.5 rounded bg-[#62DF7D]/20 text-[#62DF7D] font-mono text-[10px] font-bold">
                FAANG Placement Ready
              </span>
            </div>
            <p className="text-xs text-[#8A8A90]">
              Target Role: <span className="text-[#FFFFFF] font-bold">{targetRole}</span> @ <span className="text-[#62DF7D] font-bold">{targetCompany}</span>
            </p>
          </div>
        </div>

        {/* Readiness Badges */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          {/* Job Readiness Index */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31]">
            <Sparkles className="w-4 h-4 text-[#62DF7D]" />
            <span className="text-[#8A8A90]">Job Readiness:</span>
            <span className="text-[#62DF7D] font-bold">{jobReadinessScore}/99</span>
          </div>

          {/* ATS Resume Score */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31]">
            <UserCheck className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-[#8A8A90]">ATS Score:</span>
            <span className="text-[#3B82F6] font-bold">{atsResumeScore}%</span>
          </div>

          {/* Mocks Completed */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31]">
            <CheckCircle2 className="w-4 h-4 text-[#A855F7]" />
            <span className="text-[#8A8A90]">Mocks Passed:</span>
            <span className="text-[#A855F7] font-bold">{completedMockInterviews.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
