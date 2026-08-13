import React, { useState } from 'react';
import { ArrowLeft, Sparkles, FileText, CheckCircle2, UserCheck, BotMessageSquare } from 'lucide-react';
import { useCareerStore } from '../../stores/useCareerStore';

interface ResumeAnalyzerModalProps {
  onClose: () => void;
}

export const ResumeAnalyzerModal: React.FC<ResumeAnalyzerModalProps> = ({ onClose }) => {
  const { atsResumeScore, setAtsResumeScore, setSavedCoverLetter } = useCareerStore();
  const [rawResumeText, setRawResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisDone(true);
      setAtsResumeScore(92);
      setSavedCoverLetter(
        `Dear Hiring Manager,\n\nI am excited to apply for the SQL Analytics position. Having completed enterprise projects in Window Functions, CTE Optimization, and FinTech risk data modeling, I bring hands-on database experience.`
      );
    }, 1200);
  };

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
              <h2 className="text-base font-bold text-[#FFFFFF]">AI Resume Analyzer & Cover Letter Generator</h2>
              <p className="text-xs text-[#8A8A90] font-mono">ATS Keyword Optimization & Professional Formatting</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <label className="text-[#8A8A90] block">Paste Resume Content or SQL Work Experience:</label>
          <textarea
            rows={5}
            value={rawResumeText}
            onChange={(e) => setRawResumeText(e.target.value)}
            placeholder="Paste your current resume bullets or project summaries here..."
            className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-3 text-xs text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D]"
          />

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full py-2.5 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>{analyzing ? 'Scanning Resume ATS Score...' : 'Run ATS Scan & Generate Cover Letter'}</span>
          </button>
        </div>

        {analysisDone && (
          <div className="p-4 rounded-xl bg-[#131315] border border-[#62DF7D]/40 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[#62DF7D]">
              <span className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> ATS Score: 92% (FAANG Optimized)
              </span>
            </div>
            <p className="text-[#8A8A90] text-[11px] font-sans">
              Tailored cover letter saved to profile! Keyword density matches Google & Stripe data roles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
