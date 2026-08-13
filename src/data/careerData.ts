import type { SkillLevel } from '../types';

export interface CompanyInterviewGuide {
  id: string;
  companyName: string;
  logoText: string;
  difficulty: SkillLevel;
  processSteps: string[];
  frequentTopics: string[];
  commonMistakes: string[];
  expectedOptimizationMs: number;
  sampleQuestion: {
    title: string;
    description: string;
    initialSql: string;
    solutionSql: string;
    databaseId: string;
  };
}

export interface MockInterviewRole {
  id: string;
  roleTitle: string;
  level: string;
  targetSalaryRange: string;
  requiredSkills: string[];
  questionCount: number;
  timeLimitMins: number;
  xpReward: number;
}

export interface SalaryBenchmark {
  role: string;
  entryLevelUsd: string;
  midLevelUsd: string;
  seniorLevelUsd: string;
  topTechUsd: string;
}

export const COMPANY_INTERVIEW_GUIDES: CompanyInterviewGuide[] = [
  {
    id: 'comp_google',
    companyName: 'Google',
    logoText: 'GOOG',
    difficulty: 'Pro Architect',
    processSteps: ['Technical Recruiter Screen', 'SQL & Coding Assessment (45m)', 'Onsite Data System Design (4 rounds)'],
    frequentTopics: ['Window Frame Clauses (ROWS BETWEEN)', 'Recursive CTEs', 'Array/JSON Unnesting'],
    commonMistakes: ['Neglecting NULL values in aggregations', 'Using inefficient subqueries instead of window functions'],
    expectedOptimizationMs: 5,
    sampleQuestion: {
      title: 'Google Ads Revenue Disparity & Percentile Ranking',
      description: 'Calculate the 90th percentile advertiser spend per region using PERCENT_RANK() or NTILE().',
      initialSql: 'SELECT region, advertiser_id, SUM(spend) FROM google_ads GROUP BY region, advertiser_id;',
      solutionSql: `WITH ranked_spend AS (
  SELECT 
    region,
    advertiser_id,
    SUM(spend) AS total_spend,
    PERCENT_RANK() OVER (PARTITION BY region ORDER BY SUM(spend) ASC) AS pr
  FROM google_ads
  GROUP BY region, advertiser_id
)
SELECT region, advertiser_id, total_spend
FROM ranked_spend
WHERE pr >= 0.90;`,
      databaseId: 'saas_crm',
    },
  },
  {
    id: 'comp_amazon',
    companyName: 'Amazon',
    logoText: 'AMZN',
    difficulty: 'Advanced',
    processSteps: ['Online Assessment (SQL + LP)', 'Phone Screen', 'Loop Interview (5 Rounds with Bar Raiser)'],
    frequentTopics: ['Top N Per Group (DENSE_RANK)', 'Self-JOINs for Order Sequences', 'Inventory Rollups'],
    commonMistakes: ['Using RANK() when ties require sequential indexing', 'Failing to explain time complexity of JOINs'],
    expectedOptimizationMs: 10,
    sampleQuestion: {
      title: 'Amazon Fulfillment Top 3 Highest Volume Sellers Per Category',
      description: 'Identify top 3 marketplace sellers by order fulfillment volume in each product category.',
      initialSql: 'SELECT category, seller_id, COUNT(*) FROM order_items GROUP BY category, seller_id;',
      solutionSql: `WITH seller_ranks AS (
  SELECT 
    p.category,
    oi.seller_id,
    COUNT(oi.id) AS total_orders,
    DENSE_RANK() OVER (PARTITION BY p.category ORDER BY COUNT(oi.id) DESC) AS rnk
  FROM order_items oi
  JOIN products p ON oi.product_id = p.id
  GROUP BY p.category, oi.seller_id
)
SELECT category, seller_id, total_orders
FROM seller_ranks
WHERE rnk <= 3;`,
      databaseId: 'ecommerce_prod',
    },
  },
  {
    id: 'comp_meta',
    companyName: 'Meta',
    logoText: 'META',
    difficulty: 'Pro Architect',
    processSteps: ['Recruiter Screen', 'Technical SQL & Product Analytics (45m)', 'Onsite Analytics Loop (4 rounds)'],
    frequentTopics: ['DAU/MAU Engagement Ratios', 'User Cohort Retention', 'Self-Referencing Friendship Networks'],
    commonMistakes: ['Not accounting for deleted or suspended user accounts', 'Incorrect date math for rolling 28-day metrics'],
    expectedOptimizationMs: 6,
    sampleQuestion: {
      title: 'Meta App Engagement DAU / MAU Stickiness Ratio',
      description: 'Compute the active user stickiness ratio defined as Daily Active Users divided by Monthly Active Users per country.',
      initialSql: 'SELECT country, COUNT(DISTINCT user_id) FROM user_actions GROUP BY country;',
      solutionSql: `WITH daily_active AS (
  SELECT country, COUNT(DISTINCT user_id) AS dau
  FROM user_actions
  WHERE action_date = CURRENT_DATE
  GROUP BY country
),
monthly_active AS (
  SELECT country, COUNT(DISTINCT user_id) AS mau
  FROM user_actions
  WHERE action_date >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY country
)
SELECT 
  d.country,
  d.dau,
  m.mau,
  ROUND(CAST(d.dau AS DECIMAL) * 100 / NULLIF(m.mau, 0), 2) AS stickiness_pct
FROM daily_active d
JOIN monthly_active m ON d.country = m.country;`,
      databaseId: 'ecommerce_prod',
    },
  },
  {
    id: 'comp_netflix',
    companyName: 'Netflix',
    logoText: 'NFLX',
    difficulty: 'Pro Architect',
    processSteps: ['Technical Recruiter Call', 'Senior Technical Screen (60m)', 'Culture & Data Architecture Loop'],
    frequentTopics: ['Streaming Session Gap Analysis', 'Binge Session Clustering', 'Subscription Churn Funnels'],
    commonMistakes: ['Overlooking time zone conversions in play duration logs', 'Failing to partition session sequences'],
    expectedOptimizationMs: 4,
    sampleQuestion: {
      title: 'Netflix Binge Watching Session Gap Identification',
      description: 'Group consecutive view events into distinct binge sessions if played within 30 minutes of each other.',
      initialSql: 'SELECT user_id, title_id, view_time FROM viewing_history;',
      solutionSql: `WITH lagged_history AS (
  SELECT 
    user_id,
    title_id,
    view_time,
    LAG(view_time) OVER (PARTITION BY user_id ORDER BY view_time) AS prev_time
  FROM viewing_history
),
session_flags AS (
  SELECT 
    *,
    CASE WHEN prev_time IS NULL OR view_time > prev_time + INTERVAL '30 minutes' THEN 1 ELSE 0 END AS new_session_flag
  FROM lagged_history
)
SELECT 
  user_id,
  title_id,
  view_time,
  SUM(new_session_flag) OVER (PARTITION BY user_id ORDER BY view_time) AS session_id
FROM session_flags;`,
      databaseId: 'saas_crm',
    },
  },
  {
    id: 'comp_stripe',
    companyName: 'Stripe',
    logoText: 'STRP',
    difficulty: 'Advanced',
    processSteps: ['Take-home Practical Project', 'Live Technical Pairing (60m)', 'Architecture & Values Onsite'],
    frequentTopics: ['Financial Ledger Reconciliations', 'Time-series Cohort Churn', 'Idempotency Checks'],
    commonMistakes: ['Division by zero in percentage calculations without NULLIF', 'Incorrect JOIN types losing inactive accounts'],
    expectedOptimizationMs: 8,
    sampleQuestion: {
      title: 'Stripe Monthly Subscription Net Revenue Retention (NRR)',
      description: 'Write a SQL query to calculate Month-over-Month NRR for recurring subscription tiers.',
      initialSql: 'SELECT month, SUM(amount) FROM subscriptions GROUP BY month;',
      solutionSql: `WITH monthly_rev AS (
  SELECT 
    TO_CHAR(created_at, 'YYYY-MM') AS mrr_month,
    SUM(mrr_amount) AS rev
  FROM subscriptions
  WHERE status = 'active'
  GROUP BY TO_CHAR(created_at, 'YYYY-MM')
)
SELECT 
  mrr_month,
  rev,
  LAG(rev) OVER (ORDER BY mrr_month) AS prev_rev,
  ROUND((rev - LAG(rev) OVER (ORDER BY mrr_month)) * 100 / NULLIF(LAG(rev) OVER (ORDER BY mrr_month), 0), 2) AS growth_pct
FROM monthly_rev;`,
      databaseId: 'saas_crm',
    },
  },
  {
    id: 'comp_uber',
    companyName: 'Uber',
    logoText: 'UBER',
    difficulty: 'Advanced',
    processSteps: ['Recruiter Screen', 'SQL & Code Assessment (60m)', 'Onsite Loop (System Design & Metrics)'],
    frequentTopics: ['Surge Pricing Hexagons', 'Driver Trip Completion Rates', 'Geospatial Aggregations'],
    commonMistakes: ['Ignoring cancelled trips in driver earnings calculations', 'Failing to use window functions for lead times'],
    expectedOptimizationMs: 7,
    sampleQuestion: {
      title: 'Uber Surge Pricing & Rider Acceptance Rate',
      description: 'Calculate the ride acceptance percentage per surge multiplier tier during peak hours.',
      initialSql: 'SELECT surge_multiplier, status FROM trip_requests GROUP BY surge_multiplier, status;',
      solutionSql: `SELECT 
  surge_multiplier,
  COUNT(*) AS total_requests,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS accepted_rides,
  ROUND(CAST(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS DECIMAL) * 100 / COUNT(*), 2) AS acceptance_pct
FROM trip_requests
WHERE EXTRACT(HOUR FROM requested_at) BETWEEN 17 AND 20
GROUP BY surge_multiplier
ORDER BY surge_multiplier DESC;`,
      databaseId: 'ecommerce_prod',
    },
  },
  {
    id: 'comp_openai',
    companyName: 'OpenAI',
    logoText: 'OAI',
    difficulty: 'Pro Architect',
    processSteps: ['Technical Screen', 'Live Coding & Prompt API Engineering (60m)', 'Full Onsite Architecture Loop'],
    frequentTopics: ['Token Usage Billing Aggregations', 'Rate Limit Window Throttling', 'Model Cost Profiling'],
    commonMistakes: ['Using FLOAT for high-precision token costs instead of NUMERIC', 'Failing to aggregate by model family'],
    expectedOptimizationMs: 3,
    sampleQuestion: {
      title: 'OpenAI API Token Consumption Rate & Monthly Bill Projection',
      description: 'Aggregate API token consumption by model (e.g., GPT-4o, Claude 3.5) and project tier costs.',
      initialSql: 'SELECT model_id, SUM(prompt_tokens) FROM api_usage GROUP BY model_id;',
      solutionSql: `SELECT 
  model_id,
  SUM(prompt_tokens) AS total_prompt_tokens,
  SUM(completion_tokens) AS total_completion_tokens,
  SUM(prompt_tokens * prompt_price_per_k + completion_tokens * completion_price_per_k) / 1000.0 AS estimated_cost_usd
FROM api_usage u
JOIN model_pricing p ON u.model_id = p.id
GROUP BY model_id
ORDER BY estimated_cost_usd DESC;`,
      databaseId: 'saas_crm',
    },
  },
];

export const MOCK_INTERVIEW_ROLES: MockInterviewRole[] = [
  {
    id: 'role_jr_da',
    roleTitle: 'Junior Data Analyst',
    level: 'Entry Level (0-2 YOE)',
    targetSalaryRange: '$75,000 - $105,000',
    requiredSkills: ['SELECT & WHERE Filtering', 'GROUP BY & Aggregations', 'INNER & LEFT JOINs', 'HAVING Clause'],
    questionCount: 3,
    timeLimitMins: 30,
    xpReward: 300,
  },
  {
    id: 'role_bi_engineer',
    roleTitle: 'Business Intelligence Analyst',
    level: 'Mid Level (2-5 YOE)',
    targetSalaryRange: '$115,000 - $155,000',
    requiredSkills: ['Window Functions (ROW_NUMBER, DENSE_RANK)', 'CTEs & Subqueries', 'Date Truncation', 'KPI Dashboards'],
    questionCount: 4,
    timeLimitMins: 45,
    xpReward: 500,
  },
  {
    id: 'role_analytics_eng',
    roleTitle: 'Senior Analytics Engineer',
    level: 'Senior Level (5+ YOE)',
    targetSalaryRange: '$160,000 - $210,000',
    requiredSkills: ['dbt & SQL Modeling', 'Recursive CTEs', 'Query Optimization & Indexing', 'Cohort Analysis'],
    questionCount: 5,
    timeLimitMins: 60,
    xpReward: 800,
  },
  {
    id: 'role_data_eng',
    roleTitle: 'Data Engineer',
    level: 'Mid-Senior Level (3-6 YOE)',
    targetSalaryRange: '$140,000 - $190,000',
    requiredSkills: ['Partitioning & Sharding', 'ETL Pipeline Modeling', 'JSON Unnesting', 'Performance Profiling'],
    questionCount: 4,
    timeLimitMins: 45,
    xpReward: 650,
  },
  {
    id: 'role_dba',
    roleTitle: 'Database Administrator (DBA)',
    level: 'Senior Level (5+ YOE)',
    targetSalaryRange: '$150,000 - $200,000',
    requiredSkills: ['EXPLAIN ANALYZE', 'Buffer Cache Tuning', 'Index Maintenance', 'ACID Transactions & Locking'],
    questionCount: 5,
    timeLimitMins: 60,
    xpReward: 850,
  },
  {
    id: 'role_staff_de',
    roleTitle: 'Staff Data Engineer',
    level: 'Staff Level (8+ YOE)',
    targetSalaryRange: '$220,000 - $320,000',
    requiredSkills: ['Distributed Data Architecture', 'Complex Window Frames', 'Storage Engine Mechanics', 'Zero-Downtime Schema Migrations'],
    questionCount: 6,
    timeLimitMins: 75,
    xpReward: 1200,
  },
];

export const SALARY_BENCHMARKS: SalaryBenchmark[] = [
  {
    role: 'Junior Data Analyst',
    entryLevelUsd: '$75,000',
    midLevelUsd: '$95,000',
    seniorLevelUsd: '$120,000',
    topTechUsd: '$145,000',
  },
  {
    role: 'BI Analytics Engineer',
    entryLevelUsd: '$95,000',
    midLevelUsd: '$135,000',
    seniorLevelUsd: '$175,000',
    topTechUsd: '$225,000',
  },
  {
    role: 'Data Engineer',
    entryLevelUsd: '$105,000',
    midLevelUsd: '$145,000',
    seniorLevelUsd: '$190,000',
    topTechUsd: '$250,000',
  },
  {
    role: 'Database Architect / DBA',
    entryLevelUsd: '$110,000',
    midLevelUsd: '$150,000',
    seniorLevelUsd: '$195,000',
    topTechUsd: '$260,000',
  },
  {
    role: 'Staff Data Engineer',
    entryLevelUsd: '$160,000',
    midLevelUsd: '$210,000',
    seniorLevelUsd: '$280,000',
    topTechUsd: '$380,000',
  },
];
