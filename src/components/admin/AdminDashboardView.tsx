import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  Award,
  BookOpen,
  Zap,
  Server,
  Database,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Lock,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/cn';

export const AdminDashboardView: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'users' | 'queries' | 'challenges' | 'academy' | 'health'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'Users & Cohorts', icon: Users },
    { id: 'queries', label: 'Query Telemetry', icon: Database },
    { id: 'challenges', label: 'Challenge Analytics', icon: Zap },
    { id: 'academy', label: 'Academy Funnel', icon: BookOpen },
    { id: 'health', label: 'System & Infra Health', icon: Server },
  ] as const;

  const mockUsers = [
    { id: 'usr_01', name: 'Elena Rostova', email: 'elena@mobilesql.io', tier: 'Pro Architect', queries: 14280, xp: 18450, status: 'Active' },
    { id: 'usr_02', name: 'Alex Mercer', email: 'alex@mobilesql.io', tier: 'Pro Architect', queries: 8492, xp: 4250, status: 'Active' },
    { id: 'usr_03', name: 'Marcus Vance', email: 'marcus@cloudscale.io', tier: 'Student Pro', queries: 3120, xp: 7800, status: 'Active' },
    { id: 'usr_04', name: 'Sarah Chen', email: 'sarah@fintech.dev', tier: 'Enterprise Lead', queries: 6420, xp: 12100, status: 'Active' },
    { id: 'usr_05', name: 'Dev Guest #492', email: 'guest492@sandbox.io', tier: 'Community Free', queries: 48, xp: 350, status: 'Guest' },
  ];

  const recentTelemetryLogs = [
    { id: 'log_01', time: '16:08:12', dialect: 'PostgreSQL 16', query: 'SELECT * FROM orders WHERE total > 1000...', durationMs: 8.4, status: '200 OK' },
    { id: 'log_02', time: '16:08:04', dialect: 'SQLite WASM', query: 'WITH cohort AS (SELECT user_id, MIN(date)...', durationMs: 2.1, status: '200 OK' },
    { id: 'log_03', time: '16:07:55', dialect: 'PostgreSQL 16', query: 'EXPLAIN ANALYZE SELECT p.name, SUM(oi.qty)...', durationMs: 14.8, status: '200 OK' },
    { id: 'log_04', time: '16:07:40', dialect: 'MySQL 8', query: 'SELECT COUNT(*) FROM fraud_events GROUP BY...', durationMs: 18.2, status: '200 OK' },
    { id: 'log_05', time: '16:07:11', dialect: 'PostgreSQL 16', query: 'SELECT bad_column FROM non_existent_tbl', durationMs: 1.2, status: '400 Syntax' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-[#FFFFFF]">
      {/* Top Header */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#FFFFFF]">MobileSQL Internal Admin & Telemetry Console</h1>
                <Badge variant="warning">Restricted Admin</Badge>
              </div>
              <p className="text-xs text-[#8A8A90] font-mono">
                System telemetry, query metrics, challenge success ratios, and Academy completion funnel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={cn(
                'px-3.5 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] text-xs font-mono text-[#FFFFFF] flex items-center gap-2 transition-all cursor-pointer',
                isRefreshing && 'opacity-60'
              )}
            >
              <RefreshCw className={cn('w-3.5 h-3.5 text-[#62DF7D]', isRefreshing && 'animate-spin')} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-t border-[#2D2D31] pt-3">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 shrink-0 cursor-pointer',
                  isActive
                    ? 'bg-[#232326] text-[#62DF7D] font-bold border border-[#62DF7D]/30'
                    : 'text-[#8A8A90] hover:text-[#FFFFFF] hover:bg-[#131315]'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-[#62DF7D]' : 'text-[#8A8A90]')} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-2">
              <span className="text-[#8A8A90] text-[10px] uppercase">TOTAL REGISTERED USERS</span>
              <div className="text-2xl font-bold text-[#FFFFFF]">28,490</div>
              <div className="text-[10px] text-[#22C55E] flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +14.2% this week
              </div>
            </div>

            <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-2">
              <span className="text-[#8A8A90] text-[10px] uppercase">QUERIES EXECUTED (24H)</span>
              <div className="text-2xl font-bold text-[#62DF7D]">184,920</div>
              <div className="text-[10px] text-[#8A8A90]">Avg: 9.8ms latency</div>
            </div>

            <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-2">
              <span className="text-[#8A8A90] text-[10px] uppercase">CHALLENGE PASS RATIO</span>
              <div className="text-2xl font-bold text-[#3B82F6]">86.4%</div>
              <div className="text-[10px] text-[#22C55E]">12,480 completed</div>
            </div>

            <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-2">
              <span className="text-[#8A8A90] text-[10px] uppercase">SYSTEM AVAILABILITY</span>
              <div className="text-2xl font-bold text-[#22C55E]">99.98%</div>
              <div className="text-[10px] text-[#8A8A90]">Zero downtime incidents</div>
            </div>
          </div>

          {/* Real-time Query Activity Log */}
          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#62DF7D]" /> Live Query Stream Telemetry
              </h2>
              <span className="text-xs font-mono text-[#8A8A90]">Streaming 5ms polling</span>
            </div>

            <div className="rounded-xl border border-[#2D2D31] bg-[#131315] overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#1B1B1E] text-[#8A8A90] border-b border-[#2D2D31] text-[11px]">
                  <tr>
                    <th className="p-3">Time (UTC)</th>
                    <th className="p-3">Dialect</th>
                    <th className="p-3">SQL Statement Snippet</th>
                    <th className="p-3">Latency</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232326] text-[#FFFFFF]">
                  {recentTelemetryLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#1B1B1E]/40">
                      <td className="p-3 text-[#8A8A90]">{log.time}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#232326] border border-[#2D2D31] text-[10px] text-[#C8C8CC]">
                          {log.dialect}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[#62DF7D] max-w-xs truncate">{log.query}</td>
                      <td className="p-3 text-[#3B82F6]">{log.durationMs} ms</td>
                      <td className="p-3">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-bold',
                            log.status.startsWith('200')
                              ? 'bg-[#22C55E]/20 text-[#22C55E]'
                              : 'bg-[#EF4444]/20 text-[#EF4444]'
                          )}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* USERS & COHORTS TAB */}
      {activeAdminTab === 'users' && (
        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D2D31] pb-4">
            <h2 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#3B82F6]" /> Active Platform Users
            </h2>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by name or email..."
                className="w-full px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D]"
              />
              <Search className="w-3.5 h-3.5 text-[#8A8A90] absolute right-3 top-2.5" />
            </div>
          </div>

          <div className="rounded-xl border border-[#2D2D31] bg-[#131315] overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#1B1B1E] text-[#8A8A90] border-b border-[#2D2D31] text-[11px]">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Tier</th>
                  <th className="p-3">Queries Run</th>
                  <th className="p-3">XP Earned</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232326] text-[#FFFFFF]">
                {mockUsers
                  .filter((u) => u.name.toLowerCase().includes(searchFilter.toLowerCase()) || u.email.toLowerCase().includes(searchFilter.toLowerCase()))
                  .map((user) => (
                    <tr key={user.id} className="hover:bg-[#1B1B1E]/40">
                      <td className="p-3">
                        <div className="font-bold text-[#FFFFFF]">{user.name}</div>
                        <div className="text-[10px] text-[#8A8A90]">{user.email}</div>
                      </td>
                      <td className="p-3">
                        <Badge variant="emerald">{user.tier}</Badge>
                      </td>
                      <td className="p-3 text-[#62DF7D] font-bold">{user.queries.toLocaleString()}</td>
                      <td className="p-3 text-[#F59E0B] font-bold">{user.xp.toLocaleString()} XP</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-bold">
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SYSTEM HEALTH TAB */}
      {(activeAdminTab === 'health' || activeAdminTab === 'queries' || activeAdminTab === 'challenges' || activeAdminTab === 'academy') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
              <Cpu className="w-4 h-4 text-[#62DF7D]" /> Node Container Memory & Resources
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center p-3 bg-[#131315] rounded-xl border border-[#2D2D31]">
                <span className="text-[#8A8A90]">Heap Used / Total</span>
                <span className="text-[#62DF7D] font-bold">48.2 MB / 128 MB</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#131315] rounded-xl border border-[#2D2D31]">
                <span className="text-[#8A8A90]">Resident Set Size (RSS)</span>
                <span className="text-[#3B82F6] font-bold">86.4 MB</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#131315] rounded-xl border border-[#2D2D31]">
                <span className="text-[#8A8A90]">Uptime</span>
                <span className="text-[#FFFFFF] font-bold">14d 8h 22m</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
              <Lock className="w-4 h-4 text-[#A855F7]" /> Security & Rate-Limit Audit
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center p-3 bg-[#131315] rounded-xl border border-[#2D2D31]">
                <span className="text-[#8A8A90]">Rate Limit Blocks (24h)</span>
                <span className="text-[#22C55E] font-bold">0 (Clean)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#131315] rounded-xl border border-[#2D2D31]">
                <span className="text-[#8A8A90]">SQL Injection Sanitization</span>
                <span className="text-[#62DF7D] font-bold">100% Passed</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#131315] rounded-xl border border-[#2D2D31]">
                <span className="text-[#8A8A90]">Active Connection Pool</span>
                <span className="text-[#F59E0B] font-bold">12 / 50 connections</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
