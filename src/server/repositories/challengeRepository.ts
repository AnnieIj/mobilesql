import { db } from '../database/db';
import { ChallengeSubmission } from '../types';

export class ChallengeRepository {
  async getSubmissionsByUser(userId: string): Promise<ChallengeSubmission[]> {
    const list: ChallengeSubmission[] = [];
    for (const sub of db.challengeSubmissions.values()) {
      if (sub.userId === userId) {
        list.push(sub);
      }
    }
    return list;
  }

  async saveSubmission(submission: Omit<ChallengeSubmission, 'id' | 'submittedAt'>): Promise<ChallengeSubmission> {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const entity: ChallengeSubmission = {
      ...submission,
      id,
      submittedAt: new Date().toISOString(),
    };

    db.challengeSubmissions.set(id, entity);
    return entity;
  }
}

export const challengeRepository = new ChallengeRepository();
