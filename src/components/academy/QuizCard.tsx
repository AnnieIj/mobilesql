import React from 'react';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, ArrowRight } from 'lucide-react';
import type { AcademyQuiz } from '../../data/academyCurriculumData';
import { useAcademyStore } from '../../stores/useAcademyStore';

interface QuizCardProps {
  quiz: AcademyQuiz;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const { activeQuizAnswer, quizSubmitted, quizIsCorrect, submitQuizAnswer } = useAcademyStore();

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (quizSubmitted) return;
    submitQuizAnswer(optionId, isCorrect);
  };

  return (
    <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 md:p-5 space-y-4 my-4 font-sans select-none shadow-xl">
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-[#2D2D31] pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#62DF7D]" />
          <div>
            <h3 className="text-sm font-bold text-[#FFFFFF]">Concept Knowledge Check</h3>
            <p className="text-xs text-[#8A8A90]">Test your understanding before proceeding</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#62DF7D]/15 text-[#62DF7D] text-xs font-mono font-bold">
          +{quiz.xpReward} XP
        </span>
      </div>

      {/* Question Text */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[#FFFFFF]">{quiz.question}</p>

        {quiz.codeSnippet && (
          <pre className="p-3 bg-[#131315] border border-[#2D2D31] rounded-xl text-xs font-mono text-[#62DF7D] overflow-x-auto">
            {quiz.codeSnippet}
          </pre>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-2">
        {quiz.options.map((opt) => {
          const isSelected = activeQuizAnswer === opt.id;
          let borderStyle = 'border-[#2D2D31] bg-[#131315] hover:border-[#62DF7D]/50';

          if (quizSubmitted) {
            if (opt.isCorrect) {
              borderStyle = 'border-[#62DF7D] bg-[#62DF7D]/10 text-[#62DF7D] font-bold';
            } else if (isSelected && !opt.isCorrect) {
              borderStyle = 'border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]';
            }
          } else if (isSelected) {
            borderStyle = 'border-[#62DF7D] bg-[#62DF7D]/15 text-[#FFFFFF]';
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
              disabled={quizSubmitted}
              className={`w-full p-3 rounded-xl border text-left text-xs font-sans transition-all flex items-start gap-3 cursor-pointer ${borderStyle}`}
            >
              <span className="w-5 h-5 rounded-full border border-[#2D2D31] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                {opt.id.toUpperCase()}
              </span>
              <div className="flex-1 space-y-1">
                <span>{opt.text}</span>
                {quizSubmitted && isSelected && (
                  <p className="text-[11px] text-[#8A8A90] font-sans mt-1">{opt.explanation}</p>
                )}
              </div>
              {quizSubmitted && opt.isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-[#62DF7D] shrink-0" />
              )}
              {quizSubmitted && isSelected && !opt.isCorrect && (
                <XCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Footer */}
      {quizSubmitted && (
        <div className="pt-2 border-t border-[#2D2D31] flex items-center justify-between text-xs font-mono">
          {quizIsCorrect ? (
            <span className="text-[#62DF7D] font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Correct Answer! Knowledge verified.
            </span>
          ) : (
            <span className="text-[#EF4444] font-bold">
              Incorrect answer. Review the explanation above.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
