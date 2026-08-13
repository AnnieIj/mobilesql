import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  markLessonComplete: (lessonId: string, xpReward: number) => void;
  
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

      markLessonComplete: (lessonId, xpReward) => {
        const { completedLessonIds, totalXp, lessonProgressMap } = get();
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
        set({
          activeQuizAnswer: answerId,
          quizSubmitted: true,
          quizIsCorrect: isCorrect,
        });
        if (isCorrect) {
          set((state) => ({ totalXp: state.totalXp + 20 }));
        }
      },

      resetQuizState: () =>
        set({
          activeQuizAnswer: null,
          quizSubmitted: false,
          quizIsCorrect: false,
        }),

      sendAiChatMessage: async (userMessageText) => {
        if (!userMessageText.trim()) return;

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
          const res = await fetch('/api/ai/copilot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: userMessageText,
              contextSql: get().activeLessonCode,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const aiMsg: AiChatMessage = {
              id: `ai_${Date.now()}`,
              sender: 'assistant',
              text: data.response || 'Here is an explanation of the concept based on your query.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            set((state) => ({
              aiChatMessages: [...state.aiChatMessages, aiMsg],
              isAiThinking: false,
            }));
          } else {
            throw new Error('API request failed');
          }
        } catch {
          // Fallback response if offline or mock
          const fallbackMsg: AiChatMessage = {
            id: `ai_${Date.now()}`,
            sender: 'assistant',
            text: `In SQL, this statement operates on the selected database table. Keep in mind:
1. Double-check your column names in the schema panel.
2. Verify table aliases when using JOINs.
3. Use WHERE before GROUP BY for row-level filtering!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          set((state) => ({
            aiChatMessages: [...state.aiChatMessages, fallbackMsg],
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
              text: 'Conversation cleared. How else can I assist with this SQL lesson?',
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
        bookmarkedLessonIds: state.bookmarkedLessonIds,
        totalXp: state.totalXp,
        streakDays: state.streakDays,
        unlockedCertificates: state.unlockedCertificates,
      }),
    }
  )
);
