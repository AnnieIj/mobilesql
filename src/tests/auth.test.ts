import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../stores/useAuthStore';

describe('Authentication Store & Session Management', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('initializes with default guest state', () => {
    const state = useAuthStore.getState();
    expect(state.user).not.toBeNull();
    expect(state.user?.role).toBe('GUEST');
    expect(state.isAuthenticated).toBe(false);
  });

  it('authenticates user on login', () => {
    const testUser = {
      id: 'usr_prod_1',
      email: 'alex@mobilesql.dev',
      name: 'Alex Rivera',
      username: 'arivera',
      role: 'PRO' as any,
      xp: 1500,
      level: 5,
      streakDays: 7,
      completedLessons: ['sql_101'],
      solvedChallenges: ['c1'],
    };

    useAuthStore.getState().login(testUser, 'jwt_access_token_mock', 'jwt_refresh_token_mock');

    const updated = useAuthStore.getState();
    expect(updated.isAuthenticated).toBe(true);
    expect(updated.user?.email).toBe('alex@mobilesql.dev');
    expect(updated.accessToken).toBe('jwt_access_token_mock');
  });

  it('accurately awards XP and level calculations', () => {
    useAuthStore.getState().login(
      {
        id: 'usr_prod_2',
        email: 'test@mobilesql.dev',
        name: 'Tester',
        username: 'tester',
        role: 'PRO' as any,
        xp: 950,
        level: 3,
        streakDays: 2,
        completedLessons: [],
        solvedChallenges: [],
      },
      'tok',
      'ref'
    );

    useAuthStore.getState().awardXP(100);
    const updated = useAuthStore.getState();
    expect(updated.user?.xp).toBe(1050);
    expect(updated.user?.level).toBe(4);
  });

  it('increments streak accurately', () => {
    useAuthStore.getState().login(
      {
        id: 'usr_prod_3',
        email: 'streak@mobilesql.dev',
        name: 'Streak User',
        username: 'streakuser',
        role: 'PRO' as any,
        xp: 100,
        level: 1,
        streakDays: 4,
        completedLessons: [],
        solvedChallenges: [],
      },
      'tok',
      'ref'
    );

    useAuthStore.getState().incrementStreak();
    expect(useAuthStore.getState().user?.streakDays).toBe(5);
  });
});
