import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, ActiveTab } from '../types';
import { DEMO_PRO_ARCHITECT } from '../data/demoPersona';
import { apiClient, authTokens } from '../services/apiClient';
import { queryClient } from '../services/reactQuery';
import { useUIStore } from './useUIStore';

export function mapBackendUserToProfile(backendUser: any): UserProfile {
  const role = backendUser.role || 'student';
  const level = backendUser.level || 1;
  const xp = backendUser.xp || 100;
  const nextLevelXp = level * 1000 + 500;

  return {
    id: backendUser.id || `user_${Date.now()}`,
    name: backendUser.name || backendUser.username || 'MobileSQL Engineer',
    email: backendUser.email || 'engineer@mobilesql.io',
    avatarUrl:
      backendUser.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    title:
      role === 'architect'
        ? 'Principal Data Architect'
        : role === 'engineer'
        ? 'Senior SQL Engineer'
        : 'SQL Data Practitioner',
    level,
    xp,
    nextLevelXp,
    streakDays: backendUser.streakDays || 1,
    queriesRun: backendUser.queriesRun || 14,
    accuracyPercentage: backendUser.accuracyPercentage || 99.2,
    division:
      role === 'architect'
        ? 'Pro Architect Division'
        : role === 'engineer'
        ? 'SQL Engineer'
        : 'Novice Queryer',
    isGuest: backendUser.isGuest || backendUser.email?.includes('guest_') || false,
    createdAt: backendUser.createdAt || new Date().toISOString(),
  };
}

export const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest_user_01',
  name: 'Alex Mercer',
  email: 'alex.mercer@mobilesql.io',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  title: 'Principal Data Architect',
  level: 12,
  xp: 4250,
  nextLevelXp: 5000,
  streakDays: 14,
  queriesRun: 8492,
  accuracyPercentage: 99.9,
  division: 'Pro Architect Division',
  isGuest: true,
  createdAt: new Date().toISOString(),
};

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
  returnTab: ActiveTab | null;
  
  setReturnTab: (tab: ActiveTab | null) => void;
  setUser: (user: UserProfile | null) => void;
  
  // Real Backend Auth Actions
  loginWithBackend: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  registerWithBackend: (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    role?: string;
    rememberMe?: boolean;
  }) => Promise<{ verificationToken?: string }>;
  loginWithGuest: (displayName?: string) => Promise<void>;
  loginWithOAuth: (
    provider: 'google' | 'github' | 'microsoft',
    data?: { name?: string; email?: string; avatarUrl?: string }
  ) => Promise<void>;
  
  // Personas & Exploratory modes
  loadDemoPersona: () => void;
  resetToDefaultGuest: () => void;
  
  // Gamification & Progression
  addXp: (amount: number) => void;
  incrementQueriesRun: () => void;
  incrementStreak: () => void;
  
  // Complete Logout Lifecycle
  logout: (options?: { silent?: boolean; notice?: string }) => Promise<void>;
  
  // Session verification
  checkSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_GUEST_USER,
      isAuthenticated: false,
      isDemoMode: false,
      isLoading: false,
      returnTab: null,

      setReturnTab: (tab) => set({ returnTab: tab }),

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      loginWithBackend: async ({ email, password, rememberMe = true }) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.auth.login({ email, password });
          const { user: rawUser, tokens } = res;
          
          authTokens.setTokens(tokens.accessToken, tokens.refreshToken, rememberMe);
          const mappedUser = mapBackendUserToProfile(rawUser);

          set({
            user: mappedUser,
            isAuthenticated: true,
            isDemoMode: false,
            isLoading: false,
          });

          const currentReturnTab = get().returnTab;
          const targetTab: ActiveTab = currentReturnTab && !['login', 'register', 'forgot-password', 'verify-email'].includes(currentReturnTab)
            ? currentReturnTab
            : 'dashboard';

          set({ returnTab: null });
          useUIStore.getState().setActiveTab(targetTab);
          window.history.pushState(null, '', `/${targetTab}`);

          useUIStore.getState().addToast({
            title: 'Welcome Back',
            message: `Authenticated as ${mappedUser.name}. Enterprise session established.`,
            type: 'success',
          });
        } catch (err: any) {
          set({ isLoading: false });
          throw err;
        }
      },

      registerWithBackend: async ({ name, username, email, password, role = 'student', rememberMe = true }) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.auth.register({ name, username, email, password, role });
          const { user: rawUser, tokens, verificationToken } = res;

          authTokens.setTokens(tokens.accessToken, tokens.refreshToken, rememberMe);
          const mappedUser = mapBackendUserToProfile(rawUser);

          set({
            user: mappedUser,
            isAuthenticated: true,
            isDemoMode: false,
            isLoading: false,
          });

          const currentReturnTab = get().returnTab;
          const targetTab: ActiveTab = currentReturnTab && !['login', 'register', 'forgot-password', 'verify-email'].includes(currentReturnTab)
            ? currentReturnTab
            : 'dashboard';

          set({ returnTab: null });
          useUIStore.getState().setActiveTab(targetTab);
          window.history.pushState(null, '', `/${targetTab}`);

          useUIStore.getState().addToast({
            title: 'Account Provisioned',
            message: `Welcome to MobileSQL, ${mappedUser.name}! +100 XP Welcome Bonus awarded.`,
            type: 'xp',
          });

          return { verificationToken };
        } catch (err: any) {
          set({ isLoading: false });
          throw err;
        }
      },

      loginWithGuest: async (displayName = 'Guest Engineer') => {
        set({ isLoading: true });
        try {
          const res = await apiClient.auth.guest({ displayName });
          const { user: rawUser, tokens } = res;

          authTokens.setTokens(tokens.accessToken, tokens.refreshToken, false);
          const mappedUser = mapBackendUserToProfile(rawUser);

          set({
            user: mappedUser,
            isAuthenticated: true,
            isDemoMode: false,
            isLoading: false,
          });

          const currentReturnTab = get().returnTab;
          const targetTab: ActiveTab = currentReturnTab && !['login', 'register', 'forgot-password', 'verify-email'].includes(currentReturnTab)
            ? currentReturnTab
            : 'dashboard';

          set({ returnTab: null });
          useUIStore.getState().setActiveTab(targetTab);
          window.history.pushState(null, '', `/${targetTab}`);

          useUIStore.getState().addToast({
            title: 'Guest Sandbox Active',
            message: `Anonymous WASM database session ready.`,
            type: 'info',
          });
        } catch (err: any) {
          // Fallback to local guest profile if offline
          set({
            user: DEFAULT_GUEST_USER,
            isAuthenticated: true,
            isDemoMode: false,
            isLoading: false,
          });
          useUIStore.getState().setActiveTab('dashboard');
          window.history.pushState(null, '', '/dashboard');
        }
      },

      loginWithOAuth: async (provider, data) => {
        set({ isLoading: true });
        try {
          const providerUserId = `oauth_${provider}_${Math.random().toString(36).substring(2, 10)}`;
          const email = data?.email || `developer@${provider}.oauth.mobilesql.io`;
          const name = data?.name || `${provider.toUpperCase()} Developer`;

          const res = await apiClient.auth.oauth({
            provider,
            providerUserId,
            email,
            name,
            avatarUrl: data?.avatarUrl,
          });

          const { user: rawUser, tokens } = res;
          authTokens.setTokens(tokens.accessToken, tokens.refreshToken, true);
          const mappedUser = mapBackendUserToProfile(rawUser);

          set({
            user: mappedUser,
            isAuthenticated: true,
            isDemoMode: false,
            isLoading: false,
          });

          const currentReturnTab = get().returnTab;
          const targetTab: ActiveTab = currentReturnTab && !['login', 'register', 'forgot-password', 'verify-email'].includes(currentReturnTab)
            ? currentReturnTab
            : 'dashboard';

          set({ returnTab: null });
          useUIStore.getState().setActiveTab(targetTab);
          window.history.pushState(null, '', `/${targetTab}`);

          useUIStore.getState().addToast({
            title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} SSO Authenticated`,
            message: `Logged in as ${mappedUser.name}.`,
            type: 'success',
          });
        } catch (err: any) {
          set({ isLoading: false });
          throw err;
        }
      },

      loadDemoPersona: () => {
        set({
          user: DEMO_PRO_ARCHITECT,
          isAuthenticated: true,
          isDemoMode: true,
          isLoading: false,
        });

        useUIStore.getState().setActiveTab('dashboard');
        window.history.pushState(null, '', '/dashboard');

        useUIStore.getState().addToast({
          title: 'Demo Persona Loaded',
          message: 'Active as Elena Rostova (Principal Architect, Level 18, 42-day streak).',
          type: 'info',
        });
      },

      resetToDefaultGuest: () => {
        set({
          user: DEFAULT_GUEST_USER,
          isAuthenticated: false,
          isDemoMode: false,
          isLoading: false,
          returnTab: null,
        });
      },

      addXp: (amount) =>
        set((state) => {
          if (!state.user) return state;
          const newXp = state.user.xp + amount;
          let newLevel = state.user.level;
          let nextLevelXp = state.user.nextLevelXp;

          if (newXp >= nextLevelXp) {
            newLevel += 1;
            nextLevelXp += 1500;
          }

          return {
            user: {
              ...state.user,
              xp: newXp,
              level: newLevel,
              nextLevelXp,
            },
          };
        }),

      incrementQueriesRun: () =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              queriesRun: state.user.queriesRun + 1,
            },
          };
        }),

      incrementStreak: () =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              streakDays: state.user.streakDays + 1,
            },
          };
        }),

      logout: async (options) => {
        const refreshToken = authTokens.getRefreshToken();
        
        // 1. Call backend to revoke refresh token and delete session
        try {
          if (refreshToken) {
            await apiClient.auth.logout(refreshToken);
          }
        } catch (err) {
          // Log silently and continue client cleanup
          console.warn('[Logout] Backend logout response:', err);
        }

        // 2. Clear all tokens from storage
        authTokens.clear();

        // 3. Clear React Query cache
        queryClient.clear();

        // 4. Reset Auth Store State
        set({
          user: DEFAULT_GUEST_USER,
          isAuthenticated: false,
          isDemoMode: false,
          isLoading: false,
          returnTab: null,
        });

        // 5. Clear Session Storage & Sensitive Keys
        sessionStorage.clear();
        localStorage.removeItem('mobilesql_redirect_tab');

        // 6. Redirect to /login
        useUIStore.getState().setActiveTab('login');
        window.history.pushState(null, '', '/login');

        // 7. Feedback
        if (!options?.silent) {
          useUIStore.getState().addToast({
            title: 'Logged Out Securely',
            message: options?.notice || 'Your session has been terminated and security tokens revoked.',
            type: 'info',
          });
        }
      },

      checkSession: async () => {
        if (get().isDemoMode && get().user) {
          return true;
        }

        const token = authTokens.getAccessToken();
        if (!token) {
          if (get().isAuthenticated) {
            set({ user: DEFAULT_GUEST_USER, isAuthenticated: false });
          }
          return false;
        }

        try {
          const userProfile = await apiClient.auth.getMe();
          if (userProfile) {
            const mappedUser = mapBackendUserToProfile(userProfile);
            set({ user: mappedUser, isAuthenticated: true });
            return true;
          }
        } catch (err: any) {
          // Attempt token refresh
          const rt = authTokens.getRefreshToken();
          if (rt) {
            try {
              const newTokens = await apiClient.auth.refresh(rt);
              authTokens.setTokens(newTokens.accessToken, newTokens.refreshToken, authTokens.isRemembered());
              const userProfile = await apiClient.auth.getMe();
              if (userProfile) {
                const mappedUser = mapBackendUserToProfile(userProfile);
                set({ user: mappedUser, isAuthenticated: true });
                return true;
              }
            } catch (refreshErr) {
              // Refresh failed, clean up session
              authTokens.clear();
              set({ user: DEFAULT_GUEST_USER, isAuthenticated: false });
              return false;
            }
          }
          authTokens.clear();
          set({ user: DEFAULT_GUEST_USER, isAuthenticated: false });
          return false;
        }

        return false;
      },
    }),
    {
      name: 'mobilesql-auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isDemoMode: state.isDemoMode,
        returnTab: state.returnTab,
      }),
    }
  )
);
