import React, { useState, useMemo } from 'react';
import { Play, Copy, Check, Sparkles, Clock, Rows, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button, IconButton } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { SQLExecutionResult } from '../../types';

export interface TerminalWindowProps {
  title?: string;
  statusText?: string;
  onRun?: () => void;
  isExecuting?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  title = 'query_editor.sql',
  statusText = 'Prod-DB-01 (PostgreSQL)',
  onRun,
  isExecuting = false,
  children,
  className,
}) => {
  return (
    <div className={cn('rounded-xl border border-[#2D2D31] bg-[#09090B] overflow-hidden shadow-2xl flex flex-col', className)}>
      {/* Top Terminal Window Control Bar */}
      <div className="h-10 bg-[#1B1B1E] border-b border-[#2D2D31] px-3 flex items-center justify-between select-none">
        {/* Window Dots & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/80" />
          </div>
          <span className="text-xs font-mono font-medium text-[#8A8A90]">{title}</span>
        </div>

        {/* Status Chip & Run Action */}
        <div className="flex items-center gap-2">
          {statusText && (
            <div className="hidden xs:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#131315] border border-[#2D2D31] text-[11px] font-mono text-[#C8C8CC]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#62DF7D] animate-pulse" />
              <span>{statusText}</span>
            </div>
          )}
          {onRun && (
            <Button
              size="sm"
              variant="glow"
              isLoading={isExecuting}
              leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
              onClick={onRun}
              aria-label="Execute SQL Script"
            >
              Run
            </Button>
          )}
        </div>
      </div>

      {/* Terminal Content Canvas */}
      <div className="p-4 overflow-x-auto flex-1 font-mono text-xs text-[#FFFFFF]">
        {children}
      </div>
    </div>
  );
};

export interface SQLCodeBlockProps {
  code: string;
  showLineNumbers?: boolean;
}

export const SQLCodeBlock: React.FC<SQLCodeBlockProps> = ({
  code,
  showLineNumbers = true,
}) => {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => code.trim().split('\n'), [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group font-mono text-xs leading-relaxed text-[#FFFFFF] bg-[#09090B] p-3 rounded-lg border border-[#2D2D31]">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconButton
          icon={copied ? <Check className="w-3.5 h-3.5 text-[#62DF7D]" /> : <Copy className="w-3.5 h-3.5" />}
          aria-label="Copy code snippet"
          size="sm"
          variant="ghost"
          onClick={handleCopy}
        />
      </div>

      <div className="flex">
        {showLineNumbers && (
          <div className="select-none text-[#8A8A90]/60 pr-4 text-right border-r border-[#2D2D31] mr-4 space-y-0.5">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <div className="overflow-x-auto space-y-0.5 text-[#FFFFFF]">
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export interface CodeEditorContainerProps {
  value: string;
  onChange: (value: string) => void;
  onExecute?: () => void;
}

export const CodeEditorContainer: React.FC<CodeEditorContainerProps> = ({
  value,
  onChange,
  onExecute,
}) => {
  const sqlKeywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT'];

  const insertKeyword = (keyword: string) => {
    onChange(`${value} ${keyword} `);
  };

  return (
    <div className="space-y-2">
      {/* Mobile SQL Keyword Insertion Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none">
        {sqlKeywords.map((kw) => (
          <button
            key={kw}
            onClick={() => insertKeyword(kw)}
            className="px-2.5 py-1 text-[11px] font-mono font-bold text-[#62DF7D] bg-[#1B1B1E] border border-[#2D2D31] rounded-md hover:border-[#62DF7D] active:scale-95 transition-all shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#62DF7D]"
          >
            {kw}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <div className="relative rounded-xl border border-[#2D2D31] bg-[#09090B] overflow-hidden focus-within:border-[#62DF7D] transition-colors">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="-- Write your SQL query here..."
          aria-label="SQL Editor Code Input"
          className="w-full h-48 p-4 bg-transparent text-[#FFFFFF] font-mono text-xs sm:text-sm resize-none focus:outline-none leading-relaxed placeholder-[#8A8A90]"
          spellCheck={false}
        />
        {onExecute && (
          <div className="absolute bottom-3 right-3">
            <Button
              size="sm"
              variant="glow"
              leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
              onClick={onExecute}
            >
              Execute Query
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export interface QueryResultTableProps {
  result: SQLExecutionResult | null;
  onExplainAI?: () => void;
}

export const QueryResultTable: React.FC<QueryResultTableProps> = ({
  result,
  onExplainAI,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  if (!result) return null;

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return result.rows;
    const lower = searchTerm.toLowerCase();
    return result.rows.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(lower))
    );
  }, [result.rows, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page]);

  return (
    <div className="rounded-xl border border-[#2D2D31] bg-[#1B1B1E] overflow-hidden space-y-0 shadow-xl">
      {/* Metrics Header */}
      <div className="p-3 bg-[#131315] border-b border-[#2D2D31] flex items-center justify-between flex-wrap gap-2 text-xs select-none">
        <div className="flex items-center gap-3">
          <Badge variant="emerald" icon={<Check className="w-3 h-3 text-[#62DF7D]" />}>
            Query Executed
          </Badge>
          <span className="flex items-center gap-1 text-[#8A8A90] font-mono">
            <Clock className="w-3.5 h-3.5 text-[#62DF7D]" />
            {result.executionTimeMs}ms
          </span>
          <span className="flex items-center gap-1 text-[#8A8A90] font-mono">
            <Rows className="w-3.5 h-3.5 text-[#62DF7D]" />
            {result.rowCount} Rows
          </span>
        </div>

        {/* Search & AI explain */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8A8A90] absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Filter result set..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-2 py-1 text-xs font-mono bg-[#1B1B1E] border border-[#2D2D31] rounded-lg text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D] w-36 sm:w-48"
            />
          </div>

          {onExplainAI && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#62DF7D]" />}
              onClick={onExplainAI}
            >
              Explain AI
            </Button>
          )}
        </div>
      </div>

      {/* Data Grid */}
      <div className="overflow-x-auto max-h-80">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-[#232326] text-[#C8C8CC] border-b border-[#2D2D31] uppercase tracking-wider text-[11px]">
              {result.columns.map((col) => (
                <th key={col} className="p-3 font-semibold border-r border-[#2D2D31] last:border-r-0">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D2D31]">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={result.columns.length} className="p-6 text-center text-[#8A8A90] font-mono">
                  No rows matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#232326]/60 transition-colors">
                  {result.columns.map((col) => {
                    const val = String(row[col] ?? '');
                    const isCurrency = val.startsWith('$');
                    return (
                      <td
                        key={col}
                        className={cn(
                          'p-3 border-r border-[#2D2D31] last:border-r-0 text-[#FFFFFF] whitespace-nowrap',
                          isCurrency && 'text-[#62DF7D] font-bold'
                        )}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredRows.length > pageSize && (
        <div className="p-2.5 bg-[#131315] border-t border-[#2D2D31] flex items-center justify-between font-mono text-xs text-[#8A8A90]">
          <span>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredRows.length)} of {filteredRows.length}
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded bg-[#1B1B1E] border border-[#2D2D31] disabled:opacity-40 hover:text-[#FFFFFF] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-[#FFFFFF] font-bold">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded bg-[#1B1B1E] border border-[#2D2D31] disabled:opacity-40 hover:text-[#FFFFFF] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

