import React from 'react';
import { HeroWelcomeSection } from './HeroWelcomeSection';
import { LearningProgressSection } from './LearningProgressSection';
import { DailyChallengeSection } from './DailyChallengeSection';
import { ContinueLearningSection } from './ContinueLearningSection';
import { RecentQueriesSection } from './RecentQueriesSection';
import { AchievementsSection } from './AchievementsSection';
import { CertificatesSection } from './CertificatesSection';
import { PortfolioProjectsSection } from './PortfolioProjectsSection';
import { LeaderboardPreviewSection } from './LeaderboardPreviewSection';
import { LearningAnalyticsSection } from './LearningAnalyticsSection';
import { AIRecommendationsSection } from './AIRecommendationsSection';
import { QuickActionsSection } from './QuickActionsSection';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* SECTION 1: Hero Welcome */}
      <HeroWelcomeSection />

      {/* SECTION 12: Quick Actions (Placed high for fast mobile/desktop utility) */}
      <QuickActionsSection />

      {/* SECTION 2: Learning Progress */}
      <LearningProgressSection />

      {/* SECTION 3: Daily Challenge */}
      <DailyChallengeSection />

      {/* SECTION 4: Continue Learning */}
      <ContinueLearningSection />

      {/* SECTION 10: Learning Analytics */}
      <LearningAnalyticsSection />

      {/* SECTION 11: AI Recommendations */}
      <AIRecommendationsSection />

      {/* SECTION 5: Recent Playground Queries */}
      <RecentQueriesSection />

      {/* SECTION 8: Portfolio Projects */}
      <PortfolioProjectsSection />

      {/* Two Column Layout for Achievements & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SECTION 6: Achievements */}
        <AchievementsSection />

        {/* SECTION 9: Leaderboard Preview */}
        <LeaderboardPreviewSection />
      </div>

      {/* SECTION 7: Certificates */}
      <CertificatesSection />
    </div>
  );
};
