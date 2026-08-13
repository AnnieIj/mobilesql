import type { SkillLevel } from '../types';

export interface AcademyQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface AcademyQuiz {
  id: string;
  question: string;
  codeSnippet?: string;
  options: AcademyQuizOption[];
  xpReward: number;
}

export interface AcademyDragBlockItem {
  id: string;
  text: string;
  correctIndex: number;
}

export interface AcademyDragExercise {
  id: string;
  instructions: string;
  blocks: AcademyDragBlockItem[];
  distractors: string[];
  expectedQuery: string;
  xpReward: number;
}

export interface AcademyLesson {
  id: string;
  title: string;
  durationMinutes: number;
  xpReward: number;
  difficulty: SkillLevel;
  summary: string;
  readingMarkdown: string;
  initialSql: string;
  expectedQuery: string;
  databaseId: string;
  visualType?: 'join_diagram' | 'er_diagram' | 'execution_tree' | 'index_btree';
  quiz?: AcademyQuiz;
  dragExercise?: AcademyDragExercise;
  interviewTip?: string;
  commonMistakes?: string[];
  bestPractices?: string[];
}

export interface AcademyModule {
  id: string;
  trackId: string;
  title: string;
  description: string;
  iconName: string;
  difficulty: SkillLevel;
  totalLessons: number;
  estimatedMinutes: number;
  xpReward: number;
  lessons: AcademyLesson[];
}

export interface AcademyTrack {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badgeName: string;
  iconName: string;
  colorHex: string;
  modules: AcademyModule[];
}

export const ACADEMY_CURRICULUM: AcademyTrack[] = [
  {
    id: 'track_foundations',
    title: '1. SQL Foundations',
    subtitle: 'Relational Database Principles & Structure',
    description: 'Master the fundamental architecture of databases, tables, columns, rows, primary keys, and data types.',
    badgeName: 'Schema Rookie',
    iconName: 'Database',
    colorHex: '#3B82F6',
    modules: [
      {
        id: 'mod_db_intro',
        trackId: 'track_foundations',
        title: 'Relational Database Fundamentals',
        description: 'Understand client-server RDBMS models, tables, columns, rows, and schema constraints.',
        iconName: 'Server',
        difficulty: 'Beginner',
        totalLessons: 3,
        estimatedMinutes: 15,
        xpReward: 200,
        lessons: [
          {
            id: 'les_db_01',
            title: 'What is a Relational Database & SQL?',
            durationMinutes: 5,
            xpReward: 50,
            difficulty: 'Beginner',
            summary: 'Learn the core concepts of RDBMS, structured tables, and SQL query syntax.',
            databaseId: 'ecommerce_prod',
            readingMarkdown: `### What is a Relational Database?
A **Relational Database Management System (RDBMS)** organizes data into structured tables consisting of **columns** (attributes) and **rows** (records).

#### Key Components:
- **Table**: A structured grid holding a specific entity (e.g., \`customers\`, \`orders\`).
- **Column**: A field defining data type (e.g., \`first_name VARCHAR(50)\`).
- **Row / Tuple**: An individual record entry in the table.
- **Primary Key (PK)**: A unique identifier for each row (e.g., \`customer_id\`).
- **Foreign Key (FK)**: A column that references the primary key of another table, creating a relational link.`,
            initialSql: `-- Run your first SQL query to inspect the customers table
SELECT id, first_name, last_name, email, country, tier 
FROM customers 
LIMIT 5;`,
            expectedQuery: `SELECT id, first_name, last_name, email, country, tier FROM customers LIMIT 5;`,
            quiz: {
              id: 'q_db_01',
              question: 'Which of the following uniquely identifies a row in a relational database table?',
              options: [
                { id: 'a', text: 'Foreign Key', isCorrect: false, explanation: 'Foreign keys establish relationships to other tables.' },
                { id: 'b', text: 'Primary Key', isCorrect: true, explanation: 'Primary keys enforce unique row identity across a table.' },
                { id: 'c', text: 'INDEX constraint', isCorrect: false, explanation: 'Indexes optimize search speed but are not required for unique identity.' },
                { id: 'd', text: 'VARCHAR data type', isCorrect: false, explanation: 'VARCHAR is a string data type.' },
              ],
              xpReward: 20,
            },
            bestPractices: [
              'Always define a Primary Key for every table.',
              'Use descriptive, lower_snake_case column names.',
            ],
            commonMistakes: [
              'Forgetting that SQL keywords are case-insensitive, but string literals are case-sensitive.',
            ],
          },
          {
            id: 'les_db_02',
            title: 'Primary Keys, Foreign Keys & Data Types',
            durationMinutes: 5,
            xpReward: 75,
            difficulty: 'Beginner',
            summary: 'Explore data types like INT, VARCHAR, TIMESTAMP, DECIMAL, and constraint enforcement.',
            databaseId: 'ecommerce_prod',
            visualType: 'er_diagram',
            readingMarkdown: `### Relational Constraints & Data Types
Data types enforce strict schema constraints on columns:
- **VARCHAR(n)**: Variable-length character string up to *n* characters.
- **INT / BIGINT**: Whole numbers for IDs and quantities.
- **DECIMAL(p, s)**: Exact numeric values for financial transactions (e.g., \`DECIMAL(10,2)\`).
- **TIMESTAMP**: Date and time values with timezones.
- **UUID**: 128-bit globally unique identifier.`,
            initialSql: `-- Inspect customers and their foreign key order references
SELECT c.id AS customer_id, c.first_name, o.id AS order_id, o.total_amount 
FROM customers c
JOIN orders o ON c.id = o.customer_id
LIMIT 5;`,
            expectedQuery: `SELECT c.id AS customer_id, c.first_name, o.id AS order_id, o.total_amount FROM customers c JOIN orders o ON c.id = o.customer_id LIMIT 5;`,
            interviewTip: 'When asked about financial precision in technical interviews, always advocate for DECIMAL or NUMERIC over FLOAT/DOUBLE due to binary floating-point rounding errors.',
          },
        ],
      },
    ],
  },
  {
    id: 'track_beginner',
    title: '2. Beginner SQL Mastery',
    subtitle: 'Filtering, Ordering, Aliasing & Pattern Matching',
    description: 'Learn to query, filter, sort, and paginate single-table datasets with precision.',
    badgeName: 'Query Specialist',
    iconName: 'Play',
    colorHex: '#62DF7D',
    modules: [
      {
        id: 'mod_filtering',
        trackId: 'track_beginner',
        title: 'WHERE Clauses, Wildcards & Logic',
        description: 'Filter rows using AND, OR, NOT, BETWEEN, IN, and LIKE pattern matching.',
        iconName: 'Filter',
        difficulty: 'Beginner',
        totalLessons: 3,
        estimatedMinutes: 20,
        xpReward: 250,
        lessons: [
          {
            id: 'les_flt_01',
            title: 'Filtering Rows with WHERE & Logical Operators',
            durationMinutes: 6,
            xpReward: 80,
            difficulty: 'Beginner',
            summary: 'Combine AND, OR, and NOT clauses to pinpoint specific records.',
            databaseId: 'ecommerce_prod',
            readingMarkdown: `### The WHERE Clause
The \`WHERE\` clause filters records based on boolean logical conditions evaluated before grouping or output.

\`\`\`sql
SELECT * FROM products
WHERE price >= 100 AND stock_quantity > 0;
\`\`\``,
            initialSql: `-- Select VIP customers located in 'Germany' or 'United Kingdom'
SELECT first_name, email, country, tier 
FROM customers 
WHERE tier = 'VIP' AND (country = 'Germany' OR country = 'United Kingdom');`,
            expectedQuery: `SELECT first_name, email, country, tier FROM customers WHERE tier = 'VIP' AND (country = 'Germany' OR country = 'United Kingdom');`,
            dragExercise: {
              id: 'drag_flt_01',
              instructions: 'Arrange the SQL keywords to construct a valid filtered SELECT statement:',
              blocks: [
                { id: 'b1', text: 'SELECT *', correctIndex: 0 },
                { id: 'b2', text: 'FROM products', correctIndex: 1 },
                { id: 'b3', text: 'WHERE price > 200', correctIndex: 2 },
                { id: 'b4', text: 'ORDER BY price DESC', correctIndex: 3 },
              ],
              distractors: ['HAVING price > 200', 'GROUP BY price'],
              expectedQuery: 'SELECT * FROM products WHERE price > 200 ORDER BY price DESC;',
              xpReward: 30,
            },
          },
        ],
      },
    ],
  },
  {
    id: 'track_intermediate',
    title: '3. Intermediate SQL & Joins',
    subtitle: 'Aggregations, Grouping & Multi-Table Joins',
    description: 'Combine datasets using INNER, LEFT, RIGHT, FULL, CROSS, and SELF JOINs.',
    badgeName: 'Join Master',
    iconName: 'Layers',
    colorHex: '#F59E0B',
    modules: [
      {
        id: 'mod_joins',
        trackId: 'track_intermediate',
        title: 'Relational Joins Deep Dive',
        description: 'Master row matching across multi-table schemas with visual diagrams.',
        iconName: 'GitMerge',
        difficulty: 'Intermediate',
        totalLessons: 4,
        estimatedMinutes: 30,
        xpReward: 400,
        lessons: [
          {
            id: 'les_join_01',
            title: 'INNER vs LEFT JOIN Visual Mechanics',
            durationMinutes: 8,
            xpReward: 100,
            difficulty: 'Intermediate',
            summary: 'Learn how row matching works between left and right table record sets.',
            databaseId: 'ecommerce_prod',
            visualType: 'join_diagram',
            readingMarkdown: `### Understanding SQL Joins
- **INNER JOIN**: Returns only rows that match in **both** tables.
- **LEFT JOIN**: Returns **all** rows from the left table and matching rows from the right table. Unmatched right rows return \`NULL\`.
- **RIGHT JOIN**: Opposite of LEFT JOIN.
- **FULL OUTER JOIN**: Returns all rows from both tables, filling \`NULL\` for missing matches.`,
            initialSql: `-- Run a LEFT JOIN to catch customers with or without orders
SELECT 
  c.first_name, 
  c.tier, 
  o.id AS order_id, 
  o.total_amount
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;`,
            expectedQuery: `SELECT c.first_name, c.tier, o.id AS order_id, o.total_amount FROM customers c LEFT JOIN orders o ON c.id = o.customer_id;`,
          },
        ],
      },
    ],
  },
  {
    id: 'track_advanced',
    title: '4. Advanced SQL Architecture',
    subtitle: 'CTEs, Recursive Queries & Window Functions',
    description: 'Write complex modular queries with WITH blocks, window partitioning, and ranking.',
    badgeName: 'SQL Architect',
    iconName: 'Zap',
    colorHex: '#A855F7',
    modules: [
      {
        id: 'mod_window_cte',
        trackId: 'track_advanced',
        title: 'Window Functions & Ranking',
        description: 'Perform analytical calculations across row partitions without collapsing data.',
        iconName: 'TrendingUp',
        difficulty: 'Advanced',
        totalLessons: 4,
        estimatedMinutes: 35,
        xpReward: 500,
        lessons: [
          {
            id: 'les_win_01',
            title: 'OVER(), PARTITION BY & Running Totals',
            durationMinutes: 10,
            xpReward: 120,
            difficulty: 'Advanced',
            summary: 'Calculate cumulative revenue and moving window statistics.',
            databaseId: 'ecommerce_prod',
            readingMarkdown: `### Window Functions Syntax
Unlike \`GROUP BY\` which collapses rows into summary groups, window functions perform calculations on sets of rows while preserving individual row granularity.

\`\`\`sql
SELECT 
  created_at, 
  total_amount,
  SUM(total_amount) OVER (ORDER BY created_at) AS running_total
FROM orders;
\`\`\``,
            initialSql: `-- Calculate running total order revenue
SELECT 
  created_at,
  total_amount,
  SUM(total_amount) OVER (ORDER BY created_at) AS running_total
FROM orders
WHERE status = 'completed';`,
            expectedQuery: `SELECT created_at, total_amount, SUM(total_amount) OVER (ORDER BY created_at) AS running_total FROM orders WHERE status = 'completed';`,
          },
        ],
      },
    ],
  },
  {
    id: 'track_design',
    title: '5. Database Design & ER Modeling',
    subtitle: 'Normalization, Keys & ER Diagrams',
    description: 'Design production-grade database schemas adhering to 1NF, 2NF, 3NF, and BCNF rules.',
    badgeName: 'Schema Sculptor',
    iconName: 'Layout',
    colorHex: '#EC4899',
    modules: [],
  },
  {
    id: 'track_performance',
    title: '6. Query Performance Tuning',
    subtitle: 'EXPLAIN Plans, B-Tree Indexes & Partitioning',
    description: 'Optimize sub-10ms query performance using indexes, partition strategies, and execution plan analysis.',
    badgeName: 'Speed Demon',
    iconName: 'Activity',
    colorHex: '#EF4444',
    modules: [],
  },
  {
    id: 'track_analytics',
    title: '7. SQL for Data Analysts',
    subtitle: 'Cohorts, Revenue Metrics & Dashboards',
    description: 'Solve real-world analytics problems across FinTech, E-Commerce, Healthcare, and SaaS.',
    badgeName: 'Data Analyst Pro',
    iconName: 'PieChart',
    colorHex: '#10B981',
    modules: [],
  },
  {
    id: 'track_interview',
    title: '8. FAANG SQL Interview Prep',
    subtitle: 'LeetCode Hard & Production Interview Questions',
    description: 'Master high-frequency SQL interview questions from Amazon, Google, Meta, Stripe, Netflix, and Uber.',
    badgeName: 'Interview Ninja',
    iconName: 'Award',
    colorHex: '#F43F5E',
    modules: [],
  },
];
