export interface LessonProgress {
  id: string;
  module: string;
  title: string;
  progressPercent: number;
  estDurationMinutes: number;
}

export interface RecentQueryItem {
  id: string;
  sql: string;
  executionTimeMs: number;
  database: string;
  executedAt: string;
}

export interface PortfolioProjectItem {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Hard' | 'Expert';
  completionPercent: number;
  technologies: string[];
  description: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatarUrl: string;
  level: number;
  weeklyXp: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

export interface AIRecommendationItem {
  id: string;
  type: 'Lesson' | 'Project' | 'Challenge' | 'Interview Question';
  title: string;
  reason: string;
  actionLabel: string;
  tabTarget: any;
}

export const HERO_MOTIVATION_QUOTES = [
  "Mastering window functions separates standard web developers from elite database architects.",
  "Write queries for how the database engine executes, not just how SQL reads.",
  "An index is a promise of speed; an EXPLAIN plan is the proof.",
  "Sub-10ms queries aren't built by luck—they are crafted with precise B-Tree index selection.",
];

export const MOCK_LEARNING_PROGRESS = {
  currentCourse: "PostgreSQL Production Performance Mastery",
  currentLesson: "Lesson 4: B-Tree Index Optimization & Execution Plan Analysis",
  courseProgressPercent: 68,
  weeklyProgressPercent: 85,
  weeklyHoursLogged: 5.1,
  weeklyHoursGoal: 6.0,
  monthlyProgressPercent: 92,
  monthlyLessonsLogged: 22,
  monthlyLessonsGoal: 24,
  overallTrackPercent: 64,
};

export const MOCK_DAILY_CHALLENGE = {
  id: "challenge_today_01",
  title: "Rolling 7-Day Revenue Window Frame Optimization",
  topic: "Window Function Frames (ROWS BETWEEN)",
  difficulty: "Hard",
  estTimeMinutes: 15,
  xpReward: 250,
  status: "Available",
  description:
    "Refactor a heavy subquery aggregation into a single-pass `SUM(revenue) OVER (PARTITION BY store_id ORDER BY trans_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)` without causing full table scans.",
};

export const MOCK_RECENT_LESSONS: LessonProgress[] = [
  {
    id: "les_01",
    module: "Advanced SQL Mechanics",
    title: "Recursive CTEs & Hierarchical Graph Queries",
    progressPercent: 75,
    estDurationMinutes: 12,
  },
  {
    id: "les_02",
    module: "PostgreSQL Deep Dive",
    title: "Indexing Strategies for JSONB & GIN Indexes",
    progressPercent: 30,
    estDurationMinutes: 20,
  },
  {
    id: "les_03",
    module: "Concurrency & Locks",
    title: "Transaction Isolation Levels & Write Skew",
    progressPercent: 10,
    estDurationMinutes: 25,
  },
];

export const MOCK_RECENT_QUERIES: RecentQueryItem[] = [
  {
    id: "q_01",
    sql: "EXPLAIN (ANALYZE, BUFFERS) SELECT u.id, COUNT(o.id) FROM users u JOIN orders o ON u.id = o.user_id GROUP BY 1 HAVING COUNT(o.id) > 5;",
    executionTimeMs: 8,
    database: "PostgreSQL v16",
    executedAt: "10 min ago",
  },
  {
    id: "q_02",
    sql: "WITH RECURSIVE org_tree AS (\n  SELECT id, manager_id, 1 AS level FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.manager_id, ot.level + 1 FROM employees e JOIN org_tree ot ON e.manager_id = ot.id\n) SELECT * FROM org_tree;",
    executionTimeMs: 12,
    database: "SQLite WASM",
    executedAt: "2 hours ago",
  },
  {
    id: "q_03",
    sql: "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_status ON orders(user_id, status) WHERE status = 'pending';",
    executionTimeMs: 4,
    database: "PostgreSQL v16",
    executedAt: "Yesterday",
  },
];

export const MOCK_PORTFOLIO_PROJECTS: PortfolioProjectItem[] = [
  {
    id: "proj_01",
    name: "E-Commerce Realtime Cohort Retention Engine",
    difficulty: "Advanced",
    completionPercent: 80,
    technologies: ["PostgreSQL v16", "JSONB", "Window Functions", "Rollup"],
    description: "Calculates user retention cohorts, monthly LTV degradation curves, and churn probability metrics.",
  },
  {
    id: "proj_02",
    name: "SaaS Billing Ledger with Double-Entry Accounting",
    difficulty: "Hard",
    completionPercent: 100,
    technologies: ["PostgreSQL", "CTEs", "Foreign Constraints", "TRIGGERS"],
    description: "Implements strict double-entry credit/debit balances with proration window functions.",
  },
  {
    id: "proj_03",
    name: "Financial Fraud Detection & Transaction Partitioning",
    difficulty: "Expert",
    completionPercent: 45,
    technologies: ["Declarative Partitioning", "LATERAL Joins", "BRIN Indexing"],
    description: "Processes 10M+ daily financial events looking for velocity anomalies in sub-15ms.",
  },
];

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Sarah Chen",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    level: 18,
    weeklyXp: 14200,
    streakDays: 28,
  },
  {
    rank: 2,
    name: "Marcus Vance",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    level: 16,
    weeklyXp: 11850,
    streakDays: 21,
  },
  {
    rank: 3,
    name: "Alex Quan",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    level: 12,
    weeklyXp: 3450,
    streakDays: 14,
    isCurrentUser: true,
  },
  {
    rank: 4,
    name: "Elena Rostova",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    level: 11,
    weeklyXp: 3100,
    streakDays: 10,
  },
  {
    rank: 5,
    name: "David Kim",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    level: 10,
    weeklyXp: 2850,
    streakDays: 8,
  },
];

export const MOCK_ANALYTICS_DATA = {
  weeklyTrend: [
    { day: "Mon", xp: 450, queries: 22, studyMins: 45 },
    { day: "Tue", xp: 620, queries: 31, studyMins: 60 },
    { day: "Wed", xp: 380, queries: 18, studyMins: 35 },
    { day: "Thu", xp: 850, queries: 42, studyMins: 75 },
    { day: "Fri", xp: 710, queries: 35, studyMins: 55 },
    { day: "Sat", xp: 940, queries: 48, studyMins: 90 },
    { day: "Sun", xp: 520, queries: 26, studyMins: 40 },
  ],
  stats: {
    weeklyXp: 4470,
    lessonsCompleted: 14,
    queriesExecuted: 222,
    studyTimeHours: 6.7,
    dailyStreak: 14,
    accuracyRate: 98.4,
  },
};

export const MOCK_AI_RECOMMENDATIONS: AIRecommendationItem[] = [
  {
    id: "rec_01",
    type: "Lesson",
    title: "Mastering LATERAL Joins vs Correlated Subqueries",
    reason: "Your recent query latency can be reduced by 60% with LATERAL joins.",
    actionLabel: "Start Lesson",
    tabTarget: "academy",
  },
  {
    id: "rec_02",
    type: "Project",
    title: "Fintech Double-Entry Ledger Schema",
    reason: "Matches your goal of mastering financial database transactions and ACID compliance.",
    actionLabel: "View Project",
    tabTarget: "projects",
  },
  {
    id: "rec_03",
    type: "Challenge",
    title: "Index Scan vs Index Only Scan Optimization",
    reason: "Popular topic in senior database engineering technical assessments.",
    actionLabel: "Solve Challenge",
    tabTarget: "challenges",
  },
  {
    id: "rec_04",
    type: "Interview Question",
    title: "Explain write skew in REPEATABLE READ isolation level",
    reason: "High-frequency question asked at top tech companies.",
    actionLabel: "Practice Answer",
    tabTarget: "career",
  },
];
