import React, { useState } from 'react';
import { Puzzle, CheckCircle2, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import type { AcademyDragExercise } from '../../data/academyCurriculumData';

interface SqlDragBlockProps {
  exercise: AcademyDragExercise;
  onComplete: (xp: number) => void;
}

export const SqlDragBlockExercise: React.FC<SqlDragBlockProps> = ({
  exercise,
  onComplete,
}) => {
  // Combine correct blocks + distractors into bank
  const allAvailable = [...exercise.blocks.map((b) => b.text), ...exercise.distractors].sort(
    () => Math.random() - 0.5
  );

  const [bank, setBank] = useState<string[]>(allAvailable);
  const [assembled, setAssembled] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectBlock = (blockText: string) => {
    if (isChecked) return;
    setBank(bank.filter((b) => b !== blockText));
    setAssembled([...assembled, blockText]);
  };

  const handleRemoveBlock = (blockText: string) => {
    if (isChecked) return;
    setAssembled(assembled.filter((b) => b !== blockText));
    setBank([...bank, blockText]);
  };

  const handleReset = () => {
    setBank(allAvailable);
    setAssembled([]);
    setIsChecked(false);
    setIsCorrect(false);
  };

  const handleVerify = () => {
    const constructedQuery = assembled.join(' ').trim() + ';';
    const matches = constructedQuery.toLowerCase() === exercise.expectedQuery.toLowerCase();
    setIsCorrect(matches);
    setIsChecked(true);

    if (matches) {
      onComplete(exercise.xpReward);
    }
  };

  return (
    <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 md:p-5 space-y-4 my-4 font-sans select-none">
      {/* Exercise Header */}
      <div className="flex items-center justify-between border-b border-[#2D2D31] pb-3">
        <div className="flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-[#62DF7D]" />
          <div>
            <h3 className="text-sm font-bold text-[#FFFFFF]">Interactive SQL Block Puzzle</h3>
            <p className="text-xs text-[#8A8A90]">{exercise.instructions}</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="p-1.5 text-[#8A8A90] hover:text-[#FFFFFF] rounded-lg bg-[#131315] border border-[#2D2D31] cursor-pointer"
          title="Reset Puzzle"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Target Assembly Area */}
      <div className="space-y-1.5">
        <span className="text-xs font-mono text-[#8A8A90]">Constructed SQL Query:</span>
        <div className="min-h-[64px] bg-[#131315] border-2 border-dashed border-[#2D2D31] rounded-xl p-3 flex flex-wrap gap-2 items-center">
          {assembled.length === 0 ? (
            <span className="text-xs font-mono text-[#8A8A90] italic">
              Tap SQL blocks from below to construct your query...
            </span>
          ) : (
            assembled.map((block, idx) => (
              <button
                key={idx}
                onClick={() => handleRemoveBlock(block)}
                className="px-3 py-1.5 bg-[#232326] border border-[#62DF7D]/40 hover:border-[#62DF7D] text-[#62DF7D] font-mono text-xs font-bold rounded-lg transition-all cursor-pointer shadow-md"
              >
                {block}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Block Bank */}
      <div className="space-y-1.5">
        <span className="text-xs font-mono text-[#8A8A90]">Available SQL Snippets:</span>
        <div className="flex flex-wrap gap-2">
          {bank.map((block, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectBlock(block)}
              className="px-3 py-1.5 bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] text-[#FFFFFF] font-mono text-xs rounded-lg transition-all cursor-pointer"
            >
              {block}
            </button>
          ))}
        </div>
      </div>

      {/* Verify & Feedback Actions */}
      <div className="pt-2 flex items-center justify-between">
        {isChecked && (
          <div className="flex items-center gap-2 text-xs font-mono">
            {isCorrect ? (
              <span className="text-[#62DF7D] flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Correct Query Structure! +{exercise.xpReward} XP
              </span>
            ) : (
              <span className="text-[#EF4444] flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4" /> Incorrect order or extra blocks. Tap reset to try again.
              </span>
            )}
          </div>
        )}

        {!isChecked && (
          <button
            onClick={handleVerify}
            disabled={assembled.length === 0}
            className="ml-auto px-4 py-2 bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4" /> Check Answer
          </button>
        )}
      </div>
    </div>
  );
};
