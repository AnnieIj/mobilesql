import React from 'react';
import { ACADEMY_CURRICULUM } from '../../data/academyCurriculumData';
import { useAcademyStore } from '../../stores/useAcademyStore';
import { AcademyHeaderStats } from './AcademyHeaderStats';
import { RoadmapTimeline } from './RoadmapTimeline';
import { ModuleCard } from './ModuleCard';
import { LessonRunnerView } from './LessonRunnerView';

export const AcademyView: React.FC = () => {
  const {
    selectedTrackId,
    searchQuery,
    activeLessonId,
    setActiveLessonId,
  } = useAcademyStore();

  const selectedTrack =
    ACADEMY_CURRICULUM.find((t) => t.id === selectedTrackId) || ACADEMY_CURRICULUM[0];

  // Find active lesson if launched
  const activeLesson = ACADEMY_CURRICULUM.flatMap((t) =>
    t.modules.flatMap((m) => m.lessons)
  ).find((l) => l.id === activeLessonId);

  // Filter modules/lessons based on search query or selected track
  const displayedModules = selectedTrack.modules.filter((m) => {
    if (!searchQuery) return true;
    const matchesModule =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLessons = m.lessons.some(
      (l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesModule || matchesLessons;
  });

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#131315] flex flex-col overflow-y-auto custom-scrollbar font-sans select-none">
      {/* Top Header Stats Bar */}
      <AcademyHeaderStats />

      {/* Main Container */}
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Connected Interactive Roadmap Timeline */}
        <RoadmapTimeline />

        {/* Selected Track Intro Header */}
        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 rounded-full bg-[#62DF7D]/15 text-[#62DF7D] text-xs font-mono font-bold">
              Active Track: {selectedTrack.title}
            </span>
            <span className="text-xs font-mono text-[#8A8A90]">
              {selectedTrack.modules.length} Modules
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#FFFFFF]">{selectedTrack.subtitle}</h2>
          <p className="text-xs text-[#8A8A90] leading-relaxed">{selectedTrack.description}</p>
        </div>

        {/* Course Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedModules.length > 0 ? (
            displayedModules.map((mod) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                onSelectLesson={(lessonId) => {
                  const found = mod.lessons.find((l) => l.id === lessonId);
                  setActiveLessonId(lessonId, found?.initialSql || '');
                }}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl space-y-2">
              <p className="text-sm font-bold text-[#FFFFFF]">No lessons matching search query</p>
              <p className="text-xs text-[#8A8A90]">
                Try searching for keywords like "SELECT", "JOIN", "WHERE", or "Window Functions"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Interactive Lesson Runner View when a lesson is selected */}
      {activeLesson && (
        <LessonRunnerView
          lesson={activeLesson}
          onClose={() => setActiveLessonId(null)}
        />
      )}
    </div>
  );
};
