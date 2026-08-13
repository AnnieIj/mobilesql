import {
  RefreshToken,
  EmailVerificationToken,
  PasswordResetToken,
  Session,
  OAuthAccount,
  SecurityAuditLog,
  OAuthProvider,
} from '../types/auth.types';

// In-memory persistent data stores for auth entities
const refreshTokensStore = new Map<string, RefreshToken>();
const emailVerificationTokensStore = new Map<string, EmailVerificationToken>();
const passwordResetTokensStore = new Map<string, PasswordResetToken>();
const sessionsStore = new Map<string, Session>();
const oauthAccountsStore = new Map<string, OAuthAccount>();
const auditLogsStore: SecurityAuditLog[] = [];

export class AuthRepository {
  // --- REFRESH TOKENS ---
  async saveRefreshToken(tokenData: Omit<RefreshToken, 'id' | 'createdAt'>): Promise<RefreshToken> {
    const id = `rt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const refreshToken: RefreshToken = {
      ...tokenData,
      id,
      createdAt: new Date().toISOString(),
    };
    refreshTokensStore.set(id, refreshToken);
    return refreshToken;
  }

  async findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
    for (const rt of refreshTokensStore.values()) {
      if (rt.tokenHash === tokenHash) {
        return rt;
      }
    }
    return null;
  }

  async revokeRefreshToken(id: string): Promise<boolean> {
    const rt = refreshTokensStore.get(id);
    if (!rt) return false;
    rt.isRevoked = true;
    refreshTokensStore.set(id, rt);
    return true;
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    for (const rt of refreshTokensStore.values()) {
      if (rt.userId === userId) {
        rt.isRevoked = true;
      }
    }
  }

  async revokeTokenFamily(familyId: string): Promise<void> {
    for (const rt of refreshTokensStore.values()) {
      if (rt.familyId === familyId) {
        rt.isRevoked = true;
      }
    }
  }

  // --- EMAIL VERIFICATION TOKENS ---
  async createEmailVerificationToken(userId: string, token: string, expiresAtHours = 24): Promise<EmailVerificationToken> {
    const id = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = new Date(Date.now() + expiresAtHours * 3600 * 1000).toISOString();
    const evt: EmailVerificationToken = {
      id,
      userId,
      token,
      expiresAt,
      createdAt: new Date().toISOString(),
    };
    emailVerificationTokensStore.set(token, evt);
    return evt;
  }

  async findEmailVerificationToken(token: string): Promise<EmailVerificationToken | null> {
    return emailVerificationTokensStore.get(token) || null;
  }

  async deleteEmailVerificationToken(token: string): Promise<boolean> {
    return emailVerificationTokensStore.delete(token);
  }

  // --- PASSWORD RESET TOKENS ---
  async createPasswordResetToken(userId: string, token: string, expiresAtMinutes = 60): Promise<PasswordResetToken> {
    const id = `prt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = new Date(Date.now() + expiresAtMinutes * 60 * 1000).toISOString();
    const prt: PasswordResetToken = {
      id,
      userId,
      token,
      isUsed: false,
      expiresAt,
      createdAt: new Date().toISOString(),
    };
    passwordResetTokensStore.set(token, prt);
    return prt;
  }

  async findPasswordResetToken(token: string): Promise<PasswordResetToken | null> {
    return passwordResetTokensStore.get(token) || null;
  }

  async markPasswordResetTokenUsed(token: string): Promise<boolean> {
    const prt = passwordResetTokensStore.get(token);
    if (!prt) return false;
    prt.isUsed = true;
    passwordResetTokensStore.set(token, prt);
    return true;
  }

  // --- OAUTH ACCOUNTS ---
  async findOAuthAccount(provider: OAuthProvider, providerUserId: string): Promise<OAuthAccount | null> {
    for (const account of oauthAccountsStore.values()) {
      if (account.provider === provider && account.providerUserId === providerUserId) {
        return account;
      }
    }
    return null;
  }

  async createOAuthAccount(userId: string, provider: OAuthProvider, providerUserId: string, email: string): Promise<OAuthAccount> {
    const id = `oauth_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const oauth: OAuthAccount = {
      id,
      userId,
      provider,
      providerUserId,
      email,
      createdAt: new Date().toISOString(),
    };
    oauthAccountsStore.set(id, oauth);
    return oauth;
  }

  // --- SESSIONS ---
  async createSession(userId: string, ipAddress: string, userAgent: string): Promise<Session> {
    const id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const session: Session = {
      id,
      userId,
      ipAddress,
      userAgent,
      lastActiveAt: now,
      createdAt: now,
    };
    sessionsStore.set(id, session);
    return session;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return sessionsStore.delete(sessionId);
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    for (const [id, sess] of sessionsStore.entries()) {
      if (sess.userId === userId) {
        sessionsStore.delete(id);
      }
    }
  }

  // --- SECURITY AUDIT LOGS ---
  async logSecurityEvent(log: Omit<SecurityAuditLog, 'id' | 'createdAt'>): Promise<SecurityAuditLog> {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const entry: SecurityAuditLog = {
      ...log,
      id,
      createdAt: new Date().toISOString(),
    };
    auditLogsStore.push(entry);
    return entry;
  }

  async getUserAuditLogs(userId: string, limit = 20): Promise<SecurityAuditLog[]> {
    return auditLogsStore.filter((l) => l.userId === userId).slice(-limit);
  }
}

export const authRepository = new AuthRepository();
