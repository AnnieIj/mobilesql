import { db } from '../database/db';
import { User } from '../types/auth.types';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return db.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const lowerEmail = email.toLowerCase().trim();
    for (const user of db.users.values()) {
      if (user.email.toLowerCase() === lowerEmail) {
        return user;
      }
    }
    return null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const lowerName = username.toLowerCase().trim();
    for (const user of db.users.values()) {
      if (user.username.toLowerCase() === lowerName) {
        return user;
      }
    }
    return null;
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'failedLoginAttempts'>): Promise<User> {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const user: User = {
      ...userData,
      id,
      failedLoginAttempts: 0,
      createdAt: now,
      updatedAt: now,
    };

    db.users.set(id, user);
    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const user = db.users.get(id);
    if (!user) return null;

    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    db.users.set(id, updatedUser);
    return updatedUser;
  }

  async incrementFailedLoginAttempts(userId: string): Promise<{ attempts: number; isLocked: boolean; lockoutUntil?: string }> {
    const user = db.users.get(userId);
    if (!user) return { attempts: 0, isLocked: false };

    const attempts = (user.failedLoginAttempts || 0) + 1;
    let lockoutUntil: string | undefined = undefined;
    
    // Lock out account for 15 minutes if failed attempts reach 5
    if (attempts >= 5) {
      lockoutUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    }

    const updated: User = {
      ...user,
      failedLoginAttempts: attempts,
      lockoutUntil,
      updatedAt: new Date().toISOString(),
    };

    db.users.set(userId, updated);
    return { attempts, isLocked: attempts >= 5, lockoutUntil };
  }

  async resetFailedLoginAttempts(userId: string): Promise<void> {
    const user = db.users.get(userId);
    if (!user) return;

    const updated: User = {
      ...user,
      failedLoginAttempts: 0,
      lockoutUntil: undefined,
      updatedAt: new Date().toISOString(),
    };

    db.users.set(userId, updated);
  }

  async markEmailVerified(userId: string): Promise<User | null> {
    return this.update(userId, { isEmailVerified: true });
  }

  async updatePassword(userId: string, newPasswordHash: string): Promise<User | null> {
    return this.update(userId, { passwordHash: newPasswordHash });
  }

  async updateEmail(userId: string, newEmail: string): Promise<User | null> {
    return this.update(userId, {
      email: newEmail.toLowerCase().trim(),
      isEmailVerified: false, // Reset verification for new email
    });
  }

  async delete(id: string): Promise<boolean> {
    return db.users.delete(id);
  }

  async findAll(page: number = 1, limit: number = 20): Promise<{ users: User[]; total: number }> {
    const allUsers = Array.from(db.users.values());
    const total = allUsers.length;
    const startIndex = (page - 1) * limit;
    const users = allUsers.slice(startIndex, startIndex + limit);

    return { users, total };
  }
}

export const userRepository = new UserRepository();
