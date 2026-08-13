import React from 'react';
import { useChallengeStore } from '../../stores/useChallengeStore';
import { SQL_CHALLENGES } from '../../data/challengesData';
import { ChallengeHeaderStats } from './ChallengeHeaderStats';
import { ChallengeFilters } from './ChallengeFilters';
import { ChallengeCard } from './ChallengeCard';
import { ChallengeRunnerView } from './ChallengeRunnerView';
import { Trophy, HelpCircle } from 'lucide-react';

export const ChallengesView: React.FC = () => {
  const {
    activeChallengeId,
    setActiveChallengeId,
    searchQuery,
    selectedDifficulty,
    selectedCategory,
    selectedCompany,
  } = useChallengeStore();

  const activeChallenge = SQL_CHALLENGES.find((c) => c.id === activeChallengeId);

  // Filter Logic
  const filteredChallenges = SQL_CHALLENGES.filter((c) => {
    // Search query match
    const matchesSearch =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Difficulty match
    const matchesDifficulty =
      selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;

    // Category match
    const matchesCategory =
      selectedCategory === 'All' || c.category === selectedCategory;

    // Company match
    const matchesCompany =
      selectedCompany === 'All' || c.companyTags.includes(selectedCompany);

    return matchesSearch && matchesDifficulty && matchesCategory && matchesCompany;
  });

  if (activeChallenge) {
    return (
      <ChallengeRunnerView
        challenge={activeChallenge}
        onBack={() => setActiveChallengeId(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#131315] font-sans text-[#FFFFFF] select-none overflow-y-auto custom-scrollbar">
      {/* Top Header */}
      <ChallengeHeaderStats />

      {/* Main Container */}
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Filters */}
        <ChallengeFilters />

        {/* List Header */}
        <div className="flex items-center justify-between font-mono text-xs text-[#8A8A90]">
          <span>Showing {filteredChallenges.length} SQL Challenges</span>
          <span className="flex items-center gap-1 text-[#62DF7D]">
            <Trophy className="w-3.5 h-3.5" /> FAANG Interview Tagged
          </span>
        </div>

        {/* Challenges Grid */}
        {filteredChallenges.length === 0 ? (
          <div className="p-12 text-center bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl space-y-3 font-mono">
            <HelpCircle className="w-8 h-8 text-[#8A8A90] mx-auto" />
            <h3 className="text-base font-bold text-[#FFFFFF]">No SQL Challenges Found</h3>
            <p className="text-xs text-[#8A8A90]">
              Try adjusting your search criteria, company filters, or difficulty selection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onSelect={(id) => setActiveChallengeId(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
