import React from 'react';
import { BookOpen, Target, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/Feedback';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SectionTitle } from '../layout/Headers';
import { MOCK_LEARNING_PROGRESS } from '../../data/dashboardData';
import { useUIStore } from '../../stores/useUIStore';

export const LearningProgressSection: React.FC = () => {
  const { setActiveTab } = useUIStore();
  const data = MOCK_LEARNING_PROGRESS;

  return (
    <div className="space-y-4 font-sans">
      <SectionTitle
        title="Learning Progress & Course Goals"
        subtitle="Active SQL learning tracks and completion milestones"
        icon={<BookOpen className="w-5 h-5 text-[#62DF7D]" />}
        action={
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => setActiveTab('academy')}>
            View All Courses
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Active Course Card (Spans 2 columns on desktop) */}
        <Card className="md:col-span-2 space-y-4 bg-[#1B1B1E] border border-[#2D2D31] p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="emerald">Active Course</Badge>
              <h3 className="text-base font-bold text-[#FFFFFF]">{data.currentCourse}</h3>
              <p className="text-xs text-[#8A8A90] font-mono">{data.currentLesson}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black font-mono text-[#62DF7D]">{data.courseProgressPercent}%</span>
              <p className="text-[10px] text-[#8A8A90] font-mono uppercase tracking-wider">Course Done</p>
            </div>
          </div>

          <ProgressBar value={data.courseProgressPercent} height="md" color="emerald" showValue={false} />

          <div className="flex items-center justify-between text-xs text-[#C8C8CC] pt-2 border-t border-[#2D2D31]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#62DF7D]" />
              <span>18 of 26 lessons completed</span>
            </div>
            <Button size="sm" variant="glow" onClick={() => setActiveTab('academy')}>
              Resume Lesson 4
            </Button>
          </div>
        </Card>

        {/* Weekly & Monthly Goals Card */}
        <Card className="space-y-4 bg-[#1B1B1E] border border-[#2D2D31] p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#3B82F6]" />
                <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider font-mono">Weekly Goal</h4>
              </div>
              <span className="text-xs font-mono font-bold text-[#62DF7D]">
                {data.weeklyHoursLogged} / {data.weeklyHoursGoal} hrs
              </span>
            </div>
            <ProgressBar value={data.weeklyProgressPercent} height="sm" color="blue" showValue={false} />

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#F59E0B]" />
                <h4 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider font-mono">Monthly Goal</h4>
              </div>
              <span className="text-xs font-mono font-bold text-[#F59E0B]">
                {data.monthlyLessonsLogged} / {data.monthlyLessonsGoal} lessons
              </span>
            </div>
            <ProgressBar value={data.monthlyProgressPercent} height="sm" color="amber" showValue={false} />
          </div>

          <div className="pt-3 border-t border-[#2D2D31] flex justify-between items-center text-xs text-[#8A8A90]">
            <span>Overall SQL Mastery:</span>
            <span className="font-mono font-bold text-[#FFFFFF]">{data.overallTrackPercent}%</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
