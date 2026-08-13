import React, { useState } from 'react';
import { useCareerStore } from '../../stores/useCareerStore';
import { COMPANY_INTERVIEW_GUIDES, MOCK_INTERVIEW_ROLES } from '../../data/careerData';
import { CareerDashboardHeader } from './CareerDashboardHeader';
import { CompanyPrepCard } from './CompanyPrepCard';
import { MockInterviewModal } from './MockInterviewModal';
import { ResumeAnalyzerModal } from './ResumeAnalyzerModal';
import { SalaryExplorerModal } from './SalaryExplorerModal';
import { Target, Sparkles, FileText, DollarSign, Award, ArrowRight, Play } from 'lucide-react';

export const CareerView: React.FC = () => {
  const { activeMockRoleId, setActiveMockRoleId } = useCareerStore();
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);

  const activeRole = MOCK_INTERVIEW_ROLES.find((r) => r.id === activeMockRoleId);

  return (
    <div className="flex flex-col h-full bg-[#131315] font-sans text-[#FFFFFF] select-none overflow-y-auto custom-scrollbar">
      {/* Top Header */}
      <CareerDashboardHeader />

      {/* Main Container */}
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Quick Action Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <button
            onClick={() => setShowResumeModal(true)}
            className="p-4 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D] flex items-center justify-between text-left cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#62DF7D]" />
              <div>
                <p className="font-bold text-[#FFFFFF] group-hover:text-[#62DF7D]">ATS Resume Scanner & Cover Letter</p>
                <p className="text-[10px] text-[#8A8A90]">Scan resume & generate tailored cover letter</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8A8A90] group-hover:text-[#62DF7D]" />
          </button>

          <button
            onClick={() => setShowSalaryModal(true)}
            className="p-4 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D] flex items-center justify-between text-left cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-[#3B82F6]" />
              <div>
                <p className="font-bold text-[#FFFFFF] group-hover:text-[#3B82F6]">Salary Explorer</p>
                <p className="text-[10px] text-[#8A8A90]">Inspect FAANG SQL compensation benchmarks</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8A8A90] group-hover:text-[#3B82F6]" />
          </button>
        </div>

        {/* Mock Interview Tracks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <h2 className="font-bold text-[#FFFFFF] text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-[#62DF7D]" /> Live Mock SQL Interview Tracks
            </h2>
            <span className="text-[#8A8A90]">Choose Role Track</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_INTERVIEW_ROLES.map((role) => (
              <div
                key={role.id}
                className="p-5 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D] space-y-4 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#131315] text-[#62DF7D] font-mono text-[10px] font-bold">
                      {role.level}
                    </span>
                    <span className="text-xs font-mono text-[#8A8A90]">{role.timeLimitMins}m Timed</span>
                  </div>
                  <h3 className="text-base font-bold text-[#FFFFFF] group-hover:text-[#62DF7D] transition-colors">
                    {role.roleTitle}
                  </h3>
                  <p className="text-xs font-mono text-[#62DF7D] font-bold">Target Salary: {role.targetSalaryRange}</p>
                </div>

                <button
                  onClick={() => setActiveMockRoleId(role.id)}
                  className="w-full py-2 rounded-xl bg-[#131315] group-hover:bg-[#62DF7D] text-[#8A8A90] group-hover:text-[#131315] font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Play className="w-3.5 h-3.5" /> Start Mock Interview
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Company Guides Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <h2 className="font-bold text-[#FFFFFF] text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#62DF7D]" /> Target Company Interview Guides
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMPANY_INTERVIEW_GUIDES.map((guide) => (
              <CompanyPrepCard
                key={guide.id}
                guide={guide}
                onSelect={(id) => {}}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeRole && (
        <MockInterviewModal role={activeRole} onClose={() => setActiveMockRoleId(null)} />
      )}
      {showResumeModal && <ResumeAnalyzerModal onClose={() => setShowResumeModal(false)} />}
      {showSalaryModal && <SalaryExplorerModal onClose={() => setShowSalaryModal(false)} />}
    </div>
  );
};
