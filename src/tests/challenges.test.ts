import { describe, it, expect } from 'vitest';
import { SQL_CHALLENGES } from '../data/challengesData';

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
});
