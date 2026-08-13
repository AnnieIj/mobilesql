import React from 'react';
import { Crown, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui';
import { Button } from '../ui/Button';
import { SectionTitle } from '../layout/Headers';
import { MOCK_LEADERBOARD } from '../../data/dashboardData';
import { useUIStore } from '../../stores/useUIStore';

export const LeaderboardPreviewSection: React.FC = () => {
  const { setActiveTab } = useUIStore();

  return (
    <div className="space-y-4 font-sans">
      <SectionTitle
        title="Global Learner Leaderboard"
        subtitle="Top database engineers ranked by execution efficiency and weekly XP"
        icon={<Crown className="w-5 h-5 text-[#F59E0B]" />}
        action={
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => setActiveTab('leaderboard')}>
            Full Standings
          </Button>
        }
      />

      <Card className="bg-[#1B1B1E] border border-[#2D2D31] p-2 rounded-2xl overflow-hidden divide-y divide-[#2D2D31]/60">
        {MOCK_LEADERBOARD.map((user) => (
          <div
            key={user.rank}
            className={`p-3.5 flex items-center justify-between gap-3 transition-colors rounded-xl ${
              user.isCurrentUser
                ? 'bg-[#62DF7D]/10 border border-[#62DF7D]/40 my-1'
                : 'hover:bg-[#232326]/60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Rank Position Badge */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                  user.rank === 1
                    ? 'bg-[#F59E0B] text-[#131315] shadow-[0_0_10px_#F59E0B]'
                    : user.rank === 2
                    ? 'bg-[#C8C8CC] text-[#131315]'
                    : user.rank === 3
                    ? 'bg-[#62DF7D] text-[#131315] shadow-[0_0_10px_#62DF7D]'
                    : 'bg-[#232326] text-[#8A8A90] border border-[#2D2D31]'
                }`}
              >
                #{user.rank}
              </div>

              {/* Avatar */}
              <Avatar name={user.name} avatarUrl={user.avatarUrl} level={user.level} status="online" />

              {/* User Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-[#FFFFFF] truncate">{user.name}</p>
                  {user.isCurrentUser && (
                    <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-[#62DF7D] text-[#131315] rounded">
                      YOU
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#8A8A90] font-mono">SQL Engineer Level {user.level}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
              <div className="hidden xs:flex items-center gap-1 text-[#F59E0B]">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{user.streakDays}d</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-[#62DF7D]">{user.weeklyXp.toLocaleString()}</span>
                <span className="text-[10px] text-[#8A8A90] block">XP THIS WEEK</span>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};
