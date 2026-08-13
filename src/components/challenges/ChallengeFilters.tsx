import React from 'react';
import { Search, Filter, Building2 } from 'lucide-react';
import { useChallengeStore } from '../../stores/useChallengeStore';

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Pro Architect'];
const CATEGORIES = ['All', 'Aggregation', 'Joins', 'Window Functions', 'CTEs', 'Data Cleaning'];
const COMPANIES = ['All', 'Amazon', 'Google', 'Meta', 'Stripe', 'Netflix', 'Microsoft'];

export const ChallengeFilters: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedCategory,
    setSelectedCategory,
    selectedCompany,
    setSelectedCompany,
  } = useChallengeStore();

  return (
    <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 space-y-3 font-sans select-none">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8A8A90] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search challenges by title, SQL keywords, or problem description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl pl-9 pr-3 py-2 text-xs text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D]"
        />
      </div>

      {/* Filter Bar Rows */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 w-full sm:w-auto">
          <span className="text-[#8A8A90] text-[11px] font-sans mr-1 shrink-0">Difficulty:</span>
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-[#62DF7D] text-[#131315] font-bold'
                  : 'bg-[#131315] text-[#8A8A90] hover:text-[#FFFFFF] border border-[#2D2D31]'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Company Pills */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 w-full sm:w-auto">
          <Building2 className="w-3.5 h-3.5 text-[#8A8A90] shrink-0 mr-1" />
          {COMPANIES.map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedCompany(comp)}
              className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                selectedCompany === comp
                  ? 'bg-[#62DF7D]/20 text-[#62DF7D] border border-[#62DF7D] font-bold'
                  : 'bg-[#131315] text-[#8A8A90] hover:text-[#FFFFFF] border border-[#2D2D31]'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
