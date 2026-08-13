import React from 'react';
import { BookOpen, Clock, Award, ChevronRight, CheckCircle } from 'lucide-react';
import type { AcademyModule } from '../../data/academyCurriculumData';
import { useAcademyStore } from '../../stores/useAcademyStore';

interface ModuleCardProps {
  module: AcademyModule;
  onSelectLesson: (lessonId: string) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onSelectLesson }) => {
  const { completedLessonIds } = useAcademyStore();

  const completedCount = module.lessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length;

  const progressPercent =
    module.lessons.length > 0
      ? Math.round((completedCount / module.lessons.length) * 100)
      : 0;

  return (
    <div className="bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#62DF7D]/60 rounded-2xl p-5 space-y-4 transition-all group shadow-lg flex flex-col justify-between">
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#62DF7D]/15 text-[#62DF7D]">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#62DF7D] uppercase tracking-wider">
                {module.difficulty}
              </span>
              <h3 className="text-base font-bold text-[#FFFFFF] group-hover:text-[#62DF7D] transition-colors">
                {module.title}
              </h3>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-[#8A8A90]">
            {progressPercent}%
          </span>
        </div>

        <p className="text-xs text-[#8A8A90] leading-relaxed line-clamp-2">
          {module.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-[#131315] rounded-full h-2 overflow-hidden border border-[#2D2D31]">
          <div
            className="bg-[#62DF7D] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#8A8A90]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {module.estimatedMinutes} mins
          </span>
          <span className="flex items-center gap-1 text-[#62DF7D]">
            <Award className="w-3.5 h-3.5" /> +{module.xpReward} XP
          </span>
        </div>
      </div>

      {/* Lesson List Items */}
      <div className="space-y-2 pt-2 border-t border-[#2D2D31]/60">
        {module.lessons.map((lesson) => {
          const isDone = completedLessonIds.includes(lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className="w-full p-2.5 rounded-xl bg-[#131315] hover:bg-[#232326] border border-[#2D2D31] flex items-center justify-between text-xs font-sans transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {isDone ? (
                  <CheckCircle className="w-4 h-4 text-[#62DF7D] shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#8A8A90] shrink-0" />
                )}
                <span
                  className={`truncate ${
                    isDone ? 'line-through text-[#8A8A90]' : 'text-[#FFFFFF] font-medium'
                  }`}
                >
                  {lesson.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-[#8A8A90]">
                <span>{lesson.durationMinutes}m</span>
                <ChevronRight className="w-4 h-4 text-[#8A8A90]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
