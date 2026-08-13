import db from '../client';
import { handleDatabaseError } from '../dbErrors';
import { ChallengeDifficulty, SqlDialect } from '@prisma/client';

export class ChallengePrismaRepository {
  async getChallenges(difficulty?: string) {
    try {
      const difficultyMap: Record<string, ChallengeDifficulty> = {
        beginner: 'BEGINNER',
        intermediate: 'INTERMEDIATE',
        advanced: 'ADVANCED',
        guru: 'GURU',
      };

      return await db.challenge.findMany({
        where: difficulty ? { difficulty: difficultyMap[difficulty.toLowerCase()] } : undefined,
        include: {
          testCases: true,
          hints: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'Challenge');
    }
  }

  async getDailyChallenge() {
    try {
      return await db.challenge.findFirst({
        where: { isDaily: true },
        include: { testCases: true, hints: true },
        orderBy: { scheduledDate: 'desc' },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'Challenge');
    }
  }

  async getChallengeBySlug(slug: string) {
    try {
      return await db.challenge.findUnique({
        where: { slug },
        include: {
          testCases: true,
          hints: true,
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'Challenge');
    }
  }

  async recordAttempt(data: {
    userId: string;
    challengeId: string;
    submittedQuery: string;
    passed: boolean;
    executionTimeMs: number;
    score: number;
  }) {
    try {
      return await db.challengeAttempt.create({
        data: {
          userId: data.userId,
          challengeId: data.challengeId,
          submittedQuery: data.submittedQuery,
          passed: data.passed,
          executionTimeMs: data.executionTimeMs,
          score: data.score,
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'ChallengeAttempt');
    }
  }

  async getLeaderboard(limit: number = 20) {
    try {
      return await db.user.findMany({
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          avatarUrl: true,
          xp: true,
          level: true,
          streakDays: true,
        },
        orderBy: { xp: 'desc' },
        take: limit,
      });
    } catch (error) {
      throw handleDatabaseError(error, 'Leaderboard');
    }
  }
}

export const challengePrismaRepository = new ChallengePrismaRepository();
