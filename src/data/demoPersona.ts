import type { UserProfile } from '../types';

export const DEMO_PRO_ARCHITECT: UserProfile = {
  id: 'demo_architect_elena',
  name: 'Elena Rostova',
  email: 'elena.rostova@mobilesql.io',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
  title: 'Lead Data Infrastructure Architect',
  level: 18,
  xp: 18450,
  nextLevelXp: 20000,
  streakDays: 42,
  queriesRun: 14280,
  accuracyPercentage: 99.8,
  division: 'Pro Architect Division',
  isGuest: false,
  createdAt: '2025-11-12T08:30:00.000Z',
};

export const DEMO_PRELOADED_METRICS = {
  completedLessonsCount: 48,
  totalXp: 18450,
  solvedChallengesCount: 16,
  certificatesEarned: [
    {
      id: 'cert_pg_architect_2026',
      title: 'PostgreSQL Enterprise Architect',
      issuedDate: '2026-02-14',
      issuer: 'MobileSQL Academy Global Certification Board',
      grade: 'Top 1% Distinction (99.4%)',
      verificationHash: '0x7F9A2B4C8E1D603A9924E',
    },
    {
      id: 'cert_window_master_2026',
      title: 'Advanced Analytical Window Functions & CTEs',
      issuedDate: '2026-04-02',
      issuer: 'MobileSQL Academy',
      grade: 'Mastery (100%)',
      verificationHash: '0x1C8A9D3F5E7B204E8812A',
    },
    {
      id: 'cert_indexing_opt_2026',
      title: 'Database Indexing & EXPLAIN Plan Optimization',
      issuedDate: '2026-06-18',
      issuer: 'MobileSQL Academy',
      grade: 'Distinction (98.6%)',
      verificationHash: '0x3D4F6A8C0E2B195D7701C',
    },
  ],
  savedQueries: [
    {
      id: 'saved_q1',
      title: 'Monthly Recurring Revenue (MRR) Cohort Retention',
      sql: `WITH monthly_cohorts AS (
  SELECT 
    user_id,
    DATE_TRUNC('month', created_at) AS cohort_month
  FROM users
),
user_activities AS (
  SELECT 
    user_id,
    DATE_TRUNC('month', order_date) AS activity_month
  FROM orders
)
SELECT 
  c.cohort_month,
  a.activity_month,
  COUNT(DISTINCT a.user_id) AS active_users,
  ROUND(COUNT(DISTINCT a.user_id)::NUMERIC / COUNT(DISTINCT c.user_id) * 100, 2) AS retention_rate_pct
FROM monthly_cohorts c
JOIN user_activities a ON c.user_id = a.user_id
GROUP BY 1, 2
ORDER BY 1, 2;`,
      dialect: 'PostgreSQL',
      tags: ['Analytics', 'Cohorts', 'CTEs'],
    },
    {
      id: 'saved_q2',
      title: 'Real-Time Fraud Anomaly Detection (Z-Score)',
      sql: `WITH transaction_stats AS (
  SELECT 
    user_id,
    AVG(amount) AS avg_amount,
    STDDEV(amount) AS stddev_amount
  FROM transactions
  GROUP BY user_id
)
SELECT 
  t.id AS tx_id,
  t.user_id,
  t.amount,
  ROUND((t.amount - s.avg_amount) / NULLIF(s.stddev_amount, 0), 2) AS z_score,
  CASE 
    WHEN (t.amount - s.avg_amount) / NULLIF(s.stddev_amount, 0) > 3.0 THEN 'CRITICAL ANOMALY'
    WHEN (t.amount - s.avg_amount) / NULLIF(s.stddev_amount, 0) > 2.0 THEN 'SUSPICIOUS'
    ELSE 'NOMINAL'
  END AS risk_tier
FROM transactions t
JOIN transaction_stats s ON t.user_id = s.user_id
WHERE t.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY z_score DESC;`,
      dialect: 'PostgreSQL',
      tags: ['Fraud', 'Statistics', 'Window Functions'],
    },
    {
      id: 'saved_q3',
      title: 'Top 5 Selling SKUs with Running Cumulative Sum',
      sql: `SELECT 
  p.category,
  p.name AS product_name,
  SUM(oi.quantity * oi.unit_price) AS total_revenue,
  SUM(SUM(oi.quantity * oi.unit_price)) OVER (
    PARTITION BY p.category 
    ORDER BY SUM(oi.quantity * oi.unit_price) DESC
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_category_revenue,
  DENSE_RANK() OVER (
    PARTITION BY p.category 
    ORDER BY SUM(oi.quantity * oi.unit_price) DESC
  ) AS category_rank
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.category, p.name
ORDER BY p.category, total_revenue DESC;`,
      dialect: 'PostgreSQL',
      tags: ['Window Functions', 'Partition', 'E-Commerce'],
    },
  ],
};
