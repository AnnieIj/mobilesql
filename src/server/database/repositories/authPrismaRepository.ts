import db from '../client';
import {
  RefreshToken,
  EmailVerificationToken,
  PasswordResetToken,
  Session,
  OAuthAccount,
  SecurityAuditLog,
  OAuthProvider,
} from '../../types/auth.types';
import { handleDatabaseError } from '../dbErrors';

export class AuthPrismaRepository {
  // --- REFRESH TOKENS ---
  async saveRefreshToken(
    data: Omit<RefreshToken, 'id' | 'createdAt'>
  ): Promise<RefreshToken> {
    try {
      const record = await db.refreshToken.create({
        data: {
          userId: data.userId,
          tokenHash: data.tokenHash,
          familyId: data.familyId,
          isRevoked: data.isRevoked,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          expiresAt: new Date(data.expiresAt),
        },
      });

      return {
        id: record.id,
        userId: record.userId,
        tokenHash: record.tokenHash,
        familyId: record.familyId,
        isRevoked: record.isRevoked,
        ipAddress: record.ipAddress,
        userAgent: record.userAgent,
        expiresAt: record.expiresAt.toISOString(),
        createdAt: record.createdAt.toISOString(),
      };
    } catch (error) {
      throw handleDatabaseError(error, 'RefreshToken');
    }
  }

  async findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
    try {
      const record = await db.refreshToken.findUnique({
        where: { tokenHash },
      });
      if (!record) return null;

      return {
        id: record.id,
        userId: record.userId,
        tokenHash: record.tokenHash,
        familyId: record.familyId,
        isRevoked: record.isRevoked,
        ipAddress: record.ipAddress,
        userAgent: record.userAgent,
        expiresAt: record.expiresAt.toISOString(),
        createdAt: record.createdAt.toISOString(),
      };
    } catch (error) {
      throw handleDatabaseError(error, 'RefreshToken');
    }
  }

  async revokeRefreshToken(id: string): Promise<void> {
    try {
      await db.refreshToken.update({
        where: { id },
        data: { isRevoked: true },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'RefreshToken');
    }
  }

  async revokeTokenFamily(familyId: string): Promise<void> {
    try {
      await db.refreshToken.updateMany({
        where: { familyId },
        data: { isRevoked: true },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'RefreshToken');
    }
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    try {
      await db.refreshToken.updateMany({
        where: { userId },
        data: { isRevoked: true },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'RefreshToken');
    }
  }

  // --- EMAIL VERIFICATION TOKENS ---
  async createEmailVerificationToken(
    userId: string,
    token: string,
    expiresInHours: number = 24
  ): Promise<EmailVerificationToken> {
    try {
      const expiresAt = new Date(Date.now() + expiresInHours * 3600 * 1000);
      const record = await db.emailVerificationToken.create({
        data: { userId, token, expiresAt },
      });

      return {
        id: record.id,
        userId: record.userId,
        token: record.token,
        expiresAt: record.expiresAt.toISOString(),
        createdAt: record.createdAt.toISOString(),
      };
    } catch (error) {
      throw handleDatabaseError(error, 'EmailVerificationToken');
    }
  }

  async findEmailVerificationToken(token: string): Promise<EmailVerificationToken | null> {
    try {
      const record = await db.emailVerificationToken.findUnique({ where: { token } });
      if (!record) return null;

      return {
        id: record.id,
        userId: record.userId,
        token: record.token,
        expiresAt: record.expiresAt.toISOString(),
        createdAt: record.createdAt.toISOString(),
      };
    } catch (error) {
      throw handleDatabaseError(error, 'EmailVerificationToken');
    }
  }

  async deleteEmailVerificationToken(token: string): Promise<void> {
    try {
      await db.emailVerificationToken.deleteMany({ where: { token } });
    } catch (error) {
      throw handleDatabaseError(error, 'EmailVerificationToken');
    }
  }

  // --- PASSWORD RESET TOKENS ---
  async createPasswordResetToken(
    userId: string,
    token: string,
    expiresInMinutes: number = 60
  ): Promise<PasswordResetToken> {
    try {
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
      const record = await db.passwordResetToken.create({
        data: { userId, token, expiresAt },
      });

      return {
        id: record.id,
        userId: record.userId,
        token: record.token,
        isUsed: record.isUsed,
        expiresAt: record.expiresAt.toISOString(),
        createdAt: record.createdAt.toISOString(),
      };
    } catch (error) {
      throw handleDatabaseError(error, 'PasswordResetToken');
    }
  }

  async findPasswordResetToken(token: string): Promise<PasswordResetToken | null> {
    try {
      const record = await db.passwordResetToken.findUnique({ where: { token } });
      if (!record) return null;

      return {
        id: record.id,
        userId: record.userId,
        token: record.token,
        isUsed: record.isUsed,
        expiresAt: record.expiresAt.toISOString(),
        createdAt: record.createdAt.toISOString(),
      };
    } catch (error) {
      throw handleDatabaseError(error, 'PasswordResetToken');
    }
  }

  async markPasswordResetTokenUsed(token: string): Promise<void> {
    try {
      await db.passwordResetToken.updateMany({
        where: { token },
        data: { isUsed: true },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'PasswordResetToken');
    }
  }

  // --- SESSIONS ---
  async createSession(userId: string, ipAddress: string, userAgent: string): Promise<Session> {
    try {
      const record = await db.session.create({
        data: { userId, ipAddress, userAgent },
      });

      return {
        id: record.id,
        userId: record.userId,
        ipAddress: record.ipAddress,
        userAgent: record.userAgent,
        lastActiveAt: record.lastActiveAt.toISOString(),
        createdAt: record.createdAt.toISOString(),
      };
    } catch (error) {
      throw handleDatabaseError(error, 'Session');
    }
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    try {
      await db.session.deleteMany({ where: { userId } });
    } catch (error) {
      throw handleDatabaseError(error, 'Session');
    }
  }

  // --- OAUTH ACCOUNTS ---
  async createOAuthAccount(
    userId: string,
    provider: OAuthProvider,
    providerUserId: string,
    email: string
  ): Promise<OAuthAccount> {
    try {
      const providerEnumMap: Record<string, any> = {
        google: 'GOOGLE',
        github: 'GITHUB',
        microsoft: 'MICROSOFT',
      };

      const record = await db.oAuthAccount.create({
        data: {
          userId,
          provider: providerEnumMap[provider] || 'GOOGLE',
          providerUserId,
          email,
        },
      });

      return {
        id: record.id,
        userId: record.userId,
        provider: record.provider.toLowerCase() as OAuthProvider,
        providerUserId: record.providerUserId,
        email: record.email,
        createdAt: record.createdAt.toISOString(),
      };
    } catch (error) {
      throw handleDatabaseError(error, 'OAuthAccount');
    }
  }

  async findOAuthAccount(provider: OAuthProvider, providerUserId: string): Promise<OAuthAccount | null> {
    try {
      const providerEnumMap: Record<string, any> = {
        google: 'GOOGLE',
        github: 'GITHUB',
        microsoft: 'MICROSOFT',
      };

      const record = await db.oAuthAccount.findFirst({
        where: {
          provider: providerEnumMap[provider] || 'GOOGLE',
          providerUserId,
        },
      });
      if (!record) return null;

      return {
        id: record.id,
        userId: record.userId,
        provider: record.provider.toLowerCase() as OAuthProvider,
        providerUserId: record.providerUserId,
        email: record.email,
        createdAt: record.createdAt.toISOString(),
      };
    } catch (error) {
      throw handleDatabaseError(error, 'OAuthAccount');
    }
  }

  // --- SECURITY AUDIT LOGS ---
  async logSecurityEvent(data: {
    userId?: string;
    action: string;
    ipAddress: string;
    userAgent: string;
    details?: any;
  }): Promise<SecurityAuditLog> {
    try {
      const record = await db.securityAuditLog.create({
        data: {
          userId: data.userId || null,
          action: data.action,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          details: data.details ? JSON.parse(JSON.stringify(data.details)) : undefined,
        },
      });

      return {
        id: record.id,
        userId: record.userId || undefined,
        action: record.action as any,
        ipAddress: record.ipAddress,
        userAgent: record.userAgent,
        details: (record.details as any) || undefined,
        createdAt: record.createdAt.toISOString(),
      };
    } catch (error) {
      throw handleDatabaseError(error, 'SecurityAuditLog');
    }
  }
}

export const authPrismaRepository = new AuthPrismaRepository();
