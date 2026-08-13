import db from '../client';
import { handleDatabaseError } from '../dbErrors';
import { ACADEMY_CURRICULUM } from '../../../data/academyCurriculumData';

export class AcademyPrismaRepository {
  // --- TRACKS & CURRICULUM ---
  async getTracks() {
    try {
      const tracks = await db.academyTrack.findMany({
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
      if (tracks && tracks.length > 0) return tracks;
    } catch {
      // Fallback
    }

    return ACADEMY_CURRICULUM.map((t, idx) => ({
      id: t.id,
      slug: t.id,
      title: t.title,
      description: t.description,
      difficulty: 'FUNDAMENTALS' as any,
      orderIndex: idx,
      isPublished: true,
      modules: t.modules.map((m, mIdx) => ({
        id: m.id,
        slug: m.id,
        title: m.title,
        description: m.description,
        orderIndex: mIdx,
        lessons: m.lessons.map((l, lIdx) => ({
          id: l.id,
          slug: l.id,
          title: l.title,
          description: l.summary,
          estimatedMin: l.durationMinutes,
          xpReward: l.xpReward,
          orderIndex: lIdx,
        })),
      })),
    }));
  }

  async getTrackBySlug(slug: string) {
    try {
      const track = await db.academyTrack.findUnique({
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
      if (track) return track;
    } catch {
      // Fallback
    }

    const found = ACADEMY_CURRICULUM.find((t) => t.id === slug);
    if (!found) return null;

    return {
      id: found.id,
      slug: found.id,
      title: found.title,
      description: found.description,
      difficulty: 'FUNDAMENTALS' as any,
      modules: found.modules.map((m, mIdx) => ({
        id: m.id,
        slug: m.id,
        title: m.title,
        description: m.description,
        orderIndex: mIdx,
        lessons: m.lessons.map((l, lIdx) => ({
          id: l.id,
          slug: l.id,
          title: l.title,
          description: l.summary,
          contentMarkdown: l.readingMarkdown,
          initialSql: l.initialSql,
          solutionSql: l.expectedQuery,
          estimatedMin: l.durationMinutes,
          xpReward: l.xpReward,
          orderIndex: lIdx,
        })),
      })),
    };
  }

  // --- LESSONS & PROGRESS ---
  async getLessonBySlug(trackSlug: string, moduleSlug: string, lessonSlug: string) {
    try {
      const track = await db.academyTrack.findUnique({ where: { slug: trackSlug } });
      if (track) {
        const mod = await db.academyModule.findFirst({
          where: { trackId: track.id, slug: moduleSlug },
        });
        if (mod) {
          const lesson = await db.academyLesson.findFirst({
            where: { moduleId: mod.id, slug: lessonSlug },
            include: {
              quizQuestions: {
                include: { attempts: true },
              },
            },
          });
          if (lesson) return lesson;
        }
      }
    } catch {
      // Fallback
    }

    for (const track of ACADEMY_CURRICULUM) {
      for (const mod of track.modules) {
        for (const les of mod.lessons) {
          if (les.id === lessonSlug) {
            return {
              id: les.id,
              slug: les.id,
              title: les.title,
              description: les.summary,
              contentMarkdown: les.readingMarkdown,
              initialSql: les.initialSql,
              solutionSql: les.expectedQuery,
              estimatedMin: les.durationMinutes,
              xpReward: les.xpReward,
              quizQuestions: les.quiz
                ? [
                    {
                      id: les.quiz.id,
                      questionText: les.quiz.question,
                      explanation: les.quiz.options.find((o) => o.isCorrect)?.explanation || '',
                      optionsJson: les.quiz.options.map((opt) => opt.text),
                      correctIndex: Math.max(0, les.quiz.options.findIndex((o) => o.isCorrect)),
                      orderIndex: 0,
                    },
                  ]
                : [],
            };
          }
        }
      }
    }
    return null;
  }

  async markLessonComplete(data: {
    userId: string;
    lessonId: string;
    submittedCode?: string;
    timeSpentSeconds?: number;
  }) {
    try {
      return await db.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: data.userId,
            lessonId: data.lessonId,
          },
        },
        update: {
          completed: true,
          completedAt: new Date(),
        },
        create: {
          userId: data.userId,
          lessonId: data.lessonId,
          completed: true,
          completedAt: new Date(),
        },
      });
    } catch {
      return {
        id: `prog_${Date.now()}`,
        userId: data.userId,
        lessonId: data.lessonId,
        completed: true,
        completedAt: new Date(),
      };
    }
  }

  async getUserProgress(userId: string) {
    try {
      return await db.lessonProgress.findMany({
        where: { userId },
      });
    } catch {
      return [];
    }
  }
}

export const academyPrismaRepository = new AcademyPrismaRepository();
