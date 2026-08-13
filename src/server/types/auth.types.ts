export type UserRole = 'student' | 'engineer' | 'architect' | 'admin';

export interface UserPreferences {
  theme: 'dark' | 'light' | 'cyber';
  defaultDialect: string;
  emailNotifications: boolean;
  autoFormatSql: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  isEmailVerified: boolean;
  avatarUrl?: string;
  bio?: string;
  title?: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  failedLoginAttempts: number;
  lockoutUntil?: string;
  githubHandle?: string;
  linkedinHandle?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  familyId: string; // Token family tracking for reuse detection
  isRevoked: boolean;
  ipAddress: string;
  userAgent: string;
  expiresAt: string;
  createdAt: string;
}

export interface EmailVerificationToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  lastActiveAt: string;
  createdAt: string;
}

export type OAuthProvider = 'google' | 'github' | 'microsoft';

export interface OAuthAccount {
  id: string;
  userId: string;
  provider: OAuthProvider;
  providerUserId: string;
  email: string;
  createdAt: string;
}

export interface SecurityAuditLog {
  id: string;
  userId?: string;
  action:
    | 'USER_REGISTERED'
    | 'USER_LOGIN_SUCCESS'
    | 'USER_LOGIN_FAILED'
    | 'ACCOUNT_LOCKED'
    | 'TOKEN_REFRESHED'
    | 'TOKEN_REVOKED'
    | 'PASSWORD_RESET_REQUESTED'
    | 'PASSWORD_RESET_COMPLETED'
    | 'PASSWORD_CHANGED'
    | 'EMAIL_CHANGED'
    | 'EMAIL_VERIFIED'
    | 'OAUTH_LOGIN_SUCCESS';
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
  createdAt: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  jti?: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}
