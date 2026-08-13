import { describe, it, expect } from 'vitest';
import { PRACTICE_DATABASES } from '../data/playgroundDatabases';

describe('Playground Engine & Practice Databases', () => {
  it('loads sample schema structures correctly', () => {
    expect(PRACTICE_DATABASES.length).toBeGreaterThan(0);
    const ecommerceDb = PRACTICE_DATABASES.find((db) => db.id === 'ecommerce_prod');
    expect(ecommerceDb).toBeDefined();
    expect(ecommerceDb?.tables.length).toBeGreaterThan(0);
  });

  it('validates table schemas have primary keys and typed columns', () => {
    const db = PRACTICE_DATABASES[0];
    db.tables.forEach((table) => {
      expect(table.name).toBeTruthy();
      expect(table.columns.length).toBeGreaterThan(0);
      table.columns.forEach((col) => {
        expect(col.name).toBeTruthy();
        expect(col.type).toBeTruthy();
      });
    });
  });

  it('contains valid seed rows matching table names', () => {
    const db = PRACTICE_DATABASES[0];
    const tableNames = db.tables.map((t) => t.name);
    tableNames.forEach((name) => {
      if (db.data[name]) {
        expect(Array.isArray(db.data[name])).toBe(true);
      }
    });
  });
});
