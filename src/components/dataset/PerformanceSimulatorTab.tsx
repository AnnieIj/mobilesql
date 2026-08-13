import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Zap,
  AlertTriangle,
  CheckCircle2,
  GitCommit,
  Clock,
  Gauge,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { useSqlLabStore } from '../../stores/useSqlLabStore';
import { analyzeQueryPerformance } from '../../services/performanceSimulatorService';

export const PerformanceSimulatorTab: React.FC = () => {
  const { activeTabId, tabs } = useSqlLabStore();
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const [testQuery, setTestQuery] = useState(
    activeTab?.query || 'SELECT c.full_name, SUM(o.total_amount) FROM customers c JOIN orders o ON c.customer_id = o.customer_id WHERE o.status = \'Shipped\' GROUP BY c.full_name ORDER BY 2 DESC;'
  );

  const [perfPlan, setPerfPlan] = useState(() => analyzeQueryPerformance(testQuery));

  const handleSimulate = () => {
    const res = analyzeQueryPerformance(testQuery);
    setPerfPlan(res);
  };

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF]">
      {/* Header */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#FFFFFF] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#62DF7D]" /> Query Performance Simulator & Execution Plan Estimator
          </h2>
          <p className="text-xs text-[#8A8A90] mt-0.5">
            Simulate PostgreSQL / MySQL EXPLAIN ANALYZE execution trees, scan types, cost metrics, and index optimization tips.
          </p>
        </div>

        <button
          onClick={handleSimulate}
          className="px-5 py-2.5 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
        >
          <Zap className="w-4 h-4" /> Run EXPLAIN ANALYZE
        </button>
      </div>

      {/* Query Input & Metrics Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        <div className="lg:col-span-2 bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-3 shadow-xl">
          <label className="text-[#8A8A90] text-[10px] uppercase font-bold block">SQL Query for Performance Testing:</label>
          <textarea
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            rows={4}
            className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-3 text-xs text-[#62DF7D] font-mono focus:outline-none resize-none"
          />
        </div>

        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-3 shadow-xl flex flex-col justify-between">
          <span className="text-[#8A8A90] text-[10px] uppercase font-bold">Estimated Cost Summary</span>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131315] border border-[#2D2D31]">
              <span className="text-[#8A8A90]">Total Cost (Cost Units):</span>
              <span className="font-bold text-[#F59E0B]">{perfPlan.totalCost.toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131315] border border-[#2D2D31]">
              <span className="text-[#8A8A90]">Est Execution Time:</span>
              <span className="font-bold text-[#62DF7D]">{perfPlan.estimatedExecutionTimeMs} ms</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131315] border border-[#2D2D31]">
              <span className="text-[#8A8A90]">Primary Scan Type:</span>
              <span className="font-bold text-[#3B82F6]">{perfPlan.scanType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Plan Nodes Tree */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl font-mono text-xs">
        <h3 className="font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <GitCommit className="w-4 h-4 text-[#3B82F6]" /> Visual Execution Plan Node Tree (EXPLAIN ANALYZE)
        </h3>

        <div className="space-y-3">
          {perfPlan.planNodes.map((node, idx) => (
            <div key={node.id} className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] space-y-2 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-[#FFFFFF] text-xs">{node.operation}</span>
                  {node.tableName && <span className="text-[#8A8A90]">on {node.tableName}</span>}
                  {node.indexName && <span className="text-[#62DF7D]">using index ({node.indexName})</span>}
                </div>

                <span className="text-[10px] text-[#8A8A90]">{node.timeMs} ms</span>
              </div>

              {node.warning && (
                <div className="p-2.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-[11px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{node.warning}</span>
                </div>
              )}

              {node.recommendation && (
                <div className="p-2.5 rounded-lg bg-[#62DF7D]/10 border border-[#62DF7D]/30 text-[#62DF7D] text-[11px] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{node.recommendation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
