export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  category: 'Speed' | 'Streak' | 'Architect' | 'Mastery';
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'badge_speedster',
    title: '10ms Speedster',
    description: 'Execute queries under 10ms execution latency',
    category: 'Speed',
  },
  {
    id: 'badge_streak_7',
    title: '7-Day Query Streak',
    description: 'Practice SQL 7 consecutive days without breaking',
    category: 'Streak',
  },
  {
    id: 'badge_window_master',
    title: 'Window Function Specialist',
    description: 'Master PARTITION BY, DENSE_RANK, and frame clauses',
    category: 'Mastery',
  },
  {
    id: 'badge_architect',
    title: 'Schema Architect',
    description: 'Design 3 high-performance relational schemas',
    category: 'Architect',
  },
];
