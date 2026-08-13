import React from 'react';
import {
  UserCheck,
  Award,
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  FileDown,
  Sparkles,
  ArrowLeft,
  Building2,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { usePortfolioStore } from '../../stores/usePortfolioStore';
import { ENTERPRISE_PROJECTS } from '../../data/portfolioProjectsData';

interface RecruiterPortfolioViewProps {
  onClose: () => void;
}

export const RecruiterPortfolioView: React.FC<RecruiterPortfolioViewProps> = ({ onClose }) => {
  const { completedProjectIds, unlockedCertificates, calculateEmployabilityScore } =
    usePortfolioStore();

  const employabilityScore = calculateEmployabilityScore();

  return (
    <div className="fixed inset-0 z-50 bg-[#131315]/95 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto custom-scrollbar font-sans text-[#FFFFFF] select-none flex justify-center">
      <div className="max-w-4xl w-full bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#2D2D31] pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#FFFFFF]">Recruiter Portfolio Showcase</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#62DF7D]/20 text-[#62DF7D] font-mono text-[10px] font-bold">
                  Verified Candidate Profile
                </span>
              </div>
              <p className="text-xs text-[#8A8A90] font-mono">
                Verified Enterprise SQL Projects & Industry Certificates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono text-[#FFFFFF] hover:border-[#62DF7D] cursor-pointer flex items-center gap-1.5">
              <FileDown className="w-4 h-4 text-[#62DF7D]" /> Resume PDF
            </button>
          </div>
        </div>

        {/* Candidate Summary Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-1">
            <span className="text-[#8A8A90] text-[10px] uppercase">Employability Index</span>
            <div className="text-xl font-bold text-[#62DF7D] flex items-center gap-1.5">
              <Sparkles className="w-5 h-5" /> {employabilityScore}/99
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-1">
            <span className="text-[#8A8A90] text-[10px] uppercase">Verified Projects</span>
            <div className="text-xl font-bold text-[#3B82F6] flex items-center gap-1.5">
              <Building2 className="w-5 h-5" /> {completedProjectIds.length} Completed
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-1">
            <span className="text-[#8A8A90] text-[10px] uppercase">Verified Certificates</span>
            <div className="text-xl font-bold text-[#A855F7] flex items-center gap-1.5">
              <Award className="w-5 h-5" /> {unlockedCertificates.length} Certificates
            </div>
          </div>
        </div>

        {/* Unlocked Certificates Showcase */}
        <div className="space-y-3 font-mono text-xs">
          <h3 className="text-xs font-bold text-[#FFFFFF] uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#62DF7D]" /> Verified Certificates & Credentials
          </h3>

          {unlockedCertificates.length === 0 ? (
            <div className="p-6 rounded-xl bg-[#131315] border border-[#2D2D31] text-center text-[#8A8A90] space-y-1 font-sans">
              <p className="text-xs">No certificates unlocked yet.</p>
              <p className="text-[11px] font-mono text-[#8A8A90]">
                Complete 100% of tasks in an enterprise project workspace to earn verified credentials.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {unlockedCertificates.map((cert) => (
                <div
                  key={cert.verificationHash}
                  className="p-4 rounded-xl bg-[#131315] border border-[#62DF7D]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-[#FFFFFF] text-sm">{cert.certificateTitle}</p>
                    <p className="text-[11px] text-[#8A8A90]">
                      Issued by {cert.companyName} • Token: {cert.verificationHash}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-[#62DF7D]/20 text-[#62DF7D] text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Token
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
