/**
 * SQL Generator Service: Multi-dialect DDL, DML, Views, Indexes, Triggers, Functions & Procedures
 */

import { FullDataset, DatasetTable, DatasetColumn, DatasetRelationship } from '../types/dataset';
import { SQLDialect } from '../types';

export function generateCreateTableSQL(table: DatasetTable, dialect: SQLDialect = 'PostgreSQL'): string {
  const lines: string[] = [];

  table.columns.forEach((col) => {
    let colType = col.type;
    if (dialect === 'SQLite') {
      if (colType.includes('VARCHAR') || colType.includes('TEXT') || colType.includes('UUID')) colType = 'TEXT';
      else if (colType.includes('INT')) colType = 'INTEGER';
      else if (colType.includes('DECIMAL') || colType.includes('FLOAT')) colType = 'REAL';
      else if (colType.includes('TIMESTAMP') || colType.includes('DATE')) colType = 'TEXT';
      else if (colType.includes('BOOLEAN')) colType = 'INTEGER';
    } else if (dialect === 'MySQL') {
      if (colType.includes('UUID')) colType = 'CHAR(36)';
      else if (colType.includes('JSONB')) colType = 'JSON';
    }

    let colDef = `  ${quoteIdent(col.name, dialect)} ${colType}`;
    if (col.isPrimaryKey) {
      if (dialect === 'PostgreSQL' && colType.includes('INT')) colDef = `  ${quoteIdent(col.name, dialect)} SERIAL PRIMARY KEY`;
      else if (dialect === 'SQLite' && col.isPrimaryKey) colDef = `  ${quoteIdent(col.name, dialect)} INTEGER PRIMARY KEY AUTOINCREMENT`;
      else colDef += ' PRIMARY KEY';
    } else {
      if (!col.nullable) colDef += ' NOT NULL';
      if (col.isUnique) colDef += ' UNIQUE';
      if (col.defaultValue) colDef += ` DEFAULT ${col.defaultValue}`;
      if (col.checkConstraint) colDef += ` CHECK (${col.checkConstraint})`;
    }

    lines.push(colDef);
  });

  // Foreign Key constraints
  table.columns
    .filter((col) => col.isForeignKey && col.referencesTable && col.referencesColumn)
    .forEach((col) => {
      lines.push(
        `  CONSTRAINT fk_${table.name}_${col.name} FOREIGN KEY (${quoteIdent(col.name, dialect)}) REFERENCES ${quoteIdent(
          col.referencesTable!,
          dialect
        )}(${quoteIdent(col.referencesColumn!, dialect)}) ON DELETE CASCADE`
      );
    });

  return `CREATE TABLE IF NOT EXISTS ${quoteIdent(table.name, dialect)} (\n${lines.join(',\n')}\n);`;
}

export function generateAllIndexesSQL(table: DatasetTable, dialect: SQLDialect = 'PostgreSQL'): string {
  if (!table.indexes || table.indexes.length === 0) return '';
  return table.indexes
    .map((idx) => {
      const cols = idx.columns.map((c) => quoteIdent(c, dialect)).join(', ');
      const uniqueKw = idx.isUnique ? 'UNIQUE ' : '';
      return `CREATE ${uniqueKw}INDEX IF NOT EXISTS ${idx.name} ON ${quoteIdent(table.name, dialect)} (${cols});`;
    })
    .join('\n');
}

export function generateInsertSQL(table: DatasetTable, rows: Record<string, unknown>[], dialect: SQLDialect = 'PostgreSQL'): string {
  if (!rows || rows.length === 0) return `-- No sample records available for ${table.name}`;

  const colNames = table.columns.map((c) => c.name);
  const quotedCols = colNames.map((c) => quoteIdent(c, dialect)).join(', ');

  const valuesLines = rows.map((row) => {
    const vals = colNames.map((colName) => {
      const val = row[colName];
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number' || typeof val === 'boolean') return `${val}`;
      if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
      return `'${String(val).replace(/'/g, "''")}'`;
    });
    return `  (${vals.join(', ')})`;
  });

  return `INSERT INTO ${quoteIdent(table.name, dialect)} (${quotedCols})\nVALUES\n${valuesLines.join(',\n')};`;
}

export function generateViewsSQL(dataset: FullDataset, dialect: SQLDialect = 'PostgreSQL'): string {
  if (!dataset.tables || dataset.tables.length === 0) return '';
  const mainTable = dataset.tables[0];
  const secondTable = dataset.tables[1];

  let viewSql = `-- Analytical View for ${dataset.name}\n`;
  if (secondTable) {
    viewSql += `CREATE OR REPLACE VIEW ${quoteIdent(`v_${mainTable.name}_summary`, dialect)} AS\n`;
    viewSql += `SELECT \n  m.*,\n  COUNT(s.id) AS total_related_records\n`;
    viewSql += `FROM ${quoteIdent(mainTable.name, dialect)} m\n`;
    viewSql += `LEFT JOIN ${quoteIdent(secondTable.name, dialect)} s ON m.${quoteIdent(mainTable.columns[0].name, dialect)} = s.${quoteIdent(secondTable.columns[1]?.name || secondTable.columns[0].name, dialect)}\n`;
    viewSql += `GROUP BY m.${quoteIdent(mainTable.columns[0].name, dialect)};`;
  } else {
    viewSql += `CREATE OR REPLACE VIEW ${quoteIdent(`v_${mainTable.name}_active`, dialect)} AS\n`;
    viewSql += `SELECT * FROM ${quoteIdent(mainTable.name, dialect)};`;
  }

  return viewSql;
}

export function generateTriggersAndFunctionsSQL(table: DatasetTable, dialect: SQLDialect = 'PostgreSQL'): string {
  if (dialect === 'PostgreSQL') {
    return `-- PostgreSQL Audit Timestamp Trigger Function for ${table.name}
CREATE OR REPLACE FUNCTION fn_update_${table.name}_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_${table.name}_updated_at
BEFORE UPDATE ON ${quoteIdent(table.name, dialect)}
FOR EACH ROW
EXECUTE FUNCTION fn_update_${table.name}_timestamp();`;
  }

  if (dialect === 'MySQL') {
    return `-- MySQL Timestamp Update Trigger for ${table.name}
DELIMITER //
CREATE TRIGGER trg_${table.name}_before_update
BEFORE UPDATE ON ${quoteIdent(table.name, dialect)}
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END;
//
DELIMITER ;`;
  }

  return `-- SQLite Trigger for ${table.name}
CREATE TRIGGER IF NOT EXISTS trg_${table.name}_updated_at
AFTER UPDATE ON ${quoteIdent(table.name, dialect)}
BEGIN
  UPDATE ${quoteIdent(table.name, dialect)} SET updated_at = CURRENT_TIMESTAMP WHERE rowid = NEW.rowid;
END;`;
}

export function generateCompleteDatasetSQL(dataset: FullDataset, dialect: SQLDialect = 'PostgreSQL'): string {
  const chunks: string[] = [];

  chunks.push(`-- ============================================================`);
  chunks.push(`-- MobileSQL Generated Schema & Dataset`);
  chunks.push(`-- Dataset: ${dataset.name}`);
  chunks.push(`-- Category: ${dataset.category}`);
  chunks.push(`-- Dialect: ${dialect}`);
  chunks.push(`-- Date: ${new Date().toISOString()}`);
  chunks.push(`-- ============================================================\n`);

  // 1. Create Tables
  dataset.tables.forEach((tbl) => {
    chunks.push(`-- Table: ${tbl.name}`);
    chunks.push(generateCreateTableSQL(tbl, dialect));
    const indexSql = generateAllIndexesSQL(tbl, dialect);
    if (indexSql) chunks.push(indexSql);
    chunks.push('');
  });

  // 2. Inserts
  chunks.push(`-- ============================================================`);
  chunks.push(`-- Sample Data Inserts`);
  chunks.push(`-- ============================================================\n`);
  dataset.tables.forEach((tbl) => {
    if (tbl.sampleData && tbl.sampleData.length > 0) {
      chunks.push(generateInsertSQL(tbl, tbl.sampleData, dialect));
      chunks.push('');
    }
  });

  // 3. Views
  chunks.push(`-- ============================================================`);
  chunks.push(`-- Analytical Views`);
  chunks.push(`-- ============================================================\n`);
  chunks.push(generateViewsSQL(dataset, dialect));
  chunks.push('');

  // 4. Triggers
  if (dataset.tables.length > 0) {
    chunks.push(`-- ============================================================`);
    chunks.push(`-- Triggers & Stored Functions`);
    chunks.push(`-- ============================================================\n`);
    chunks.push(generateTriggersAndFunctionsSQL(dataset.tables[0], dialect));
  }

  return chunks.join('\n');
}

function quoteIdent(ident: string, dialect: SQLDialect): string {
  if (dialect === 'MySQL') return `\`${ident}\``;
  if (dialect === 'SQL Server') return `[${ident}]`;
  return `"${ident}"`;
}
