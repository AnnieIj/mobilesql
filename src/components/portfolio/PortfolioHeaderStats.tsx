import React from 'react';
import { Briefcase, Award, Sparkles, UserCheck, CheckCircle2, Share2, ExternalLink } from 'lucide-react';
import { usePortfolioStore } from '../../stores/usePortfolioStore';
import { ENTERPRISE_PROJECTS } from '../../data/portfolioProjectsData';

export const PortfolioHeaderStats: React.FC = () => {
  const {
    completedProjectIds,
    unlockedCertificates,
    calculateEmployabilityScore,
    setRecruiterViewMode,
  } = usePortfolioStore();

  const employabilityScore = calculateEmployabilityScore();
  const totalProjects = ENTERPRISE_PROJECTS.length;
  const completedCount = completedProjectIds.length;

  return (
    <div className="bg-[#1B1B1E] border-b border-[#2D2D31] p-4 font-sans select-none space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Title Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#62DF7D]/15 border border-[#62DF7D]/40 flex items-center justify-center text-[#62DF7D]">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#FFFFFF]">Enterprise Portfolio Studio</h1>
              <span className="px-2 py-0.5 rounded bg-[#62DF7D]/20 text-[#62DF7D] font-mono text-[10px] font-bold">
                Employer Showcase
              </span>
            </div>
            <p className="text-xs text-[#8A8A90]">
              Solve multi-table business scenarios for FinTech, Healthcare & E-Commerce
            </p>
          </div>
        </div>

        {/* Stats Badges & Recruiter Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Employability Score */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono">
            <Sparkles className="w-4 h-4 text-[#62DF7D]" />
            <span className="text-[#8A8A90]">Employability Score:</span>
            <span className="text-[#62DF7D] font-bold">{employabilityScore}/99</span>
          </div>

          {/* Verified Certs */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono text-[#3B82F6]">
            <Award className="w-4 h-4 text-[#3B82F6]" />
            <span>{unlockedCertificates.length} Certificates</span>
          </div>

          {/* Recruiter View Button */}
          <button
            onClick={() => setRecruiterViewMode(true)}
            className="px-3 py-1.5 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <UserCheck className="w-4 h-4" />
            <span>Recruiter Showcase View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
