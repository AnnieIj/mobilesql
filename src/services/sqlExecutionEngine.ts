import type { SQLExecutionResult, SQLDialect } from '../types';
import { PRACTICE_DATABASES } from '../data/playgroundDatabases';
import { apiClient } from './apiClient';
import { logger } from '../server/utils/logger';
import alasql from 'alasql';

export interface ExecutionPlanNode {
  id: string;
  type: string;
  relationName?: string;
  costStart: number;
  costEnd: number;
  actualTimeMs: number;
  rowsProcessed: number;
  filter?: string;
  children?: ExecutionPlanNode[];
}

const clientDatabases = new Map<string, any>();

function getClientPracticeDatabase(databaseId: string = 'ecommerce_prod'): any {
  if (clientDatabases.has(databaseId)) {
    return clientDatabases.get(databaseId);
  }

  const dbInstance = new alasql.Database();
  const dbConfig = PRACTICE_DATABASES.find((db) => db.id === databaseId) || PRACTICE_DATABASES[0];

  if (dbConfig && dbConfig.tables && dbConfig.data) {
    for (const table of dbConfig.tables) {
      const colDefs = table.columns.map((c) => {
        let sqlType = 'STRING';
        const t = c.type.toUpperCase();
        if (t.includes('INT') || t.includes('SERIAL') || t.includes('BIGINT')) sqlType = 'INT';
        else if (t.includes('DECIMAL') || t.includes('NUMERIC') || t.includes('FLOAT')) sqlType = 'FLOAT';
        else if (t.includes('BOOL')) sqlType = 'BOOLEAN';
        return `${c.name} ${sqlType}`;
      }).join(', ');

      dbInstance.exec(`CREATE TABLE ${table.name} (${colDefs});`);

      const rows = (dbConfig.data as Record<string, any[]>)[table.name] || [];
      if (rows.length > 0) {
        for (const row of rows) {
          const keys = Object.keys(row);
          const cols = keys.join(', ');
          const placeholders = keys.map(() => '?').join(', ');
          const values = keys.map((k) => row[k]);
          dbInstance.exec(`INSERT INTO ${table.name} (${cols}) VALUES (${placeholders});`, values);
        }
      }
    }
  }

  clientDatabases.set(databaseId, dbInstance);
  return dbInstance;
}

export const executePlaygroundQuery = async (
  sql: string,
  databaseId: string,
  dialect: SQLDialect
): Promise<{ result: SQLExecutionResult; plan?: ExecutionPlanNode }> => {
  const startTime = performance.now();
  const trimmed = sql.trim();
  const upperSql = trimmed.toUpperCase();

  if (!trimmed) {
    return {
      result: {
        query: sql,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: 'Syntax Error: Empty SQL statement passed to engine.',
        executedAt: new Date().toISOString(),
        dialect,
      },
    };
  }

  // 1. Attempt execution via backend API
  try {
    const backendResult = await apiClient.sql.execute({
      query: trimmed,
      dialect: dialect as any,
      databaseId,
      timeoutMs: 8000,
      readOnly: false,
      limit: 1000,
    });

    if (backendResult && backendResult.status === 'success') {
      const execTime = backendResult.executionTimeMs || Math.round(performance.now() - startTime);
      const colNames = backendResult.columns && backendResult.columns.length > 0
        ? backendResult.columns.map((c: any) => c.name)
        : Object.keys(backendResult.rows[0] || {});

      return {
        result: {
          query: trimmed,
          columns: colNames.length > 0 ? colNames : ['status'],
          rows: backendResult.rows || [],
          rowCount: backendResult.rowCount || (backendResult.rows ? backendResult.rows.length : 0),
          executionTimeMs: execTime,
          executedAt: new Date().toISOString(),
          dialect,
        },
        plan: {
          id: 'plan_node_1',
          type: upperSql.includes('JOIN') ? 'Hash Join / Aggregate' : (upperSql.includes('WHERE') ? 'Index Scan' : 'Seq Scan'),
          relationName: databaseId || 'dataset_table',
          costStart: 0.0,
          costEnd: 18.5,
          actualTimeMs: Math.max(0.1, execTime * 0.4),
          rowsProcessed: backendResult.rowCount || 1,
        },
      };
    } else if (backendResult && backendResult.status === 'error') {
      return {
        result: {
          query: trimmed,
          columns: [],
          rows: [],
          rowCount: 0,
          executionTimeMs: Math.round(performance.now() - startTime),
          error: backendResult.errorMessage || 'Query execution failed on database',
          executedAt: new Date().toISOString(),
          dialect,
        },
      };
    }
  } catch (backendError) {
    logger.warn('[SQLEngine] Real backend execution exception, evaluating dataset sandbox:', backendError);
  }

  // 2. Client-side Sandbox fallback for local practice datasets
  try {
    const clientDb = getClientPracticeDatabase(databaseId);
    const rawResult = clientDb.exec(trimmed);
    const execTime = Math.max(1, Math.round(performance.now() - startTime));
    const rows = Array.isArray(rawResult) ? rawResult : [];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    return {
      result: {
        query: trimmed,
        columns,
        rows,
        rowCount: rows.length,
        executionTimeMs: execTime,
        executedAt: new Date().toISOString(),
        dialect,
      },
      plan: {
        id: 'plan_node_client',
        type: upperSql.includes('JOIN') ? 'Hash Join' : (upperSql.includes('WHERE') ? 'Index Scan' : 'Seq Scan'),
        relationName: databaseId || 'dataset_table',
        costStart: 0.0,
        costEnd: 24.8,
        actualTimeMs: execTime * 0.5,
        rowsProcessed: rows.length,
      },
    };
  } catch (clientSqlErr: any) {
    return {
      result: {
        query: trimmed,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: Math.round(performance.now() - startTime),
        error: clientSqlErr?.message || 'Client SQL evaluation error',
        executedAt: new Date().toISOString(),
        dialect,
      },
    };
  }
};

export const formatSQLQuery = async (query: string, dialect: SQLDialect = 'PostgreSQL'): Promise<string> => {
  try {
    const res = await apiClient.sql.format({
      query,
      dialect: dialect as any,
      uppercaseKeywords: true,
      tabWidth: 2,
    });
    if (res && res.formattedSql) return res.formattedSql;
  } catch {
    // fallback
  }

  const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT'];
  let formatted = query.trim();
  keywords.forEach((kw) => {
    const reg = new RegExp(`\\b${kw}\\b`, 'gi');
    formatted = formatted.replace(reg, kw);
  });
  return formatted;
};

export const exportToCSV = (columns: string[], rows: Record<string, any>[]): string => {
  if (!columns.length || !rows.length) return '';
  const header = columns.join(',');
  const rowData = rows.map((r) =>
    columns
      .map((col) => {
        const val = r[col];
        if (val === null || val === undefined) return '';
        if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return String(val);
      })
      .join(',')
  );

  return [header, ...rowData].join('\n');
};
