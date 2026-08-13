import type { SkillLevel } from '../types';

export interface PracticeExercise {
  id: string;
  title: string;
  difficulty: SkillLevel;
  databaseId: string;
  xpReward: number;
  estTimeMinutes: number;
  question: string;
  hints: string[];
  initialQuery: string;
  expectedQuery: string;
  expectedOutputColumns: string[];
  expectedRowCount: number;
}

export const PRACTICE_EXERCISES: PracticeExercise[] = [
  {
    id: 'ex_01',
    title: 'Top 3 Spending VIP Customers',
    difficulty: 'Beginner',
    databaseId: 'ecommerce_prod',
    xpReward: 150,
    estTimeMinutes: 5,
    question: 'Write a query to find the top 3 customers with tier = "VIP" who have spent the highest total order amount in completed orders. Return customer first name, tier, and total spent.',
    hints: [
      'Filter orders by status = "completed" and customers by tier = "VIP"',
      'Use GROUP BY c.id, c.first_name, c.tier',
      'Use SUM(o.total_amount) and ORDER BY spending DESC LIMIT 3',
    ],
    initialQuery: `-- Write your SQL solution below:
SELECT 
  c.first_name,
  c.tier,
  SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
-- Add your WHERE, GROUP BY, ORDER BY and LIMIT clauses here
;`,
    expectedQuery: `SELECT c.first_name, c.tier, SUM(o.total_amount) AS total_spent FROM customers c JOIN orders o ON c.id = o.customer_id WHERE o.status = 'completed' AND c.tier = 'VIP' GROUP BY c.first_name, c.tier ORDER BY total_spent DESC LIMIT 3;`,
    expectedOutputColumns: ['first_name', 'tier', 'total_spent'],
    expectedRowCount: 2,
  },
  {
    id: 'ex_02',
    title: 'Department Average Salary Gap',
    difficulty: 'Intermediate',
    databaseId: 'employees_corp',
    xpReward: 250,
    estTimeMinutes: 8,
    question: 'Calculate the average employee salary for each department along with the department name. Exclude any department where average salary is under $150,000.',
    hints: [
      'JOIN employees e WITH departments d ON e.dept_id = d.id',
      'Use GROUP BY d.name',
      'Use HAVING AVG(e.salary) >= 150000',
    ],
    initialQuery: `-- Calculate average salary by department
SELECT 
  d.name AS department_name,
  AVG(e.salary) AS avg_salary
FROM departments d
JOIN employees e ON d.id = e.dept_id
-- Add your GROUP BY and HAVING clauses here
;`,
    expectedQuery: `SELECT d.name AS department_name, AVG(e.salary) AS avg_salary FROM departments d JOIN employees e ON d.id = e.dept_id GROUP BY d.name HAVING AVG(e.salary) >= 150000;`,
    expectedOutputColumns: ['department_name', 'avg_salary'],
    expectedRowCount: 2,
  },
  {
    id: 'ex_03',
    title: 'Customer Order Count Window Rank',
    difficulty: 'Advanced',
    databaseId: 'ecommerce_prod',
    xpReward: 400,
    estTimeMinutes: 12,
    question: 'Rank all customers by their total completed order count using DENSE_RANK(). Return first name, country, total orders, and rank.',
    hints: [
      'Aggregate orders per customer using COUNT(o.id)',
      'Apply DENSE_RANK() OVER (ORDER BY COUNT(o.id) DESC)',
    ],
    initialQuery: `-- Window Function Ranking Exercise
SELECT 
  c.first_name,
  c.country,
  COUNT(o.id) AS order_count,
  DENSE_RANK() OVER (ORDER BY COUNT(o.id) DESC) AS customer_rank
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.first_name, c.country
ORDER BY customer_rank;`,
    expectedQuery: `SELECT c.first_name, c.country, COUNT(o.id) AS order_count, DENSE_RANK() OVER (ORDER BY COUNT(o.id) DESC) AS customer_rank FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.first_name, c.country ORDER BY customer_rank;`,
    expectedOutputColumns: ['first_name', 'country', 'order_count', 'customer_rank'],
    expectedRowCount: 5,
  },
];
