import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Key,
  Link,
  Code,
  Check,
  X,
  Move,
  Database,
  Terminal,
  Copy,
  Download,
  Settings,
  Sparkles,
  ArrowRight,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { useDatasetStore } from '../../stores/useDatasetStore';
import { useUIStore } from '../../stores/useUIStore';
import { generateCompleteDatasetSQL } from '../../services/sqlGeneratorService';
import { DatasetColumn } from '../../types/dataset';

export const VisualDatabaseDesignerTab: React.FC = () => {
  const { addToast } = useUIStore();
  const {
    currentDataset,
    selectedTableId,
    setSelectedTableId,
    addTable,
    deleteTable,
    updateTablePosition,
    addColumnToTable,
    deleteColumnFromTable,
  } = useDatasetStore();

  const [newTableName, setNewTableName] = useState('');
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [targetTableForCol, setTargetTableForCol] = useState<string | null>(null);

  // New column state
  const [newColName, setNewColName] = useState('');
  const [newColType, setNewColType] = useState('VARCHAR(100)');
  const [newColIsPk, setNewColIsPk] = useState(false);
  const [newColIsFk, setNewColIsFk] = useState(false);
  const [newColRefTable, setNewColRefTable] = useState('');
  const [newColRefCol, setNewColRefCol] = useState('');

  const [showDdlPanel, setShowDdlPanel] = useState(true);
  const selectedTable = currentDataset.tables.find((t) => t.id === selectedTableId);

  const generatedDdl = generateCompleteDatasetSQL(currentDataset, currentDataset.dialect);

  const handleCreateNewTable = () => {
    if (!newTableName.trim()) return;
    addTable(newTableName);
    setNewTableName('');
    setShowAddTableModal(false);
    addToast({ title: 'Table Created', message: `Added table "${newTableName}".`, type: 'success' });
  };

  const handleAddColumn = () => {
    if (!targetTableForCol || !newColName.trim()) return;

    addColumnToTable(targetTableForCol, {
      name: newColName,
      type: newColType,
      isPrimaryKey: newColIsPk,
      isForeignKey: newColIsFk,
      referencesTable: newColRefTable || undefined,
      referencesColumn: newColRefCol || undefined,
      nullable: !newColIsPk,
      mockGeneratorType: 'fullName',
    });

    setNewColName('');
    setShowColumnModal(false);
    addToast({ title: 'Column Added', message: `Added column "${newColName}".`, type: 'success' });
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(generatedDdl);
    addToast({ title: 'Copied to Clipboard', message: 'Generated SQL script copied.', type: 'info' });
  };

  return (
    <div className="space-y-4 font-sans text-[#FFFFFF]">
      {/* Top Toolbar */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#62DF7D]/15 border border-[#62DF7D]/30 flex items-center justify-center text-[#62DF7D]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-[#FFFFFF] text-sm">{currentDataset.name} — Interactive ER Designer</h2>
            <p className="text-[10px] text-[#8A8A90]">{currentDataset.tables.length} Tables • DrawSQL / dbdiagram Canvas Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddTableModal(true)}
            className="px-3 py-2 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Table
          </button>

          <button
            onClick={() => setShowDdlPanel(!showDdlPanel)}
            className={`px-3 py-2 rounded-xl border font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              showDdlPanel ? 'bg-[#3B82F6]/20 border-[#3B82F6]/40 text-[#3B82F6]' : 'bg-[#131315] border-[#2D2D31] text-[#8A8A90]'
            }`}
          >
            <Code className="w-4 h-4" /> {showDdlPanel ? 'Hide Generated SQL' : 'View Generated SQL'}
          </button>
        </div>
      </div>

      {/* Main Designer Canvas + DDL Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ER Canvas (2 Cols) */}
        <div className={`relative min-h-[520px] rounded-2xl bg-[#131315] border border-[#2D2D31] p-6 overflow-auto shadow-inner bg-[radial-gradient(#2D2D31_1px,transparent_1px)] [background-size:16px_16px] ${showDdlPanel ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#1B1B1E]/90 border border-[#2D2D31] font-mono text-[10px] text-[#8A8A90]">
            Interactive ER Grid • Click table to edit columns
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            {currentDataset.tables.map((table) => {
              const isSelected = selectedTableId === table.id;

              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedTableId(table.id)}
                  className={`rounded-2xl bg-[#1B1B1E] border shadow-2xl transition-all font-mono text-xs overflow-hidden ${
                    isSelected ? 'border-[#62DF7D] ring-2 ring-[#62DF7D]/20' : 'border-[#2D2D31] hover:border-[#8A8A90]'
                  }`}
                >
                  {/* Table Card Header */}
                  <div className="bg-[#232326] px-4 py-3 border-b border-[#2D2D31] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#62DF7D]" />
                      <span className="font-bold text-[#FFFFFF]">{table.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTargetTableForCol(table.id);
                          setShowColumnModal(true);
                        }}
                        className="p-1 rounded bg-[#131315] border border-[#2D2D31] text-[#62DF7D] hover:bg-[#2D2D31]"
                        title="Add Column"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTable(table.id);
                        }}
                        className="p-1 rounded bg-[#131315] border border-[#2D2D31] text-[#EF4444] hover:bg-[#2D2D31]"
                        title="Delete Table"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Columns List */}
                  <div className="p-3 space-y-1.5">
                    {table.columns.map((col) => (
                      <div
                        key={col.id}
                        className="p-2 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-center justify-between text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          {col.isPrimaryKey && (
                            <span title="Primary Key">
                              <Key className="w-3.5 h-3.5 text-[#F59E0B]" />
                            </span>
                          )}
                          {col.isForeignKey && (
                            <span title="Foreign Key">
                              <Link className="w-3.5 h-3.5 text-[#3B82F6]" />
                            </span>
                          )}
                          <span className={`font-bold ${col.isPrimaryKey ? 'text-[#F59E0B]' : 'text-[#FFFFFF]'}`}>
                            {col.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#8A8A90]">{col.type}</span>
                          <button
                            onClick={() => deleteColumnFromTable(table.id, col.id)}
                            className="text-[#8A8A90] hover:text-[#EF4444]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Generated SQL Code Sidebar (1 Col) */}
        {showDdlPanel && (
          <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-3 shadow-2xl flex flex-col justify-between font-mono text-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#2D2D31] pb-3">
                <h3 className="font-bold text-[#FFFFFF] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#62DF7D]" /> Real-Time Generated DDL Script
                </h3>
                <button
                  onClick={handleCopySQL}
                  className="px-2.5 py-1 rounded bg-[#131315] border border-[#2D2D31] text-[#62DF7D] hover:bg-[#232326] flex items-center gap-1 text-[10px]"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>

              <textarea
                readOnly
                value={generatedDdl}
                className="w-full h-[400px] bg-[#131315] border border-[#2D2D31] rounded-xl p-3 text-[11px] text-[#62DF7D] focus:outline-none resize-none font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddTableModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm rounded-2xl bg-[#131315] border border-[#2D2D31] p-6 space-y-4 z-10 font-mono text-xs">
            <h3 className="font-bold text-[#FFFFFF] text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-[#62DF7D]" /> Add Relational Table
            </h3>
            <input
              type="text"
              placeholder="Table Name (e.g. invoices, shipments)"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              className="w-full bg-[#1B1B1E] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
            />
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowAddTableModal(false)}
                className="flex-1 py-2 rounded-xl bg-[#1B1B1E] text-[#8A8A90]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewTable}
                className="flex-1 py-2 rounded-xl bg-[#62DF7D] text-[#131315] font-bold"
              >
                Create Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Column Modal */}
      {showColumnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowColumnModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl bg-[#131315] border border-[#2D2D31] p-6 space-y-4 z-10 font-mono text-xs">
            <h3 className="font-bold text-[#FFFFFF] text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#3B82F6]" /> Add Column Definition
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[#8A8A90] block mb-1">Column Name:</label>
                <input
                  type="text"
                  placeholder="e.g. status, total_amount, email"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  className="w-full bg-[#1B1B1E] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="text-[#8A8A90] block mb-1">SQL Data Type:</label>
                <select
                  value={newColType}
                  onChange={(e) => setNewColType(e.target.value)}
                  className="w-full bg-[#1B1B1E] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#3B82F6]"
                >
                  <option value="VARCHAR(100)">VARCHAR(100)</option>
                  <option value="INTEGER">INTEGER</option>
                  <option value="BIGINT">BIGINT</option>
                  <option value="DECIMAL(12,2)">DECIMAL(12,2)</option>
                  <option value="TIMESTAMP">TIMESTAMP</option>
                  <option value="UUID">UUID</option>
                  <option value="BOOLEAN">BOOLEAN</option>
                  <option value="JSONB">JSONB</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newColIsPk}
                    onChange={(e) => setNewColIsPk(e.target.checked)}
                    className="accent-[#F59E0B]"
                  />
                  <span>Primary Key</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newColIsFk}
                    onChange={(e) => setNewColIsFk(e.target.checked)}
                    className="accent-[#3B82F6]"
                  />
                  <span>Foreign Key</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button onClick={() => setShowColumnModal(false)} className="flex-1 py-2 rounded-xl bg-[#1B1B1E] text-[#8A8A90]">
                Cancel
              </button>
              <button onClick={handleAddColumn} className="flex-1 py-2 rounded-xl bg-[#3B82F6] text-[#FFFFFF] font-bold">
                Save Column
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
