import React from 'react';
import { Database, Play, Layers, Zap, Layout, Activity, PieChart, Award, CheckCircle, Lock } from 'lucide-react';
import { ACADEMY_CURRICULUM } from '../../data/academyCurriculumData';
import { useAcademyStore } from '../../stores/useAcademyStore';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Database,
  Play,
  Layers,
  Zap,
  Layout,
  Activity,
  PieChart,
  Award,
};

export const RoadmapTimeline: React.FC = () => {
  const { selectedTrackId, setSelectedTrackId, completedLessonIds } = useAcademyStore();

  return (
    <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 md:p-6 space-y-4 font-sans select-none shadow-xl">
      <div className="flex items-center justify-between border-b border-[#2D2D31] pb-3">
        <div>
          <h2 className="text-base font-bold text-[#FFFFFF]">Interactive SQL Skill Roadmap</h2>
          <p className="text-xs text-[#8A8A90]">Master all 8 tracks from Beginner to FAANG Interview Level</p>
        </div>
      </div>

      {/* Horizontal Connected Timeline Nodes */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 custom-scrollbar">
        {ACADEMY_CURRICULUM.map((track, idx) => {
          const isSelected = selectedTrackId === track.id;
          const IconComp = ICON_MAP[track.iconName] || Database;

          // Count completed lessons in this track
          const allLessonIds = track.modules.flatMap((m) => m.lessons.map((l) => l.id));
          const completedCount = allLessonIds.filter((id) => completedLessonIds.includes(id)).length;
          const isFinished = allLessonIds.length > 0 && completedCount === allLessonIds.length;

          return (
            <React.Fragment key={track.id}>
              {/* Connector line */}
              {idx > 0 && (
                <div
                  className={`h-0.5 w-8 shrink-0 transition-colors ${
                    isFinished ? 'bg-[#62DF7D]' : 'bg-[#2D2D31]'
                  }`}
                />
              )}

              {/* Node Card */}
              <button
                onClick={() => setSelectedTrackId(track.id)}
                className={`p-3 rounded-xl border flex items-center gap-3 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#62DF7D]/15 border-[#62DF7D] text-[#FFFFFF] shadow-lg scale-105'
                    : 'bg-[#131315] border-[#2D2D31] hover:border-[#62DF7D]/50 text-[#8A8A90]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                    isSelected ? 'bg-[#62DF7D] text-[#131315]' : 'bg-[#232326] text-[#62DF7D]'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </div>

                <div className="text-left font-sans space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#FFFFFF]">{track.title}</span>
                    {isFinished && <CheckCircle className="w-3.5 h-3.5 text-[#62DF7D]" />}
                  </div>
                  <p className="text-[10px] font-mono text-[#8A8A90] truncate max-w-[140px]">
                    {track.badgeName}
                  </p>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
