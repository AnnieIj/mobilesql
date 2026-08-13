import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Database,
  Building2,
  Award,
  Sparkles,
  Layers,
  Code2,
  BotMessageSquare,
  FileText,
  Terminal,
} from 'lucide-react';
import type { EnterpriseProject } from '../../data/portfolioProjectsData';
import { usePortfolioStore } from '../../stores/usePortfolioStore';
import { useAcademyStore } from '../../stores/useAcademyStore';
import { MonacoSQLEditor } from '../playground/MonacoSQLEditor';
import { executePlaygroundQuery } from '../../services/sqlExecutionEngine';
import type { SQLExecutionResult } from '../../types';

interface ProjectWorkspaceViewProps {
  project: EnterpriseProject;
  onBack: () => void;
}

export const ProjectWorkspaceView: React.FC<ProjectWorkspaceViewProps> = ({
  project,
  onBack,
}) => {
  const { activeTab, setActiveTab, completeObjective, completedObjectiveIds, unlockedCertificates } =
    usePortfolioStore();
  const { awardXp } = useAcademyStore();

  const [selectedObjIndex, setSelectedObjIndex] = useState(0);
  const activeObjective = project.objectives[selectedObjIndex];

  const [activeCode, setActiveCode] = useState(activeObjective?.targetSql || '');
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<SQLExecutionResult | null>(null);

  const isCurrentObjCompleted = completedObjectiveIds.includes(activeObjective.id);

  const handleRunQuery = async () => {
    setIsExecuting(true);
    const { result } = await executePlaygroundQuery(
      activeCode,
      project.databaseId,
      'PostgreSQL'
    );
    setIsExecuting(false);
    setQueryResult(result);

    // Verify objective
    if (!result.error && result.rowCount > 0) {
      completeObjective(project.id, activeObjective.id, activeObjective.xpReward);
      awardXp(activeObjective.xpReward);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#131315] font-sans text-[#FFFFFF] select-none">
      {/* Top Studio Header Bar */}
      <div className="bg-[#1B1B1E] border-b border-[#2D2D31] p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#62DF7D]/20 text-[#62DF7D] font-mono text-xs font-bold flex items-center justify-center">
                {project.companyLogoText}
              </span>
              <h2 className="text-sm md:text-base font-bold text-[#FFFFFF]">{project.title}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3B82F6]/20 text-[#3B82F6]">
                {project.industry}
              </span>
            </div>
            <p className="text-xs text-[#8A8A90] font-mono flex items-center gap-2 mt-0.5">
              <span>{project.companyName}</span>
              <span>•</span>
              <span className="text-[#62DF7D]">+{project.xpReward} Portfolio XP</span>
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleRunQuery}
          disabled={isExecuting}
          className="px-4 py-2 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-[#131315]" />
          <span>{isExecuting ? 'Running Query...' : 'Execute Objective Query'}</span>
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
        {/* Left Side: Business Requirements, ERD & Data Dictionary */}
        <div className="lg:col-span-5 bg-[#1B1B1E] border-r border-[#2D2D31] flex flex-col h-full overflow-y-auto custom-scrollbar p-5 space-y-5">
          {/* Navigation Tabs */}
          <div className="flex border-b border-[#2D2D31] gap-4 font-mono text-xs">
            <button
              onClick={() => setActiveTab('scenario')}
              className={`pb-2 cursor-pointer transition-all ${
                activeTab === 'scenario'
                  ? 'border-b-2 border-[#62DF7D] text-[#62DF7D] font-bold'
                  : 'text-[#8A8A90] hover:text-[#FFFFFF]'
              }`}
            >
              Scenario & Objectives
            </button>
            <button
              onClick={() => setActiveTab('erd')}
              className={`pb-2 cursor-pointer transition-all ${
                activeTab === 'erd'
                  ? 'border-b-2 border-[#62DF7D] text-[#62DF7D] font-bold'
                  : 'text-[#8A8A90] hover:text-[#FFFFFF]'
              }`}
            >
              ER Diagram Specs
            </button>
            <button
              onClick={() => setActiveTab('tables')}
              className={`pb-2 cursor-pointer transition-all ${
                activeTab === 'tables'
                  ? 'border-b-2 border-[#62DF7D] text-[#62DF7D] font-bold'
                  : 'text-[#8A8A90] hover:text-[#FFFFFF]'
              }`}
            >
              Data Dictionary
            </button>
          </div>

          {/* Scenario Tab */}
          {activeTab === 'scenario' && (
            <div className="space-y-4 text-xs leading-relaxed text-[#D0D0D5]">
              <div className="p-3.5 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                <span className="text-[#8A8A90] font-mono text-[10px] uppercase">
                  Company Briefing
                </span>
                <p className="text-[#FFFFFF]">{project.businessScenario}</p>
              </div>

              {/* Objectives List */}
              <div className="space-y-2">
                <span className="font-mono font-bold text-[#FFFFFF] text-xs">
                  Project Objectives Checklist ({project.objectives.length})
                </span>

                {project.objectives.map((obj, idx) => {
                  const isDone = completedObjectiveIds.includes(obj.id);
                  const isSelected = idx === selectedObjIndex;

                  return (
                    <div
                      key={obj.id}
                      onClick={() => {
                        setSelectedObjIndex(idx);
                        setActiveCode(obj.targetSql);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#131315] border-[#62DF7D] text-[#FFFFFF]'
                          : 'bg-[#131315]/50 border-[#2D2D31] text-[#8A8A90] hover:border-[#8A8A90]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs">
                          Task #{idx + 1}: {obj.title}
                        </span>
                        {isDone && (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-[#62DF7D] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Done
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8A8A90] mt-1">{obj.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ERD Tab */}
          {activeTab === 'erd' && (
            <div className="space-y-3 font-mono text-xs">
              <span className="text-[#8A8A90]">Relational Schema Cardinality:</span>
              <div className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#62DF7D] font-mono text-xs">
                {project.erDiagramSyntax}
              </div>
            </div>
          )}

          {/* Data Dictionary Tab */}
          {activeTab === 'tables' && (
            <div className="space-y-4 font-mono text-xs">
              {project.tables.map((t) => (
                <div key={t.tableName} className="p-3.5 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#62DF7D]">{t.tableName}</span>
                    <span className="text-[10px] text-[#8A8A90]">{t.rowCount} rows</span>
                  </div>
                  <p className="text-[11px] text-[#8A8A90] font-sans">{t.description}</p>
                  <div className="space-y-1 pt-1">
                    {t.columns.map((c) => (
                      <div key={c.name} className="flex items-center justify-between text-[11px]">
                        <span className="text-[#FFFFFF]">
                          {c.name} {c.keyType && <span className="text-[#62DF7D]">({c.keyType})</span>}
                        </span>
                        <span className="text-[#8A8A90]">{c.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Monaco Editor & Execution Results */}
        <div className="lg:col-span-7 bg-[#131315] flex flex-col h-full overflow-hidden">
          {/* Editor Header */}
          <div className="p-2.5 bg-[#1B1B1E] border-b border-[#2D2D31] flex items-center justify-between text-xs font-mono text-[#8A8A90]">
            <span className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#62DF7D]" /> Enterprise Query Editor
            </span>
            <span>Task #{selectedObjIndex + 1} Workspace</span>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-[300px]">
            <MonacoSQLEditor
              value={activeCode}
              onChange={(val) => setActiveCode(val || '')}
              onRunQuery={handleRunQuery}
            />
          </div>

          {/* Output Results Table */}
          <div className="bg-[#1B1B1E] border-t border-[#2D2D31] p-4 space-y-3 h-[220px] overflow-y-auto custom-scrollbar font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#FFFFFF]">Query Output Results</span>
              {isCurrentObjCompleted && (
                <span className="px-2.5 py-0.5 rounded bg-[#62DF7D]/20 text-[#62DF7D] font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Objective Verified
                </span>
              )}
            </div>

            {queryResult && !queryResult.error && queryResult.rowCount > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[#2D2D31] bg-[#131315]">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#2D2D31] text-[#8A8A90] uppercase text-[10px]">
                      {queryResult.columns.map((col: string) => (
                        <th key={col} className="p-2">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.rows.map((row: Record<string, any>, rIdx: number) => (
                      <tr key={rIdx} className="border-b border-[#2D2D31]/40 hover:bg-[#1F1F23]">
                        {queryResult.columns.map((col: string) => (
                          <td key={col} className="p-2 text-[#FFFFFF]">
                            {String(row[col] ?? 'NULL')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-[#8A8A90] space-y-1">
                <p>Run query to inspect objective dataset execution results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
