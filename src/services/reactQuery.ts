import { QueryClient } from '@tanstack/react-query';

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
