import React, { useState } from 'react';
import {
  Table as TableIcon,
  Activity,
  Download,
  Copy,
  Check,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  GitCommit,
  Clock,
  Layers,
  Database,
  FileSpreadsheet,
} from 'lucide-react';
import type { SQLExecutionResult } from '../../types';
import type { ExecutionPlanNode } from '../../services/sqlExecutionEngine';
import { exportToCSV } from '../../services/sqlExecutionEngine';
import { Button } from '../ui/Button';

interface QueryResultsPanelProps {
  result: SQLExecutionResult | null;
  plan: ExecutionPlanNode | null;
  isExecuting: boolean;
}

export const QueryResultsPanel: React.FC<QueryResultsPanelProps> = ({
  result,
  plan,
  isExecuting,
}) => {
  const [activeTab, setActiveTab] = useState<'table' | 'plan'>('table');
  const [filterText, setFilterText] = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);

  const pageSize = 10;

  if (isExecuting) {
    return (
      <div className="w-full h-full bg-[#1B1B1E] border-t border-[#2D2D31] flex flex-col items-center justify-center p-6 text-xs font-mono text-[#8A8A90]">
        <div className="w-8 h-8 border-2 border-[#62DF7D] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-[#FFFFFF] font-bold text-sm">Executing Query...</p>
        <p className="text-[11px] text-[#8A8A90]">Parsing AST & fetching dataset records</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full h-full bg-[#1B1B1E] border-t border-[#2D2D31] flex flex-col items-center justify-center p-6 text-center text-xs font-mono text-[#8A8A90]">
        <TableIcon className="w-10 h-10 text-[#2D2D31] mb-2" />
        <p className="text-[#FFFFFF] font-bold text-sm">Query Results & Execution Plan</p>
        <p className="text-[11px] text-[#8A8A90] max-w-sm mt-1">
          Press <span className="text-[#62DF7D] font-bold">Ctrl + Enter</span> or click <span className="text-[#62DF7D]">Run</span> above to execute your SQL statement.
        </p>
      </div>
    );
  }

  // Handle Query Error State
  if (result.error) {
    return (
      <div className="w-full h-full bg-[#1B1B1E] border-t border-[#2D2D31] p-4 font-mono text-xs overflow-y-auto">
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/40 rounded-xl p-4 text-[#EF4444] space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            Execution Error ({result.dialect})
          </div>
          <p className="text-xs font-mono text-[#FFFFFF] bg-[#131315] p-3 rounded-lg border border-[#2D2D31]">
            {result.error}
          </p>
          <p className="text-[11px] text-[#8A8A90]">
            💡 Tip: Ask the <span className="text-[#62DF7D] font-bold">AI Assistant</span> on the right to auto-fix this syntax error!
          </p>
        </div>
      </div>
    );
  }

  // Filter & Sort Rows
  let displayRows = result.rows || [];
  if (filterText) {
    displayRows = displayRows.filter((r) =>
      Object.values(r).some((val) =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }

  if (sortCol) {
    displayRows = [...displayRows].sort((a, b) => {
      const valA = a[sortCol];
      const valB = b[sortCol];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }

  const totalPages = Math.ceil(displayRows.length / pageSize) || 1;
  const paginatedRows = displayRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCopyCSV = () => {
    const csvData = exportToCSV(result.columns, result.rows);
    navigator.clipboard.writeText(csvData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const csvData = exportToCSV(result.columns, result.rows);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_results_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full bg-[#1B1B1E] border-t border-[#2D2D31] flex flex-col font-sans select-none text-xs">
      {/* Top Header Bar */}
      <div className="bg-[#131315] border-b border-[#2D2D31] px-3 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1 rounded-lg font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'table'
                ? 'bg-[#62DF7D]/15 text-[#62DF7D] border border-[#62DF7D]/30'
                : 'text-[#8A8A90] hover:text-[#FFFFFF]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Data Table ({result.rowCount})
          </button>

          <button
            onClick={() => setActiveTab('plan')}
            className={`px-3 py-1 rounded-lg font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'plan'
                ? 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30'
                : 'text-[#8A8A90] hover:text-[#FFFFFF]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            EXPLAIN Plan
          </button>
        </div>

        {/* Center: Search Filter */}
        {activeTab === 'table' && (
          <div className="relative hidden sm:block">
            <Search className="w-3 h-3 text-[#8A8A90] absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter results..."
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#1B1B1E] border border-[#2D2D31] rounded-lg pl-7 pr-2 py-0.5 text-xs text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D]"
            />
          </div>
        )}

        {/* Right Metrics & Export */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[#62DF7D] font-bold bg-[#62DF7D]/10 px-2 py-0.5 rounded border border-[#62DF7D]/30">
            {result.executionTimeMs} ms
          </span>
          <span className="text-[#8A8A90]">| 1.2 MB RAM</span>

          <button
            onClick={handleCopyCSV}
            className="p-1 text-[#8A8A90] hover:text-[#FFFFFF] bg-[#1B1B1E] rounded border border-[#2D2D31] cursor-pointer"
            title="Copy as CSV"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#62DF7D]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownloadCSV}
            className="p-1 text-[#8A8A90] hover:text-[#FFFFFF] bg-[#1B1B1E] rounded border border-[#2D2D31] cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto custom-scrollbar p-2">
        {activeTab === 'table' ? (
          result.rows.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#8A8A90] font-mono p-6">
              <p>Query executed successfully with 0 rows returned.</p>
            </div>
          ) : (
            <div className="border border-[#2D2D31] rounded-xl overflow-hidden bg-[#131315]">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-[#1B1B1E] border-b border-[#2D2D31] text-[#8A8A90]">
                    {result.columns.map((col) => (
                      <th
                        key={col}
                        onClick={() => {
                          if (sortCol === col) {
                            setSortAsc(!sortAsc);
                          } else {
                            setSortCol(col);
                            setSortAsc(true);
                          }
                        }}
                        className="p-2.5 font-bold text-[#FFFFFF] hover:bg-[#232326] cursor-pointer border-r border-[#2D2D31]/50 last:border-r-0"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span>{col}</span>
                          {sortCol === col && (
                            <span className="text-[#62DF7D]">{sortAsc ? '▲' : '▼'}</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2D31]/40 text-[#FFFFFF]">
                  {paginatedRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#1F1F23] transition-colors"
                    >
                      {result.columns.map((col) => {
                        const cellVal = row[col];
                        const formattedVal =
                          cellVal === null || cellVal === undefined
                            ? 'NULL'
                            : typeof cellVal === 'object'
                            ? JSON.stringify(cellVal)
                            : String(cellVal);

                        return (
                          <td
                            key={col}
                            className="p-2.5 border-r border-[#2D2D31]/30 last:border-r-0 truncate max-w-[200px]"
                          >
                            <span
                              className={
                                cellVal === null
                                  ? 'text-[#8A8A90] italic'
                                  : typeof cellVal === 'number'
                                  ? 'text-[#3B82F6]'
                                  : 'text-[#FFFFFF]'
                              }
                            >
                              {formattedVal}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* EXPLAIN Plan Tree View */
          <div className="p-3 font-mono space-y-3">
            <div className="bg-[#131315] border border-[#2D2D31] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-[#2D2D31] pb-2">
                <span className="font-bold text-[#3B82F6] flex items-center gap-1.5">
                  <GitCommit className="w-4 h-4" />
                  PostgreSQL Query Execution Plan Node Tree
                </span>
                <span className="text-[#62DF7D] font-bold">Total Cost: {plan?.costEnd || 28.15}</span>
              </div>

              {/* Root Plan Node */}
              {plan && (
                <div className="p-3 bg-[#1B1B1E] border border-[#2D2D31] rounded-lg space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#62DF7D]">{plan.type}</span>
                    <span className="text-[10px] text-[#8A8A90]">
                      Cost: {plan.costStart}..{plan.costEnd}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8A8A90]">
                    Relation: <span className="text-[#FFFFFF]">{plan.relationName}</span> | Actual Time:{' '}
                    <span className="text-[#3B82F6]">{plan.actualTimeMs}ms</span> | Rows: {plan.rowsProcessed}
                  </p>

                  {/* Child Nodes */}
                  {plan.children && (
                    <div className="pl-4 border-l-2 border-[#3B82F6]/50 space-y-2 mt-2">
                      {plan.children.map((child) => (
                        <div key={child.id} className="p-2 bg-[#131315] border border-[#2D2D31] rounded">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-bold text-[#3B82F6]">{child.type}</span>
                            <span className="text-[10px] text-[#8A8A90]">{child.actualTimeMs}ms</span>
                          </div>
                          <p className="text-[10px] text-[#8A8A90]">Target: {child.relationName}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      {activeTab === 'table' && totalPages > 1 && (
        <div className="bg-[#131315] border-t border-[#2D2D31] px-3 py-1.5 flex items-center justify-between font-mono text-[11px]">
          <span className="text-[#8A8A90]">
            Showing {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, displayRows.length)} of {displayRows.length} rows
          </span>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="px-2 text-[#FFFFFF]">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
