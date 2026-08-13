import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../services/apiClient';

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  completedAt?: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AcademyState {
  // Navigation & Filtering
  selectedTrackId: string;
  searchQuery: string;
  activeLessonId: string | null;
  bookmarkedLessonIds: string[];

  // Progress & Gamification
  completedLessonIds: string[];
  lessonProgressMap: Record<string, LessonProgress>;
  totalXp: number;
  streakDays: number;
  unlockedCertificates: string[];

  // Active Lesson Execution State
  activeLessonCode: string;
  isLessonPassed: boolean;
  activeQuizAnswer: string | null;
  quizSubmitted: boolean;
  quizIsCorrect: boolean;

  // AI Mentor Chat Messages
  aiChatMessages: AiChatMessage[];
  isAiThinking: boolean;

  // Actions
  setSelectedTrackId: (trackId: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveLessonId: (lessonId: string | null, initialCode?: string) => void;
  toggleBookmarkLesson: (lessonId: string) => void;

  updateLessonCode: (code: string) => void;
  markLessonComplete: (lessonId: string, xpReward: number) => Promise<void>;

  submitQuizAnswer: (answerId: string, isCorrect: boolean) => void;
  resetQuizState: () => void;

  sendAiChatMessage: (userMessageText: string) => Promise<void>;
  clearAiChat: () => void;
  awardXp: (xp: number) => void;
}

export const useAcademyStore = create<AcademyState>()(
  persist(
    (set, get) => ({
      selectedTrackId: 'track_foundations',
      searchQuery: '',
      activeLessonId: null,
      bookmarkedLessonIds: ['les_db_01'],

      completedLessonIds: [],
      lessonProgressMap: {},
      totalXp: 350,
      streakDays: 4,
      unlockedCertificates: [],

      activeLessonCode: '',
      isLessonPassed: false,
      activeQuizAnswer: null,
      quizSubmitted: false,
      quizIsCorrect: false,

      aiChatMessages: [
        {
          id: 'msg_welcome',
          sender: 'assistant',
          text: 'Hello! I am your AI SQL Mentor. Ask me any question about this lesson, or click "Explain Concept" for a simplified breakdown!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      isAiThinking: false,

      setSelectedTrackId: (trackId) => set({ selectedTrackId: trackId }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setActiveLessonId: (lessonId, initialCode = '') =>
        set({
          activeLessonId: lessonId,
          activeLessonCode: initialCode,
          isLessonPassed: false,
          activeQuizAnswer: null,
          quizSubmitted: false,
          quizIsCorrect: false,
        }),

      toggleBookmarkLesson: (lessonId) => {
        const { bookmarkedLessonIds } = get();
        const exists = bookmarkedLessonIds.includes(lessonId);
        set({
          bookmarkedLessonIds: exists
            ? bookmarkedLessonIds.filter((id) => id !== lessonId)
            : [...bookmarkedLessonIds, lessonId],
        });
      },

      updateLessonCode: (code) => set({ activeLessonCode: code }),

      markLessonComplete: async (lessonId, xpReward) => {
        const { completedLessonIds, totalXp, lessonProgressMap, activeLessonCode } = get();

        // 1. Sync completion with backend
        try {
          await apiClient.academy.completeLesson(lessonId, activeLessonCode);
        } catch {
          // Continue with optimistic client state
        }

        if (!completedLessonIds.includes(lessonId)) {
          set({
            completedLessonIds: [...completedLessonIds, lessonId],
            totalXp: totalXp + xpReward,
            isLessonPassed: true,
            lessonProgressMap: {
              ...lessonProgressMap,
              [lessonId]: {
                lessonId,
                completed: true,
                score: 100,
                completedAt: new Date().toISOString(),
              },
            },
          });
        }
      },

      submitQuizAnswer: (answerId, isCorrect) => {
        const { activeLessonId } = get();
        set({
          activeQuizAnswer: answerId,
          quizSubmitted: true,
          quizIsCorrect: isCorrect,
        });

        if (isCorrect && activeLessonId) {
          get().markLessonComplete(activeLessonId, 50);
        }
      },

      resetQuizState: () =>
        set({
          activeQuizAnswer: null,
          quizSubmitted: false,
          quizIsCorrect: false,
        }),

      sendAiChatMessage: async (userMessageText) => {
        const userMsg: AiChatMessage = {
          id: `usr_${Date.now()}`,
          sender: 'user',
          text: userMessageText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set((state) => ({
          aiChatMessages: [...state.aiChatMessages, userMsg],
          isAiThinking: true,
        }));

        try {
          // Request explanation from AI service
          const aiResponse = await apiClient.post<{ explanation: string }>('/copilot/explain', {
            query: userMessageText,
            dialect: 'PostgreSQL',
          });

          const replyText = aiResponse?.explanation || 'Here is the breakdown of the SQL concept you asked about.';

          const aiReply: AiChatMessage = {
            id: `ai_${Date.now()}`,
            sender: 'assistant',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          set((state) => ({
            aiChatMessages: [...state.aiChatMessages, aiReply],
            isAiThinking: false,
          }));
        } catch {
          const fallbackReply: AiChatMessage = {
            id: `ai_${Date.now()}`,
            sender: 'assistant',
            text: 'Great question! In SQL, statements are logically processed starting from FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          set((state) => ({
            aiChatMessages: [...state.aiChatMessages, fallbackReply],
            isAiThinking: false,
          }));
        }
      },

      clearAiChat: () =>
        set({
          aiChatMessages: [
            {
              id: 'msg_welcome',
              sender: 'assistant',
              text: 'AI Mentor Chat reset. Ask any SQL or schema modeling question to get started!',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
        }),

      awardXp: (xp) => set((state) => ({ totalXp: state.totalXp + xp })),
    }),
    {
      name: 'mobilesql_academy_store',
      partialize: (state) => ({
        completedLessonIds: state.completedLessonIds,
        lessonProgressMap: state.lessonProgressMap,
        totalXp: state.totalXp,
        streakDays: state.streakDays,
        bookmarkedLessonIds: state.bookmarkedLessonIds,
        unlockedCertificates: state.unlockedCertificates,
      }),
    }
  )
);
