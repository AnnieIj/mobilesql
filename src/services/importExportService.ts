/**
 * Import & Export Service for CSV, JSON, Excel, and SQL Dumps
 */

import { FullDataset, DatasetTable, DatasetColumn } from '../types/dataset';
import { generateCompleteDatasetSQL } from './sqlGeneratorService';

export function parseCSVToTable(csvText: string, tableName: string): DatasetTable {
  const lines = csvText.trim().split('\n').filter((line) => line.trim().length > 0);
  if (lines.length === 0) throw new Error('CSV file is empty');

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
  const sampleRows: Record<string, unknown>[] = [];

  for (let i = 1; i < Math.min(lines.length, 100); i++) {
    const vals = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
    const rowObj: Record<string, unknown> = {};
    headers.forEach((h, idx) => {
      const rawVal = vals[idx] ?? '';
      if (!isNaN(Number(rawVal)) && rawVal !== '') {
        rowObj[h] = Number(rawVal);
      } else if (rawVal.toLowerCase() === 'true' || rawVal.toLowerCase() === 'false') {
        rowObj[h] = rawVal.toLowerCase() === 'true';
      } else {
        rowObj[h] = rawVal;
      }
    });
    sampleRows.push(rowObj);
  }

  const columns: DatasetColumn[] = headers.map((colName, index) => {
    const firstVal = sampleRows[0]?.[colName];
    let type = 'VARCHAR(255)';
    if (typeof firstVal === 'number') type = Number.isInteger(firstVal) ? 'INTEGER' : 'DECIMAL(10,2)';
    if (typeof firstVal === 'boolean') type = 'BOOLEAN';

    return {
      id: `col_csv_${index}`,
      name: colName,
      type,
      isPrimaryKey: index === 0,
      isForeignKey: false,
      nullable: false,
      mockGeneratorType: typeof firstVal === 'number' ? 'integer' : 'fullName',
    };
  });

  return {
    id: `tbl_csv_${Date.now()}`,
    name: tableName.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
    description: `Imported from CSV (${lines.length - 1} rows)`,
    x: 100,
    y: 100,
    columns,
    indexes: [],
    rowCount: lines.length - 1,
    sampleData: sampleRows,
  };
}

export function parseJSONToTable(jsonText: string, tableName: string): DatasetTable {
  const parsed = JSON.parse(jsonText);
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  if (rows.length === 0) throw new Error('JSON contains no rows');

  const keys = Object.keys(rows[0]);
  const columns: DatasetColumn[] = keys.map((key, index) => {
    const val = rows[0][key];
    let type = 'VARCHAR(255)';
    if (typeof val === 'number') type = Number.isInteger(val) ? 'BIGINT' : 'DECIMAL(12,2)';
    if (typeof val === 'boolean') type = 'BOOLEAN';
    if (typeof val === 'object') type = 'JSONB';

    return {
      id: `col_json_${index}`,
      name: key,
      type,
      isPrimaryKey: index === 0,
      isForeignKey: false,
      nullable: false,
      mockGeneratorType: 'statusEnum',
    };
  });

  return {
    id: `tbl_json_${Date.now()}`,
    name: tableName.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
    description: `Imported from JSON (${rows.length} items)`,
    x: 120,
    y: 120,
    columns,
    indexes: [],
    rowCount: rows.length,
    sampleData: rows.slice(0, 100),
  };
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportDatasetAsSQL(dataset: FullDataset) {
  const sql = generateCompleteDatasetSQL(dataset, dataset.dialect);
  downloadFile(`${dataset.name.toLowerCase().replace(/\s+/g, '_')}_dump.sql`, sql, 'text/plain');
}

export function exportDatasetAsCSV(table: DatasetTable) {
  if (!table.sampleData || table.sampleData.length === 0) return;
  const headers = table.columns.map((c) => c.name).join(',');
  const rowLines = table.sampleData.map((row) =>
    table.columns.map((c) => `"${String(row[c.name] ?? '').replace(/"/g, '""')}"`).join(',')
  );

  const csvContent = [headers, ...rowLines].join('\n');
  downloadFile(`${table.name}.csv`, csvContent, 'text/csv');
}

export function exportDatasetAsJSON(dataset: FullDataset) {
  const jsonContent = JSON.stringify(dataset, null, 2);
  downloadFile(`${dataset.name.toLowerCase().replace(/\s+/g, '_')}_dataset.json`, jsonContent, 'application/json');
}
