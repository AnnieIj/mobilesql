import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OAuthProviderInfo {
  id: 'google' | 'github' | 'microsoft' | 'apple';
  name: string;
  connected: boolean;
  email?: string;
  connectedAt?: string;
}

export interface ActiveSession {
  id: string;
  deviceName: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  isTrusted: boolean;
}

export interface SecurityAlert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'failed_login' | 'new_device' | 'password_change' | '2fa_enabled';
  resolved: boolean;
}

export interface UserAccountPreferences {
  theme: 'dark-emerald' | 'obsidian' | 'midnight' | 'high-contrast';
  fontSize: number;
  editorFont: 'JetBrains Mono' | 'Fira Code' | 'Source Code Pro' | 'Inter';
  sqlDialect: 'PostgreSQL' | 'SQLite' | 'MySQL';
  defaultDatabase: string;
  aiResponseStyle: 'Concise Code-First' | 'Deep Architectural' | 'Interview Coach Mode';
  keyboardShortcuts: 'VS Code' | 'Vim' | 'Emacs';
  timeZone: string;
  language: string;
  highContrast: boolean;
  reducedMotion: boolean;
  largeTouchTargets: boolean;
  screenReaderOptimized: boolean;
}

export interface SyncSettings {
  status: 'synced' | 'syncing' | 'offline';
  lastSyncedAt: string;
  autoSync: boolean;
  optimisticUpdates: boolean;
  conflictResolution: 'server-wins' | 'client-wins' | 'merge';
}

export interface PrivacySettings {
  publicProfile: boolean;
  shareLeaderboardStats: boolean;
  anonymousTelemetry: boolean;
  allowAiTrainingOnQueries: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  weeklyReport: boolean;
  aiRecommendations: boolean;
  challengeReminders: boolean;
  certificateEarned: boolean;
  portfolioCompleted: boolean;
}

interface AccountState {
  authProvider: 'email' | 'google' | 'github' | 'microsoft' | 'apple' | 'guest';
  isTwoFactorEnabled: boolean;
  twoFactorSecret: string;
  providers: OAuthProviderInfo[];
  sessions: ActiveSession[];
  securityAlerts: SecurityAlert[];
  preferences: UserAccountPreferences;
  sync: SyncSettings;
  privacy: PrivacySettings;
  notifications: NotificationPreferences;

  // Actions
  updatePreferences: (partial: Partial<UserAccountPreferences>) => void;
  updatePrivacy: (partial: Partial<PrivacySettings>) => void;
  updateNotifications: (partial: Partial<NotificationPreferences>) => void;
  updateSync: (partial: Partial<SyncSettings>) => void;
  toggleTwoFactor: (enabled: boolean) => void;
  disconnectProvider: (providerId: string) => void;
  connectProvider: (providerId: string, email: string) => void;
  revokeSession: (sessionId: string) => void;
  revokeAllOtherSessions: () => void;
  toggleTrustedDevice: (sessionId: string) => void;
  resolveAlert: (alertId: string) => void;
  triggerCloudSync: () => void;
  resetAccountData: () => void;
}

const DEFAULT_SESSIONS: ActiveSession[] = [
  {
    id: 'sess_cur',
    deviceName: 'MacBook Pro 16" (M3 Max)',
    browser: 'Chrome v127.0 (macOS)',
    ipAddress: '192.168.1.104',
    location: 'San Francisco, CA (US)',
    lastActive: 'Active Now',
    isCurrent: true,
    isTrusted: true,
  },
  {
    id: 'sess_2',
    deviceName: 'iPhone 15 Pro Max',
    browser: 'MobileSQL App v2.4',
    ipAddress: '172.56.21.90',
    location: 'San Jose, CA (US)',
    lastActive: '2 hours ago',
    isCurrent: false,
    isTrusted: true,
  },
  {
    id: 'sess_3',
    deviceName: 'Linux Workstation',
    browser: 'Firefox v128.0 (Ubuntu)',
    ipAddress: '34.201.12.88',
    location: 'Seattle, WA (US)',
    lastActive: 'Yesterday',
    isCurrent: false,
    isTrusted: false,
  },
];

const DEFAULT_PROVIDERS: OAuthProviderInfo[] = [
  { id: 'google', name: 'Google Workspace', connected: true, email: 'alex.mercer@gmail.com', connectedAt: '2026-01-15' },
  { id: 'github', name: 'GitHub Developer', connected: true, email: 'alexmercer-sql', connectedAt: '2026-02-01' },
  { id: 'microsoft', name: 'Microsoft Azure Active Directory', connected: false },
  { id: 'apple', name: 'Apple ID (Architecture Ready)', connected: false },
];

const DEFAULT_ALERTS: SecurityAlert[] = [
  {
    id: 'alt_1',
    title: 'New Device Sign-In',
    message: 'Login detected from Linux Workstation in Seattle, WA.',
    timestamp: '1 day ago',
    type: 'new_device',
    resolved: false,
  },
  {
    id: 'alt_2',
    title: 'Failed Password Attempt Mitigated',
    message: '2 failed password attempts blocked by rate limiting from 198.51.100.4.',
    timestamp: '3 days ago',
    type: 'failed_login',
    resolved: true,
  },
];

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      authProvider: 'google',
      isTwoFactorEnabled: false,
      twoFactorSecret: 'JBSWY3DPEHPK3PXP',
      providers: DEFAULT_PROVIDERS,
      sessions: DEFAULT_SESSIONS,
      securityAlerts: DEFAULT_ALERTS,

      preferences: {
        theme: 'dark-emerald',
        fontSize: 14,
        editorFont: 'JetBrains Mono',
        sqlDialect: 'PostgreSQL',
        defaultDatabase: 'main_production',
        aiResponseStyle: 'Concise Code-First',
        keyboardShortcuts: 'VS Code',
        timeZone: 'America/Los_Angeles (PST)',
        language: 'English (US)',
        highContrast: false,
        reducedMotion: false,
        largeTouchTargets: false,
        screenReaderOptimized: false,
      },

      sync: {
        status: 'synced',
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        autoSync: true,
        optimisticUpdates: true,
        conflictResolution: 'server-wins',
      },

      privacy: {
        publicProfile: true,
        shareLeaderboardStats: true,
        anonymousTelemetry: false,
        allowAiTrainingOnQueries: false,
      },

      notifications: {
        email: true,
        push: true,
        inApp: true,
        weeklyReport: true,
        aiRecommendations: true,
        challengeReminders: true,
        certificateEarned: true,
        portfolioCompleted: true,
      },

      updatePreferences: (partial) =>
        set((state) => ({ preferences: { ...state.preferences, ...partial } })),

      updatePrivacy: (partial) =>
        set((state) => ({ privacy: { ...state.privacy, ...partial } })),

      updateNotifications: (partial) =>
        set((state) => ({ notifications: { ...state.notifications, ...partial } })),

      updateSync: (partial) =>
        set((state) => ({ sync: { ...state.sync, ...partial } })),

      toggleTwoFactor: (enabled) =>
        set({ isTwoFactorEnabled: enabled }),

      disconnectProvider: (providerId) =>
        set((state) => ({
          providers: state.providers.map((p) =>
            p.id === providerId ? { ...p, connected: false, email: undefined } : p
          ),
        })),

      connectProvider: (providerId, email) =>
        set((state) => ({
          providers: state.providers.map((p) =>
            p.id === providerId
              ? { ...p, connected: true, email, connectedAt: new Date().toISOString().split('T')[0] }
              : p
          ),
        })),

      revokeSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
        })),

      revokeAllOtherSessions: () =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.isCurrent),
        })),

      toggleTrustedDevice: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, isTrusted: !s.isTrusted } : s
          ),
        })),

      resolveAlert: (alertId) =>
        set((state) => ({
          securityAlerts: state.securityAlerts.map((a) =>
            a.id === alertId ? { ...a, resolved: true } : a
          ),
        })),

      triggerCloudSync: () => {
        set((state) => ({ sync: { ...state.sync, status: 'syncing' } }));
        setTimeout(() => {
          set((state) => ({
            sync: {
              ...state.sync,
              status: 'synced',
              lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          }));
        }, 1200);
      },

      resetAccountData: () => {
        localStorage.clear();
        window.location.reload();
      },
    }),
    {
      name: 'mobilesql-enterprise-account-store',
    }
  )
);
