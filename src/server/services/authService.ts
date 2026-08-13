import crypto from 'crypto';
import { userRepository } from '../repositories/userRepository';
import { authRepository } from '../repositories/authRepository';
import { AuthUtils } from '../utils/auth';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '../utils/errors';
import { User, AuthTokens, JWTPayload, OAuthProvider } from '../types/auth.types';

export interface RequestMetadata {
  ipAddress: string;
  userAgent: string;
}

export class AuthService {
  // --- USER REGISTRATION ---
  async register(
    data: { email: string; password: string; name: string; username: string; role?: any },
    meta: RequestMetadata
  ): Promise<{ user: Omit<User, 'passwordHash'>; tokens: AuthTokens; verificationToken: string }> {
    const existingEmail = await userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new ConflictError('A user account with this email address already exists.');
    }

    const existingUsername = await userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new ConflictError('This username is already taken by another engineer.');
    }

    const passwordHash = await AuthUtils.hashPassword(data.password);

    const user = await userRepository.create({
      email: data.email,
      passwordHash,
      name: data.name,
      username: data.username,
      role: data.role || 'student',
      isEmailVerified: false,
      xp: 100, // Welcome Bonus XP
      level: 1,
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        defaultDialect: 'PostgreSQL',
        emailNotifications: true,
        autoFormatSql: true,
      },
    });

    // Create Email Verification Token
    const verifyTokenString = crypto.randomBytes(32).toString('hex');
    await authRepository.createEmailVerificationToken(user.id, verifyTokenString);

    // Issue JWT Token Family
    const tokens = await this.issueTokenFamily(user, meta);

    // Audit Log
    await authRepository.logSecurityEvent({
      userId: user.id,
      action: 'USER_REGISTERED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      details: { email: user.email, role: user.role },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens, verificationToken: verifyTokenString };
  }

  // --- EMAIL LOGIN WITH ACCOUNT LOCKOUT ---
  async login(
    data: { email: string; password: string },
    meta: RequestMetadata
  ): Promise<{ user: Omit<User, 'passwordHash'>; tokens: AuthTokens }> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      // Mitigate timing attacks
      await AuthUtils.comparePassword(data.password, '$2b$10$abcdefghijklmnopqrstuu');
      throw new UnauthorizedError('Invalid credentials.');
    }

    // Check account lockout status
    if (user.lockoutUntil) {
      const lockoutTime = new Date(user.lockoutUntil).getTime();
      if (Date.now() < lockoutTime) {
        const remainingMinutes = Math.ceil((lockoutTime - Date.now()) / 60000);
        await authRepository.logSecurityEvent({
          userId: user.id,
          action: 'USER_LOGIN_FAILED',
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
          details: { reason: 'ACCOUNT_LOCKED_ATTEMPT', remainingMinutes },
        });
        throw new ForbiddenError(
          `Account is locked due to repeated failed login attempts. Please try again in ${remainingMinutes} minute(s).`
        );
      } else {
        // Lockout expired, reset counter
        await userRepository.resetFailedLoginAttempts(user.id);
      }
    }

    const isMatch = await AuthUtils.comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      const { attempts, isLocked, lockoutUntil } = await userRepository.incrementFailedLoginAttempts(user.id);

      await authRepository.logSecurityEvent({
        userId: user.id,
        action: isLocked ? 'ACCOUNT_LOCKED' : 'USER_LOGIN_FAILED',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        details: { failedAttempts: attempts, lockoutUntil },
      });

      if (isLocked) {
        throw new ForbiddenError(
          'Account locked due to 5 consecutive failed login attempts. Please try again in 15 minutes or reset your password.'
        );
      }

      throw new UnauthorizedError('Invalid credentials.');
    }

    // Reset failed attempts on success
    await userRepository.resetFailedLoginAttempts(user.id);
    await userRepository.update(user.id, { lastActiveDate: new Date().toISOString() });

    const tokens = await this.issueTokenFamily(user, meta);
    await authRepository.createSession(user.id, meta.ipAddress, meta.userAgent);

    await authRepository.logSecurityEvent({
      userId: user.id,
      action: 'USER_LOGIN_SUCCESS',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  }

  // --- GUEST LOGIN ---
  async guestLogin(
    displayName: string = 'Guest Engineer',
    meta: RequestMetadata
  ): Promise<{ user: Omit<User, 'passwordHash'>; tokens: AuthTokens }> {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const guestUser = await userRepository.create({
      email: `guest_${randomSuffix}@mobilesql.internal`,
      passwordHash: await AuthUtils.hashPassword(crypto.randomBytes(16).toString('hex')),
      name: displayName,
      username: `guest_${randomSuffix}`,
      role: 'student',
      isEmailVerified: true,
      xp: 50,
      level: 1,
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        defaultDialect: 'PostgreSQL',
        emailNotifications: false,
        autoFormatSql: true,
      },
    });

    const tokens = await this.issueTokenFamily(guestUser, meta);

    await authRepository.logSecurityEvent({
      userId: guestUser.id,
      action: 'USER_LOGIN_SUCCESS',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      details: { isGuest: true },
    });

    const { passwordHash: _, ...userWithoutPassword } = guestUser;
    return { user: userWithoutPassword, tokens };
  }

  // --- OAUTH LOGIN (GOOGLE, GITHUB, MICROSOFT) ---
  async oauthLogin(
    data: { provider: OAuthProvider; providerUserId: string; email: string; name: string; avatarUrl?: string },
    meta: RequestMetadata
  ): Promise<{ user: Omit<User, 'passwordHash'>; tokens: AuthTokens }> {
    let oauthAcc = await authRepository.findOAuthAccount(data.provider, data.providerUserId);
    let user: User | null = null;

    if (oauthAcc) {
      user = await userRepository.findById(oauthAcc.userId);
    }

    if (!user) {
      // Check if email already registered
      user = await userRepository.findByEmail(data.email);

      if (!user) {
        // Register new user via OAuth
        const username = `${data.provider}_${Math.random().toString(36).substring(2, 8)}`;
        user = await userRepository.create({
          email: data.email,
          passwordHash: await AuthUtils.hashPassword(crypto.randomBytes(20).toString('hex')),
          name: data.name,
          username,
          role: 'student',
          isEmailVerified: true, // OAuth emails are pre-verified
          avatarUrl: data.avatarUrl,
          xp: 150,
          level: 1,
          streakDays: 1,
          lastActiveDate: new Date().toISOString(),
          preferences: {
            theme: 'dark',
            defaultDialect: 'PostgreSQL',
            emailNotifications: true,
            autoFormatSql: true,
          },
        });
      }

      // Link OAuth Account
      await authRepository.createOAuthAccount(user.id, data.provider, data.providerUserId, data.email);
    }

    const tokens = await this.issueTokenFamily(user, meta);

    await authRepository.logSecurityEvent({
      userId: user.id,
      action: 'OAUTH_LOGIN_SUCCESS',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      details: { provider: data.provider },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  }

  // --- REFRESH TOKEN ROTATION WITH REUSE DETECTION ---
  async refreshToken(refreshTokenStr: string, meta: RequestMetadata): Promise<AuthTokens> {
    const tokenHash = crypto.createHash('sha256').update(refreshTokenStr).digest('hex');
    const existingRt = await authRepository.findRefreshTokenByHash(tokenHash);

    if (!existingRt) {
      throw new UnauthorizedError('Invalid or expired refresh token.');
    }

    // Token Reuse Detection Safeguard
    if (existingRt.isRevoked) {
      // Reused revoked token implies theft! Revoke whole token family for safety.
      await authRepository.revokeTokenFamily(existingRt.familyId);
      await authRepository.logSecurityEvent({
        userId: existingRt.userId,
        action: 'TOKEN_REVOKED',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        details: { reason: 'REFRESH_TOKEN_REUSE_DETECTED', familyId: existingRt.familyId },
      });
      throw new UnauthorizedError('Security breach warning: Reused refresh token detected. Session terminated.');
    }

    if (new Date(existingRt.expiresAt).getTime() < Date.now()) {
      throw new UnauthorizedError('Refresh token expired. Please login again.');
    }

    // Revoke old token
    await authRepository.revokeRefreshToken(existingRt.id);

    const user = await userRepository.findById(existingRt.userId);
    if (!user) {
      throw new NotFoundError('User account not found.');
    }

    // Issue new pair in SAME family
    const tokens = await this.issueTokenFamily(user, meta, existingRt.familyId);

    await authRepository.logSecurityEvent({
      userId: user.id,
      action: 'TOKEN_REFRESHED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return tokens;
  }

  // --- LOGOUT ---
  async logout(refreshTokenStr: string, userId: string, meta: RequestMetadata): Promise<void> {
    if (refreshTokenStr) {
      const tokenHash = crypto.createHash('sha256').update(refreshTokenStr).digest('hex');
      const rt = await authRepository.findRefreshTokenByHash(tokenHash);
      if (rt) {
        await authRepository.revokeRefreshToken(rt.id);
      }
    }

    await authRepository.deleteAllUserSessions(userId);

    await authRepository.logSecurityEvent({
      userId,
      action: 'TOKEN_REVOKED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      details: { reason: 'USER_LOGOUT' },
    });
  }

  // --- FORGOT PASSWORD ---
  async forgotPassword(email: string, meta: RequestMetadata): Promise<{ resetToken: string }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Don't leak existence of email
      return { resetToken: 'if_email_exists_token_sent' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    await authRepository.createPasswordResetToken(user.id, token, 60);

    await authRepository.logSecurityEvent({
      userId: user.id,
      action: 'PASSWORD_RESET_REQUESTED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return { resetToken: token };
  }

  // --- RESET PASSWORD ---
  async resetPassword(token: string, newPasswordStr: string, meta: RequestMetadata): Promise<void> {
    const prt = await authRepository.findPasswordResetToken(token);
    if (!prt || prt.isUsed || new Date(prt.expiresAt).getTime() < Date.now()) {
      throw new BadRequestError('Invalid or expired password reset token.');
    }

    const user = await userRepository.findById(prt.userId);
    if (!user) {
      throw new NotFoundError('User account not found.');
    }

    const newPasswordHash = await AuthUtils.hashPassword(newPasswordStr);
    await userRepository.updatePassword(user.id, newPasswordHash);
    await userRepository.resetFailedLoginAttempts(user.id);
    await authRepository.markPasswordResetTokenUsed(token);

    // Revoke all existing sessions and refresh tokens for security
    await authRepository.revokeAllUserRefreshTokens(user.id);
    await authRepository.deleteAllUserSessions(user.id);

    await authRepository.logSecurityEvent({
      userId: user.id,
      action: 'PASSWORD_RESET_COMPLETED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
  }

  // --- VERIFY EMAIL ---
  async verifyEmail(token: string, meta: RequestMetadata): Promise<void> {
    const evt = await authRepository.findEmailVerificationToken(token);
    if (!evt || new Date(evt.expiresAt).getTime() < Date.now()) {
      throw new BadRequestError('Invalid or expired email verification token.');
    }

    await userRepository.markEmailVerified(evt.userId);
    await authRepository.deleteEmailVerificationToken(token);

    await authRepository.logSecurityEvent({
      userId: evt.userId,
      action: 'EMAIL_VERIFIED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
  }

  // --- CHANGE PASSWORD ---
  async changePassword(
    userId: string,
    currentPasswordStr: string,
    newPasswordStr: string,
    meta: RequestMetadata
  ): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const isMatch = await AuthUtils.comparePassword(currentPasswordStr, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Current password specified is incorrect.');
    }

    const newHash = await AuthUtils.hashPassword(newPasswordStr);
    await userRepository.updatePassword(userId, newHash);

    // Revoke other tokens
    await authRepository.revokeAllUserRefreshTokens(userId);

    await authRepository.logSecurityEvent({
      userId,
      action: 'PASSWORD_CHANGED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
  }

  // --- CHANGE EMAIL ---
  async changeEmail(
    userId: string,
    currentPasswordStr: string,
    newEmail: string,
    meta: RequestMetadata
  ): Promise<{ verificationToken: string }> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const isMatch = await AuthUtils.comparePassword(currentPasswordStr, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Current password specified is incorrect.');
    }

    const existingEmail = await userRepository.findByEmail(newEmail);
    if (existingEmail && existingEmail.id !== userId) {
      throw new ConflictError('Email address is already in use by another account.');
    }

    await userRepository.updateEmail(userId, newEmail);

    const verifyToken = crypto.randomBytes(32).toString('hex');
    await authRepository.createEmailVerificationToken(userId, verifyToken);

    await authRepository.logSecurityEvent({
      userId,
      action: 'EMAIL_CHANGED',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      details: { newEmail },
    });

    return { verificationToken: verifyToken };
  }

  // --- CURRENT USER DETAILS ---
  async getCurrentUser(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User account profile not found.');
    }
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // --- PRIVATE TOKEN ISSUANCE HELPER ---
  private async issueTokenFamily(
    user: User,
    meta: RequestMetadata,
    familyId?: string
  ): Promise<AuthTokens> {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = AuthUtils.generateTokens(payload);

    const activeFamilyId = familyId || `fam_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const tokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');

    // Store in AuthRepository
    await authRepository.saveRefreshToken({
      userId: user.id,
      tokenHash,
      familyId: activeFamilyId,
      isRevoked: false,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(), // 7 days
    });

    return tokens;
  }
}

export const authService = new AuthService();
