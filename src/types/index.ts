/**
 * MobileSQL Core Domain TypeScript Definitions
 */

export type SQLDialect = 'PostgreSQL' | 'SQLite' | 'MySQL' | 'SQL Server' | 'Oracle' | 'MariaDB';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro Architect';

export type UserDivision = 'Novice Queryer' | 'Data Analyst' | 'SQL Engineer' | 'Pro Architect Division';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  title: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  queriesRun: number;
  accuracyPercentage: number;
  division: UserDivision;
  isGuest: boolean;
  createdAt: string;
}

export interface TableColumn {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  nullable?: boolean;
  references?: string;
}

export interface TableSchema {
  name: string;
  rowCount: number;
  columns: TableColumn[];
  sampleQueries?: string[];
}

export interface DatabaseDataset {
  id: string;
  name: string;
  description: string;
  dialect: SQLDialect;
  tables: TableSchema[];
  data: Record<string, Record<string, unknown>[]>;
}

export interface SQLExecutionResult {
  query: string;
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
  executedAt: string;
  dialect: SQLDialect;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: SkillLevel;
  xpReward: number;
  initialQuery: string;
  instructions: string[];
  hints: string[];
  solution: string;
  targetOutputColumns?: string[];
  expectedRowCount?: number;
}

export interface AcademyModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  level: number;
  totalLessons: number;
  completedLessons: number;
  isLocked: boolean;
  requiresModuleId?: string;
  lessons: Lesson[];
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  unoptimizedQuery: string;
  targetExecutionTimeMs: number;
  badgeReward: string;
  xpReward: number;
  completed: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'Speed' | 'Streak' | 'Architect' | 'Mastery';
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface CopilotExplanation {
  summary: string;
  breakdown: Array<{ step: string; detail: string }>;
  performanceTip: string;
}

export interface SlowQueryLog {
  id: string;
  statement: string;
  avgTimeMs: number;
  needsReview: boolean;
}

export interface WorkspaceMetrics {
  avgQueryRuntimeMs: number;
  runtimeDeltaPercent: number;
  storageUsedPercent: number;
  successRatePercent: number;
  systemStatus: 'nominal' | 'degraded' | 'maintenance';
  activeConnectionsHeatmap: number[][]; // 5x6 grid density matrix
  slowQueries: SlowQueryLog[];
}

export type ActiveTab =
  | 'dashboard'
  | 'academy'
  | 'playground'
  | 'challenges'
  | 'dataset-builder'
  | 'sql-lab'
  | 'projects'
  | 'portfolio'
  | 'certificates'
  | 'achievements'
  | 'leaderboard'
  | 'analytics'
  | 'career'
  | 'community'
  | 'copilot'
  | 'settings'
  | 'help'
  | 'docs'
  | 'landing'
  | 'admin'
  | 'editor'
  | 'profile'
  | 'ranks'
  | 'insights'
  | 'error-404'
  | 'error-500'
  | 'error-offline'
  | 'error-403'
  | 'error-expired';

export * from './analytics';
