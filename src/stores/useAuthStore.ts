import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '../types';

interface AuthState {
  user: UserProfile;
  isAuthenticated: boolean;
  setUser: (user: UserProfile) => void;
  addXp: (amount: number) => void;
  incrementQueriesRun: () => void;
  incrementStreak: () => void;
  logout: () => void;
}

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest_user_01',
  name: 'Alex Mercer',
  email: 'alex.mercer@mobilesql.io',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEFAULT_GUEST_USER,
      isAuthenticated: true,

      setUser: (user) => set({ user, isAuthenticated: true }),

      addXp: (amount) =>
        set((state) => {
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
        set((state) => ({
          user: {
            ...state.user,
            queriesRun: state.user.queriesRun + 1,
          },
        })),

      incrementStreak: () =>
        set((state) => ({
          user: {
            ...state.user,
            streakDays: state.user.streakDays + 1,
          },
        })),

      logout: () => set({ user: DEFAULT_GUEST_USER, isAuthenticated: false }),
    }),
    {
      name: 'mobilesql-auth-store',
    }
  )
);
