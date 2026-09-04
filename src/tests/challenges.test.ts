import { describe, it, expect } from 'vitest';
import { SQL_CHALLENGES } from '../data/challengesData';
import { challengeService } from '../server/services/challengeService';

describe('Challenge Engine & Problem Verification', () => {
  it('provides a valid list of challenges across difficulty spectrum', () => {
    expect(SQL_CHALLENGES.length).toBeGreaterThan(0);
    const difficulties = new Set(SQL_CHALLENGES.map((c) => c.difficulty));
    expect(difficulties.has('Intermediate') || difficulties.has('Advanced')).toBe(true);
  });

  it('ensures each challenge contains test cases and valid solution SQL', () => {
    SQL_CHALLENGES.forEach((challenge) => {
      expect(challenge.id).toBeTruthy();
      expect(challenge.title).toBeTruthy();
      expect(challenge.solutionSql).toBeTruthy();
      expect(challenge.testCases.length).toBeGreaterThan(0);
      expect(challenge.pointsReward).toBeGreaterThan(0);
    });
  });

  it('evaluates and passes official challenge solution queries against practice datasets', async () => {
    for (const challenge of SQL_CHALLENGES) {
      const result = await challengeService.submitAttempt(
        challenge.slug,
        {
          query: challenge.solutionSql,
          dialect: 'PostgreSQL',
        },
        'test_user_challenge'
      );

      expect(result.passed).toBe(true);
      expect(result.score).toBe(100);
      expect(result.xpAwarded).toBeGreaterThan(0);
      expect(result.testResults.every((t) => t.passed)).toBe(true);
    }
  });

  it('accurately fails an incorrect challenge attempt with test results feedback', async () => {
    const result = await challengeService.submitAttempt(
      'top-3-revenue-customers-per-country',
      {
        query: 'SELECT 1 AS dummy;',
        dialect: 'PostgreSQL',
      },
      'test_user_challenge'
    );

    expect(result.passed).toBe(false);
    expect(result.score).toBe(0);
    expect(result.xpAwarded).toBe(0);
    expect(result.testResults.length).toBeGreaterThan(0);
    expect(result.testResults[0].passed).toBe(false);
  });
});
