import React from 'react';
import { Activity, Clock, Zap, Target, Flame, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card } from '../ui/Card';
import { SectionTitle } from '../layout/Headers';
import { MOCK_ANALYTICS_DATA } from '../../data/dashboardData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#131315] border border-[#2D2D31] p-3 rounded-xl shadow-2xl font-mono text-xs space-y-1">
        <p className="font-bold text-[#FFFFFF]">{label}</p>
        <p className="text-[#62DF7D]">{payload[0].value} XP Earned</p>
        <p className="text-[#3B82F6]">{payload[0].payload.queries} Queries Executed</p>
        <p className="text-[#F59E0B]">{payload[0].payload.studyMins} mins studied</p>
      </div>
    );
  }
  return null;
};

export const LearningAnalyticsSection: React.FC = () => {
  const data = MOCK_ANALYTICS_DATA;

  return (
    <div className="space-y-4 font-sans">
      <SectionTitle
        title="Learning Analytics & Performance Metrics"
        subtitle="Weekly study volume, XP velocity, and query accuracy benchmarks"
        icon={<Activity className="w-5 h-5 text-[#62DF7D]" />}
      />

      {/* Analytics Summary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-1">
          <p className="text-[10px] text-[#8A8A90] font-mono uppercase font-bold">Weekly XP</p>
          <p className="text-base font-black text-[#62DF7D] font-mono">{data.stats.weeklyXp}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-1">
          <p className="text-[10px] text-[#8A8A90] font-mono uppercase font-bold">Lessons</p>
          <p className="text-base font-black text-[#FFFFFF] font-mono">{data.stats.lessonsCompleted}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-1">
          <p className="text-[10px] text-[#8A8A90] font-mono uppercase font-bold">Queries Run</p>
          <p className="text-base font-black text-[#3B82F6] font-mono">{data.stats.queriesExecuted}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-1">
          <p className="text-[10px] text-[#8A8A90] font-mono uppercase font-bold">Study Time</p>
          <p className="text-base font-black text-[#F59E0B] font-mono">{data.stats.studyTimeHours} hrs</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-1">
          <p className="text-[10px] text-[#8A8A90] font-mono uppercase font-bold">Daily Streak</p>
          <p className="text-base font-black text-[#F59E0B] font-mono">{data.stats.dailyStreak}d</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-1">
          <p className="text-[10px] text-[#8A8A90] font-mono uppercase font-bold">Accuracy</p>
          <p className="text-base font-black text-[#22C55E] font-mono">{data.stats.accuracyRate}%</p>
        </div>
      </div>

      {/* Recharts Bar Chart Card */}
      <Card className="bg-[#1B1B1E] border border-[#2D2D31] p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#2D2D31] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#FFFFFF]">Weekly XP Velocity Chart</h3>
            <p className="text-xs text-[#8A8A90]">Daily experience points earned across practice and modules</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#62DF7D] bg-[#62DF7D]/10 px-2.5 py-1 rounded-lg border border-[#62DF7D]/30">
            Avg: 638 XP / day
          </span>
        </div>

        <div className="w-full h-60 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D31" vertical={false} />
              <XAxis dataKey="day" stroke="#8A8A90" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#8A8A90" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="xp" fill="#62DF7D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
