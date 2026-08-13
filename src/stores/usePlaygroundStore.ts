import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SQLDialect, SQLExecutionResult } from '../types';

export interface EditorTab {
  id: string;
  title: string;
  sql: string;
  isUnsaved: boolean;
  dialect: SQLDialect;
  databaseId: string;
}

export interface SavedQuery {
  id: string;
  title: string;
  sql: string;
  dialect: SQLDialect;
  databaseId: string;
  collectionName?: string;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sqlSnippet?: string;
  executionPlanSnippet?: string;
  suggestedAction?: string;
  timestamp: string;
}

interface PlaygroundState {
  tabs: EditorTab[];
  activeTabId: string;
  savedQueries: SavedQuery[];
  collections: string[];
  
  // Editor Config
  fontSize: number;
  wordWrap: 'on' | 'off';
  minimapEnabled: boolean;
  zoomLevel: number; // 80 - 140
  
  // Mode & Panels
  activeExerciseId: string | null;
  exerciseTimerSeconds: number;
  isExerciseActive: boolean;
  sidebarCollapsed: boolean;
  aiPanelOpen: boolean;
  
  // AI Assistant Chat History
  aiChatHistory: AIChatMessage[];
  isAiThinking: boolean;

  // Execution History Profiler
  executionHistory: SQLExecutionResult[];
  addExecutionHistory: (result: SQLExecutionResult) => void;

  // Actions
  setActiveTabId: (id: string) => void;
  updateTabContent: (tabId: string, sql: string) => void;
  createNewTab: (title?: string, initialSql?: string, databaseId?: string) => void;
  closeTab: (tabId: string) => void;
  setTabDialect: (tabId: string, dialect: SQLDialect) => void;
  setTabDatabase: (tabId: string, databaseId: string) => void;
  
  // Saved Queries & Collections
  saveCurrentQuery: (title: string, collectionName?: string) => void;
  toggleFavoriteQuery: (id: string) => void;
  togglePinQuery: (id: string) => void;
  deleteSavedQuery: (id: string) => void;
  
  // Editor Settings
  setFontSize: (size: number) => void;
  toggleWordWrap: () => void;
  toggleMinimap: () => void;
  setZoomLevel: (zoom: number) => void;
  
  // Sidebar & AI Panel
  toggleSidebar: () => void;
  setAiPanelOpen: (open: boolean) => void;
  
  // Exercise Mode
  startExercise: (exerciseId: string) => void;
  stopExercise: () => void;
  
  // AI Chat
  addAiMessage: (message: Omit<AIChatMessage, 'id' | 'timestamp'>) => void;
  setAiThinking: (thinking: boolean) => void;
  clearAiChat: () => void;
}

const DEFAULT_TABS: EditorTab[] = [
  {
    id: 'tab_default_1',
    title: 'revenue_window.sql',
    sql: `-- 7-Day Revenue Moving Average Window Function
SELECT 
  c.country,
  o.created_at::DATE AS order_date,
  o.total_amount,
  SUM(o.total_amount) OVER (PARTITION BY c.country ORDER BY o.created_at) AS cumulative_country_revenue,
  ROUND(AVG(o.total_amount) OVER (
    PARTITION BY c.country 
    ORDER BY o.created_at 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ), 2) AS moving_7day_avg
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'completed'
ORDER BY c.country, o.created_at DESC;`,
    isUnsaved: false,
    dialect: 'PostgreSQL',
    databaseId: 'ecommerce_prod',
  },
  {
    id: 'tab_default_2',
    title: 'org_recursive.sql',
    sql: `-- Recursive Org Structure Traversal
WITH RECURSIVE OrgTree AS (
  SELECT id, name, role, manager_id, 1 AS depth
  FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.role, e.manager_id, ot.depth + 1
  FROM employees e JOIN OrgTree ot ON e.manager_id = ot.id
)
SELECT * FROM OrgTree ORDER BY depth, id;`,
    isUnsaved: false,
    dialect: 'PostgreSQL',
    databaseId: 'employees_corp',
  },
];

const DEFAULT_SAVED_QUERIES: SavedQuery[] = [
  {
    id: 'sq_01',
    title: 'Top Customer Retention Cohorts',
    sql: 'SELECT c.tier, COUNT(o.id) FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY 1;',
    dialect: 'PostgreSQL',
    databaseId: 'ecommerce_prod',
    collectionName: 'Analytics',
    isFavorite: true,
    isPinned: true,
    createdAt: '2026-08-10',
  },
  {
    id: 'sq_02',
    title: 'Department Salary Ceiling Audit',
    sql: 'SELECT d.name, MAX(e.salary) FROM departments d JOIN employees e ON d.id = e.dept_id GROUP BY 1;',
    dialect: 'PostgreSQL',
    databaseId: 'employees_corp',
    collectionName: 'HR Audits',
    isFavorite: true,
    isPinned: false,
    createdAt: '2026-08-11',
  },
];

export const usePlaygroundStore = create<PlaygroundState>()(
  persist(
    (set, get) => ({
      tabs: DEFAULT_TABS,
      activeTabId: 'tab_default_1',
      savedQueries: DEFAULT_SAVED_QUERIES,
      collections: ['Analytics', 'HR Audits', 'Performance Tuning'],
      
      fontSize: 14,
      wordWrap: 'on',
      minimapEnabled: false,
      zoomLevel: 100,
      
      activeExerciseId: null,
      exerciseTimerSeconds: 0,
      isExerciseActive: false,
      sidebarCollapsed: false,
      aiPanelOpen: true,
      
      aiChatHistory: [
        {
          id: 'msg_welcome',
          sender: 'ai',
          text: "Hello! I'm your AI SQL Mentor powered by Gemini 2.5. Highlight any query in your editor or run an EXPLAIN plan to get real-time performance advice!",
          timestamp: 'Just now',
        },
      ],
      isAiThinking: false,

      executionHistory: [],
      addExecutionHistory: (result) =>
        set((state) => ({
          executionHistory: [result, ...state.executionHistory].slice(0, 50),
        })),

      setActiveTabId: (id) => set({ activeTabId: id }),

      updateTabContent: (tabId, sql) =>
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === tabId ? { ...tab, sql, isUnsaved: true } : tab
          ),
        })),

      createNewTab: (title, initialSql, databaseId) => {
        const newId = `tab_${Date.now()}`;
        const newTitle = title || `query_${get().tabs.length + 1}.sql`;
        const newTab: EditorTab = {
          id: newId,
          title: newTitle,
          sql: initialSql || `-- New SQL Workbench File\nSELECT * FROM customers LIMIT 10;\n`,
          isUnsaved: false,
          dialect: 'PostgreSQL',
          databaseId: databaseId || 'ecommerce_prod',
        };
        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: newId,
        }));
      },

      closeTab: (tabId) => {
        const state = get();
        if (state.tabs.length === 1) return; // Don't close last remaining tab
        const newTabs = state.tabs.filter((t) => t.id !== tabId);
        const newActiveId =
          state.activeTabId === tabId ? newTabs[newTabs.length - 1].id : state.activeTabId;
        set({ tabs: newTabs, activeTabId: newActiveId });
      },

      setTabDialect: (tabId, dialect) =>
        set((state) => ({
          tabs: state.tabs.map((tab) => (tab.id === tabId ? { ...tab, dialect } : tab)),
        })),

      setTabDatabase: (tabId, databaseId) =>
        set((state) => ({
          tabs: state.tabs.map((tab) => (tab.id === tabId ? { ...tab, databaseId } : tab)),
        })),

      saveCurrentQuery: (title, collectionName) => {
        const state = get();
        const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
        if (!activeTab) return;

        const newSaved: SavedQuery = {
          id: `sq_${Date.now()}`,
          title: title || activeTab.title.replace('.sql', ''),
          sql: activeTab.sql,
          dialect: activeTab.dialect,
          databaseId: activeTab.databaseId,
          collectionName: collectionName || 'Uncategorized',
          isFavorite: false,
          isPinned: false,
          createdAt: new Date().toISOString().slice(0, 10),
        };

        set((s) => ({
          savedQueries: [newSaved, ...s.savedQueries],
          tabs: s.tabs.map((t) => (t.id === activeTab.id ? { ...t, isUnsaved: false } : t)),
        }));
      },

      toggleFavoriteQuery: (id) =>
        set((state) => ({
          savedQueries: state.savedQueries.map((sq) =>
            sq.id === id ? { ...sq, isFavorite: !sq.isFavorite } : sq
          ),
        })),

      togglePinQuery: (id) =>
        set((state) => ({
          savedQueries: state.savedQueries.map((sq) =>
            sq.id === id ? { ...sq, isPinned: !sq.isPinned } : sq
          ),
        })),

      deleteSavedQuery: (id) =>
        set((state) => ({
          savedQueries: state.savedQueries.filter((sq) => sq.id !== id),
        })),

      setFontSize: (size) => set({ fontSize: Math.max(10, Math.min(24, size)) }),
      toggleWordWrap: () => set((s) => ({ wordWrap: s.wordWrap === 'on' ? 'off' : 'on' })),
      toggleMinimap: () => set((s) => ({ minimapEnabled: !s.minimapEnabled })),
      setZoomLevel: (zoom) => set({ zoomLevel: Math.max(80, Math.min(140, zoom)) }),

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setAiPanelOpen: (open) => set({ aiPanelOpen: open }),

      startExercise: (exerciseId) =>
        set({
          activeExerciseId: exerciseId,
          isExerciseActive: true,
          exerciseTimerSeconds: 0,
        }),

      stopExercise: () =>
        set({
          activeExerciseId: null,
          isExerciseActive: false,
          exerciseTimerSeconds: 0,
        }),

      addAiMessage: (msg) =>
        set((state) => ({
          aiChatHistory: [
            ...state.aiChatHistory,
            { ...msg, id: `msg_${Date.now()}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ],
        })),

      setAiThinking: (thinking) => set({ isAiThinking: thinking }),
      clearAiChat: () => set({ aiChatHistory: [] }),
    }),
    {
      name: 'mobilesql-playground-store',
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        savedQueries: state.savedQueries,
        fontSize: state.fontSize,
        wordWrap: state.wordWrap,
        minimapEnabled: state.minimapEnabled,
      }),
    }
  )
);
