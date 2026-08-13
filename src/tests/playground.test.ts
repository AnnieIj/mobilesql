import { describe, it, expect } from 'vitest';
import { SAMPLE_DATABASES } from '../data/playgroundDatabases';

describe('Playground Engine & Sample Databases', () => {
  it('loads sample schema structures correctly', () => {
    expect(SAMPLE_DATABASES.length).toBeGreaterThan(0);
    const ecommerceDb = SAMPLE_DATABASES.find((db) => db.id === 'ecommerce');
    expect(ecommerceDb).toBeDefined();
    expect(ecommerceDb?.tables.length).toBeGreaterThan(0);
  });

  it('validates table schemas have primary keys and typed columns', () => {
    const db = SAMPLE_DATABASES[0];
    db.tables.forEach((table) => {
      expect(table.name).toBeTruthy();
      expect(table.columns.length).toBeGreaterThan(0);
      table.columns.forEach((col) => {
        expect(col.name).toBeTruthy();
        expect(col.type).toBeTruthy();
      });
    });
  });

  it('contains valid seed rows matching column definitions', () => {
    const db = SAMPLE_DATABASES[0];
    db.tables.forEach((table) => {
      if (table.sampleRows && table.sampleRows.length > 0) {
        const firstRow = table.sampleRows[0];
        table.columns.forEach((col) => {
          expect(col.name in firstRow).toBe(true);
        });
      }
    });
  });
});
