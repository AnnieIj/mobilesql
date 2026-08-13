import { create } from 'zustand';
import { SQLExecutionResult, SQLDialect } from '../types';
import { ExecutionPlanResult } from '../types/dataset';
import { analyzeQueryPerformance } from '../services/performanceSimulatorService';

export interface SqlLabTab {
  id: string;
  title: string;
  query: string;
  dialect: SQLDialect;
  result: SQLExecutionResult | null;
  executionPlan: ExecutionPlanResult | null;
  inTransaction: boolean;
}

export interface AiAssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionableQuery?: string;
}

interface SqlLabState {
  activeTabId: string;
  tabs: SqlLabTab[];
  assistantMessages: AiAssistantMessage[];
  isAssistantOpen: boolean;

  // Actions
  setActiveTabId: (id: string) => void;
  updateTabQuery: (tabId: string, query: string) => void;
  createNewTab: (title?: string, initialQuery?: string) => void;
  closeTab: (tabId: string) => void;
  executeQuery: (tabId: string) => void;
  toggleTransaction: (tabId: string) => void;
  analyzeQuery: (tabId: string) => void;

  // Assistant Actions
  sendAssistantMessage: (text: string) => void;
  setAssistantOpen: (open: boolean) => void;
}

const DEFAULT_QUERY = `-- SQL Laboratory & Experimentation Playground
-- Safely test transactions, indexes, views, triggers, and procedures

BEGIN TRANSACTION;

-- 1. Create temporary indexing view
CREATE VIEW IF NOT EXISTS v_high_value_orders AS
SELECT 
    order_id, 
    customer_id, 
    total_amount, 
    order_date
FROM orders
WHERE total_amount > 500.00;

-- 2. Query with performance metrics
SELECT * FROM v_high_value_orders 
ORDER BY total_amount DESC 
LIMIT 10;

COMMIT;`;

export const useSqlLabStore = create<SqlLabState>((set, get) => ({
  activeTabId: 'tab_1',
  tabs: [
    {
      id: 'tab_1',
      title: 'Query Lab #1',
      query: DEFAULT_QUERY,
      dialect: 'PostgreSQL',
      result: null,
      executionPlan: null,
      inTransaction: false,
    },
  ],
  assistantMessages: [
    {
      id: 'msg_1',
      sender: 'assistant',
      text: 'Hello! I am your AI Schema & SQL Optimization Assistant. Ask me to explain schemas, suggest 3NF normalization, generate indexes, or detect data redundancy.',
      timestamp: 'Just now',
    },
  ],
  isAssistantOpen: true,

  setActiveTabId: (id) => set({ activeTabId: id }),

  updateTabQuery: (tabId, query) =>
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === tabId ? { ...t, query } : t)),
    })),

  createNewTab: (title = 'New Query Lab', initialQuery = 'SELECT * FROM orders LIMIT 25;') =>
    set((state) => {
      const newId = `tab_${Date.now()}`;
      const newTab: SqlLabTab = {
        id: newId,
        title,
        query: initialQuery,
        dialect: 'PostgreSQL',
        result: null,
        executionPlan: null,
        inTransaction: false,
      };
      return {
        tabs: [...state.tabs, newTab],
        activeTabId: newId,
      };
    }),

  closeTab: (tabId) =>
    set((state) => {
      if (state.tabs.length <= 1) return state;
      const filtered = state.tabs.filter((t) => t.id !== tabId);
      return {
        tabs: filtered,
        activeTabId: filtered[filtered.length - 1].id,
      };
    }),

  executeQuery: (tabId) =>
    set((state) => {
      const tab = state.tabs.find((t) => t.id === tabId);
      if (!tab) return state;

      const mockColumns = ['order_id', 'customer_id', 'order_date', 'total_amount', 'status'];
      const mockRows = [
        { order_id: 9001, customer_id: 'e1001-uuid', order_date: '2026-02-01 10:30:00', total_amount: 1549.49, status: 'Shipped' },
        { order_id: 9002, customer_id: 'e1002-uuid', order_date: '2026-02-02 14:12:00', total_amount: 849.50, status: 'Delivered' },
        { order_id: 9003, customer_id: 'e1003-uuid', order_date: '2026-02-03 16:45:00', total_amount: 1380.00, status: 'Processing' },
        { order_id: 9004, customer_id: 'e1004-uuid', order_date: '2026-02-04 11:20:00', total_amount: 620.00, status: 'Completed' },
      ];

      const execResult: SQLExecutionResult = {
        query: tab.query,
        columns: mockColumns,
        rows: mockRows,
        rowCount: mockRows.length,
        executionTimeMs: Number((Math.random() * 8 + 2).toFixed(2)),
        executedAt: new Date().toLocaleTimeString(),
        dialect: tab.dialect,
      };

      const plan = analyzeQueryPerformance(tab.query, ['idx_orders_customer_id']);

      return {
        tabs: state.tabs.map((t) =>
          t.id === tabId ? { ...t, result: execResult, executionPlan: plan } : t
        ),
      };
    }),

  toggleTransaction: (tabId) =>
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.id === tabId ? { ...t, inTransaction: !t.inTransaction } : t
      ),
    })),

  analyzeQuery: (tabId) =>
    set((state) => {
      const tab = state.tabs.find((t) => t.id === tabId);
      if (!tab) return state;
      const plan = analyzeQueryPerformance(tab.query, ['idx_orders_customer_id']);
      return {
        tabs: state.tabs.map((t) => (t.id === tabId ? { ...t, executionPlan: plan } : t)),
      };
    }),

  sendAssistantMessage: (text) =>
    set((state) => {
      const userMsg: AiAssistantMessage = {
        id: `user_${Date.now()}`,
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const lower = text.toLowerCase();
      let replyText = 'I have analyzed your request. Here are my recommendations:';
      let optQuery: string | undefined;

      if (lower.includes('index') || lower.includes('slow')) {
        replyText = 'Based on full sequence scan patterns, adding a B-Tree composite index on (customer_id, status) will increase query execution speed by ~85%.';
        optQuery = 'CREATE INDEX idx_orders_cust_status ON orders (customer_id, status);';
      } else if (lower.includes('normalize') || lower.includes('3nf')) {
        replyText = 'To achieve Third Normal Form (3NF), extract address components (city, state, zipcode) into a separate "addresses" lookup table to eliminate transitive dependencies.';
      } else if (lower.includes('explain') || lower.includes('schema')) {
        replyText = 'The active schema comprises 3 main entities with 1:N cardinality. "orders" references "customers" via foreign key customer_id.';
      }

      const aiMsg: AiAssistantMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionableQuery: optQuery,
      };

      return {
        assistantMessages: [...state.assistantMessages, userMsg, aiMsg],
      };
    }),

  setAssistantOpen: (open) => set({ isAssistantOpen: open }),
}));
