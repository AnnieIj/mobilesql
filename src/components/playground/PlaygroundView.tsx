import React, { useState, useEffect } from 'react';
import { Bot, PanelLeft, Sparkles, SlidersHorizontal } from 'lucide-react';
import { usePlaygroundStore } from '../../stores/usePlaygroundStore';
import { useSQLEngineStore } from '../../stores/useSQLEngineStore';
import { PlaygroundHeaderStats } from './PlaygroundHeaderStats';
import { PlaygroundSidebar } from './PlaygroundSidebar';
import { EditorTabsBar } from './EditorTabsBar';
import { EditorToolbar } from './EditorToolbar';
import { MonacoSQLEditor } from './MonacoSQLEditor';
import { QueryResultsPanel } from './QueryResultsPanel';
import { AIAssistantPanel } from './AIAssistantPanel';
import { PracticeModeBanner } from './PracticeModeBanner';
import { TemplatesModal } from './TemplatesModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { executePlaygroundQuery } from '../../services/sqlExecutionEngine';
import type { ExecutionPlanNode } from '../../services/sqlExecutionEngine';

export const PlaygroundView: React.FC = () => {
  const {
    tabs,
    activeTabId,
    updateTabContent,
    sidebarCollapsed,
    toggleSidebar,
    aiPanelOpen,
    setAiPanelOpen,
    isExerciseActive,
  } = usePlaygroundStore();

  const { setResult, setExecuting, isExecuting, latestResult } = useSQLEngineStore();

  const [activeDbId, setActiveDbId] = useState('ecommerce_prod');
  const [currentPlan, setCurrentPlan] = useState<ExecutionPlanNode | null>(null);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Mobile Drawer State
  const [mobileTab, setMobileTab] = useState<'editor' | 'sidebar' | 'ai'>('editor');

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleRunQuery = async () => {
    if (!activeTab?.sql) return;
    setExecuting(true);

    const { result, plan } = await executePlaygroundQuery(
      activeTab.sql,
      activeTab.databaseId || activeDbId,
      activeTab.dialect || 'PostgreSQL'
    );

    setResult(result);
    setCurrentPlan(plan || null);
  };

  const handleStopQuery = () => {
    setExecuting(false);
  };

  const handleFormatSql = () => {
    if (!activeTab?.sql) return;
    // Pretty-print SQL formatting
    const formatted = activeTab.sql
      .replace(/\s+/g, ' ')
      .replace(/\s*(SELECT|FROM|WHERE|JOIN|GROUP BY|HAVING|ORDER BY|LIMIT|WITH)\s*/gi, '\n$1 ')
      .trim();
    updateTabContent(activeTab.id, formatted);
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#131315] flex flex-col overflow-hidden select-none font-sans">
      {/* Top Gamification Header Stats */}
      <PlaygroundHeaderStats
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
      />

      {/* Practice Challenge Banner if Exercise Active */}
      {isExerciseActive && <PracticeModeBanner />}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* DESKTOP LEFT SIDEBAR */}
        <div
          className={`hidden md:block h-full transition-all duration-300 ${
            sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-72'
          }`}
        >
          <PlaygroundSidebar
            activeDatabaseId={activeDbId}
            onSelectDatabase={setActiveDbId}
          />
        </div>

        {/* MAIN CENTER EDITOR & RESULTS PANE */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-[#131315]">
          {/* Tabs Bar & Mobile Controls */}
          <div className="flex items-center justify-between bg-[#131315]">
            <div className="flex items-center min-w-0 flex-1">
              <button
                onClick={toggleSidebar}
                className="hidden md:flex p-2 text-[#8A8A90] hover:text-[#FFFFFF] border-r border-[#2D2D31] cursor-pointer"
                title="Toggle Left Sidebar (Ctrl+B)"
              >
                <PanelLeft className="w-4 h-4" />
              </button>

              <EditorTabsBar />
            </div>

            {/* AI Toggle Button */}
            <button
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className={`p-2 font-mono text-xs font-bold border-l border-[#2D2D31] flex items-center gap-1.5 cursor-pointer transition-colors ${
                aiPanelOpen
                  ? 'bg-[#62DF7D]/15 text-[#62DF7D]'
                  : 'text-[#8A8A90] hover:text-[#FFFFFF]'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Mentor</span>
            </button>
          </div>

          {/* Editor Toolbar */}
          <EditorToolbar
            onRunQuery={handleRunQuery}
            onStopQuery={handleStopQuery}
            onFormatSql={handleFormatSql}
            isExecuting={isExecuting}
            executionTimeMs={latestResult?.executionTimeMs}
            rowCount={latestResult?.rowCount}
          />

          {/* Split View: Top Editor (60%) | Bottom Results (40%) */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Monaco SQL Editor */}
            <div className="h-[55%] min-h-[200px] w-full relative border-b border-[#2D2D31]">
              <MonacoSQLEditor
                value={activeTab?.sql || ''}
                onChange={(val) => activeTab && updateTabContent(activeTab.id, val)}
                onRunQuery={handleRunQuery}
                onFormatQuery={handleFormatSql}
              />
            </div>

            {/* Query Results Panel */}
            <div className="h-[45%] min-h-[160px] w-full">
              <QueryResultsPanel
                result={latestResult}
                plan={currentPlan}
                isExecuting={isExecuting}
              />
            </div>
          </div>
        </div>

        {/* DESKTOP RIGHT AI ASSISTANT PANEL */}
        <div
          className={`hidden lg:block h-full transition-all duration-300 ${
            aiPanelOpen ? 'w-80' : 'w-0 overflow-hidden border-none'
          }`}
        >
          <AIAssistantPanel />
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION DRAWERS */}
      <div className="md:hidden bg-[#1B1B1E] border-t border-[#2D2D31] p-2 flex justify-around text-xs font-mono">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex items-center gap-1.5 p-2 rounded-lg ${
            mobileTab === 'editor' ? 'bg-[#62DF7D] text-[#131315] font-bold' : 'text-[#8A8A90]'
          }`}
        >
          <Sparkles className="w-4 h-4" /> SQL Editor
        </button>

        <button
          onClick={() => setMobileTab('sidebar')}
          className={`flex items-center gap-1.5 p-2 rounded-lg ${
            mobileTab === 'sidebar' ? 'bg-[#62DF7D] text-[#131315] font-bold' : 'text-[#8A8A90]'
          }`}
        >
          <PanelLeft className="w-4 h-4" /> Workspace
        </button>

        <button
          onClick={() => setMobileTab('ai')}
          className={`flex items-center gap-1.5 p-2 rounded-lg ${
            mobileTab === 'ai' ? 'bg-[#62DF7D] text-[#131315] font-bold' : 'text-[#8A8A90]'
          }`}
        >
          <Bot className="w-4 h-4" /> AI Mentor
        </button>
      </div>

      {/* Modals */}
      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
};
