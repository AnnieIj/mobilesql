import type { SkillLevel } from '../types';

export interface SQLTemplateItem {
  id: string;
  category: string;
  title: string;
  difficulty: SkillLevel;
  estTimeMinutes: number;
  description: string;
  sql: string;
}

export const SQL_TEMPLATES: SQLTemplateItem[] = [
  // SELECT & Basics
  {
    id: 'tmpl_select_01',
    category: 'SELECT',
    title: 'Select All Columns with Column Aliases',
    difficulty: 'Beginner',
    estTimeMinutes: 2,
    description: 'Fetch records with clean user-facing aliases.',
    sql: `SELECT 
  id AS customer_id, 
  first_name || ' ' || last_name AS full_name, 
  email AS contact_email, 
  tier AS membership_level
FROM customers
LIMIT 10;`,
  },
  {
    id: 'tmpl_where_01',
    category: 'WHERE',
    title: 'Filter by Multiple Conditions & Pattern Matching',
    difficulty: 'Beginner',
    estTimeMinutes: 3,
    description: 'Filter records using AND, OR, and ILIKE wildcard matching.',
    sql: `SELECT *
FROM products
WHERE price BETWEEN 100 AND 500
  AND (category = 'Hardware' OR category = 'Accessories')
  AND title ILIKE '%pro%'
ORDER BY price DESC;`,
  },
  {
    id: 'tmpl_groupby_01',
    category: 'GROUP BY',
    title: 'Aggregating Revenue & Order Counts by Tier',
    difficulty: 'Beginner',
    estTimeMinutes: 4,
    description: 'Group orders by customer membership tier with COUNT and SUM.',
    sql: `SELECT 
  c.tier,
  COUNT(o.id) AS total_orders,
  SUM(o.total_amount) AS total_revenue,
  ROUND(AVG(o.total_amount), 2) AS avg_order_value
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.tier
ORDER BY total_revenue DESC;`,
  },
  {
    id: 'tmpl_having_01',
    category: 'HAVING',
    title: 'Filter Grouped Aggregates with HAVING Clause',
    difficulty: 'Intermediate',
    estTimeMinutes: 4,
    description: 'Restrict aggregated groups to those with revenue above $1,000.',
    sql: `SELECT 
  c.country,
  COUNT(c.id) AS total_customers,
  SUM(o.total_amount) AS country_revenue
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.country
HAVING SUM(o.total_amount) > 1000
ORDER BY country_revenue DESC;`,
  },

  // JOINS
  {
    id: 'tmpl_inner_join_01',
    category: 'INNER JOIN',
    title: 'Multi-Table Inner Join across 3 Relational Tables',
    difficulty: 'Intermediate',
    estTimeMinutes: 5,
    description: 'Join customers, orders, and order_items to analyze purchase behavior.',
    sql: `SELECT 
  o.id AS order_id,
  c.first_name || ' ' || c.last_name AS customer_name,
  p.title AS product_name,
  oi.quantity,
  oi.unit_price,
  (oi.quantity * oi.unit_price) AS line_total
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.status = 'completed';`,
  },
  {
    id: 'tmpl_left_join_01',
    category: 'LEFT JOIN',
    title: 'Identify Customers with Zero Order Activity',
    difficulty: 'Intermediate',
    estTimeMinutes: 4,
    description: 'Find inactive customers using a LEFT JOIN and NULL check.',
    sql: `SELECT 
  c.id,
  c.first_name,
  c.email,
  c.created_at
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;`,
  },
  {
    id: 'tmpl_self_join_01',
    category: 'SELF JOIN',
    title: 'Hierarchical Organizational Manager Lookup',
    difficulty: 'Intermediate',
    estTimeMinutes: 5,
    description: 'Join the employees table onto itself to reveal direct reporting lines.',
    sql: `SELECT 
  e.id AS emp_id,
  e.name AS employee_name,
  e.role AS employee_role,
  m.name AS manager_name,
  m.role AS manager_role
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY m.name NULLS FIRST;`,
  },

  // WINDOW FUNCTIONS & RANKING
  {
    id: 'tmpl_window_01',
    category: 'Window Functions',
    title: 'Running Total & 7-Day Moving Average',
    difficulty: 'Advanced',
    estTimeMinutes: 7,
    description: 'Calculate cumulative revenue and moving averages without collapsing rows.',
    sql: `SELECT 
  created_at::DATE AS order_date,
  total_amount,
  SUM(total_amount) OVER (ORDER BY created_at) AS cumulative_revenue,
  ROUND(AVG(total_amount) OVER (
    ORDER BY created_at 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ), 2) AS moving_7day_avg
FROM orders
WHERE status = 'completed';`,
  },
  {
    id: 'tmpl_ranking_01',
    category: 'Ranking',
    title: 'DENSE_RANK Top Products per Category',
    difficulty: 'Advanced',
    estTimeMinutes: 6,
    description: 'Rank products within each category using DENSE_RANK window function.',
    sql: `WITH RankedProducts AS (
  SELECT 
    title,
    category,
    price,
    rating,
    DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank
  FROM products
)
SELECT *
FROM RankedProducts
WHERE price_rank <= 3;`,
  },

  // CTEs & RECURSIVE CTEs
  {
    id: 'tmpl_cte_01',
    category: 'CTE',
    title: 'Modular Analytics with Multiple Common Table Expressions',
    difficulty: 'Intermediate',
    estTimeMinutes: 6,
    description: 'Break complex analytics into readable, modular WITH blocks.',
    sql: `WITH HighValueCustomers AS (
  SELECT customer_id, SUM(total_amount) AS total_spent
  FROM orders
  GROUP BY customer_id
  HAVING SUM(total_amount) > 1000
),
CustomerDetails AS (
  SELECT id, first_name || ' ' || last_name AS name, country, tier
  FROM customers
)
SELECT 
  cd.name,
  cd.country,
  cd.tier,
  hvc.total_spent
FROM HighValueCustomers hvc
JOIN CustomerDetails cd ON hvc.customer_id = cd.id
ORDER BY hvc.total_spent DESC;`,
  },
  {
    id: 'tmpl_recursive_cte_01',
    category: 'Recursive CTE',
    title: 'Traverse Deep Hierarchical Employee Org Tree',
    difficulty: 'Pro Architect',
    estTimeMinutes: 10,
    description: 'Recursively build organizational tree depth levels.',
    sql: `WITH RECURSIVE OrgHierarchy AS (
  -- Anchor Member: Root executives
  SELECT 
    id, 
    name, 
    role, 
    manager_id, 
    1 AS hierarchy_level,
    name::TEXT AS management_path
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive Member: Subordinate employees
  SELECT 
    e.id, 
    e.name, 
    e.role, 
    e.manager_id, 
    oh.hierarchy_level + 1,
    oh.management_path || ' -> ' || e.name
  FROM employees e
  JOIN OrgHierarchy oh ON e.manager_id = oh.id
)
SELECT 
  hierarchy_level, 
  REPEAT('  ', hierarchy_level - 1) || name AS formatted_name,
  role, 
  management_path
FROM OrgHierarchy
ORDER BY hierarchy_level, id;`,
  },

  // JSON & ADVANCED
  {
    id: 'tmpl_json_01',
    category: 'JSON',
    title: 'JSONB Unnesting & GIN Index Querying',
    difficulty: 'Advanced',
    estTimeMinutes: 8,
    description: 'Extract elements and key-value attributes from JSONB columns.',
    sql: `SELECT 
  id,
  email,
  -- Extract JSON field value
  meta_data->>'theme' AS preferred_theme,
  -- Check JSON key existence
  meta_data ? 'beta_features' AS has_beta_access
FROM user_profiles
WHERE meta_data @> '{"status": "active"}'::jsonb;`,
  },

  // OPTIMIZATION & INDEXES
  {
    id: 'tmpl_optimization_01',
    category: 'Optimization',
    title: 'EXPLAIN (ANALYZE, BUFFERS) Query Plan Inspection',
    difficulty: 'Pro Architect',
    estTimeMinutes: 10,
    description: 'Analyze PostgreSQL buffer cache hits and execution cost nodes.',
    sql: `EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT 
  u.id, 
  COUNT(o.id) AS total_orders
FROM customers u
JOIN orders o ON u.id = o.customer_id
WHERE o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id
HAVING COUNT(o.id) > 2;`,
  },
  {
    id: 'tmpl_index_01',
    category: 'Indexes',
    title: 'Partial B-Tree Index Creation for Pending Orders',
    difficulty: 'Advanced',
    estTimeMinutes: 5,
    description: 'Create a partial index to minimize index size and accelerate pending orders.',
    sql: `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_pending_user
ON orders (customer_id, created_at DESC)
WHERE status = 'pending';`,
  },
];
