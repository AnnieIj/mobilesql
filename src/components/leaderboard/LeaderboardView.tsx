import React, { useState } from 'react';
import { Crown, Trophy, Search, Flame, Zap, Award, Sparkles, Filter } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatarText: string;
  division: string;
  xp: number;
  avgLatencyMs: number;
  solvedCount: number;
  streakDays: number;
  badge: string;
  isUser?: boolean;
}

const LEADERBOARD_DATA: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Alexandre Mercer',
    avatarText: 'AM',
    division: 'Pro Architect Division',
    xp: 28450,
    avgLatencyMs: 3.2,
    solvedCount: 142,
    streakDays: 48,
    badge: '👑 World #1 Architect',
  },
  {
    rank: 2,
    name: 'Elena Rostova',
    avatarText: 'ER',
    division: 'Pro Architect Division',
    xp: 26100,
    avgLatencyMs: 4.1,
    solvedCount: 138,
    streakDays: 32,
    badge: '⚡ Speedmaster',
  },
  {
    rank: 3,
    name: 'Chen Wei',
    avatarText: 'CW',
    division: 'SQL Engineer',
    xp: 24900,
    avgLatencyMs: 4.8,
    solvedCount: 125,
    streakDays: 29,
    badge: '🔥 30d Streak',
  },
  {
    rank: 4,
    name: 'Sofia Vance',
    avatarText: 'SV',
    division: 'SQL Engineer',
    xp: 22800,
    avgLatencyMs: 5.2,
    solvedCount: 112,
    streakDays: 21,
    badge: '🏆 Arena Champ',
  },
  {
    rank: 5,
    name: 'SQL Query Architect (You)',
    avatarText: 'SQ',
    division: 'Pro Architect Division',
    xp: 18450,
    avgLatencyMs: 8.0,
    solvedCount: 94,
    streakDays: 14,
    badge: 'FAANG Candidate',
    isUser: true,
  },
  {
    rank: 6,
    name: 'David Kim',
    avatarText: 'DK',
    division: 'Data Analyst',
    xp: 16200,
    avgLatencyMs: 9.1,
    solvedCount: 82,
    streakDays: 12,
    badge: 'Analyst Pro',
  },
];

export const LeaderboardView: React.FC = () => {
  const { addToast } = useUIStore();
  const [filter, setFilter] = useState<'all' | 'weekly' | 'speed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = LEADERBOARD_DATA.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-[#FFFFFF] select-none">
      {/* Header */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B] flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#FFFFFF]">Global Developer Leaderboard</h1>
              <p className="text-xs text-[#8A8A90] font-mono">
                Top database query architects ranked by execution speed, XP, and Arena solutions.
              </p>
            </div>
          </div>

          {/* User Rank Card */}
          <div className="px-4 py-2 rounded-xl bg-[#131315] border border-[#62DF7D]/40 flex items-center gap-3 font-mono text-xs">
            <span className="text-[#8A8A90]">Your Global Rank:</span>
            <span className="text-[#62DF7D] font-extrabold text-sm">#5 (Top 1%)</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 font-mono text-xs border-t border-[#2D2D31]">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#8A8A90] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter architects..."
              className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl pl-9 pr-3 py-2 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {(['all', 'weekly', 'speed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl border capitalize transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-[#62DF7D] text-[#131315] font-bold border-[#62DF7D]'
                    : 'bg-[#131315] text-[#8A8A90] border-[#2D2D31] hover:text-[#FFFFFF]'
                }`}
              >
                {f === 'speed' ? 'Sub-5ms Latency' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#131315] border-b border-[#2D2D31] text-[#8A8A90] uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Architect</th>
                <th className="py-3 px-4">Division</th>
                <th className="py-3 px-4 text-right">Latency</th>
                <th className="py-3 px-4 text-right">Streak</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D2D31]">
              {filteredUsers.map((u) => (
                <tr
                  key={u.rank}
                  className={`transition-colors ${
                    u.isUser
                      ? 'bg-[#62DF7D]/10 text-[#FFFFFF] font-bold'
                      : 'hover:bg-[#131315]/60 text-[#C8C8CC]'
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold ${
                        u.rank === 1
                          ? 'bg-[#F59E0B] text-[#131315]'
                          : u.rank === 2
                          ? 'bg-[#94A3B8] text-[#131315]'
                          : u.rank === 3
                          ? 'bg-[#B45309] text-[#FFFFFF]'
                          : 'bg-[#131315] text-[#8A8A90]'
                      }`}
                    >
                      {u.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-center justify-center text-[#62DF7D] font-bold text-xs">
                        {u.avatarText}
                      </div>
                      <div>
                        <p className="font-sans font-bold text-sm text-[#FFFFFF] flex items-center gap-2">
                          {u.name}
                          {u.isUser && (
                            <span className="px-1.5 py-0.2 rounded bg-[#62DF7D] text-[#131315] text-[9px] font-bold">
                              YOU
                            </span>
                          )}
                        </p>
                        <span className="text-[10px] text-[#8A8A90]">{u.badge}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#8A8A90] text-[11px]">{u.division}</td>
                  <td className="py-3.5 px-4 text-right text-[#62DF7D] font-bold">
                    {u.avgLatencyMs} ms
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#F59E0B] font-bold">
                    <span className="inline-flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current" /> {u.streakDays}d
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#FFFFFF] font-bold">
                    {u.xp.toLocaleString()} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
