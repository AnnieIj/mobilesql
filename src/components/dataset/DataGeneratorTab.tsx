import React, { useState } from 'react';
import {
  Sliders,
  Table,
  RefreshCw,
  Download,
  Database,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useDatasetStore } from '../../stores/useDatasetStore';
import { useUIStore } from '../../stores/useUIStore';
import { generateTableMockRows } from '../../services/mockDataGeneratorService';
import { exportDatasetAsCSV, exportDatasetAsJSON } from '../../services/importExportService';

export const DataGeneratorTab: React.FC = () => {
  const { addToast } = useUIStore();
  const { currentDataset, mockRowCount, setMockRowCount } = useDatasetStore();

  const [selectedTableIndex, setSelectedTableIndex] = useState(0);
  const activeTable = currentDataset.tables[selectedTableIndex] || currentDataset.tables[0];

  const [mockRows, setMockRows] = useState<Record<string, unknown>[]>(() =>
    activeTable ? generateTableMockRows(activeTable, 10) : []
  );

  const handleRegenerate = () => {
    if (!activeTable) return;
    const newRows = generateTableMockRows(activeTable, 10);
    setMockRows(newRows);
    addToast({ title: 'Data Regenerated', message: `Generated 10 preview records for ${activeTable.name}.`, type: 'info' });
  };

  const handleExportCSV = () => {
    if (!activeTable) return;
    const fullRows = generateTableMockRows(activeTable, Math.min(mockRowCount, 5000));
    exportDatasetAsCSV({ ...activeTable, sampleData: fullRows });
    addToast({ title: 'Export Complete', message: `Exported ${fullRows.length} CSV records for ${activeTable.name}.`, type: 'success' });
  };

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF]">
      {/* Header Banner */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#FFFFFF] flex items-center gap-2 font-mono">
            <Sliders className="w-5 h-5 text-[#62DF7D]" /> Mockaroo-Style Realistic Fake Data Generator
          </h2>
          <p className="text-xs text-[#8A8A90] font-mono mt-0.5">
            Configure column generator rules for realistic Names, Emails, Prices, Timestamps, UUIDs, and JSON fields up to 1,000,000 rows.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleRegenerate}
            className="px-4 py-2.5 rounded-xl bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] text-[#FFFFFF] hover:text-[#62DF7D] font-bold cursor-pointer transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Re-Roll Seed
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold cursor-pointer transition-all flex items-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" /> Download Batch CSV
          </button>
        </div>
      </div>

      {/* Controls & Table Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-mono text-xs">
        {/* Sidebar Controls */}
        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-4 shadow-xl">
          <div>
            <label className="text-[#8A8A90] text-[10px] block mb-1">Target Table:</label>
            <select
              value={selectedTableIndex}
              onChange={(e) => {
                const idx = Number(e.target.value);
                setSelectedTableIndex(idx);
                if (currentDataset.tables[idx]) {
                  setMockRows(generateTableMockRows(currentDataset.tables[idx], 10));
                }
              }}
              className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
            >
              {currentDataset.tables.map((t, idx) => (
                <option key={t.id} value={idx}>
                  {t.name} ({t.columns.length} Cols)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[#8A8A90] text-[10px] mb-1">
              <span>Batch Generation Row Count:</span>
              <span className="text-[#62DF7D] font-bold">{mockRowCount.toLocaleString()} Rows</span>
            </div>
            <input
              type="range"
              min={100}
              max={1000000}
              step={500}
              value={mockRowCount}
              onChange={(e) => setMockRowCount(Number(e.target.value))}
              className="w-full accent-[#62DF7D]"
            />
            <div className="flex justify-between text-[9px] text-[#8A8A90] mt-1">
              <span>100</span>
              <span>100,000</span>
              <span>1,000,000</span>
            </div>
          </div>
        </div>

        {/* Live Mock Records Preview Table (3 Cols) */}
        <div className="lg:col-span-3 bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-4 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#2D2D31] pb-3">
            <h3 className="font-bold text-[#FFFFFF] flex items-center gap-2">
              <Table className="w-4 h-4 text-[#3B82F6]" /> Generated Preview Matrix ({activeTable?.name})
            </h3>
            <span className="text-[10px] text-[#8A8A90]">Showing 10 sample rows</span>
          </div>

          {activeTable && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-[#2D2D31] text-[#8A8A90]">
                    {activeTable.columns.map((c) => (
                      <th key={c.id} className="pb-2 pr-4 font-bold">
                        {c.name}
                        <span className="block text-[9px] font-normal text-[#62DF7D]">{c.mockGeneratorType}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2D31]">
                  {mockRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#131315]/50 transition-colors">
                      {activeTable.columns.map((c) => (
                        <td key={c.id} className="py-2.5 pr-4 text-[#C8C8CC] truncate max-w-[160px]">
                          {typeof row[c.name] === 'object'
                            ? JSON.stringify(row[c.name])
                            : String(row[c.name] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
