import { z } from 'zod';

export const sqlDialectEnum = z.enum([
  'PostgreSQL',
  'MySQL',
  'SQLite',
  'SQL Server',
  'Oracle',
  'Snowflake',
  'BigQuery',
]);

export const executeSqlSchema = z.object({
  query: z.string().min(1, 'SQL query cannot be empty').max(50000, 'SQL query exceeds 50KB limit'),
  dialect: sqlDialectEnum.default('PostgreSQL'),
  databaseId: z.string().optional(),
  parameters: z.record(z.string(), z.any()).optional(),
  timeoutMs: z.number().int().min(100).max(30000).default(5000),
  readOnly: z.boolean().default(false),
  limit: z.number().int().min(1).max(5000).default(1000),
});

export const explainSqlSchema = z.object({
  query: z.string().min(1, 'SQL query cannot be empty'),
  dialect: sqlDialectEnum.default('PostgreSQL'),
  analyze: z.boolean().default(false),
  format: z.enum(['TEXT', 'JSON', 'TREE']).default('JSON'),
});

export const formatSqlSchema = z.object({
  query: z.string().min(1, 'SQL query cannot be empty'),
  dialect: sqlDialectEnum.default('PostgreSQL'),
  uppercaseKeywords: z.boolean().default(true),
  tabWidth: z.number().int().min(2).max(8).default(2),
});

export const validateSqlSchema = z.object({
  query: z.string().min(1, 'SQL query cannot be empty'),
  dialect: sqlDialectEnum.default('PostgreSQL'),
});

export const optimizeSqlSchema = z.object({
  query: z.string().min(1, 'SQL query cannot be empty'),
  dialect: sqlDialectEnum.default('PostgreSQL'),
});

export type ExecuteSqlInput = z.infer<typeof executeSqlSchema>;
export type ExplainSqlInput = z.infer<typeof explainSqlSchema>;
export type FormatSqlInput = z.infer<typeof formatSqlSchema>;
export type ValidateSqlInput = z.infer<typeof validateSqlSchema>;
export type OptimizeSqlInput = z.infer<typeof optimizeSqlSchema>;
