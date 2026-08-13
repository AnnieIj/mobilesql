import React from 'react';
import { usePortfolioStore } from '../../stores/usePortfolioStore';
import { ENTERPRISE_PROJECTS } from '../../data/portfolioProjectsData';
import { PortfolioHeaderStats } from './PortfolioHeaderStats';
import { PortfolioCard } from './PortfolioCard';
import { ProjectWorkspaceView } from './ProjectWorkspaceView';
import { RecruiterPortfolioView } from './RecruiterPortfolioView';
import { Search, Filter, Briefcase, HelpCircle } from 'lucide-react';

const INDUSTRIES = [
  'All',
  'FinTech & Banking',
  'E-Commerce',
  'Healthcare',
  'Human Resources',
  'Logistics',
  'Telecom',
];

export const PortfolioView: React.FC = () => {
  const {
    activeProjectId,
    setActiveProjectId,
    recruiterViewMode,
    setRecruiterViewMode,
    searchQuery,
    setSearchQuery,
    selectedIndustry,
    setSelectedIndustry,
  } = usePortfolioStore();

  const activeProject = ENTERPRISE_PROJECTS.find((p) => p.id === activeProjectId);

  // Filter Projects
  const filteredProjects = ENTERPRISE_PROJECTS.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.businessScenario.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry =
      selectedIndustry === 'All' || p.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  if (activeProject) {
    return (
      <ProjectWorkspaceView
        project={activeProject}
        onBack={() => setActiveProjectId(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#131315] font-sans text-[#FFFFFF] select-none overflow-y-auto custom-scrollbar">
      {/* Header Banner */}
      <PortfolioHeaderStats />

      {/* Main Container */}
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Search & Filter Bar */}
        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 space-y-3 font-sans">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8A8A90] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search enterprise projects by industry, SQL techniques, or company scenario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl pl-9 pr-3 py-2 text-xs text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D]"
            />
          </div>

          {/* Industry Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs font-mono">
            <span className="text-[#8A8A90] mr-1 shrink-0">Industry:</span>
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3 py-1 rounded-lg text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  selectedIndustry === ind
                    ? 'bg-[#62DF7D] text-[#131315] font-bold'
                    : 'bg-[#131315] text-[#8A8A90] hover:text-[#FFFFFF] border border-[#2D2D31]'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl space-y-3 font-mono">
            <HelpCircle className="w-8 h-8 text-[#8A8A90] mx-auto" />
            <h3 className="text-base font-bold text-[#FFFFFF]">No Enterprise Projects Found</h3>
            <p className="text-xs text-[#8A8A90]">
              Try adjusting your search terms or selecting a different industry domain filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <PortfolioCard
                key={project.id}
                project={project}
                onSelect={(id) => setActiveProjectId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recruiter View Modal */}
      {recruiterViewMode && (
        <RecruiterPortfolioView onClose={() => setRecruiterViewMode(false)} />
      )}
    </div>
  );
};
