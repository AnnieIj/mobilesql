import React, { useState } from 'react';
import {
  FileUp,
  Download,
  FileText,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Zap,
} from 'lucide-react';
import { useDatasetStore } from '../../stores/useDatasetStore';
import { useUIStore } from '../../stores/useUIStore';
import { parseCSVToTable, parseJSONToTable, exportDatasetAsSQL, exportDatasetAsJSON } from '../../services/importExportService';

export const ImportExportTab: React.FC = () => {
  const { addToast } = useUIStore();
  const { currentDataset, addTable, setActiveSubTab } = useDatasetStore();

  const [importText, setImportText] = useState('');
  const [importType, setImportType] = useState<'csv' | 'json'>('csv');
  const [importTableName, setImportTableName] = useState('imported_dataset');

  const handleImport = () => {
    if (!importText.trim()) return;

    try {
      if (importType === 'csv') {
        const tbl = parseCSVToTable(importText, importTableName);
        addTable(tbl.name);
        addToast({ title: 'CSV Imported', message: `Created table "${tbl.name}" from CSV data.`, type: 'success' });
      } else {
        const tbl = parseJSONToTable(importText, importTableName);
        addTable(tbl.name);
        addToast({ title: 'JSON Imported', message: `Created table "${tbl.name}" from JSON payload.`, type: 'success' });
      }

      setImportText('');
      setActiveSubTab('designer');
    } catch (err: any) {
      addToast({ title: 'Import Failed', message: err.message || 'Malformed file payload.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF]">
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 shadow-xl space-y-2 font-mono">
        <h2 className="text-base sm:text-lg font-bold text-[#FFFFFF] flex items-center gap-2">
          <FileUp className="w-5 h-5 text-[#62DF7D]" /> Multi-Format Import & Export Manager
        </h2>
        <p className="text-xs text-[#8A8A90]">
          Import raw CSV files, JSON payloads, or SQL dumps into active dataset schemas. Export full DDL/DML, CSV dumps, and pg_dump scripts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Import Section */}
        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="font-bold text-[#FFFFFF] border-b border-[#2D2D31] pb-3 flex items-center gap-2">
            <FileUp className="w-4 h-4 text-[#3B82F6]" /> Import Raw Data (CSV / JSON)
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#8A8A90] text-[10px] block mb-1">Format:</label>
              <select
                value={importType}
                onChange={(e) => setImportType(e.target.value as any)}
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none"
              >
                <option value="csv">CSV (Comma Separated)</option>
                <option value="json">JSON Array</option>
              </select>
            </div>

            <div>
              <label className="text-[#8A8A90] text-[10px] block mb-1">Target Table Name:</label>
              <input
                type="text"
                value={importTableName}
                onChange={(e) => setImportTableName(e.target.value)}
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none"
              />
            </div>
          </div>

          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={8}
            placeholder={
              importType === 'csv'
                ? 'Paste CSV content here:\nid,full_name,email,amount\n1,Alexander Wright,alex@tech.io,1200.50'
                : 'Paste JSON array here:\n[{"id": 1, "name": "Alex", "spend": 1200.50}]'
            }
            className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-3 text-xs text-[#62DF7D] focus:outline-none resize-none font-mono"
          />

          <button
            onClick={handleImport}
            className="w-full py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563eb] text-[#FFFFFF] font-bold cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" /> Parse & Construct Table
          </button>
        </div>

        {/* Export Section */}
        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#FFFFFF] border-b border-[#2D2D31] pb-3 flex items-center gap-2">
              <Download className="w-4 h-4 text-[#62DF7D]" /> Export Active Schema ({currentDataset.name})
            </h3>

            <div className="space-y-3 pt-3">
              <div className="p-3.5 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#FFFFFF]">SQL Dump File (.sql)</p>
                  <p className="text-[10px] text-[#8A8A90]">DDL + INSERT statements for {currentDataset.dialect}</p>
                </div>
                <button
                  onClick={() => exportDatasetAsSQL(currentDataset)}
                  className="px-3 py-1.5 rounded-xl bg-[#62DF7D] text-[#131315] font-bold"
                >
                  Download .sql
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#FFFFFF]">Full Dataset Backup (.json)</p>
                  <p className="text-[10px] text-[#8A8A90]">Complete JSON schema with coordinates & exercises</p>
                </div>
                <button
                  onClick={() => exportDatasetAsJSON(currentDataset)}
                  className="px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] font-bold hover:border-[#62DF7D]"
                >
                  Download .json
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
