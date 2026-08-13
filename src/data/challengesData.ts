import type { SkillLevel } from '../types';

export interface ChallengeTestCase {
  id: string;
  name: string;
  description: string;
  expectedRowCount: number;
  expectedFirstRow: Record<string, any>;
}

export interface SQLChallenge {
  id: string;
  title: string;
  slug: string;
  difficulty: SkillLevel;
  category: 'Aggregation' | 'Joins' | 'Window Functions' | 'CTEs' | 'Data Cleaning' | 'Optimization' | 'FAANG Interview';
  companyTags: string[];
  passRatePercentage: number;
  pointsReward: number;
  estimatedTimeMins: number;
  databaseId: string;
  descriptionMarkdown: string;
  initialSql: string;
  solutionSql: string;
  testCases: ChallengeTestCase[];
  hints: string[];
  interviewTip: string;
}

export const SQL_CHALLENGES: SQLChallenge[] = [
  {
    id: 'ch_01',
    title: 'Top 3 Revenue Customers Per Country',
    slug: 'top-3-revenue-customers-per-country',
    difficulty: 'Intermediate',
    category: 'Window Functions',
    companyTags: ['Amazon', 'Stripe', 'Meta'],
    passRatePercentage: 42,
    pointsReward: 120,
    estimatedTimeMins: 15,
    databaseId: 'ecommerce_prod',
    descriptionMarkdown: `### Top 3 Revenue Customers Per Country

You are given a \`customers\` table and an \`orders\` table. 

Write a SQL query to identify the **top 3 customers by total spending** in each country.

#### Schema Requirements:
- Calculate total order spending per customer for completed orders (\`status = 'completed'\`).
- Rank customers within each country using \`DENSE_RANK()\`.
- Output columns: \`country\`, \`customer_id\`, \`first_name\`, \`total_spent\`, \`rank\`.
- Order results by \`country\` ASC, \`rank\` ASC.`,
    initialSql: `-- Write your SQL query below
SELECT 
  c.country,
  c.id AS customer_id,
  c.first_name,
  SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.country, c.id, c.first_name;`,
    solutionSql: `WITH customer_spend AS (
  SELECT 
    c.country,
    c.id AS customer_id,
    c.first_name,
    SUM(o.total_amount) AS total_spent,
    DENSE_RANK() OVER (PARTITION BY c.country ORDER BY SUM(o.total_amount) DESC) AS rank
  FROM customers c
  JOIN orders o ON c.id = o.customer_id
  WHERE o.status = 'completed'
  GROUP BY c.country, c.id, c.first_name
)
SELECT country, customer_id, first_name, total_spent, rank
FROM customer_spend
WHERE rank <= 3
ORDER BY country ASC, rank ASC;`,
    testCases: [
      {
        id: 'tc_1',
        name: 'Top Spenders Ranking',
        description: 'Verify DENSE_RANK partition grouping per country',
        expectedRowCount: 3,
        expectedFirstRow: { country: 'Germany', rank: 1 },
      },
    ],
    hints: [
      'Use a Common Table Expression (CTE) to aggregate SUM(total_amount) first.',
      'Apply DENSE_RANK() OVER (PARTITION BY country ORDER BY SUM(total_amount) DESC).',
      'Filter WHERE rank <= 3 in the outer query.',
    ],
    interviewTip: 'When ranking records in interviews, explain why you chose DENSE_RANK() vs RANK() vs ROW_NUMBER() based on handling tie values.',
  },
  {
    id: 'ch_02',
    title: 'Department Highest & Lowest Paid Salary Ratio',
    slug: 'department-highest-lowest-salary-ratio',
    difficulty: 'Advanced',
    category: 'Aggregation',
    companyTags: ['Google', 'Netflix', 'Microsoft'],
    passRatePercentage: 35,
    pointsReward: 150,
    estimatedTimeMins: 20,
    databaseId: 'hr_payroll',
    descriptionMarkdown: `### Department Salary Disparity Analysis

Analyze payroll disparity across departments.

Write a query to calculate:
1. \`department_name\`
2. Highest employee salary (\`max_salary\`)
3. Lowest employee salary (\`min_salary\`)
4. Salary disparity ratio (\`max_salary / min_salary\` rounded to 2 decimal places)

#### Rules:
- Exclude departments with fewer than 2 active employees.
- Order output by salary disparity ratio DESC.`,
    initialSql: `-- Calculate salary disparity ratio per department
SELECT 
  d.name AS department_name,
  MAX(e.salary) AS max_salary,
  MIN(e.salary) AS min_salary
FROM employees e
JOIN departments d ON e.department_id = d.id
GROUP BY d.name;`,
    solutionSql: `SELECT 
  d.name AS department_name,
  MAX(e.salary) AS max_salary,
  MIN(e.salary) AS min_salary,
  ROUND(CAST(MAX(e.salary) AS DECIMAL) / NULLIF(MIN(e.salary), 0), 2) AS disparity_ratio
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE e.is_active = true
GROUP BY d.name
HAVING COUNT(e.id) >= 2
ORDER BY disparity_ratio DESC;`,
    testCases: [
      {
        id: 'tc_2',
        name: 'Salary Disparity Output',
        description: 'Verify HAVING COUNT >= 2 filter and ROUND calculation',
        expectedRowCount: 2,
        expectedFirstRow: { department_name: 'Engineering' },
      },
    ],
    hints: [
      'Use NULLIF(MIN(e.salary), 0) to avoid division-by-zero runtime exceptions.',
      'Filter group counts with HAVING COUNT(e.id) >= 2.',
    ],
    interviewTip: 'Always safeguard division in production SQL with NULLIF or CASE WHEN to prevent division-by-zero crashes.',
  },
  {
    id: 'ch_03',
    title: 'Monthly Recurring Revenue (MRR) Churn Analysis',
    slug: 'monthly-recurring-revenue-mrr-churn',
    difficulty: 'Pro Architect',
    category: 'CTEs',
    companyTags: ['Stripe', 'Airbnb', 'Uber'],
    passRatePercentage: 28,
    pointsReward: 200,
    estimatedTimeMins: 25,
    databaseId: 'saas_crm',
    descriptionMarkdown: `### SaaS MRR Churn Rate Tracker

Calculate month-over-month MRR churn for active subscription plans.

#### Required Output Columns:
- \`month\`: YYYY-MM formatted date
- \`total_mrr\`: Sum of active plan amounts
- \`churned_mrr\`: Sum of cancelled subscriptions in that month
- \`churn_rate_pct\`: \`(churned_mrr / total_mrr) * 100\` rounded to 2 decimals.`,
    initialSql: `-- Write your SQL for SaaS MRR churn calculation
SELECT * FROM subscriptions LIMIT 10;`,
    solutionSql: `WITH monthly_summary AS (
  SELECT 
    DATE_TRUNC('month', start_date) AS month,
    SUM(mrr_amount) AS total_mrr,
    SUM(CASE WHEN status = 'cancelled' THEN mrr_amount ELSE 0 END) AS churned_mrr
  FROM subscriptions
  GROUP BY DATE_TRUNC('month', start_date)
)
SELECT 
  TO_CHAR(month, 'YYYY-MM') AS month,
  total_mrr,
  churned_mrr,
  ROUND(CAST(churned_mrr AS DECIMAL) * 100 / NULLIF(total_mrr, 0), 2) AS churn_rate_pct
FROM monthly_summary
ORDER BY month ASC;`,
    testCases: [
      {
        id: 'tc_3',
        name: 'MRR Metrics',
        description: 'Check month aggregation and percentage calculation',
        expectedRowCount: 3,
        expectedFirstRow: { month: '2024-01' },
      },
    ],
    hints: [
      'Use DATE_TRUNC(\'month\', start_date) for monthly grouping.',
      'Use conditional aggregation with SUM(CASE WHEN status = \'cancelled\' THEN mrr_amount ELSE 0 END).',
    ],
    interviewTip: 'Conditional aggregation with SUM(CASE...) is one of the most tested techniques in FinTech and SaaS analytics interviews.',
  },
];
