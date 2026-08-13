import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Building2,
  Award,
  Sparkles,
  Database,
  Code2,
  Check,
  BotMessageSquare,
} from 'lucide-react';
import type { SQLChallenge } from '../../data/challengesData';
import { useChallengeStore } from '../../stores/useChallengeStore';
import { MonacoSQLEditor } from '../playground/MonacoSQLEditor';

interface ChallengeRunnerViewProps {
  challenge: SQLChallenge;
  onBack: () => void;
}

export const ChallengeRunnerView: React.FC<ChallengeRunnerViewProps> = ({ challenge, onBack }) => {
  const {
    activeCode,
    updateCode,
    runChallengeCode,
    resetChallenge,
    isExecuting,
    testResults,
    allPassed,
  } = useChallengeStore();

  const [activeTab, setActiveTab] = useState<'problem' | 'hints' | 'solution'>('problem');
  const [showHintIndex, setShowHintIndex] = useState<number | null>(null);

  const handleRun = () => {
    runChallengeCode(challenge);
  };

  return (
    <div className="flex flex-col h-full bg-[#131315] font-sans text-[#FFFFFF] select-none">
      {/* Top Header Bar */}
      <div className="bg-[#1B1B1E] border-b border-[#2D2D31] p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-bold text-[#FFFFFF]">{challenge.title}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#62DF7D]/15 text-[#62DF7D]">
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-xs text-[#8A8A90] font-mono flex items-center gap-2 mt-0.5">
              <span>Database: {challenge.databaseId}</span>
              <span>•</span>
              <span className="text-[#62DF7D]">+{challenge.pointsReward} Pts</span>
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => resetChallenge(challenge)}
            className="p-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            title="Reset query snippet"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isExecuting}
            className="px-4 py-2 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6d] text-[#131315] font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-[#131315]" />
            <span>{isExecuting ? 'Running Query...' : 'Submit & Test Query'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
        {/* Left Panel: Description, Schema & Hints */}
        <div className="lg:col-span-5 bg-[#1B1B1E] border-r border-[#2D2D31] flex flex-col h-full overflow-y-auto custom-scrollbar p-5 space-y-5">
          {/* Tabs */}
          <div className="flex border-b border-[#2D2D31] gap-4 font-mono text-xs">
            <button
              onClick={() => setActiveTab('problem')}
              className={`pb-2 transition-all cursor-pointer ${
                activeTab === 'problem'
                  ? 'border-b-2 border-[#62DF7D] text-[#62DF7D] font-bold'
                  : 'text-[#8A8A90] hover:text-[#FFFFFF]'
              }`}
            >
              Problem Description
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`pb-2 transition-all cursor-pointer ${
                activeTab === 'hints'
                  ? 'border-b-2 border-[#62DF7D] text-[#62DF7D] font-bold'
                  : 'text-[#8A8A90] hover:text-[#FFFFFF]'
              }`}
            >
              Hints ({challenge.hints.length})
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`pb-2 transition-all cursor-pointer ${
                activeTab === 'solution'
                  ? 'border-b-2 border-[#62DF7D] text-[#62DF7D] font-bold'
                  : 'text-[#8A8A90] hover:text-[#FFFFFF]'
              }`}
            >
              Official Solution
            </button>
          </div>

          {/* Problem Tab */}
          {activeTab === 'problem' && (
            <div className="space-y-4 text-xs leading-relaxed text-[#D0D0D5]">
              {/* FAANG Companies */}
              <div className="flex items-center gap-2">
                <span className="text-[#8A8A90] font-mono text-[11px]">Asked in Interviews:</span>
                {challenge.companyTags.map((comp) => (
                  <span
                    key={comp}
                    className="px-2 py-0.5 rounded bg-[#131315] border border-[#2D2D31] font-mono text-[10px] text-[#62DF7D] font-bold flex items-center gap-1"
                  >
                    <Building2 className="w-3 h-3" /> {comp}
                  </span>
                ))}
              </div>

              {/* Description Text */}
              <div className="prose prose-invert max-w-none space-y-3 font-sans">
                <p className="whitespace-pre-line text-[#FFFFFF] font-medium">{challenge.descriptionMarkdown}</p>
              </div>

              {/* FAANG Interview Tip Box */}
              <div className="p-3.5 rounded-xl bg-[#62DF7D]/10 border border-[#62DF7D]/30 space-y-1">
                <div className="flex items-center gap-2 text-[#62DF7D] font-bold font-mono text-[11px]">
                  <Sparkles className="w-4 h-4" /> FAANG Interview Tip
                </div>
                <p className="text-[#D0D0D5] text-[11px] font-sans">{challenge.interviewTip}</p>
              </div>
            </div>
          )}

          {/* Hints Tab */}
          {activeTab === 'hints' && (
            <div className="space-y-3 text-xs">
              <p className="text-[#8A8A90]">Need guidance? Reveal step-by-step hints without spoiling the query:</p>

              {challenge.hints.map((hint, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#62DF7D]">Hint #{idx + 1}</span>
                    <button
                      onClick={() => setShowHintIndex(showHintIndex === idx ? null : idx)}
                      className="text-[11px] font-mono text-[#8A8A90] hover:text-[#FFFFFF] cursor-pointer"
                    >
                      {showHintIndex === idx ? 'Hide' : 'Reveal Hint'}
                    </button>
                  </div>
                  {showHintIndex === idx ? (
                    <p className="text-[#FFFFFF] font-sans text-[11px] pt-1">{hint}</p>
                  ) : (
                    <div className="h-4 bg-[#2D2D31]/40 rounded animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Solution Tab */}
          {activeTab === 'solution' && (
            <div className="space-y-3 text-xs font-mono">
              <p className="text-[#8A8A90]">Reference SQL solution for {challenge.title}:</p>
              <pre className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#62DF7D] text-[11px] overflow-x-auto whitespace-pre-wrap">
                {challenge.solutionSql}
              </pre>
            </div>
          )}
        </div>

        {/* Right Panel: Editor & Test Case Verification */}
        <div className="lg:col-span-7 bg-[#131315] flex flex-col h-full overflow-hidden">
          {/* Monaco Editor Header */}
          <div className="p-2.5 bg-[#1B1B1E] border-b border-[#2D2D31] flex items-center justify-between text-xs font-mono text-[#8A8A90]">
            <span className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#62DF7D]" /> SQL Query Editor
            </span>
            <span>PostgreSQL Dialect</span>
          </div>

          {/* Editor Container */}
          <div className="flex-1 min-h-[300px]">
            <MonacoSQLEditor
              value={activeCode}
              onChange={(val) => updateCode(val || '')}
              onRunQuery={handleRun}
            />
          </div>

          {/* Test Case Execution Output Panel */}
          <div className="bg-[#1B1B1E] border-t border-[#2D2D31] p-4 space-y-3 h-[220px] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-[#FFFFFF]">Test Verification Output</span>
              {allPassed && (
                <span className="px-2.5 py-0.5 rounded bg-[#62DF7D]/20 text-[#62DF7D] font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Tests Passed (+{challenge.pointsReward} Pts)
                </span>
              )}
            </div>

            {testResults.length === 0 ? (
              <div className="p-6 text-center text-[#8A8A90] font-mono text-xs space-y-2">
                <p>Click "Submit & Test Query" above to verify your solution against target constraints.</p>
              </div>
            ) : (
              <div className="space-y-2 font-mono text-xs">
                {testResults.map((tr) => (
                  <div
                    key={tr.testCaseId}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      tr.passed
                        ? 'bg-[#62DF7D]/10 border-[#62DF7D]/30 text-[#FFFFFF]'
                        : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#FFFFFF]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {tr.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#62DF7D] shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                      )}
                      <div>
                        <p className="font-bold">{tr.name}</p>
                        <p className="text-[11px] text-[#8A8A90]">{tr.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
