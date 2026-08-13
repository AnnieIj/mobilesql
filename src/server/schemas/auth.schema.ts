import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format.').toLowerCase().trim(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.'),
    name: z.string().min(2, 'Name must be at least 2 characters long.').trim(),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters long.')
      .max(30, 'Username cannot exceed 30 characters.')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.')
      .toLowerCase()
      .trim(),
    role: z.enum(['student', 'engineer', 'architect', 'admin']).optional(),
  }),
});

// Backwards compatibility alias
export const signupSchema = registerSchema;

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format.').toLowerCase().trim(),
    password: z.string().min(1, 'Password is required.'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required.'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format.').toLowerCase().trim(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required.'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.'),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Verification token is required.'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.'),
  }),
});

export const changeEmailSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required to change email.'),
    newEmail: z.string().email('Invalid new email address format.').toLowerCase().trim(),
  }),
});

export const oauthLoginSchema = z.object({
  body: z.object({
    provider: z.enum(['google', 'github', 'microsoft']),
    providerUserId: z.string().min(1, 'Provider User ID is required.'),
    email: z.string().email('Invalid OAuth account email.').toLowerCase().trim(),
    name: z.string().min(1, 'Name is required.'),
    avatarUrl: z.string().url().optional(),
  }),
});

export const guestLoginSchema = z.object({
  body: z
    .object({
      displayName: z.string().max(50).optional(),
    })
    .optional(),
});
