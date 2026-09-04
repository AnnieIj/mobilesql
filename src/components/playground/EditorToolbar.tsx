import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Wand2,
  Copy,
  Download,
  Upload,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Database,
  CheckCircle2,
  AlertCircle,
  Trash2,
  FileCode,
} from 'lucide-react';
import type { SQLDialect } from '../../types';
import { usePlaygroundStore } from '../../stores/usePlaygroundStore';
import { PRACTICE_DATABASES } from '../../data/playgroundDatabases';
import { apiClient } from '../../services/apiClient';
import { Button } from '../ui/Button';

interface ToolbarProps {
  onRunQuery: () => void;
  onStopQuery: () => void;
  onFormatSql: () => void;
  isExecuting: boolean;
  executionTimeMs?: number;
  rowCount?: number;
}

const DIALECTS: { dialect: SQLDialect; label: string; color: string }[] = [
  { dialect: 'PostgreSQL', label: 'PostgreSQL v16', color: '#336791' },
  { dialect: 'SQLite', label: 'SQLite WASM', color: '#003B57' },
  { dialect: 'MySQL', label: 'MySQL 8.0', color: '#00758F' },
];

export const EditorToolbar: React.FC<ToolbarProps> = ({
  onRunQuery,
  onStopQuery,
  onFormatSql,
  isExecuting,
  executionTimeMs,
  rowCount,
}) => {
  const {
    tabs,
    activeTabId,
    updateTabContent,
    setTabDialect,
    setTabDatabase,
    fontSize,
    setFontSize,
  } = usePlaygroundStore();

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const currentDialect = activeTab?.dialect || 'PostgreSQL';
  const currentDbId = activeTab?.databaseId || 'ecommerce_prod';

  const [engineStatus, setEngineStatus] = useState<{
    ready: boolean;
    backend: string;
    label: string;
  }>({
    ready: true,
    backend: 'in-memory',
    label: 'Engine Ready (In-Memory Sandbox)',
  });
  const [isCheckingEngine, setIsCheckingEngine] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkEngine = async () => {
      try {
        setIsCheckingEngine(true);
        const status = await apiClient.sql.status(currentDbId);
        if (isMounted && status) {
          setEngineStatus({
            ready: status.ready,
            backend: status.backend,
            label: status.label || (status.backend === 'postgresql' ? 'Engine Ready (PostgreSQL)' : 'Engine Ready (In-Memory Sandbox)'),
          });
        }
      } catch {
        if (isMounted) {
          setEngineStatus({
            ready: true,
            backend: 'in-memory',
            label: 'Engine Ready (In-Memory Sandbox)',
          });
        }
      } finally {
        if (isMounted) setIsCheckingEngine(false);
      }
    };

    checkEngine();
    return () => {
      isMounted = false;
    };
  }, [currentDbId]);

  const handleCopy = () => {
    if (activeTab?.sql) {
      navigator.clipboard.writeText(activeTab.sql);
    }
  };

  const handleDownload = () => {
    if (!activeTab?.sql) return;
    const blob = new Blob([activeTab.sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab.title || 'query.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (activeTab) {
      updateTabContent(activeTab.id, '');
    }
  };

  return (
    <div className="bg-[#1B1B1E] border-b border-[#2D2D31] px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono select-none">
      {/* Left: Action Triggers */}
      <div className="flex items-center gap-2">
        {isExecuting ? (
          <Button
            size="sm"
            variant="danger"
            leftIcon={<Square className="w-3.5 h-3.5 fill-current animate-pulse" />}
            onClick={onStopQuery}
          >
            Stop Execution
          </Button>
        ) : (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={onRunQuery}
            className="shadow-[0_0_12px_rgba(98,223,125,0.25)] font-bold"
          >
            Run (Ctrl+Enter)
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          leftIcon={<Wand2 className="w-3.5 h-3.5 text-[#62DF7D]" />}
          onClick={onFormatSql}
          title="Auto-Format SQL (Ctrl+Shift+F)"
        >
          Format
        </Button>

        <div className="h-4 w-[1px] bg-[#2D2D31] mx-1 hidden sm:block" />

        {/* Database Dropdown Selector */}
        <div className="flex items-center gap-1.5 bg-[#131315] border border-[#2D2D31] px-2 py-1 rounded-lg">
          <Database className="w-3.5 h-3.5 text-[#3B82F6]" />
          <select
            value={currentDbId}
            onChange={(e) => activeTab && setTabDatabase(activeTab.id, e.target.value)}
            className="bg-transparent text-[#FFFFFF] font-sans font-medium focus:outline-none cursor-pointer"
          >
            {PRACTICE_DATABASES.map((db) => (
              <option key={db.id} value={db.id} className="bg-[#131315]">
                {db.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dialect Badges */}
        <div className="hidden lg:flex items-center gap-1">
          {DIALECTS.map((d) => (
            <button
              key={d.dialect}
              onClick={() => activeTab && setTabDialect(activeTab.id, d.dialect)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                currentDialect === d.dialect
                  ? 'bg-[#62DF7D] text-[#131315]'
                  : 'bg-[#131315] text-[#8A8A90] hover:text-[#FFFFFF] border border-[#2D2D31]'
              }`}
            >
              {d.dialect}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Quick Tools & Execution Stats */}
      <div className="flex items-center gap-2">
        {executionTimeMs !== undefined && (
          <div className="hidden md:flex items-center gap-2 bg-[#131315] px-2.5 py-1 rounded border border-[#2D2D31] text-[11px]">
            <span className="text-[#62DF7D] font-bold">{executionTimeMs}ms</span>
            <span className="text-[#2D2D31]">|</span>
            <span className="text-[#8A8A90]">{rowCount ?? 0} rows</span>
          </div>
        )}

        <div className="flex items-center gap-1 bg-[#131315] p-0.5 rounded border border-[#2D2D31]">
          <button
            onClick={() => setFontSize(fontSize - 1)}
            className="p-1 text-[#8A8A90] hover:text-[#FFFFFF]"
            title="Decrease Editor Font Size"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-[#FFFFFF] px-1">{fontSize}px</span>
          <button
            onClick={() => setFontSize(fontSize + 1)}
            className="p-1 text-[#8A8A90] hover:text-[#FFFFFF]"
            title="Increase Editor Font Size"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 text-[#8A8A90] hover:text-[#FFFFFF] bg-[#131315] rounded border border-[#2D2D31] cursor-pointer"
          title="Copy SQL to Clipboard"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleDownload}
          className="p-1.5 text-[#8A8A90] hover:text-[#FFFFFF] bg-[#131315] rounded border border-[#2D2D31] cursor-pointer"
          title="Download SQL File"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleClear}
          className="p-1.5 text-[#8A8A90] hover:text-[#EF4444] bg-[#131315] rounded border border-[#2D2D31] cursor-pointer"
          title="Clear Editor"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <span
          className={`hidden xl:flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${
            engineStatus.ready
              ? 'text-[#62DF7D] bg-[#62DF7D]/10 border-[#62DF7D]/30'
              : 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30'
          }`}
          title={`Active backend: ${engineStatus.backend}. Dialect: ${currentDialect}.`}
        >
          {isCheckingEngine ? (
            <RotateCcw className="w-3 h-3 animate-spin text-[#8A8A90]" />
          ) : engineStatus.ready ? (
            <CheckCircle2 className="w-3 h-3 text-[#62DF7D]" />
          ) : (
            <AlertCircle className="w-3 h-3 text-[#EF4444]" />
          )}
          {engineStatus.label}
        </span>
      </div>
    </div>
  );
};
