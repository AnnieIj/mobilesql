import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services/reactQuery';
import { useUIStore } from './stores/useUIStore';
import { useAuthStore } from './stores/useAuthStore';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
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
import { LandingPageView } from './components/landing/LandingPageView';
import { DocsHubView } from './components/docs/DocsHubView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { DatasetBuilderView } from './components/dataset/DatasetBuilderView';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { VerifyEmailPage } from './components/auth/VerifyEmailPage';
import {
  PageNotFound404,
  SystemError500,
  NetworkOfflineState,
  UnauthorizedState,
  SessionExpiredState,
} from './components/shared/StateDisplays';
import type { ActiveTab } from './types';

const PUBLIC_TABS: ActiveTab[] = ['login', 'register', 'forgot-password', 'verify-email', 'landing', 'docs', 'help'];

function ActiveTabContent() {
  const activeTab = useUIStore((s) => s.activeTab);

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

  if (activeTab === 'landing') {
    return <LandingPageView />;
  }

  if (activeTab === 'docs') {
    return <DocsHubView />;
  }

  if (activeTab === 'admin') {
    return <AdminDashboardView />;
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

function MainRouter() {
  const { activeTab, setActiveTab, addToast } = useUIStore();
  const { isAuthenticated, isDemoMode, setReturnTab, checkSession } = useAuthStore();

  // Initial Route & Session Validation on Mount
  useEffect(() => {
    checkSession();

    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    const validTabs: ActiveTab[] = [
      'login',
      'register',
      'forgot-password',
      'verify-email',
      'dashboard',
      'academy',
      'playground',
      'challenges',
      'dataset-builder',
      'sql-lab',
      'projects',
      'portfolio',
      'certificates',
      'achievements',
      'leaderboard',
      'analytics',
      'career',
      'community',
      'copilot',
      'settings',
      'help',
      'docs',
      'landing',
      'admin',
    ];

    if (path && validTabs.includes(path as ActiveTab)) {
      const targetTab = path as ActiveTab;

      // If user visits auth pages while already logged in, route to dashboard
      if (['login', 'register', 'forgot-password'].includes(targetTab) && (isAuthenticated || isDemoMode)) {
        setActiveTab('dashboard');
        window.history.replaceState(null, '', '/dashboard');
      } else if (!PUBLIC_TABS.includes(targetTab) && !isAuthenticated && !isDemoMode) {
        // Protected route without authentication
        setReturnTab(targetTab);
        setActiveTab('login');
        window.history.replaceState(null, '', '/login');
        addToast({
          title: 'Authentication Required',
          message: `Please sign in to access /${targetTab}.`,
          type: 'info',
        });
      } else {
        setActiveTab(targetTab);
      }
    } else if (!path || path === '/') {
      if (isAuthenticated || isDemoMode) {
        setActiveTab('dashboard');
        window.history.replaceState(null, '', '/dashboard');
      } else {
        setActiveTab('landing');
        window.history.replaceState(null, '', '/landing');
      }
    }

    // Handle browser back / forward buttons
    const handlePopState = () => {
      const popPath = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (popPath && validTabs.includes(popPath as ActiveTab)) {
        const popTab = popPath as ActiveTab;
        if (!PUBLIC_TABS.includes(popTab) && !useAuthStore.getState().isAuthenticated && !useAuthStore.getState().isDemoMode) {
          useAuthStore.getState().setReturnTab(popTab);
          setActiveTab('login');
          window.history.replaceState(null, '', '/login');
        } else {
          setActiveTab(popTab);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Protected Route Interceptor
  const isPublicRoute = PUBLIC_TABS.includes(activeTab);
  const isAuthAllowed = isAuthenticated || isDemoMode || isPublicRoute;

  // Render Dedicated Authentication Pages
  if (activeTab === 'login') {
    return <LoginPage />;
  }

  if (activeTab === 'register') {
    return <RegisterPage />;
  }

  if (activeTab === 'forgot-password') {
    return <ForgotPasswordPage />;
  }

  if (activeTab === 'verify-email') {
    return <VerifyEmailPage />;
  }

  // If a protected route was triggered without auth, enforce redirect to login
  if (!isAuthAllowed) {
    return <LoginPage />;
  }

  // Authenticated Application Shell & Workspace
  return (
    <AppShell>
      <ErrorBoundary moduleName="Active Workspace Canvas">
        <ActiveTabContent />
      </ErrorBoundary>
    </AppShell>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary moduleName="MobileSQL Core Shell">
        <MainRouter />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
