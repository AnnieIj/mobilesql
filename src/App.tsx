import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services/reactQuery';
import { useUIStore } from './stores/useUIStore';
import { AppShell } from './components/layout/AppShell';
import { DashboardView } from './components/dashboard/DashboardView';
import { PlaygroundView } from './components/playground/PlaygroundView';
import { AcademyView } from './components/academy/AcademyView';
import { ChallengesView } from './components/challenges/ChallengesView';
import { ProfileView } from './components/profile/ProfileView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { PortfolioView } from './components/portfolio/PortfolioView';
import { CareerView } from './components/career/CareerView';
import { CertificatesView } from './components/certificates/CertificatesView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { CommunityView } from './components/community/CommunityView';
import { SettingsView } from './components/settings/SettingsView';
import { HelpView } from './components/help/HelpView';
import { DatasetBuilderView } from './components/dataset/DatasetBuilderView';
import {
  PageNotFound404,
  SystemError500,
  NetworkOfflineState,
  UnauthorizedState,
  SessionExpiredState,
} from './components/shared/StateDisplays';

function ActiveTabContent() {
  const { activeTab, setActiveTab, setSearchOpen, setCopilotOpen, addToast } = useUIStore();

  if (activeTab === 'dashboard') {
    return (
      <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8 font-sans">
        <DashboardView />
      </main>
    );
  }

  if (activeTab === 'playground' || activeTab === 'editor') {
    return <PlaygroundView />;
  }

  if (activeTab === 'academy') {
    return <AcademyView />;
  }

  if (activeTab === 'challenges') {
    return <ChallengesView />;
  }

  if (activeTab === 'dataset-builder' || activeTab === 'sql-lab') {
    return (
      <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8 font-sans">
        <DatasetBuilderView />
      </main>
    );
  }

  if (activeTab === 'profile') {
    return <ProfileView />;
  }

  if (activeTab === 'analytics') {
    return (
      <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8 font-sans">
        <AnalyticsView />
      </main>
    );
  }

  if (activeTab === 'projects' || activeTab === 'portfolio') {
    return <PortfolioView />;
  }

  if (activeTab === 'career') {
    return <CareerView />;
  }

  if (activeTab === 'certificates') {
    return <CertificatesView />;
  }

  if (activeTab === 'achievements') {
    return <ProfileView />;
  }

  if (activeTab === 'leaderboard' || activeTab === 'ranks') {
    return <LeaderboardView />;
  }

  if (activeTab === 'community') {
    return <CommunityView />;
  }

  if (activeTab === 'settings') {
    return <SettingsView />;
  }

  if (activeTab === 'help') {
    return <HelpView />;
  }

  if (activeTab === 'error-404') {
    return <PageNotFound404 />;
  }

  if (activeTab === 'error-500') {
    return <SystemError500 />;
  }

  if (activeTab === 'error-offline') {
    return <NetworkOfflineState />;
  }

  if (activeTab === 'error-403') {
    return <UnauthorizedState />;
  }

  if (activeTab === 'error-expired') {
    return <SessionExpiredState />;
  }

  if (activeTab === 'copilot') {
    return <DashboardView />;
  }

  return <DashboardView />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell>
        <ActiveTabContent />
      </AppShell>
    </QueryClientProvider>
  );
}

