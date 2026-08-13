import React from 'react';
import { Zap, Clock, Award, Play, CheckCircle2, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SectionTitle } from '../layout/Headers';
import { MOCK_DAILY_CHALLENGE } from '../../data/dashboardData';
import { useUIStore } from '../../stores/useUIStore';

export const DailyChallengeSection: React.FC = () => {
  const { setActiveTab, addToast } = useUIStore();
  const challenge = MOCK_DAILY_CHALLENGE;

  return (
    <div className="space-y-4 font-sans">
      <SectionTitle
        title="Daily SQL Performance Challenge"
        subtitle="Solve sub-10ms query optimization challenges to maintain your streak and earn bonus XP"
        icon={<Zap className="w-5 h-5 text-[#F59E0B]" />}
      />

      <Card className="relative p-6 sm:p-8 bg-gradient-to-r from-[#1B1B1E] via-[#1B1B1E] to-[#232326] border-2 border-[#F59E0B]/40 shadow-2xl rounded-3xl overflow-hidden space-y-6">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <Badge variant="warning" icon={<Zap className="w-3.5 h-3.5 text-[#F59E0B]" />}>
              Daily Challenge #{new Date().toISOString().slice(0, 10)}
            </Badge>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30">
              {challenge.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#232326] text-[#C8C8CC] border border-[#2D2D31]">
              {challenge.topic}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1 text-[#8A8A90]">
              <Clock className="w-3.5 h-3.5 text-[#8A8A90]" />
              {challenge.estTimeMinutes} min est.
            </span>
            <span className="flex items-center gap-1 font-bold text-[#62DF7D]">
              <Award className="w-4 h-4 text-[#62DF7D]" />
              +{challenge.xpReward} XP
            </span>
          </div>
        </div>

        {/* Challenge Description */}
        <div className="space-y-2 relative z-10">
          <h2 className="text-xl sm:text-2xl font-black text-[#FFFFFF] tracking-tight">
            {challenge.title}
          </h2>
          <p className="text-sm text-[#C8C8CC] leading-relaxed max-w-3xl">
            {challenge.description}
          </p>
        </div>

        {/* Challenge Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#2D2D31] relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#8A8A90]">
            <Sparkles className="w-4 h-4 text-[#62DF7D]" />
            <span>Target Execution Latency: <strong className="text-[#62DF7D] font-mono">&lt; 10ms</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="glow"
              size="md"
              leftIcon={<Play className="w-4 h-4 text-[#131315] fill-current" />}
              onClick={() => {
                setActiveTab('challenges');
                addToast({
                  title: 'Daily Challenge Loaded',
                  message: 'Starting Rolling 7-Day Revenue Window Frame Optimization.',
                  type: 'xp',
                });
              }}
            >
              Start Challenge (+{challenge.xpReward} XP)
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
