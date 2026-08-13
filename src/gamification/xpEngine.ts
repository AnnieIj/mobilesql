export interface LevelInfo {
  level: number;
  title: string;
  currentXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

export function calculateLevel(totalXp: number): LevelInfo {
  const level = Math.floor(totalXp / 500) + 1;
  const currentLevelBaseXp = (level - 1) * 500;
  const currentXpInLevel = totalXp - currentLevelBaseXp;
  const nextLevelXp = 500;
  const progressPercent = Math.min(100, Math.round((currentXpInLevel / nextLevelXp) * 100));

  let title = 'Novice Queryer';
  if (level >= 15) title = 'SQL Master Architect';
  else if (level >= 10) title = 'Senior Database Engineer';
  else if (level >= 5) title = 'Data Analyst';
  else if (level >= 2) title = 'Junior Query Writer';

  return {
    level,
    title,
    currentXp: totalXp,
    nextLevelXp: level * 500,
    progressPercent,
  };
}
