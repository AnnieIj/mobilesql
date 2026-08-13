import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';
import { AchievementCard } from '../shared/DomainCards';
import { SectionTitle } from '../layout/Headers';
import { Button } from '../ui/Button';
import { useUIStore } from '../../stores/useUIStore';
import type { AchievementBadge } from '../../types';

const RECENT_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'ach_speedster',
    title: 'Sub-10ms Speedster',
    description: 'Execute 10 complex join queries under 10ms execution latency.',
    unlocked: true,
    unlockedAt: '2 days ago',
    progress: 10,
    maxProgress: 10,
    category: 'Speed',
    iconName: 'Zap',
  },
  {
    id: 'ach_cte',
    title: 'Recursive CTE Master',
    description: 'Write and optimize 20 recursive Common Table Expressions.',
    unlocked: true,
    unlockedAt: 'Yesterday',
    progress: 20,
    maxProgress: 20,
    category: 'Mastery',
    iconName: 'Terminal',
  },
  {
    id: 'ach_schema',
    title: 'Production Schema Architect',
    description: 'Design 12 normalized production relational database schemas.',
    unlocked: false,
    progress: 10,
    maxProgress: 12,
    category: 'Architect',
    iconName: 'Database',
  },
  {
    id: 'ach_streak',
    title: '14-Day Consistency Warrior',
    description: 'Maintain an uninterrupted 14-day daily learning streak.',
    unlocked: true,
    unlockedAt: 'Today',
    progress: 14,
    maxProgress: 14,
    category: 'Streak',
    iconName: 'Flame',
  },
];

export const AchievementsSection: React.FC = () => {
  const { setActiveTab, addToast } = useUIStore();

  return (
    <div className="space-y-4 font-sans">
      <SectionTitle
        title="Recent Achievements & Badges"
        subtitle="Badges earned for execution speed, streak milestones, and query precision"
        icon={<Trophy className="w-5 h-5 text-[#F59E0B]" />}
        action={
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} onClick={() => setActiveTab('achievements')}>
            All Badges
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RECENT_ACHIEVEMENTS.map((badge) => (
          <AchievementCard
            key={badge.id}
            badge={badge}
            onClaim={() =>
              addToast({
                title: 'Achievement Unlocked!',
                message: `Claimed +500 XP for ${badge.title}.`,
                type: 'xp',
              })
            }
          />
        ))}
      </div>
    </div>
  );
};
