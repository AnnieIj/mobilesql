import db from '../client';
import { handleDatabaseError } from '../dbErrors';

export class AcademyPrismaRepository {
  // --- TRACKS & CURRICULUM ---
  async getTracks() {
    try {
      return await db.academyTrack.findMany({
        where: { isPublished: true },
        orderBy: { orderIndex: 'asc' },
        include: {
          modules: {
            orderBy: { orderIndex: 'asc' },
            include: {
              lessons: {
                orderBy: { orderIndex: 'asc' },
                select: {
                  id: true,
                  slug: true,
                  title: true,
                  description: true,
                  estimatedMin: true,
                  xpReward: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'AcademyTrack');
    }
  }

  async getTrackBySlug(slug: string) {
    try {
      return await db.academyTrack.findUnique({
        where: { slug },
        include: {
          modules: {
            orderBy: { orderIndex: 'asc' },
            include: {
              lessons: {
                orderBy: { orderIndex: 'asc' },
              },
            },
          },
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'AcademyTrack');
    }
  }

  // --- LESSONS & PROGRESS ---
  async getLessonBySlug(trackSlug: string, moduleSlug: string, lessonSlug: string) {
    try {
      const track = await db.academyTrack.findUnique({ where: { slug: trackSlug } });
      if (!track) return null;

      const moduleItem = await db.academyModule.findFirst({
        where: { trackId: track.id, slug: moduleSlug },
      });
      if (!moduleItem) return null;

      return await db.academyLesson.findFirst({
        where: { moduleId: moduleItem.id, slug: lessonSlug },
        include: {
          quizQuestions: true,
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'AcademyLesson');
    }
  }

  async getUserProgress(userId: string) {
    try {
      return await db.lessonProgress.findMany({
        where: { userId },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'LessonProgress');
    }
  }

  async markLessonCompleted(userId: string, lessonId: string, score: number = 100) {
    try {
      return await db.lessonProgress.upsert({
        where: {
          userId_lessonId: { userId, lessonId },
        },
        update: {
          completed: true,
          score,
          completedAt: new Date(),
        },
        create: {
          userId,
          lessonId,
          completed: true,
          score,
          completedAt: new Date(),
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'LessonProgress');
    }
  }

  // --- QUIZ ATTEMPTS ---
  async recordQuizAttempt(userId: string, questionId: string, selectedOption: number, isCorrect: boolean) {
    try {
      return await db.quizAttempt.create({
        data: {
          userId,
          questionId,
          selectedOption,
          isCorrect,
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'QuizAttempt');
    }
  }

  // --- LESSON NOTES ---
  async saveLessonNote(userId: string, lessonId: string, noteText: string) {
    try {
      return await db.lessonNote.upsert({
        where: {
          userId_lessonId: { userId, lessonId },
        },
        update: { noteText },
        create: { userId, lessonId, noteText },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'LessonNote');
    }
  }

  // --- CERTIFICATES ---
  async createCertificate(userId: string, trackId: string, title: string, skillsVerified: string[]) {
    try {
      const credentialId = `MSQL-CERT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      return await db.certificate.create({
        data: {
          userId,
          trackId,
          title,
          credentialId,
          skillsVerified,
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'Certificate');
    }
  }

  async getUserCertificates(userId: string) {
    try {
      return await db.certificate.findMany({
        where: { userId },
        orderBy: { issuedAt: 'desc' },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'Certificate');
    }
  }
}

export const academyPrismaRepository = new AcademyPrismaRepository();
