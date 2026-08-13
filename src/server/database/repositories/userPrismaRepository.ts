import db from '../client';
import { User, UserRole } from '../../types/auth.types';
import { ThemePreference, SqlDialect } from '@prisma/client';
import { handleDatabaseError } from '../dbErrors';

export class UserPrismaRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const record = await db.user.findUnique({
        where: { id },
        include: { settings: true },
      });
      if (!record) return null;
      return this.mapToUserDomain(record);
    } catch (error) {
      throw handleDatabaseError(error, 'User');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const record = await db.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { settings: true },
      });
      if (!record) return null;
      return this.mapToUserDomain(record);
    } catch (error) {
      throw handleDatabaseError(error, 'User');
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const record = await db.user.findUnique({
        where: { username: username.toLowerCase() },
        include: { settings: true },
      });
      if (!record) return null;
      return this.mapToUserDomain(record);
    } catch (error) {
      throw handleDatabaseError(error, 'User');
    }
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'failedLoginAttempts' | 'lockoutUntil'>): Promise<User> {
    try {
      const roleMap: Record<string, any> = {
        student: 'STUDENT',
        engineer: 'ENGINEER',
        architect: 'ARCHITECT',
        admin: 'ADMIN',
      };

      const newUser = await db.user.create({
        data: {
          email: data.email.toLowerCase(),
          username: data.username.toLowerCase(),
          name: data.name,
          passwordHash: data.passwordHash,
          role: roleMap[data.role] || 'STUDENT',
          isEmailVerified: data.isEmailVerified ?? false,
          avatarUrl: data.avatarUrl,
          bio: data.bio,
          title: data.title,
          xp: data.xp ?? 100,
          level: data.level ?? 1,
          streakDays: data.streakDays ?? 1,
          settings: {
            create: {
              theme: (data.preferences?.theme?.toUpperCase() as ThemePreference) || ThemePreference.DARK,
              defaultDialect: (data.preferences?.defaultDialect?.toUpperCase().replace(' ', '_') as SqlDialect) || SqlDialect.POSTGRESQL,
              emailNotifications: data.preferences?.emailNotifications ?? true,
              autoFormatSql: data.preferences?.autoFormatSql ?? true,
            },
          },
        },
        include: { settings: true },
      });

      return this.mapToUserDomain(newUser);
    } catch (error) {
      throw handleDatabaseError(error, 'User');
    }
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    try {
      const updated = await db.user.update({
        where: { id },
        data: {
          name: updates.name,
          avatarUrl: updates.avatarUrl,
          bio: updates.bio,
          title: updates.title,
          xp: updates.xp,
          level: updates.level,
          streakDays: updates.streakDays,
          lastActiveDate: updates.lastActiveDate ? new Date(updates.lastActiveDate) : undefined,
        },
        include: { settings: true },
      });
      return this.mapToUserDomain(updated);
    } catch (error) {
      throw handleDatabaseError(error, 'User');
    }
  }

  async incrementFailedLoginAttempts(id: string): Promise<{ attempts: number; isLocked: boolean; lockoutUntil?: string }> {
    try {
      const user = await db.user.findUnique({ where: { id } });
      if (!user) throw new Error('User not found.');

      const newAttempts = user.failedLoginAttempts + 1;
      let lockoutUntil: Date | undefined = undefined;

      if (newAttempts >= 5) {
        lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minute lockout
      }

      await db.user.update({
        where: { id },
        data: {
          failedLoginAttempts: newAttempts,
          lockoutUntil,
        },
      });

      return {
        attempts: newAttempts,
        isLocked: newAttempts >= 5,
        lockoutUntil: lockoutUntil ? lockoutUntil.toISOString() : undefined,
      };
    } catch (error) {
      throw handleDatabaseError(error, 'User');
    }
  }

  async resetFailedLoginAttempts(id: string): Promise<void> {
    try {
      await db.user.update({
        where: { id },
        data: {
          failedLoginAttempts: 0,
          lockoutUntil: null,
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'User');
    }
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    try {
      await db.user.update({
        where: { id },
        data: { passwordHash },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'User');
    }
  }

  async updateEmail(id: string, newEmail: string): Promise<void> {
    try {
      await db.user.update({
        where: { id },
        data: {
          email: newEmail.toLowerCase(),
          isEmailVerified: false,
        },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'User');
    }
  }

  async markEmailVerified(id: string): Promise<void> {
    try {
      await db.user.update({
        where: { id },
        data: { isEmailVerified: true },
      });
    } catch (error) {
      throw handleDatabaseError(error, 'User');
    }
  }

  private mapToUserDomain(record: any): User {
    const roleMap: Record<string, UserRole> = {
      STUDENT: 'student',
      ENGINEER: 'engineer',
      ARCHITECT: 'architect',
      ADMIN: 'admin',
    };

    return {
      id: record.id,
      email: record.email,
      name: record.name,
      username: record.username,
      passwordHash: record.passwordHash,
      role: roleMap[record.role] || 'student',
      isEmailVerified: record.isEmailVerified,
      avatarUrl: record.avatarUrl || undefined,
      bio: record.bio || undefined,
      title: record.title || undefined,
      xp: record.xp,
      level: record.level,
      streakDays: record.streakDays,
      lastActiveDate: record.lastActiveDate ? new Date(record.lastActiveDate).toISOString() : new Date().toISOString(),
      failedLoginAttempts: record.failedLoginAttempts,
      lockoutUntil: record.lockoutUntil ? new Date(record.lockoutUntil).toISOString() : undefined,
      preferences: {
        theme: (record.settings?.theme?.toLowerCase() as any) || 'dark',
        defaultDialect: (record.settings?.defaultDialect === 'POSTGRESQL' ? 'PostgreSQL' : 'MySQL') as any,
        emailNotifications: record.settings?.emailNotifications ?? true,
        autoFormatSql: record.settings?.autoFormatSql ?? true,
      },
      createdAt: record.createdAt ? new Date(record.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: record.updatedAt ? new Date(record.updatedAt).toISOString() : new Date().toISOString(),
    };
  }
}

export const userPrismaRepository = new UserPrismaRepository();
