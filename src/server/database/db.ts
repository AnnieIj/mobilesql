import {
  User,
  LessonProgress,
  ChallengeSubmission,
  SavedQuery,
  QueryHistoryItem,
  Dataset,
  Dashboard,
  PortfolioProject,
  Certificate,
  Notification,
} from '../types';

export class Database {
  private static instance: Database;

  public users: Map<string, User> = new Map();
  public lessonProgress: Map<string, LessonProgress> = new Map();
  public challengeSubmissions: Map<string, ChallengeSubmission> = new Map();
  public savedQueries: Map<string, SavedQuery> = new Map();
  public queryHistory: Map<string, QueryHistoryItem> = new Map();
  public datasets: Map<string, Dataset> = new Map();
  public dashboards: Map<string, Dashboard> = new Map();
  public portfolioProjects: Map<string, PortfolioProject> = new Map();
  public certificates: Map<string, Certificate> = new Map();
  public notifications: Map<string, Notification> = new Map();
  public marketplaceTemplates: Map<string, any> = new Map();

  private constructor() {
    this.seedInitialData();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private seedInitialData() {
    // Seed Demo/Admin User
    const demoUser: User = {
      id: 'usr_demo_2026',
      email: 'demo@mobilesql.app',
      name: 'Alex Rivera',
      username: 'arivera_sql',
      passwordHash: '$2a$10$wT8K8U1hY1XzUe1Nq8Jp.e9H3v/gqJj2bZ7jY9w4zN4u8kL7mK1yO', // "password123"
      role: 'architect',
      isEmailVerified: true,
      failedLoginAttempts: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      title: 'Senior SQL Architect & Data Lead',
      bio: 'Mastering SQL optimization, distributed database architectures, and MobileSQL BI analytics.',
      xp: 2450,
      level: 12,
      streakDays: 14,
      lastActiveDate: new Date().toISOString(),
      githubHandle: 'arivera-sql',
      linkedinHandle: 'alex-rivera-db',
      preferences: {
        theme: 'dark',
        defaultDialect: 'PostgreSQL',
        emailNotifications: true,
        autoFormatSql: true,
      },
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(demoUser.id, demoUser);

    // Seed Demo Saved Query
    const query1: SavedQuery = {
      id: 'sq_101',
      userId: demoUser.id,
      title: 'Top Customer LTV & Cohort Retention',
      description: 'Calculates 90-day LTV, active order counts, and total spend per customer.',
      query: `SELECT u.id, u.name, COUNT(o.id) AS total_orders, SUM(o.total_amount) AS ltv FROM users u JOIN orders o ON u.id = o.user_id WHERE o.status = 'completed' GROUP BY u.id, u.name ORDER BY ltv DESC LIMIT 10;`,
      dialect: 'PostgreSQL',
      isFavorite: true,
      tags: ['analytics', 'ltv', 'cohort'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.savedQueries.set(query1.id, query1);

    // Seed Demo Dashboard
    const dash1: Dashboard = {
      id: 'dash_exec_01',
      userId: demoUser.id,
      title: 'Global Revenue & User Growth Matrix',
      description: 'C-Suite executive dashboard tracking active revenue streams, conversion rates, and churn.',
      theme: 'emerald-dark',
      layout: [],
      widgets: [
        {
          id: 'w_kpi_rev',
          title: 'Monthly Recurring Revenue',
          type: 'kpi',
          size: 'small',
          dataSourceId: 'ds_ecommerce',
          dataSourceType: 'sql_playground',
          position: { x: 0, y: 0, w: 1, h: 1 },
          kpiConfig: {
            metricType: 'revenue',
            label: 'Monthly Recurring Revenue',
            value: 482910,
            unit: '$',
            changePercent: 18.4,
            comparisonPeriod: 'vs Prev Month',
            statusColor: 'green',
            iconName: 'DollarSign',
            sparklineData: [320, 340, 380, 410, 440, 482],
          },
        },
      ],
      isPublished: true,
      publicShareToken: 'pub_share_exec_9921',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.dashboards.set(dash1.id, dash1);

    // Seed Demo Portfolio Project
    const port1: PortfolioProject = {
      id: 'port_101',
      userId: demoUser.id,
      title: 'E-Commerce Fraud Detection & Anomaly Pipeline',
      description: 'A comprehensive SQL pipeline detecting high-frequency chargebacks and geographic IP shifts.',
      dialect: 'PostgreSQL',
      sqlSchema: 'CREATE TABLE transactions (id UUID PRIMARY KEY, user_id UUID, amount NUMERIC, ip_address VARCHAR(45));',
      queries: [{ name: 'Fraud Trigger Query', sql: 'SELECT * FROM transactions WHERE amount > 5000;' }],
      tags: ['Security', 'Fraud', 'Analytics'],
      githubUrl: 'https://github.com/arivera-sql/ecommerce-fraud-sql',
      isFeatured: true,
      viewsCount: 342,
      likesCount: 89,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.portfolioProjects.set(port1.id, port1);

    // Seed Demo Certificate
    const cert1: Certificate = {
      id: 'cert_101',
      userId: demoUser.id,
      title: 'Senior Database Architect & Query Optimization Specialist',
      trackName: 'MobileSQL Enterprise Mastery',
      credentialId: 'MSQL-CERT-2026-9912',
      issuedAt: new Date().toISOString(),
      skillsVerified: ['Indexing', 'Query Tuning', 'Window Functions', 'Partitioning'],
      certificateUrl: 'https://mobilesql.app/verify/MSQL-CERT-2026-9912',
    };
    this.certificates.set(cert1.id, cert1);

    // Seed Demo Notification
    const notif1: Notification = {
      id: 'notif_101',
      userId: demoUser.id,
      title: 'Streak Milestone Achieved!',
      message: 'You completed a 14-day continuous SQL study streak and earned 250 Bonus XP!',
      type: 'achievement',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.set(notif1.id, notif1);
  }
}

export const db = Database.getInstance();
