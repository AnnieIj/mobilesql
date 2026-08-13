import { z } from 'zod';

export const challengeDifficultyEnum = z.enum([
  'beginner',
  'intermediate',
  'advanced',
  'guru',
]);

export const submitChallengeSchema = z.object({
  query: z.string().min(1, 'SQL query cannot be empty'),
  dialect: z.string().default('PostgreSQL'),
});

export const unlockHintSchema = z.object({
  hintIndex: z.number().int().min(0).max(10).default(0),
});

export type SubmitChallengeInput = z.infer<typeof submitChallengeSchema>;
export type UnlockHintInput = z.infer<typeof unlockHintSchema>;
