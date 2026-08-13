import { academyRepository } from '../repositories/academyRepository';
import { userRepository } from '../repositories/userRepository';
import { LessonProgress } from '../types';

export class AcademyService {
  async getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | null> {
    return academyRepository.getLessonProgress(userId, lessonId);
  }

  async getAllUserProgress(userId: string): Promise<LessonProgress[]> {
    return academyRepository.getAllUserProgress(userId);
  }

  async markLessonCompleted(userId: string, lessonId: string, score: number = 100): Promise<LessonProgress> {
    const progress = await academyRepository.saveLessonProgress({
      userId,
      lessonId,
      completed: true,
      score,
      completedAt: new Date().toISOString(),
    });

    // Award XP to user profile
    const user = await userRepository.findById(userId);
    if (user) {
      await userRepository.update(userId, {
        xp: user.xp + 50,
        level: Math.floor((user.xp + 50) / 200) + 1,
      });
    }

    return progress;
  }
}

export const academyService = new AcademyService();
