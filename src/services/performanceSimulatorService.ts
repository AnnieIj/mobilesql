/**
 * Query Performance Simulator & Execution Plan Estimator (EXPLAIN ANALYZE)
 */

import { ExecutionPlanResult, PerformancePlanNode } from '../types/dataset';

export function analyzeQueryPerformance(query: string, availableIndexes: string[] = []): ExecutionPlanResult {
  const lowerQuery = query.toLowerCase();
  const hasIndex = availableIndexes.some((idx) => lowerQuery.includes(idx.toLowerCase()));
  const hasWhere = lowerQuery.includes('where');
  const hasJoin = lowerQuery.includes('join');
  const hasGroupBy = lowerQuery.includes('group by');
  const hasOrderBy = lowerQuery.includes('order by');

  let scanType: ExecutionPlanResult['scanType'] = 'Sequential Scan';
  let totalCost = 450.0;
  let estTimeMs = 38.5;
  let indexUsed: string | null = null;

  if (hasIndex) {
    scanType = 'Index Scan';
    totalCost = 12.4;
    estTimeMs = 1.8;
    indexUsed = availableIndexes[0];
  } else if (!hasWhere && !hasJoin) {
    scanType = 'Sequential Scan';
    totalCost = 180.0;
    estTimeMs = 12.2;
  }

  const nodes: PerformancePlanNode[] = [];

  if (hasGroupBy) {
    nodes.push({
      id: 'node_agg',
      operation: 'Aggregate',
      costStart: totalCost - 10,
      costEnd: totalCost,
      estimatedRows: 50,
      actualRows: 48,
      timeMs: 4.2,
    });
  }

  if (hasOrderBy && !hasIndex) {
    nodes.push({
      id: 'node_sort',
      operation: 'Sort',
      costStart: totalCost - 25,
      costEnd: totalCost - 10,
      estimatedRows: 1000,
      actualRows: 980,
      timeMs: 8.5,
      warning: 'In-Memory QuickSort executed on unindexed column',
    });
  }

  if (hasJoin) {
    nodes.push({
      id: 'node_join',
      operation: 'Hash Join',
      costStart: 50.0,
      costEnd: totalCost - 30,
      estimatedRows: 1200,
      actualRows: 1150,
      timeMs: 14.2,
    });
  }

  nodes.push({
    id: 'node_scan',
    operation: scanType === 'Index Scan' ? 'Index Scan' : 'Seq Scan',
    tableName: 'orders',
    indexName: indexUsed || undefined,
    costStart: 0.0,
    costEnd: 45.0,
    estimatedRows: 10000,
    actualRows: 9850,
    timeMs: scanType === 'Index Scan' ? 0.8 : 15.6,
    warning: scanType === 'Sequential Scan' ? 'Full table sequential scan executed over 10,000 rows' : undefined,
    recommendation: scanType === 'Sequential Scan' ? 'Add B-Tree index on filter column' : undefined,
  });

  const suggestions: string[] = [];
  if (scanType === 'Sequential Scan') {
    suggestions.push('Create B-Tree index on WHERE/JOIN condition column to eliminate full table scan.');
  }
  if (hasOrderBy && !hasIndex) {
    suggestions.push('Add composite index matching (category, created_at DESC) to avoid explicit Sort node.');
  }
  if (hasJoin) {
    suggestions.push('Verify foreign key column has index for fast Hash/Nested-Loop joins.');
  }
  if (suggestions.length === 0) {
    suggestions.push('Query execution plan is fully optimized with index coverage.');
  }

  return {
    query,
    totalCost,
    estimatedExecutionTimeMs: estTimeMs,
    planningTimeMs: 0.35,
    scanType,
    indexUsed,
    planNodes: nodes,
    optimizationSuggestions: suggestions,
  };
}
