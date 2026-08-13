import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Clock, CheckCircle2, Code2, Award, BotMessageSquare } from 'lucide-react';
import type { MockInterviewRole } from '../../data/careerData';
import { useCareerStore } from '../../stores/useCareerStore';
import { MonacoSQLEditor } from '../playground/MonacoSQLEditor';
import { executePlaygroundQuery } from '../../services/sqlExecutionEngine';
import type { SQLExecutionResult } from '../../types';

interface MockInterviewModalProps {
  role: MockInterviewRole;
  onClose: () => void;
}

export const MockInterviewModal: React.FC<MockInterviewModalProps> = ({ role, onClose }) => {
  const { recordMockInterview } = useCareerStore();

  const [timeLeftSeconds, setTimeLeftSeconds] = useState(role.timeLimitMins * 60);
  const [activeCode, setActiveCode] = useState(
    `-- SQL Mock Interview Question for ${role.roleTitle}\nSELECT * FROM customers LIMIT 5;`
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<SQLExecutionResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeftSeconds <= 0 || submitted) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeftSeconds, submitted]);

  const mins = Math.floor(timeLeftSeconds / 60);
  const secs = timeLeftSeconds % 60;

  const handleRunQuery = async () => {
    setIsExecuting(true);
    const { result } = await executePlaygroundQuery(activeCode, 'ecommerce_prod', 'PostgreSQL');
    setIsExecuting(false);
    setQueryResult(result);
  };

  const handleSubmitInterview = () => {
    setSubmitted(true);
    recordMockInterview({
      id: `mock_${Date.now()}`,
      roleId: role.id,
      roleTitle: role.roleTitle,
      completedAtIso: new Date().toISOString(),
      scorePercent: 92,
      timeSpentMins: Math.round((role.timeLimitMins * 60 - timeLeftSeconds) / 60),
      passed: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131315]/95 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto custom-scrollbar font-sans text-[#FFFFFF] select-none flex justify-center">
      <div className="max-w-5xl w-full bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-5 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2D2D31] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-bold text-[#FFFFFF]">Live Mock Interview: {role.roleTitle}</h2>
              <p className="text-xs text-[#8A8A90] font-mono">{role.level} • Target Salary: {role.targetSalaryRange}</p>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono font-bold text-[#F59E0B]">
            <Clock className="w-4 h-4" />
            <span>{mins}:{secs < 10 ? `0${secs}` : secs}</span>
          </div>
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
              <span className="text-[#62DF7D] font-bold">Interview Question #1</span>
              <p className="text-[#FFFFFF] font-sans text-xs">
                Write a SQL query using window functions to identify repeat customer order dates and calculate days elapsed between orders.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-1">
              <span className="text-[#8A8A90] text-[10px] uppercase">Evaluated Skills:</span>
              <div className="flex flex-wrap gap-1 pt-1">
                {role.requiredSkills.map((sk) => (
                  <span key={sk} className="px-2 py-0.5 rounded bg-[#232326] text-[10px] text-[#62DF7D]">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="h-[260px] rounded-xl overflow-hidden border border-[#2D2D31]">
              <MonacoSQLEditor
                value={activeCode}
                onChange={(val) => setActiveCode(val || '')}
                onRunQuery={handleRunQuery}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleRunQuery}
                disabled={isExecuting}
                className="px-4 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono text-[#FFFFFF] hover:border-[#62DF7D] cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 text-[#62DF7D]" /> Run Query
              </button>

              <button
                onClick={handleSubmitInterview}
                disabled={submitted}
                className="px-4 py-2 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold text-xs font-mono cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> {submitted ? 'Interview Submitted' : 'Submit Final Solution'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
