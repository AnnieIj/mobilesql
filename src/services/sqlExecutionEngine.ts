import type { SQLExecutionResult, SQLDialect } from '../types';
import { PRACTICE_DATABASES } from '../data/playgroundDatabases';

export interface ExecutionPlanNode {
  id: string;
  type: string; // e.g. 'Seq Scan', 'Index Scan', 'Hash Join', 'Sort', 'Aggregate'
  relationName?: string;
  costStart: number;
  costEnd: number;
  actualTimeMs: number;
  rowsProcessed: number;
  filter?: string;
  children?: ExecutionPlanNode[];
}

export const executePlaygroundQuery = async (
  sql: string,
  databaseId: string,
  dialect: SQLDialect
): Promise<{ result: SQLExecutionResult; plan?: ExecutionPlanNode }> => {
  const startTime = performance.now();
  
  // Find database dataset
  const db = PRACTICE_DATABASES.find((d) => d.id === databaseId) || PRACTICE_DATABASES[0];

  const trimmed = sql.trim();
  const upperSql = trimmed.toUpperCase();

  // Basic validation check
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

  // Check for EXPLAIN / EXPLAIN ANALYZE
  const isExplain = upperSql.startsWith('EXPLAIN');

  // Simulate parsing delay for realistic execution feeling
  await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 8) + 4));

  // Determine target table from query
  let matchedTableName = '';
  for (const table of db.tables) {
    if (upperSql.includes(table.name.toUpperCase())) {
      matchedTableName = table.name;
      break;
    }
  }

  if (!matchedTableName && db.tables.length > 0) {
    matchedTableName = db.tables[0].name; // default fallback
  }

  const rawRows = db.data[matchedTableName] || [];
  
  // Derive columns
  let columns: string[] = [];
  if (rawRows.length > 0) {
    columns = Object.keys(rawRows[0]);
  } else if (db.tables.find((t) => t.name === matchedTableName)) {
    columns = db.tables.find((t) => t.name === matchedTableName)!.columns.map((c) => c.name);
  } else {
    columns = ['result'];
  }

  // Handle Aggregate / Group By queries
  let rows = [...rawRows];
  if (upperSql.includes('COUNT') || upperSql.includes('SUM') || upperSql.includes('AVG')) {
    if (upperSql.includes('GROUP BY')) {
      // Return aggregated rows preview
      rows = rows.slice(0, 5);
    } else {
      // Single aggregate result
      columns = ['total_count', 'total_sum', 'avg_val'];
      rows = [
        {
          total_count: rawRows.length,
          total_sum: 45800.50,
          avg_val: 1250.25,
        },
      ];
    }
  }

  // Handle LIMIT clause if specified
  const limitMatch = trimmed.match(/LIMIT\s+(\d+)/i);
  if (limitMatch && limitMatch[1]) {
    const limitNum = parseInt(limitMatch[1], 10);
    rows = rows.slice(0, limitNum);
  }

  const executionTimeMs = Math.round((performance.now() - startTime) * 10) / 10;

  // Build Execution Plan Node if EXPLAIN is requested or for visual tab
  const plan: ExecutionPlanNode = {
    id: 'node_root',
    type: upperSql.includes('ORDER BY') ? 'Sort' : upperSql.includes('JOIN') ? 'Hash Join' : 'Seq Scan',
    relationName: matchedTableName,
    costStart: 0.0,
    costEnd: upperSql.includes('JOIN') ? 142.50 : 28.15,
    actualTimeMs: Math.round(executionTimeMs * 0.8 * 10) / 10,
    rowsProcessed: rows.length,
    filter: upperSql.includes('WHERE') ? "status = 'completed'" : undefined,
    children: upperSql.includes('JOIN')
      ? [
          {
            id: 'node_child_1',
            type: 'Index Scan',
            relationName: `${matchedTableName}_pkey`,
            costStart: 0.15,
            costEnd: 8.2,
            actualTimeMs: 1.2,
            rowsProcessed: rows.length,
          },
          {
            id: 'node_child_2',
            type: 'Seq Scan',
            relationName: 'customers',
            costStart: 0.0,
            costEnd: 18.5,
            actualTimeMs: 2.4,
            rowsProcessed: 1250,
          },
        ]
      : undefined,
  };

  return {
    result: {
      query: sql,
      columns,
      rows,
      rowCount: rows.length,
      executionTimeMs: Math.max(1.2, executionTimeMs),
      executedAt: new Date().toLocaleTimeString(),
      dialect,
    },
    plan,
  };
};

export const exportToCSV = (columns: string[], rows: Record<string, unknown>[]) => {
  if (!columns.length || !rows.length) return '';
  const header = columns.join(',');
  const csvRows = rows.map((r) =>
    columns
      .map((col) => {
        const val = r[col];
        const strVal = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
        return `"${strVal.replace(/"/g, '""')}"`;
      })
      .join(',')
  );
  return [header, ...csvRows].join('\n');
};
