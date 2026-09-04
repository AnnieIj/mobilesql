import React from 'react';
import { Terminal, Play, Clock, Database, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SectionTitle } from '../layout/Headers';
import { SQLCodeBlock } from '../shared/TerminalComponents';
import { MOCK_RECENT_QUERIES } from '../../data/dashboardData';
import { useUIStore } from '../../stores/useUIStore';
import { usePlaygroundStore } from '../../stores/usePlaygroundStore';

export const RecentQueriesSection: React.FC = () => {
  const { setActiveTab, addToast } = useUIStore();
  const { executionHistory, createNewTab } = usePlaygroundStore();

  const queries = executionHistory.length > 0
    ? executionHistory.slice(0, 3).map((item, idx) => ({
        id: `real_${idx}`,
        sql: item.query,
        database: item.dialect || 'PostgreSQL',
        executionTimeMs: item.executionTimeMs,
        executedAt: new Date(item.executedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: item.error ? 'error' : 'success',
      }))
    : MOCK_RECENT_QUERIES;

  return (
    <div className="space-y-4 font-sans">
      <SectionTitle
        title="Recent Playground Queries"
        subtitle="Recently executed SQL workbench sessions with latency stats"
        icon={<Terminal className="w-5 h-5 text-[#62DF7D]" />}
        action={
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => setActiveTab('playground')}>
            Open Playground
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {queries.map((q) => (
          <Card
            key={q.id}
            className="bg-[#1B1B1E] border border-[#2D2D31] p-4 rounded-2xl flex flex-col justify-between space-y-3 font-mono"
          >
            <div className="flex items-center justify-between text-[10px] text-[#8A8A90] pb-2 border-b border-[#2D2D31]">
              <div className="flex items-center gap-1.5 text-[#62DF7D]">
                <Database className="w-3 h-3 text-[#62DF7D]" />
                <span className="font-bold">{q.database}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.2 rounded bg-[#232326] text-[#62DF7D] font-bold">
                  {q.executionTimeMs}ms
                </span>
                <span className="text-[#8A8A90]">{q.executedAt}</span>
              </div>
            </div>

            <div className="flex-1 bg-[#131315] p-2.5 rounded-xl border border-[#2D2D31] overflow-hidden">
              <SQLCodeBlock code={q.sql} />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Play className="w-3.5 h-3.5 text-[#62DF7D]" />}
                onClick={() => {
                  createNewTab('Recent Query', q.sql);
                  setActiveTab('playground');
                  addToast({
                    title: 'Query Loaded',
                    message: `Loaded into Playground tab: ${q.sql.slice(0, 30)}...`,
                    type: 'info',
                  });
                }}
              >
                Run Again
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
