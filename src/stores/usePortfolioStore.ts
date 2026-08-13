import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ENTERPRISE_PROJECTS } from '../data/portfolioProjectsData';
import type { EnterpriseProject } from '../data/portfolioProjectsData';

export interface UnlockedCertificate {
  projectId: string;
  certificateTitle: string;
  companyName: string;
  unlockedAtIso: string;
  verificationHash: string;
}

interface PortfolioState {
  activeProjectId: string | null;
  activeTab: 'scenario' | 'erd' | 'tables' | 'query' | 'objectives';
  completedProjectIds: string[];
  completedObjectiveIds: string[];
  unlockedCertificates: UnlockedCertificate[];
  recruiterViewMode: boolean;
  searchQuery: string;
  selectedIndustry: string;

  // Actions
  setActiveProjectId: (id: string | null) => void;
  setActiveTab: (tab: 'scenario' | 'erd' | 'tables' | 'query' | 'objectives') => void;
  setRecruiterViewMode: (enabled: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedIndustry: (industry: string) => void;

  completeObjective: (projectId: string, objectiveId: string, xpReward: number) => void;
  calculateEmployabilityScore: () => number;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      activeProjectId: null,
      activeTab: 'scenario',
      completedProjectIds: [],
      completedObjectiveIds: [],
      unlockedCertificates: [],
      recruiterViewMode: false,
      searchQuery: '',
      selectedIndustry: 'All',

      setActiveProjectId: (id) => set({ activeProjectId: id, activeTab: 'scenario' }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setRecruiterViewMode: (enabled) => set({ recruiterViewMode: enabled }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedIndustry: (industry) => set({ selectedIndustry: industry }),

      completeObjective: (projectId, objectiveId, xpReward) => {
        const { completedObjectiveIds, completedProjectIds, unlockedCertificates } = get();

        if (completedObjectiveIds.includes(objectiveId)) return;

        const updatedObjectives = [...completedObjectiveIds, objectiveId];
        const project = ENTERPRISE_PROJECTS.find((p) => p.id === projectId);

        let updatedProjects = [...completedProjectIds];
        let updatedCertificates = [...unlockedCertificates];

        if (project) {
          const allProjectObjsCompleted = project.objectives.every((obj) =>
            updatedObjectives.includes(obj.id)
          );

          if (allProjectObjsCompleted && !completedProjectIds.includes(projectId)) {
            updatedProjects.push(projectId);
            updatedCertificates.push({
              projectId,
              certificateTitle: project.certificateTitle,
              companyName: project.companyName,
              unlockedAtIso: new Date().toISOString(),
              verificationHash: `MSQL-CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            });
          }
        }

        set({
          completedObjectiveIds: updatedObjectives,
          completedProjectIds: updatedProjects,
          unlockedCertificates: updatedCertificates,
        });
      },

      calculateEmployabilityScore: () => {
        const { completedProjectIds, unlockedCertificates } = get();
        const baseScore = 65; // Base starting profile strength
        const projectAdd = completedProjectIds.length * 15;
        const certAdd = unlockedCertificates.length * 10;
        return Math.min(99, baseScore + projectAdd + certAdd);
      },
    }),
    {
      name: 'mobilesql_portfolio_store',
      partialize: (state) => ({
        completedProjectIds: state.completedProjectIds,
        completedObjectiveIds: state.completedObjectiveIds,
        unlockedCertificates: state.unlockedCertificates,
      }),
    }
  )
);
