import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SQLExecutionResult, SQLDialect } from '../types';

interface SQLEngineState {
  activeQuery: string;
  activeDialect: SQLDialect;
  selectedDatasetId: string;
  isExecuting: boolean;
  latestResult: SQLExecutionResult | null;
  history: SQLExecutionResult[];
  setActiveQuery: (query: string) => void;
  setDialect: (dialect: SQLDialect) => void;
  setSelectedDatasetId: (id: string) => void;
  setExecuting: (executing: boolean) => void;
  setResult: (result: SQLExecutionResult) => void;
  clearHistory: () => void;
}

const DEFAULT_SQL_QUERY = `-- Complex Revenue Analysis Query
WITH MonthlyRevenue AS (
  SELECT 
    DATE_TRUNC('month', o.created_at) AS month,
    c.region_id,
    SUM(o.total_amount) AS revenue
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE o.status = 'completed'
  GROUP BY 1, 2
)
SELECT 
  mr.month,
  r.name AS region_name,
  mr.revenue,
  LAG(mr.revenue) OVER (PARTITION BY mr.region_id ORDER BY mr.month) AS prev_month_revenue
FROM MonthlyRevenue mr
JOIN regions r ON mr.region_id = r.id
ORDER BY mr.month DESC, mr.revenue DESC;`;

export const useSQLEngineStore = create<SQLEngineState>()(
  persist(
    (set) => ({
      activeQuery: DEFAULT_SQL_QUERY,
      activeDialect: 'PostgreSQL',
      selectedDatasetId: 'ecommerce_prod',
      isExecuting: false,
      latestResult: null,
      history: [],

      setActiveQuery: (query) => set({ activeQuery: query }),
      setDialect: (dialect) => set({ activeDialect: dialect }),
      setSelectedDatasetId: (id) => set({ selectedDatasetId: id }),
      setExecuting: (isExecuting) => set({ isExecuting }),

      setResult: (result) =>
        set((state) => ({
          latestResult: result,
          history: [result, ...state.history.slice(0, 49)], // Keep last 50 queries
          isExecuting: false,
        })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'mobilesql-engine-store',
      partialize: (state) => ({
        activeQuery: state.activeQuery,
        activeDialect: state.activeDialect,
        selectedDatasetId: state.selectedDatasetId,
      }),
    }
  )
);
