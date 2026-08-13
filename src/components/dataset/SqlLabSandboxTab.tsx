import React from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Plus,
  X,
  Shield,
  Activity,
  Code,
  Sparkles,
  Bot,
  Copy,
  Sliders,
} from 'lucide-react';
import { useSqlLabStore } from '../../stores/useSqlLabStore';
import { useUIStore } from '../../stores/useUIStore';

export const SqlLabSandboxTab: React.FC = () => {
  const { addToast } = useUIStore();
  const {
    activeTabId,
    tabs,
    setActiveTabId,
    updateTabQuery,
    createNewTab,
    closeTab,
    executeQuery,
    toggleTransaction,
    analyzeQuery,
    isAssistantOpen,
    setAssistantOpen,
  } = useSqlLabStore();

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleRun = () => {
    executeQuery(activeTab.id);
    addToast({ title: 'Query Executed', message: 'Executed statement in isolated sandbox.', type: 'success' });
  };

  return (
    <div className="space-y-4 font-sans text-[#FFFFFF]">
      {/* Tab Navigation Header */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-2 flex items-center justify-between gap-2 overflow-x-auto font-mono text-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isSelected = tab.id === activeTab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`px-3 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
                  isSelected ? 'bg-[#131315] border border-[#62DF7D] text-[#62DF7D] font-bold' : 'text-[#8A8A90] hover:text-[#FFFFFF]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{tab.title}</span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="text-[#8A8A90] hover:text-[#EF4444]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={() => createNewTab()}
            className="p-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#62DF7D] hover:bg-[#232326] cursor-pointer"
            title="New SQL Lab Tab"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 pr-2 shrink-0">
          <button
            onClick={() => toggleTransaction(activeTab.id)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 cursor-pointer ${
              activeTab.inTransaction
                ? 'bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]'
                : 'bg-[#131315] border-[#2D2D31] text-[#8A8A90]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{activeTab.inTransaction ? 'TRANSACTION ACTIVE (BEGIN)' : 'AUTO-COMMIT MODE'}</span>
          </button>

          <button
            onClick={handleRun}
            className="px-4 py-1.5 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Execute SQL
          </button>
        </div>
      </div>

      {/* Main Split View: Editor + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
        {/* SQL Code Console */}
        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 space-y-3 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#2D2D31] pb-2">
            <span className="text-[#8A8A90] text-[10px] uppercase font-bold">SQL Editor ({activeTab.dialect})</span>
            <span className="text-[10px] text-[#62DF7D]">PostgreSQL 16 Engine</span>
          </div>

          <textarea
            value={activeTab.query}
            onChange={(e) => updateTabQuery(activeTab.id, e.target.value)}
            rows={14}
            className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-4 text-xs font-mono text-[#62DF7D] focus:outline-none focus:border-[#62DF7D] resize-none leading-relaxed"
          />
        </div>

        {/* Results Pane */}
        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 space-y-3 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#2D2D31] pb-2">
            <span className="text-[#8A8A90] text-[10px] uppercase font-bold">Execution Output</span>
            {activeTab.result && (
              <span className="text-[10px] text-[#3B82F6]">
                {activeTab.result.rowCount} rows • {activeTab.result.executionTimeMs} ms
              </span>
            )}
          </div>

          {activeTab.result ? (
            <div className="overflow-x-auto max-h-[300px]">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-[#2D2D31] text-[#8A8A90]">
                    {activeTab.result.columns.map((col, idx) => (
                      <th key={idx} className="pb-2 pr-4 font-bold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2D31]">
                  {activeTab.result.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {activeTab.result!.columns.map((col, cIdx) => (
                        <td key={cIdx} className="py-2 pr-4 text-[#C8C8CC]">
                          {String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-[260px] flex flex-col items-center justify-center text-[#8A8A90] space-y-2">
              <Terminal className="w-8 h-8 opacity-40 text-[#62DF7D]" />
              <p>Click "Execute SQL" to run query and view output table.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
