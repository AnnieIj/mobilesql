import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Clock,
  Award,
  CheckCircle2,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRACTICE_EXERCISES } from '../../data/practiceExercisesData';
import { usePlaygroundStore } from '../../stores/usePlaygroundStore';
import { useSQLEngineStore } from '../../stores/useSQLEngineStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { Button } from '../ui/Button';

export const PracticeModeBanner: React.FC = () => {
  const { activeExerciseId, stopExercise } = usePlaygroundStore();
  const { latestResult } = useSQLEngineStore();
  const { addXp } = useAuthStore();

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const exercise = PRACTICE_EXERCISES.find((e) => e.id === activeExerciseId) || PRACTICE_EXERCISES[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Validate student solution whenever latestResult updates
  useEffect(() => {
    if (!latestResult || latestResult.error || !exercise) return;

    // Check row count and output columns match
    const hasMatchingColumns = exercise.expectedOutputColumns.every((col) =>
      latestResult.columns.map((c) => c.toLowerCase()).includes(col.toLowerCase())
    );

    if (hasMatchingColumns && latestResult.rowCount >= exercise.expectedRowCount) {
      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      addXp(exercise.xpReward);
    }
  }, [latestResult, exercise, addXp]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#18181B] border-b border-[#2D2D31] p-3 text-xs font-sans space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#62DF7D]/20 text-[#62DF7D] font-mono font-bold text-[11px] border border-[#62DF7D]/30">
            Practice Challenge
          </span>
          <h3 className="font-bold text-[#FFFFFF] text-sm">{exercise.title}</h3>
          <span className="px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-mono font-bold text-[10px]">
            +{exercise.xpReward} XP
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <span className="flex items-center gap-1 text-[#8A8A90] bg-[#131315] px-2 py-1 rounded border border-[#2D2D31]">
            <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
            {formatTimer(timerSeconds)}
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowHints(!showHints)}
            leftIcon={<HelpCircle className="w-3.5 h-3.5 text-[#F59E0B]" />}
          >
            Hints ({exercise.hints.length})
          </Button>

          <button
            onClick={stopExercise}
            className="p-1 text-[#8A8A90] hover:text-[#EF4444]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-[#D4D4D8] leading-relaxed">{exercise.question}</p>

      {/* Hints Drawer */}
      {showHints && (
        <div className="p-3 bg-[#131315] border border-[#2D2D31] rounded-xl space-y-1 font-mono text-[11px] text-[#F59E0B]">
          <p className="font-bold uppercase tracking-wider">Solution Guidance Hints:</p>
          <ul className="list-disc pl-4 space-y-0.5 text-[#E0E0E0]">
            {exercise.hints.map((hint, idx) => (
              <li key={idx}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Modal Toast */}
      {isSuccess && (
        <div className="p-3 bg-[#62DF7D]/20 border border-[#62DF7D] rounded-xl flex items-center justify-between font-mono text-xs text-[#62DF7D]">
          <span className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#62DF7D]" />
            Challenge Passed! +{exercise.xpReward} XP Awarded to your profile!
          </span>
          <Button size="sm" variant="primary" onClick={stopExercise}>
            Next Exercise
          </Button>
        </div>
      )}
    </div>
  );
};
