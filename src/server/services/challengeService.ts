import { SubmitChallengeInput } from '../schemas/challenge.schema';
import { challengePrismaRepository } from '../database/repositories/challengePrismaRepository';
import { userPrismaRepository } from '../database/repositories/userPrismaRepository';
import { sqlExecutionService } from './sqlExecutionService';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { logger } from '../utils/logger';

export interface TestCaseResult {
  testCaseId: string;
  description: string;
  passed: boolean;
  expectedOutput: any;
  actualOutput: any;
  diffMessage?: string;
}

export interface ChallengeSubmissionResult {
  passed: boolean;
  score: number;
  xpAwarded: number;
  executionTimeMs: number;
  testResults: TestCaseResult[];
  streakDays: number;
  level: number;
  feedback: string;
}

export class ChallengeService {
  async getChallenges(difficulty?: string) {
    return await challengePrismaRepository.getChallenges(difficulty);
  }

  async getDailyChallenge() {
    const daily = await challengePrismaRepository.getDailyChallenge();
    if (!daily) {
      // Fallback: get the first available challenge if daily is not scheduled
      const all = await challengePrismaRepository.getChallenges();
      return all[0] || null;
    }
    return daily;
  }

  async getChallengeBySlug(slug: string) {
    const challenge = await challengePrismaRepository.getChallengeBySlug(slug);
    if (!challenge) {
      throw new NotFoundError(`Challenge with slug "${slug}" not found.`);
    }
    return challenge;
  }

  async submitAttempt(
    slug: string,
    input: SubmitChallengeInput,
    userId: string
  ): Promise<ChallengeSubmissionResult> {
    const challenge = await this.getChallengeBySlug(slug);
    const startTime = performance.now();

    // 1. Execute the user's submitted SQL query
    const execResult = await sqlExecutionService.execute(
      {
        query: input.query,
        dialect: input.dialect as any,
        databaseId: (challenge as any).databaseId || 'ecommerce_prod',
        timeoutMs: 5000,
        readOnly: true,
        limit: 1000,
      },
      userId
    );

    const executionTimeMs = Math.round(performance.now() - startTime);

    if (execResult.status === 'error') {
      // Record failed attempt
      await challengePrismaRepository.recordAttempt({
        userId,
        challengeId: challenge.id,
        submittedQuery: input.query,
        passed: false,
        executionTimeMs,
        score: 0,
      });

      return {
        passed: false,
        score: 0,
        xpAwarded: 0,
        executionTimeMs,
        testResults: [
          {
            testCaseId: 'syntax_error',
            description: 'SQL Execution Error',
            passed: false,
            expectedOutput: 'Valid query execution',
            actualOutput: execResult.errorMessage || 'Execution failed',
            diffMessage: execResult.errorMessage,
          },
        ],
        streakDays: 1,
        level: 1,
        feedback: `Query execution failed: ${execResult.errorMessage}`,
      };
    }

    // 2. Evaluate against test cases
    const testResults: TestCaseResult[] = [];
    let allPassed = true;

    if (challenge.testCases && challenge.testCases.length > 0) {
      for (const tc of challenge.testCases) {
        const expected = tc.expectedOutput as any[];
        const actual = execResult.rows;

        const isMatch = this.compareDatasetResults(expected, actual);
        if (!isMatch) allPassed = false;

        let diffMsg: string | undefined;
        if (!isMatch) {
          if (Array.isArray(expected)) {
            diffMsg = `Mismatch: Expected ${expected.length} rows, received ${actual?.length || 0} rows.`;
          } else if (typeof expected === 'object' && expected !== null) {
            diffMsg = `Output mismatch: Result first row does not match expected criteria.`;
          } else {
            diffMsg = `Query output did not match expected test case criteria.`;
          }
        }

        testResults.push({
          testCaseId: tc.id,
          description: tc.description,
          passed: isMatch,
          expectedOutput: expected,
          actualOutput: actual,
          diffMessage: diffMsg,
        });
      }
    } else {
      // If no explicit test cases configured, check if query returned non-empty rows without error
      allPassed = execResult.rowCount > 0;
      testResults.push({
        testCaseId: 'default_eval',
        description: 'Result verification',
        passed: allPassed,
        expectedOutput: 'Query output rows > 0',
        actualOutput: `${execResult.rowCount} rows returned`,
      });
    }

    let xpAwarded = 0;
    let score = 0;
    let streakDays = 1;
    let level = 1;

    if (allPassed) {
      // Calculate speed & accuracy score
      const baseXP = challenge.xpReward || 100;
      const speedBonus = executionTimeMs < 100 ? 25 : executionTimeMs < 500 ? 10 : 0;
      xpAwarded = baseXP + speedBonus;
      score = 100;

      // Update user XP, level, and streak
      const user = await userPrismaRepository.findById(userId);
      if (user) {
        const newXP = user.xp + xpAwarded;
        const newLevel = Math.floor(newXP / 500) + 1;
        streakDays = user.streakDays + 1;
        level = newLevel;

        await userPrismaRepository.update(userId, {
          xp: newXP,
          level: newLevel,
          streakDays,
          lastActiveDate: new Date().toISOString(),
        });
      }
    }

    // Record the attempt in database
    await challengePrismaRepository.recordAttempt({
      userId,
      challengeId: challenge.id,
      submittedQuery: input.query,
      passed: allPassed,
      executionTimeMs,
      score,
    });

    return {
      passed: allPassed,
      score,
      xpAwarded,
      executionTimeMs,
      testResults,
      streakDays,
      level,
      feedback: allPassed
        ? `Challenge Solved! You earned +${xpAwarded} XP and advanced your daily streak to ${streakDays} days.`
        : 'Query results did not match the expected dataset output. Inspect the test case diff and try again.',
    };
  }

  async getLeaderboard(limit: number = 20) {
    return await challengePrismaRepository.getLeaderboard(limit);
  }

  // --- Helper Methods ---

  private compareDatasetResults(expected: any, actual: any[]): boolean {
    if (!Array.isArray(actual) || actual.length === 0) return false;

    // Case 1: expected is an array of rows
    if (Array.isArray(expected)) {
      if (expected.length !== actual.length) return false;
      for (let i = 0; i < expected.length; i++) {
        if (!this.matchesRow(expected[i], actual[i])) return false;
      }
      return true;
    }

    // Case 2: expected is a single row object (such as expectedFirstRow)
    if (typeof expected === 'object' && expected !== null) {
      return this.matchesRow(expected, actual[0]);
    }

    return false;
  }

  private matchesRow(expectedRow: Record<string, any>, actualRow: Record<string, any>): boolean {
    if (!expectedRow || !actualRow) return false;

    const expKeys = Object.keys(expectedRow);
    for (const key of expKeys) {
      const normKey = key.toLowerCase();
      const actMatchingKey = Object.keys(actualRow).find((k) => k.toLowerCase() === normKey);
      if (!actMatchingKey) return false;

      const expVal = expectedRow[key];
      const actVal = actualRow[actMatchingKey];

      if (typeof expVal === 'number' && typeof actVal === 'number') {
        if (Math.abs(expVal - actVal) > 0.01) return false;
      } else if (String(expVal).trim().toLowerCase() !== String(actVal).trim().toLowerCase()) {
        return false;
      }
    }

    return true;
  }
}

export const challengeService = new ChallengeService();
