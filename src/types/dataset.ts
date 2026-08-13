/**
 * MobileSQL AI Dataset Builder & SQL Lab Domain Definitions
 */

import { SQLDialect } from './index';

export type MockFieldType =
  | 'fullName'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'address'
  | 'city'
  | 'country'
  | 'companyName'
  | 'productName'
  | 'invoiceNumber'
  | 'price'
  | 'amount'
  | 'salary'
  | 'medicalCode'
  | 'timestamp'
  | 'uuid'
  | 'jsonField'
  | 'creditCard'
  | 'statusEnum'
  | 'integer'
  | 'boolean';

export interface DatasetColumn {
  id: string;
  name: string;
  type: string; // e.g., 'VARCHAR(255)', 'INTEGER', 'BIGINT', 'BOOLEAN', 'TIMESTAMP', 'DECIMAL(10,2)', 'JSONB', 'UUID'
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  referencesTable?: string;
  referencesColumn?: string;
  nullable: boolean;
  isUnique?: boolean;
  defaultValue?: string;
  checkConstraint?: string;
  mockGeneratorType: MockFieldType;
  description?: string;
}

export interface DatasetTableIndex {
  id: string;
  name: string;
  columns: string[];
  isUnique: boolean;
  type: 'B-TREE' | 'HASH' | 'GIN' | 'GiST';
}

export interface DatasetTable {
  id: string;
  name: string;
  description: string;
  x: number; // ER Diagram Canvas X coordinate
  y: number; // ER Diagram Canvas Y coordinate
  columns: DatasetColumn[];
  indexes: DatasetTableIndex[];
  rowCount: number;
  sampleData?: Record<string, unknown>[];
}

export interface DatasetRelationship {
  id: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  type: '1:1' | '1:N' | 'N:M';
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  onUpdate?: 'CASCADE' | 'NO ACTION';
}

export type DatasetCategory =
  | 'E-Commerce'
  | 'Banking'
  | 'Healthcare'
  | 'Education'
  | 'HR'
  | 'CRM'
  | 'ERP'
  | 'Retail'
  | 'Logistics'
  | 'Airlines'
  | 'Hotels'
  | 'Social Media'
  | 'Movie Streaming'
  | 'Food Delivery'
  | 'Insurance'
  | 'Government'
  | 'Telecommunications'
  | 'Manufacturing'
  | 'Real Estate'
  | 'SaaS Analytics';

export interface SQLExercise {
  id: string;
  title: string;
  question: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  hint: string;
  solutionQuery: string;
  explanation: string;
}

export interface FullDataset {
  id: string;
  name: string;
  category: DatasetCategory;
  description: string;
  businessContext: string;
  dialect: SQLDialect;
  tables: DatasetTable[];
  relationships: DatasetRelationship[];
  sampleRowMultiplier: number;
  exercises: SQLExercise[];
  author: string;
  isPublished: boolean;
  stars: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIScenario {
  id: string;
  title: string;
  category: DatasetCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Architect';
  businessContext: string;
  objectives: string[];
  dataset: FullDataset;
  questions: Array<{
    id: string;
    question: string;
    hint: string;
    solutionQuery: string;
    expectedInsight: string;
  }>;
}

export interface PerformancePlanNode {
  id: string;
  operation: 'Seq Scan' | 'Index Scan' | 'Bitmap Heap Scan' | 'Hash Join' | 'Nested Loop' | 'Sort' | 'Aggregate';
  tableName?: string;
  indexName?: string;
  costStart: number;
  costEnd: number;
  estimatedRows: number;
  actualRows: number;
  timeMs: number;
  warning?: string;
  recommendation?: string;
}

export interface ExecutionPlanResult {
  query: string;
  totalCost: number;
  estimatedExecutionTimeMs: number;
  planningTimeMs: number;
  scanType: 'Sequential Scan' | 'Index Scan' | 'Bitmap Index Scan' | 'Covering Index Scan';
  indexUsed: string | null;
  planNodes: PerformancePlanNode[];
  optimizationSuggestions: string[];
}

export interface MarketplaceFilter {
  category: DatasetCategory | 'All';
  searchQuery: string;
  sortBy: 'popular' | 'newest' | 'stars' | 'tables';
}
