import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../stores/useAuthStore';
import type { UserProfile } from '../types';

describe('Authentication Store & Session Management', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('initializes with default guest state', () => {
    const state = useAuthStore.getState();
    expect(state.user).not.toBeNull();
    expect(state.user.isGuest).toBe(true);
    expect(state.isAuthenticated).toBe(false);
  });

  it('authenticates user on setUser', () => {
    const testUser: UserProfile = {
      id: 'usr_prod_1',
      email: 'alex@mobilesql.dev',
      name: 'Alex Rivera',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250',
      title: 'Principal Data Architect',
      level: 5,
      xp: 1500,
      nextLevelXp: 2000,
      streakDays: 7,
      queriesRun: 150,
      accuracyPercentage: 98.5,
      division: 'Senior Division',
      isGuest: false,
      createdAt: new Date().toISOString(),
    };

    useAuthStore.getState().setUser(testUser);

    const updated = useAuthStore.getState();
    expect(updated.isAuthenticated).toBe(true);
    expect(updated.user.email).toBe('alex@mobilesql.dev');
    expect(updated.user.isGuest).toBe(false);
  });

  it('accurately awards XP and calculates level up', () => {
    const testUser: UserProfile = {
      id: 'usr_prod_2',
      email: 'test@mobilesql.dev',
      name: 'Tester',
      avatarUrl: '',
      title: 'SQL Student',
      level: 3,
      xp: 4950,
      nextLevelXp: 5000,
      streakDays: 2,
      queriesRun: 50,
      accuracyPercentage: 95.0,
      division: 'Novice Division',
      isGuest: false,
      createdAt: new Date().toISOString(),
    };

    useAuthStore.getState().setUser(testUser);
    useAuthStore.getState().addXp(100);

    const updated = useAuthStore.getState();
    expect(updated.user.xp).toBe(5050);
    expect(updated.user.level).toBe(4);
    expect(updated.user.nextLevelXp).toBe(6500);
  });

  it('increments streak and queries run accurately', () => {
    const testUser: UserProfile = {
      id: 'usr_prod_3',
      email: 'streak@mobilesql.dev',
      name: 'Streak User',
      avatarUrl: '',
      title: 'SQL Explorer',
      level: 1,
      xp: 100,
      nextLevelXp: 1000,
      streakDays: 4,
      queriesRun: 10,
      accuracyPercentage: 100,
      division: 'Novice',
      isGuest: false,
      createdAt: new Date().toISOString(),
    };

    useAuthStore.getState().setUser(testUser);
    useAuthStore.getState().incrementStreak();
    useAuthStore.getState().incrementQueriesRun();

    const state = useAuthStore.getState();
    expect(state.user.streakDays).toBe(5);
    expect(state.user.queriesRun).toBe(11);
  });
});
