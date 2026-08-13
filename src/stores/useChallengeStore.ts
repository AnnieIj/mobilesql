import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SQL_CHALLENGES } from '../data/challengesData';
import type { SQLChallenge } from '../data/challengesData';
import { executePlaygroundQuery } from '../services/sqlExecutionEngine';
import { apiClient } from '../services/apiClient';

export interface TestCaseResult {
  testCaseId: string;
  name: string;
  passed: boolean;
  message: string;
}

interface ChallengeState {
  // Navigation & Filters
  activeChallengeId: string | null;
  searchQuery: string;
  selectedCategory: string;
  selectedDifficulty: string;
  selectedCompany: string;

  // Editor & Submission
  activeCode: string;
  isExecuting: boolean;
  testResults: TestCaseResult[];
  allPassed: boolean;
  submissionFeedback: string | null;

  // User Stats & Persistence
  solvedChallengeIds: string[];
  totalPoints: number;
  streakDays: number;

  // Actions
  setActiveChallengeId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedDifficulty: (diff: string) => void;
  setSelectedCompany: (company: string) => void;
  updateCode: (code: string) => void;

  runChallengeCode: (challenge: SQLChallenge) => Promise<void>;
  resetChallenge: (challenge: SQLChallenge) => void;
}

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set, get) => ({
      activeChallengeId: null,
      searchQuery: '',
      selectedCategory: 'All',
      selectedDifficulty: 'All',
      selectedCompany: 'All',

      activeCode: '',
      isExecuting: false,
      testResults: [],
      allPassed: false,
      submissionFeedback: null,

      solvedChallengeIds: [],
      totalPoints: 270,
      streakDays: 5,

      setActiveChallengeId: (id) => {
        const challenge = SQL_CHALLENGES.find((c) => c.id === id);
        set({
          activeChallengeId: id,
          activeCode: challenge ? challenge.initialSql : '',
          testResults: [],
          allPassed: false,
          submissionFeedback: null,
        });
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setSelectedDifficulty: (diff) => set({ selectedDifficulty: diff }),
      setSelectedCompany: (company) => set({ selectedCompany: company }),

      updateCode: (code) => set({ activeCode: code }),

      runChallengeCode: async (challenge) => {
        set({ isExecuting: true, submissionFeedback: null });
        const { activeCode } = get();
        const codeToRun = activeCode || challenge.initialSql;

        // 1. Attempt server-side challenge evaluation
        try {
          const res = await apiClient.challenges.submitAttempt(challenge.id, {
            query: codeToRun,
            dialect: 'PostgreSQL',
          });

          if (res) {
            const mappedTestResults: TestCaseResult[] = (res.testResults || []).map((tr: any) => ({
              testCaseId: tr.testCaseId,
              name: tr.description || 'Test Assertion',
              passed: tr.passed,
              message: tr.diffMessage || (tr.passed ? 'Test assertion passed.' : 'Result mismatch.'),
            }));

            set({
              isExecuting: false,
              testResults: mappedTestResults,
              allPassed: res.passed,
              submissionFeedback: res.feedback,
              streakDays: res.streakDays || get().streakDays,
            });

            if (res.passed) {
              const { solvedChallengeIds, totalPoints } = get();
              if (!solvedChallengeIds.includes(challenge.id)) {
                set({
                  solvedChallengeIds: [...solvedChallengeIds, challenge.id],
                  totalPoints: totalPoints + (res.xpAwarded || challenge.pointsReward),
                });
              }
            }
            return;
          }
        } catch {
          // Fallback to local sandbox engine
        }

        // 2. Client-side evaluation fallback
        const { result } = await executePlaygroundQuery(
          codeToRun,
          challenge.databaseId,
          'PostgreSQL'
        );

        const testResults: TestCaseResult[] = [];
        let passedAll = false;

        if (result.error) {
          testResults.push({
            testCaseId: 'err_1',
            name: 'SQL Syntax Execution',
            passed: false,
            message: `Syntax Error: ${result.error}`,
          });
        } else {
          const hasRows = result.rowCount > 0;
          testResults.push({
            testCaseId: 'tc_rows',
            name: 'Non-Empty Output Dataset',
            passed: hasRows,
            message: hasRows ? `Returned ${result.rowCount} rows.` : 'Query returned 0 rows.',
          });
          passedAll = hasRows && !result.error;
        }

        set({
          isExecuting: false,
          testResults,
          allPassed: passedAll,
          submissionFeedback: passedAll ? 'Challenge completed successfully!' : 'Check your query syntax and constraints.',
        });

        if (passedAll) {
          const { solvedChallengeIds, totalPoints } = get();
          if (!solvedChallengeIds.includes(challenge.id)) {
            set({
              solvedChallengeIds: [...solvedChallengeIds, challenge.id],
              totalPoints: totalPoints + challenge.pointsReward,
            });
          }
        }
      },

      resetChallenge: (challenge) => {
        set({
          activeCode: challenge.initialSql,
          testResults: [],
          allPassed: false,
          submissionFeedback: null,
        });
      },
    }),
    {
      name: 'mobilesql_challenge_store',
      partialize: (state) => ({
        solvedChallengeIds: state.solvedChallengeIds,
        totalPoints: state.totalPoints,
        streakDays: state.streakDays,
      }),
    }
  )
);
