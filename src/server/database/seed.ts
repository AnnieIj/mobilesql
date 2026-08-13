import db from './client';
import { AuthUtils } from '../utils/auth';
import { logger } from '../utils/logger';

export async function seedDatabase() {
  logger.info('[Database Seed] Starting PostgreSQL database seeding...');

  try {
    const defaultPasswordHash = await AuthUtils.hashPassword('password123');

    // 1. Seed Core Users
    const architect = await db.user.upsert({
      where: { email: 'alex.rivera@mobilesql.internal' },
      update: {},
      create: {
        email: 'alex.rivera@mobilesql.internal',
        username: 'arivera_sql',
        name: 'Alex Rivera',
        passwordHash: defaultPasswordHash,
        role: 'ARCHITECT',
        isEmailVerified: true,
        xp: 3450,
        level: 12,
        streakDays: 24,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        title: 'Senior SQL Architect & Data Lead',
        bio: 'Mastering SQL optimization, distributed database architectures, and MobileSQL BI analytics.',
        settings: {
          create: {
            theme: 'DARK',
            defaultDialect: 'POSTGRESQL',
            emailNotifications: true,
            autoFormatSql: true,
          },
        },
      },
    });

    const engineer = await db.user.upsert({
      where: { email: 'jordan.chen@mobilesql.internal' },
      update: {},
      create: {
        email: 'jordan.chen@mobilesql.internal',
        username: 'jchen_data',
        name: 'Jordan Chen',
        passwordHash: defaultPasswordHash,
        role: 'ENGINEER',
        isEmailVerified: true,
        xp: 1850,
        level: 7,
        streakDays: 14,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        title: 'Database Reliability Engineer',
        settings: {
          create: {
            theme: 'DARK',
            defaultDialect: 'POSTGRESQL',
          },
        },
      },
    });

    // 2. Seed Academy Tracks
    const fundamentalsTrack = await db.academyTrack.upsert({
      where: { slug: 'sql-fundamentals' },
      update: {},
      create: {
        slug: 'sql-fundamentals',
        title: 'SQL Engineering Fundamentals',
        description: 'Master relational data models, SELECT queries, JOINs, aggregations, and subqueries.',
        difficulty: 'FUNDAMENTALS',
        iconName: 'Database',
        colorHex: '#3b82f6',
        orderIndex: 1,
        modules: {
          create: [
            {
              slug: 'select-and-filtering',
              title: 'SELECT Statements & Filtering',
              description: 'Learn projection, WHERE clauses, and pattern matching.',
              orderIndex: 1,
              lessons: {
                create: [
                  {
                    slug: 'anatomy-of-select',
                    title: 'Anatomy of a SELECT Query',
                    description: 'Understand execution order and projection.',
                    contentMarkdown: '# Anatomy of a SELECT Query\n\nIn SQL, projection selects specific columns...',
                    initialSql: 'SELECT * FROM users;',
                    solutionSql: 'SELECT id, email, name FROM users WHERE role = \'student\';',
                    xpReward: 50,
                    estimatedMin: 10,
                    orderIndex: 1,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    // 3. Seed Daily Challenges
    await db.challenge.upsert({
      where: { slug: 'monthly-active-user-retention' },
      update: {},
      create: {
        slug: 'monthly-active-user-retention',
        title: 'Calculate Monthly Active User Retention',
        description: 'Write a query returning user retention rates across consecutive billing cycles.',
        difficulty: 'ADVANCED',
        category: 'Analytics & Cohorts',
        dialect: 'POSTGRESQL',
        initialSql: 'SELECT user_id, signup_date FROM user_cohorts;',
        solutionSql: 'WITH monthly_activity AS (SELECT user_id, DATE_TRUNC(\'month\', active_date) AS month FROM user_logs) SELECT * FROM monthly_activity;',
        xpReward: 250,
        schemaSetupSql: 'CREATE TABLE user_logs (id UUID PRIMARY KEY, user_id UUID, active_date TIMESTAMP);',
        isDaily: true,
        scheduledDate: new Date(),
        testCases: {
          create: [
            {
              description: 'Returns correct cohort retention percentage',
              expectedOutput: [{ cohort_month: '2026-01-01', retention_pct: 84.5 }],
              orderIndex: 1,
            },
          ],
        },
      },
    });

    // 4. Seed Standard Billing Plans
    await db.plan.upsert({
      where: { code: 'PRO_MONTHLY' },
      update: {},
      create: {
        name: 'Professional Engineer',
        code: 'PRO_MONTHLY',
        description: 'Full access to AI SQL Assistant, unlimited practice databases, and verified certificates.',
        priceMonthlyUsd: 19.99,
        priceYearlyUsd: 199.99,
        featuresJson: ['Unlimited AI Query Optimizations', 'Custom Synthetic Dataset Generator', 'All Academy Tracks', 'Shareable Portfolio Projects'],
      },
    });

    logger.info('[Database Seed] PostgreSQL database seeding completed successfully.');
  } catch (error) {
    logger.error('[Database Seed] Failed to seed database:', error);
  }
}

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
