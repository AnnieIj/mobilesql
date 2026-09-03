import { describe, it, expect } from 'vitest';
import { sqlExecutionService } from '../server/services/sqlExecutionService';
import { authService } from '../server/services/authService';

describe('Server SQL Engine & Safety Suite', () => {
  it('formats SQL queries correctly with uppercase keywords', () => {
    const res = sqlExecutionService.format({
      query: 'select id, name, email from users where active = true',
      dialect: 'PostgreSQL',
      uppercaseKeywords: true,
      tabWidth: 2,
    });
    expect(res.formattedSql).toContain('SELECT');
    expect(res.formattedSql).toContain('FROM users');
    expect(res.formattedSql).toContain('WHERE active = true');
  });

  it('validates safe SELECT queries as valid', () => {
    const validation = sqlExecutionService.validate({
      query: 'SELECT * FROM users WHERE id = 1;',
      dialect: 'PostgreSQL',
    });
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('blocks destructive SQL in read-only sandbox mode', async () => {
    const result = await sqlExecutionService.execute({
      query: 'DROP TABLE users;',
      dialect: 'PostgreSQL',
      readOnly: true,
      limit: 100,
      timeoutMs: 5000,
    });

    expect(result.status).toBe('error');
    expect(result.errorMessage).toContain('read-only mode');
  });

  it('generates performance optimization suggestions for wildcards', () => {
    const report = sqlExecutionService.optimize({
      query: 'SELECT * FROM users WHERE name LIKE "%test%";',
      dialect: 'PostgreSQL',
    });
    expect(report.suggestions.length).toBeGreaterThan(0);
    expect(report.complexityScore).toBeGreaterThanOrEqual(1);
  });

  it('generates execution explain plans', async () => {
    const plan = await sqlExecutionService.explain({
      query: 'SELECT * FROM users JOIN orders ON users.id = orders.user_id;',
      dialect: 'PostgreSQL',
      analyze: false,
      format: 'JSON',
    });
    expect(plan).toBeDefined();
    expect(plan.plan).toBeDefined();
    expect(plan.totalCost).toBeGreaterThan(0);
  });
});

describe('Server Authentication Service & Security', () => {
  it('registers and authenticates new user without exposing password in user object', async () => {
    const registerRes = await authService.register({
      email: 'test_unit@example.com',
      password: 'Password123!',
      name: 'Unit Tester',
      username: 'unittester',
      role: 'student',
    });

    expect(registerRes.user).toBeDefined();
    expect(registerRes.user.email).toBe('test_unit@example.com');
    expect((registerRes.user as any).password).toBeUndefined();
    expect((registerRes.user as any).passwordHash).toBeUndefined();
    expect(registerRes.tokens.accessToken).toBeDefined();
    expect(registerRes.tokens.refreshToken).toBeDefined();
  });

  it('rejects authentication with incorrect password', async () => {
    await expect(
      authService.login({
        email: 'test_unit@example.com',
        password: 'WrongPassword!',
      })
    ).rejects.toThrow('Invalid credentials.');
  });
});

