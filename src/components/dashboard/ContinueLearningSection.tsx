import React from 'react';
import { PlayCircle, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/Feedback';
import { Button } from '../ui/Button';
import { SectionTitle } from '../layout/Headers';
import { MOCK_RECENT_LESSONS } from '../../data/dashboardData';
import { useUIStore } from '../../stores/useUIStore';

export const ContinueLearningSection: React.FC = () => {
  const { setActiveTab, addToast } = useUIStore();

  return (
    <div className="space-y-4 font-sans">
      <SectionTitle
        title="Continue Learning"
        subtitle="Pick up right where you left off in your active modules"
        icon={<BookOpen className="w-5 h-5 text-[#3B82F6]" />}
        action={
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => setActiveTab('academy')}>
            All Modules
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_RECENT_LESSONS.map((lesson) => (
          <Card
            key={lesson.id}
            className="group hover:border-[#62DF7D]/60 transition-all duration-200 bg-[#1B1B1E] border border-[#2D2D31] p-5 flex flex-col justify-between space-y-4 cursor-pointer"
            onClick={() => {
              setActiveTab('academy');
              addToast({
                title: lesson.title,
                message: `Resuming ${lesson.module}...`,
                type: 'info',
              });
            }}
          >
            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#232326] text-[#62DF7D] border border-[#2D2D31]">
                {lesson.module}
              </span>
              <h3 className="text-sm font-bold text-[#FFFFFF] group-hover:text-[#62DF7D] transition-colors leading-snug">
                {lesson.title}
              </h3>
            </div>

            <div className="space-y-3 pt-2 border-t border-[#2D2D31]">
              <div className="flex justify-between items-center text-[11px] text-[#8A8A90] font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#8A8A90]" />
                  {lesson.estDurationMinutes} min left
                </span>
                <span className="text-[#62DF7D] font-bold">{lesson.progressPercent}%</span>
              </div>

              <ProgressBar value={lesson.progressPercent} height="sm" color="emerald" showValue={false} />

              <Button
                variant="secondary"
                size="sm"
                className="w-full group-hover:bg-[#62DF7D] group-hover:text-[#131315] group-hover:border-[#62DF7D] transition-all"
                leftIcon={<PlayCircle className="w-4 h-4" />}
              >
                Continue Lesson
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
