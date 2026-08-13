import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MockInterviewResult {
  id: string;
  roleId: string;
  roleTitle: string;
  completedAtIso: string;
  scorePercent: number;
  timeSpentMins: number;
  passed: boolean;
}

interface CareerState {
  targetRole: string;
  targetCompany: string;
  jobReadinessScore: number;
  atsResumeScore: number;
  completedMockInterviews: MockInterviewResult[];
  savedCoverLetter: string | null;
  activeMockRoleId: string | null;
  activeCompanyPrepId: string | null;

  // Actions
  setTargetRole: (role: string) => void;
  setTargetCompany: (comp: string) => void;
  setAtsResumeScore: (score: number) => void;
  recordMockInterview: (result: MockInterviewResult) => void;
  setSavedCoverLetter: (letter: string | null) => void;
  setActiveMockRoleId: (roleId: string | null) => void;
  setActiveCompanyPrepId: (compPrepId: string | null) => void;
  recalculateJobReadiness: () => number;
}

export const useCareerStore = create<CareerState>()(
  persist(
    (set, get) => ({
      targetRole: 'Senior Analytics Engineer',
      targetCompany: 'Google',
      jobReadinessScore: 82,
      atsResumeScore: 88,
      completedMockInterviews: [],
      savedCoverLetter: null,
      activeMockRoleId: null,
      activeCompanyPrepId: null,

      setTargetRole: (role) => set({ targetRole: role }),
      setTargetCompany: (comp) => set({ targetCompany: comp }),
      setAtsResumeScore: (score) => set({ atsResumeScore: score }),
      setSavedCoverLetter: (letter) => set({ savedCoverLetter: letter }),
      setActiveMockRoleId: (roleId) => set({ activeMockRoleId: roleId }),
      setActiveCompanyPrepId: (compPrepId) => set({ activeCompanyPrepId: compPrepId }),

      recordMockInterview: (result) => {
        const { completedMockInterviews } = get();
        const updated = [result, ...completedMockInterviews];
        set({ completedMockInterviews: updated });
        get().recalculateJobReadiness();
      },

      recalculateJobReadiness: () => {
        const { atsResumeScore, completedMockInterviews } = get();
        const base = 70;
        const mockBonus = Math.min(20, completedMockInterviews.length * 5);
        const atsBonus = Math.round(atsResumeScore * 0.1);
        const total = Math.min(99, base + mockBonus + atsBonus);
        set({ jobReadinessScore: total });
        return total;
      },
    }),
    {
      name: 'mobilesql_career_store',
      partialize: (state) => ({
        targetRole: state.targetRole,
        targetCompany: state.targetCompany,
        jobReadinessScore: state.jobReadinessScore,
        atsResumeScore: state.atsResumeScore,
        completedMockInterviews: state.completedMockInterviews,
        savedCoverLetter: state.savedCoverLetter,
      }),
    }
  )
);
