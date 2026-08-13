import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthTokens, JWTPayload, UserRole } from '../types';

export class AuthUtils {
  private static SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateTokens(payload: JWTPayload): AuthTokens {
    const accessOptions: SignOptions = {
      expiresIn: config.jwt.expiresIn as any,
    };

    const refreshOptions: SignOptions = {
      expiresIn: config.jwt.refreshExpiresIn as any,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, accessOptions);
    const refreshToken = jwt.sign({ userId: payload.userId }, config.jwt.refreshSecret, refreshOptions);

    return {
      accessToken,
      refreshToken,
      expiresIn: config.jwt.expiresIn,
    };
  }

  static verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, config.jwt.secret) as JWTPayload;
  }

  static verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
  }
}
