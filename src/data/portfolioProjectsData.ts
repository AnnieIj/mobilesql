import type { SkillLevel } from '../types';

export interface ProjectObjective {
  id: string;
  title: string;
  description: string;
  targetSql: string;
  expectedRowCount: number;
  xpReward: number;
  isCompleted?: boolean;
}

export interface DatabaseTableSchema {
  tableName: string;
  description: string;
  rowCount: number;
  columns: { name: string; type: string; keyType?: 'PK' | 'FK'; description: string }[];
}

export interface EnterpriseProject {
  id: string;
  title: string;
  slug: string;
  industry: 'FinTech & Banking' | 'E-Commerce' | 'Healthcare' | 'Human Resources' | 'Logistics' | 'Telecom';
  difficulty: SkillLevel;
  estimatedHours: number;
  xpReward: number;
  companyName: string;
  companyLogoText: string;
  companyDescription: string;
  businessScenario: string;
  erDiagramSyntax: string; // Mermaid ERD or visual layout representation
  tables: DatabaseTableSchema[];
  objectives: ProjectObjective[];
  databaseId: string;
  certificateTitle: string;
  interviewRelevance: string;
}

export const ENTERPRISE_PROJECTS: EnterpriseProject[] = [
  {
    id: 'proj_fintech_01',
    title: 'FinTech Credit Card Fraud Detection & Risk Pipeline',
    slug: 'fintech-fraud-detection-risk-pipeline',
    industry: 'FinTech & Banking',
    difficulty: 'Advanced',
    estimatedHours: 3,
    xpReward: 500,
    companyName: 'Apex Capital Pay',
    companyLogoText: 'APX',
    companyDescription: 'High-frequency digital payment processor handling $12B+ in annual transaction volume.',
    businessScenario: `Apex Capital Pay has experienced a 14% spike in fraudulent transactions occurring across cross-border merchant categories. 
    
    As a Senior Analytics Engineer, your goal is to construct a real-time risk scoring engine using SQL window functions, anomaly thresholds, and time-series aggregation to flag suspicious transaction clusters before payout settlement.`,
    erDiagramSyntax: `[CUSTOMERS] 1---N [ACCOUNTS] 1---N [TRANSACTIONS] N---1 [MERCHANTS]`,
    databaseId: 'ecommerce_prod',
    certificateTitle: 'Certified FinTech Risk Analytics Specialist',
    interviewRelevance: 'Commonly asked in Stripe, Square, and Revolut Senior Analytics Engineer technical interviews.',
    tables: [
      {
        tableName: 'transactions',
        description: 'Ledger of all digital payments and swipe events',
        rowCount: 14200,
        columns: [
          { name: 'transaction_id', type: 'UUID', keyType: 'PK', description: 'Unique transaction token' },
          { name: 'account_id', type: 'VARCHAR', keyType: 'FK', description: 'Associated customer account' },
          { name: 'amount', type: 'DECIMAL(12,2)', description: 'Transaction magnitude in USD' },
          { name: 'merchant_category', type: 'VARCHAR', description: 'MCC code category (e.g. Wire, Gambling)' },
          { name: 'is_flagged', type: 'BOOLEAN', description: 'Current fraud engine status' },
          { name: 'created_at', type: 'TIMESTAMP', description: 'Transaction execution timestamp' },
        ],
      },
      {
        tableName: 'accounts',
        description: 'Customer account balances and risk tiers',
        rowCount: 3200,
        columns: [
          { name: 'account_id', type: 'VARCHAR', keyType: 'PK', description: 'Primary account ID' },
          { name: 'risk_tier', type: 'VARCHAR', description: 'Account tier (LOW, MEDIUM, HIGH)' },
          { name: 'created_country', type: 'VARCHAR', description: 'Origin country ISO' },
        ],
      },
    ],
    objectives: [
      {
        id: 'obj_1',
        title: 'Identify High-Velocity Swipe Anomalies',
        description: 'Write a SQL query using window functions to identify accounts executing more than 3 transactions within a 10-minute window.',
        targetSql: `WITH velocity_cte AS (
  SELECT 
    account_id,
    amount,
    created_at,
    COUNT(*) OVER (PARTITION BY account_id ORDER BY created_at RANGE BETWEEN INTERVAL '10 minutes' PRECEDING AND CURRENT ROW) AS velocity_count
  FROM transactions
)
SELECT * FROM velocity_cte WHERE velocity_count > 3;`,
        expectedRowCount: 12,
        xpReward: 150,
      },
      {
        id: 'obj_2',
        title: 'Calculate Cross-Border Merchant Risk Concentration',
        description: 'Aggregate total transaction volumes per merchant_category and calculate the ratio of flagged fraudulent volume to total volume.',
        targetSql: `SELECT 
  merchant_category,
  COUNT(*) AS total_tx,
  SUM(amount) AS total_vol,
  SUM(CASE WHEN is_flagged = true THEN amount ELSE 0 END) AS fraud_vol,
  ROUND(CAST(SUM(CASE WHEN is_flagged = true THEN amount ELSE 0 END) AS DECIMAL) * 100 / NULLIF(SUM(amount), 0), 2) AS fraud_pct
FROM transactions
GROUP BY merchant_category
ORDER BY fraud_pct DESC;`,
        expectedRowCount: 5,
        xpReward: 200,
      },
      {
        id: 'obj_3',
        title: 'Construct Automated Account Lockdown Queue',
        description: 'Generate a ranked list of high-risk account IDs eligible for temporary account suspension using DENSE_RANK().',
        targetSql: `WITH risk_scores AS (
  SELECT 
    a.account_id,
    a.risk_tier,
    COUNT(t.transaction_id) AS total_swipes,
    SUM(t.amount) AS total_spent,
    DENSE_RANK() OVER (ORDER BY SUM(t.amount) DESC) AS rank
  FROM accounts a
  JOIN transactions t ON a.account_id = t.account_id
  WHERE a.risk_tier = 'HIGH'
  GROUP BY a.account_id, a.risk_tier
)
SELECT * FROM risk_scores WHERE rank <= 5;`,
        expectedRowCount: 5,
        xpReward: 150,
      },
    ],
  },
  {
    id: 'proj_ecommerce_02',
    title: 'E-Commerce Cohort Retention & LTV Customer Segmentation',
    slug: 'ecommerce-cohort-retention-ltv-segmentation',
    industry: 'E-Commerce',
    difficulty: 'Pro Architect',
    estimatedHours: 4,
    xpReward: 650,
    companyName: 'Aura Market',
    companyLogoText: 'AUR',
    companyDescription: 'Global direct-to-consumer marketplace serving 2.5 million active shoppers.',
    businessScenario: `Aura Market wants to understand customer repurchase behavior and long-term Customer Lifetime Value (LTV) across monthly signup cohorts. 
    
    You are tasked with building a SQL cohort retention matrix and automated RFM (Recency, Frequency, Monetary) customer segmentation framework to empower the Chief Growth Officer's marketing spend allocations.`,
    erDiagramSyntax: `[CUSTOMERS] 1---N [ORDERS] 1---N [ORDER_ITEMS] N---1 [PRODUCTS]`,
    databaseId: 'ecommerce_prod',
    certificateTitle: 'Certified E-Commerce Growth Analytics Engineer',
    interviewRelevance: 'Featured in Amazon, Shopify, and Wayfair Data Engineering assessment loops.',
    tables: [
      {
        tableName: 'customers',
        description: 'Customer registration dates and geographic region',
        rowCount: 8500,
        columns: [
          { name: 'id', type: 'BIGINT', keyType: 'PK', description: 'Customer ID' },
          { name: 'first_name', type: 'VARCHAR', description: 'Customer given name' },
          { name: 'country', type: 'VARCHAR', description: 'Country of residence' },
          { name: 'created_at', type: 'TIMESTAMP', description: 'Signup timestamp' },
        ],
      },
      {
        tableName: 'orders',
        description: 'Customer order history and order totals',
        rowCount: 24000,
        columns: [
          { name: 'id', type: 'BIGINT', keyType: 'PK', description: 'Order ID' },
          { name: 'customer_id', type: 'BIGINT', keyType: 'FK', description: 'FK to customers' },
          { name: 'total_amount', type: 'DECIMAL(10,2)', description: 'Order grand total' },
          { name: 'status', type: 'VARCHAR', description: 'Order status (completed, pending, cancelled)' },
          { name: 'order_date', type: 'TIMESTAMP', description: 'Order placement timestamp' },
        ],
      },
    ],
    objectives: [
      {
        id: 'obj_retention_1',
        title: 'Build Monthly Signup Cohort Matrix',
        description: 'Group customers by their first purchase month and calculate monthly repeat order retention rates.',
        targetSql: `WITH first_purchases AS (
  SELECT customer_id, MIN(DATE_TRUNC('month', order_date)) AS cohort_month
  FROM orders
  GROUP BY customer_id
)
SELECT 
  fp.cohort_month,
  COUNT(DISTINCT fp.customer_id) AS total_cohort_size
FROM first_purchases fp
GROUP BY fp.cohort_month
ORDER BY fp.cohort_month ASC;`,
        expectedRowCount: 6,
        xpReward: 250,
      },
      {
        id: 'obj_rfm_2',
        title: 'Calculate RFM Customer Segments (VIP vs At-Risk)',
        description: 'Use NTILE(4) to score customers on Recency, Frequency, and Monetary parameters.',
        targetSql: `WITH rfm_raw AS (
  SELECT 
    c.id AS customer_id,
    MAX(o.order_date) AS last_order,
    COUNT(o.id) AS frequency,
    SUM(o.total_amount) AS monetary
  FROM customers c
  JOIN orders o ON c.id = o.customer_id
  GROUP BY c.id
)
SELECT 
  customer_id,
  NTILE(4) OVER (ORDER BY frequency DESC) AS f_score,
  NTILE(4) OVER (ORDER BY monetary DESC) AS m_score
FROM rfm_raw;`,
        expectedRowCount: 10,
        xpReward: 400,
      },
    ],
  },
];
