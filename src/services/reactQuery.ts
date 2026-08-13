import { QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';
import { ExecuteSqlInput, ExplainSqlInput, FormatSqlInput, ValidateSqlInput, OptimizeSqlInput } from '../server/schemas/sql.schema';
import { SubmitChallengeInput } from '../server/schemas/challenge.schema';

/**
 * Singleton QueryClient configured for MobileSQL client-side query execution and caching.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,    // 30 minutes garbage collection
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// --- Query Keys Registry ---
export const queryKeys = {
  challenges: {
    all: ['challenges'] as const,
    list: (difficulty?: string) => ['challenges', 'list', difficulty] as const,
    daily: ['challenges', 'daily'] as const,
    detail: (slug: string) => ['challenges', 'detail', slug] as const,
    leaderboard: ['challenges', 'leaderboard'] as const,
  },
  academy: {
    tracks: ['academy', 'tracks'] as const,
    track: (slug: string) => ['academy', 'track', slug] as const,
    lesson: (slug: string) => ['academy', 'lesson', slug] as const,
    certificates: ['academy', 'certificates'] as const,
  },
  playground: {
    savedQueries: ['playground', 'savedQueries'] as const,
    history: ['playground', 'history'] as const,
    templates: ['playground', 'templates'] as const,
    databases: ['playground', 'databases'] as const,
  },
  analytics: {
    dashboards: ['analytics', 'dashboards'] as const,
    dashboard: (id: string) => ['analytics', 'dashboard', id] as const,
  },
  datasets: {
    list: (category?: string) => ['datasets', 'list', category] as const,
    detail: (id: string) => ['datasets', 'detail', id] as const,
  },
  portfolio: {
    detail: (username?: string) => ['portfolio', username] as const,
    projects: ['portfolio', 'projects'] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
  },
};

// --- Custom Hooks for SQL Execution ---
export function useExecuteSql() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ExecuteSqlInput) => apiClient.sql.execute(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.playground.history });
    },
  });
}

export function useExplainSql() {
  return useMutation({
    mutationFn: (input: ExplainSqlInput) => apiClient.sql.explain(input),
  });
}

export function useFormatSql() {
  return useMutation({
    mutationFn: (input: FormatSqlInput) => apiClient.sql.format(input),
  });
}

export function useValidateSql() {
  return useMutation({
    mutationFn: (input: ValidateSqlInput) => apiClient.sql.validate(input),
  });
}

export function useOptimizeSql() {
  return useMutation({
    mutationFn: (input: OptimizeSqlInput) => apiClient.sql.optimize(input),
  });
}

// --- Custom Hooks for Challenges ---
export function useChallenges(difficulty?: string) {
  return useQuery({
    queryKey: queryKeys.challenges.list(difficulty),
    queryFn: () => apiClient.challenges.list(difficulty),
  });
}

export function useDailyChallenge() {
  return useQuery({
    queryKey: queryKeys.challenges.daily,
    queryFn: () => apiClient.challenges.getDaily(),
  });
}

export function useChallengeDetail(slug: string) {
  return useQuery({
    queryKey: queryKeys.challenges.detail(slug),
    queryFn: () => apiClient.challenges.getBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useSubmitChallengeAttempt(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitChallengeInput) => apiClient.challenges.submitAttempt(slug, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.challenges.all });
      qc.invalidateQueries({ queryKey: queryKeys.challenges.leaderboard });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: queryKeys.challenges.leaderboard,
    queryFn: () => apiClient.challenges.getLeaderboard(),
  });
}

// --- Custom Hooks for Academy ---
export function useAcademyTracks() {
  return useQuery({
    queryKey: queryKeys.academy.tracks,
    queryFn: () => apiClient.academy.getTracks(),
  });
}

export function useAcademyLesson(slug: string) {
  return useQuery({
    queryKey: queryKeys.academy.lesson(slug),
    queryFn: () => apiClient.academy.getLesson(slug),
    enabled: Boolean(slug),
  });
}

export function useCompleteLesson(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (query?: string) => apiClient.academy.completeLesson(slug, query),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.academy.tracks });
      qc.invalidateQueries({ queryKey: queryKeys.academy.certificates });
    },
  });
}

// --- Custom Hooks for Playground Saved Queries & History ---
export function useSavedQueries() {
  return useQuery({
    queryKey: queryKeys.playground.savedQueries,
    queryFn: () => apiClient.playground.getSavedQueries(),
  });
}

export function useSaveQueryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; query: string; dialect: string; tags?: string[] }) =>
      apiClient.playground.saveQuery(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.playground.savedQueries });
    },
  });
}

export function useQueryHistory() {
  return useQuery({
    queryKey: queryKeys.playground.history,
    queryFn: () => apiClient.playground.getHistory(),
  });
}

// --- Custom Hooks for Analytics ---
export function useDashboards() {
  return useQuery({
    queryKey: queryKeys.analytics.dashboards,
    queryFn: () => apiClient.analytics.getDashboards(),
  });
}

// --- Custom Hooks for Datasets ---
export function useDatasets(category?: string) {
  return useQuery({
    queryKey: queryKeys.datasets.list(category),
    queryFn: () => apiClient.datasets.list(category),
  });
}
