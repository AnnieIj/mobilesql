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

  it('executes queries with leading SQL comments in read-only mode successfully', async () => {
    const result = await sqlExecutionService.execute({
      query: '-- Inspection query\n/* Multi-line comment */\nSELECT id, name FROM customers LIMIT 2;',
      dialect: 'PostgreSQL',
      readOnly: true,
      limit: 100,
      timeoutMs: 5000,
    });

    expect(result.status).toBe('success');
    expect(result.error).toBeUndefined();
    expect(result.rowCount).toBe(2);
  });

  it('validates SQL syntax correctly for valid and invalid queries', () => {
    const valid = sqlExecutionService.validate({
      query: 'SELECT id, name FROM customers WHERE country = "Germany";',
      dialect: 'PostgreSQL',
    });
    expect(valid.isValid).toBe(true);
    expect(valid.errors.length).toBe(0);

    const invalid = sqlExecutionService.validate({
      query: 'SELECT FROM WHERE;',
      dialect: 'PostgreSQL',
    });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(0);
    expect(invalid.errors[0]).toContain('Parse error');
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

  it('executes basic SELECT against practice database without crash', async () => {
    const result = await sqlExecutionService.execute({
      query: 'SELECT * FROM customers;',
      dialect: 'PostgreSQL',
      databaseId: 'ecommerce_prod',
      readOnly: true,
      limit: 100,
      timeoutMs: 5000,
    });

    expect(result.status).toBe('success');
    expect(result.backend).toBe('in-memory');
    expect(result.rowCount).toBe(5);
    expect(result.rows.length).toBe(5);
    expect(result.columns.map((c) => c.name)).toContain('id');
    expect(result.columns.map((c) => c.name)).toContain('name');
  });

  it('executes projection query (SELECT id, name FROM customers)', async () => {
    const result = await sqlExecutionService.execute({
      query: 'SELECT id, name FROM customers;',
      dialect: 'PostgreSQL',
      databaseId: 'ecommerce_prod',
      readOnly: true,
      limit: 100,
      timeoutMs: 5000,
    });

    expect(result.status).toBe('success');
    expect(result.rowCount).toBe(5);
    expect(result.columns.map((c) => c.name)).toEqual(['id', 'name']);
    expect(result.rows[0].name).toBe('Elena Rostova');
  });

  it('executes filtering query (SELECT * FROM orders WHERE status = "completed")', async () => {
    const result = await sqlExecutionService.execute({
      query: "SELECT * FROM orders WHERE status = 'completed';",
      dialect: 'PostgreSQL',
      databaseId: 'ecommerce_prod',
      readOnly: true,
      limit: 100,
      timeoutMs: 5000,
    });

    expect(result.status).toBe('success');
    expect(result.rowCount).toBe(3);
    for (const row of result.rows) {
      expect(row.status).toBe('completed');
    }
  });

  it('executes aggregation query (SELECT COUNT(*) FROM orders)', async () => {
    const result = await sqlExecutionService.execute({
      query: 'SELECT COUNT(*) FROM orders;',
      dialect: 'PostgreSQL',
      databaseId: 'ecommerce_prod',
      readOnly: true,
      limit: 100,
      timeoutMs: 5000,
    });

    expect(result.status).toBe('success');
    expect(result.rowCount).toBe(1);
    expect(Object.values(result.rows[0])[0]).toBe(5);
  });

  it('executes GROUP BY query (SELECT status, COUNT(*) FROM orders GROUP BY status)', async () => {
    const result = await sqlExecutionService.execute({
      query: 'SELECT status, COUNT(*) FROM orders GROUP BY status;',
      dialect: 'PostgreSQL',
      databaseId: 'ecommerce_prod',
      readOnly: true,
      limit: 100,
      timeoutMs: 5000,
    });

    expect(result.status).toBe('success');
    expect(result.rowCount).toBe(3);
    const statuses = result.rows.map((r) => r.status);
    expect(statuses).toContain('completed');
    expect(statuses).toContain('pending');
    expect(statuses).toContain('refunded');
  });

  it('executes JOIN query (SELECT c.name, o.id FROM customers c JOIN orders o ON c.id = o.customer_id)', async () => {
    const result = await sqlExecutionService.execute({
      query: 'SELECT c.name, o.id FROM customers c JOIN orders o ON c.id = o.customer_id;',
      dialect: 'PostgreSQL',
      databaseId: 'ecommerce_prod',
      readOnly: true,
      limit: 100,
      timeoutMs: 5000,
    });

    expect(result.status).toBe('success');
    expect(result.rowCount).toBe(5);
    expect(result.rows[0]).toHaveProperty('name');
    expect(result.rows[0]).toHaveProperty('id');
  });

  it('executes complex Aggregate JOIN query', async () => {
    const complexSql = `
      SELECT
          c.country,
          COUNT(o.id) AS total_orders,
          SUM(o.total_amount) AS revenue
      FROM customers c
      JOIN orders o ON c.id = o.customer_id
      WHERE o.status = 'completed'
      GROUP BY c.country
      ORDER BY revenue DESC;
    `;

    const result = await sqlExecutionService.execute({
      query: complexSql,
      dialect: 'PostgreSQL',
      databaseId: 'ecommerce_prod',
      readOnly: true,
      limit: 100,
      timeoutMs: 5000,
    });

    expect(result.status).toBe('success');
    expect(result.rowCount).toBe(3);
    expect(result.rows[0].country).toBe('Japan');
    expect(result.rows[0].revenue).toBe(3420);
    expect(result.rows[1].country).toBe('Germany');
    expect(result.rows[1].revenue).toBe(1450);
    expect(result.rows[2].country).toBe('United Kingdom');
    expect(result.rows[2].revenue).toBe(890.5);
  });

  it('handles invalid SQL syntax gracefully with informative error', async () => {
    const result = await sqlExecutionService.execute({
      query: 'SELECT FROM WHERE;',
      dialect: 'PostgreSQL',
      databaseId: 'ecommerce_prod',
      readOnly: true,
      limit: 100,
      timeoutMs: 5000,
    });

    expect(result.status).toBe('error');
    expect(result.errorMessage).toBeDefined();
    expect(result.errorMessage).toContain('Parse error');
  });

  it('reports truthful engine readiness and active backend', async () => {
    const status = await sqlExecutionService.getEngineStatus('ecommerce_prod');
    expect(status.ready).toBe(true);
    expect(status.backend).toBe('in-memory');
    expect(status.label).toContain('In-Memory Sandbox');
    expect(status.availableDialects).toContain('PostgreSQL');
    expect(status.availableDialects).toContain('SQLite');
    expect(status.availableDialects).toContain('MySQL');
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

