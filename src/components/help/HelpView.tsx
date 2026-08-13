import React from 'react';
import { HelpCircle, BookOpen, Terminal, Sparkles, Command, CheckCircle2, Search, AlertTriangle } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';

export const HelpView: React.FC = () => {
  const { setSearchOpen, setCopilotOpen, setActiveTab } = useUIStore();

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-[#FFFFFF] select-none">
      {/* Header */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#62DF7D]/15 border border-[#62DF7D]/40 text-[#62DF7D] flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#FFFFFF]">MobileSQL Documentation & Help Center</h1>
              <p className="text-xs text-[#8A8A90] font-mono">
                PostgreSQL v16 syntax cheat sheet, SQLite WASM mechanics, and keyboard shortcut reference.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] text-xs font-mono text-[#FFFFFF] cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-[#8A8A90]" /> Search (⌘K)
            </button>
            <button
              onClick={() => setCopilotOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#62DF7D] text-[#131315] font-bold text-xs font-mono cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Ask Copilot
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Card */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <Command className="w-4 h-4 text-[#62DF7D]" /> Essential Keyboard Shortcuts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-1">
            <span className="text-[#8A8A90] text-[10px]">Command Search</span>
            <div className="font-bold text-[#62DF7D]">⌘ + K</div>
          </div>
          <div className="p-3 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-1">
            <span className="text-[#8A8A90] text-[10px]">Run Query</span>
            <div className="font-bold text-[#62DF7D]">⌘ + Enter</div>
          </div>
          <div className="p-3 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-1">
            <span className="text-[#8A8A90] text-[10px]">Toggle AI Copilot</span>
            <div className="font-bold text-[#3B82F6]">⌘ + I</div>
          </div>
          <div className="p-3 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-1">
            <span className="text-[#8A8A90] text-[10px]">Clear Terminal Output</span>
            <div className="font-bold text-[#A855F7]">Ctrl + L</div>
          </div>
        </div>
      </div>

      {/* SQL Quick Cheat Sheet */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <Terminal className="w-4 h-4 text-[#62DF7D]" /> PostgreSQL v16 Quick Cheat Sheet
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
            <span className="text-[#62DF7D] font-bold">Window Frame Clauses</span>
            <pre className="text-[11px] text-[#C8C8CC]">
{`SUM(amount) OVER (
  PARTITION BY user_id 
  ORDER BY created_at 
  ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
)`}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
            <span className="text-[#3B82F6] font-bold">Recursive CTE Syntax</span>
            <pre className="text-[11px] text-[#C8C8CC]">
{`WITH RECURSIVE org_tree AS (
  SELECT id, manager_id, 1 AS depth FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.manager_id, t.depth + 1 FROM employees e JOIN org_tree t ON e.manager_id = t.id
) SELECT * FROM org_tree;`}
            </pre>
          </div>
        </div>
      </div>

      {/* System Error & UX Diagnostic Testing Cards */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B]" /> UX Diagnostics & Custom Error Page Previews
        </h2>
        <p className="text-xs text-[#8A8A90] font-mono">
          Click any error state below to trigger and inspect the corresponding custom error page layout:
        </p>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <button
            onClick={() => setActiveTab('error-404')}
            className="px-3 py-1.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#F59E0B]/20 transition-all cursor-pointer font-bold"
          >
            Preview 404 Route Error
          </button>
          <button
            onClick={() => setActiveTab('error-500')}
            className="px-3 py-1.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/20 transition-all cursor-pointer font-bold"
          >
            Preview 500 WASM Panic
          </button>
          <button
            onClick={() => setActiveTab('error-offline')}
            className="px-3 py-1.5 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6]/20 transition-all cursor-pointer font-bold"
          >
            Preview Network Offline
          </button>
          <button
            onClick={() => setActiveTab('error-403')}
            className="px-3 py-1.5 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] hover:bg-[#A855F7]/20 transition-all cursor-pointer font-bold"
          >
            Preview 403 Unauthorized
          </button>
          <button
            onClick={() => setActiveTab('error-expired')}
            className="px-3 py-1.5 rounded-xl bg-[#62DF7D]/10 border border-[#62DF7D]/30 text-[#62DF7D] hover:bg-[#62DF7D]/20 transition-all cursor-pointer font-bold"
          >
            Preview Session Expired
          </button>
        </div>
      </div>
    </main>
  );
};
