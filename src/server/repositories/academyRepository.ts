import { db } from '../database/db';
import { LessonProgress } from '../types';

export class AcademyRepository {
  async getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | null> {
    const key = `${userId}:${lessonId}`;
    return db.lessonProgress.get(key) || null;
  }

  async getAllUserProgress(userId: string): Promise<LessonProgress[]> {
    const results: LessonProgress[] = [];
    for (const prog of db.lessonProgress.values()) {
      if (prog.userId === userId) {
        results.push(prog);
      }
    }
    return results;
  }

  async saveLessonProgress(progress: Omit<LessonProgress, 'id'>): Promise<LessonProgress> {
    const key = `${progress.userId}:${progress.lessonId}`;
    const id = `prog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const entity: LessonProgress = {
      ...progress,
      id,
    };

    db.lessonProgress.set(key, entity);
    return entity;
  }
}

export const academyRepository = new AcademyRepository();
