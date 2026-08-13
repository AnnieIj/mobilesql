import React from 'react';
import { Building2, ChevronRight, CheckCircle2, Zap, HelpCircle } from 'lucide-react';
import type { CompanyInterviewGuide } from '../../data/careerData';
import { useCareerStore } from '../../stores/useCareerStore';

interface CompanyPrepCardProps {
  guide: CompanyInterviewGuide;
  onSelect: (guideId: string) => void;
}

export const CompanyPrepCard: React.FC<CompanyPrepCardProps> = ({ guide, onSelect }) => {
  return (
    <div className="bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D] rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all group shadow-xl">
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#62DF7D] font-mono text-xs font-bold flex items-center justify-center">
              {guide.logoText}
            </span>
            <h3 className="text-base font-bold text-[#FFFFFF] group-hover:text-[#62DF7D] transition-colors">
              {guide.companyName}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#131315] border border-[#2D2D31] text-[10px] font-mono text-[#62DF7D] font-bold">
            {guide.difficulty}
          </span>
        </div>

        {/* Process Steps */}
        <div className="space-y-1 font-mono text-xs">
          <span className="text-[#8A8A90] text-[10px] uppercase">Interview Process:</span>
          <div className="space-y-1">
            {guide.processSteps.map((step, idx) => (
              <p key={idx} className="text-[#D0D0D5] text-[11px] flex items-center gap-1.5">
                <span className="text-[#62DF7D] font-bold">{idx + 1}.</span> {step}
              </p>
            ))}
          </div>
        </div>

        {/* Frequent Topics */}
        <div className="flex flex-wrap gap-1 pt-1">
          {guide.frequentTopics.map((top) => (
            <span
              key={top}
              className="px-2 py-0.5 rounded bg-[#131315] border border-[#2D2D31] text-[10px] font-mono text-[#8A8A90]"
            >
              {top}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-3 border-t border-[#2D2D31]/60 flex items-center justify-between text-xs font-mono">
        <span className="text-[#8A8A90] flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-[#62DF7D]" /> Sub-{guide.expectedOptimizationMs}ms Target
        </span>
        <button
          onClick={() => onSelect(guide.id)}
          className="px-3 py-1.5 rounded-xl bg-[#131315] group-hover:bg-[#62DF7D] text-[#8A8A90] group-hover:text-[#131315] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>Practice Guide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
