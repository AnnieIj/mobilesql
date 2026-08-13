import React from 'react';
import { ArrowLeft, DollarSign, TrendingUp, Building2 } from 'lucide-react';
import { SALARY_BENCHMARKS } from '../../data/careerData';

interface SalaryExplorerModalProps {
  onClose: () => void;
}

export const SalaryExplorerModal: React.FC<SalaryExplorerModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#131315]/95 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto custom-scrollbar font-sans text-[#FFFFFF] select-none flex justify-center">
      <div className="max-w-3xl w-full bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-5 shadow-2xl relative my-auto">
        <div className="flex items-center justify-between border-b border-[#2D2D31] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-bold text-[#FFFFFF]">SQL Salary Benchmark Explorer</h2>
              <p className="text-xs text-[#8A8A90] font-mono">Market Compensation Data (2026 FAANG & Tech Standards)</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {SALARY_BENCHMARKS.map((b) => (
            <div key={b.role} className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#FFFFFF] text-sm">{b.role}</span>
                <span className="text-[#62DF7D] font-bold flex items-center gap-1">
                  <DollarSign className="w-4 h-4" /> Top Tech: {b.topTechUsd}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-[#8A8A90] pt-1">
                <span>Entry: <strong className="text-[#FFFFFF]">{b.entryLevelUsd}</strong></span>
                <span>Mid: <strong className="text-[#FFFFFF]">{b.midLevelUsd}</strong></span>
                <span>Senior: <strong className="text-[#FFFFFF]">{b.seniorLevelUsd}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
