export * from './auth.types';

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: Record<string, any>;
  timestamp: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  completedAt?: string;
}

export interface ChallengeSubmission {
  id: string;
  userId: string;
  challengeId: string;
  userQuery: string;
  passed: boolean;
  executionTimeMs: number;
  submittedAt: string;
}

export interface SavedQuery {
  id: string;
  userId: string;
  title: string;
  description?: string;
  query: string;
  dialect: string;
  databaseId?: string;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QueryHistoryItem {
  id: string;
  userId: string;
  query: string;
  dialect: string;
  status: 'success' | 'error';
  executionTimeMs: number;
  rowCount: number;
  errorMessage?: string;
  executedAt: string;
}

export interface Dataset {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  rowCount: number;
  tableCount: number;
  sizeBytes: number;
  schemaJson: any;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Dashboard {
  id: string;
  userId: string;
  title: string;
  description?: string;
  theme: string;
  layout: any[];
  widgets: any[];
  isPublished: boolean;
  publicShareToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioProject {
  id: string;
  userId: string;
  title: string;
  description: string;
  dialect: string;
  sqlSchema: string;
  queries: any[];
  tags: string[];
  githubUrl?: string;
  isFeatured: boolean;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  title: string;
  trackName: string;
  credentialId: string;
  issuedAt: string;
  skillsVerified: string[];
  certificateUrl?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'achievement' | 'alert';
  isRead: boolean;
  createdAt: string;
}
