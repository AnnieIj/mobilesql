import React, { useState } from 'react';
import {
  Search,
  Database,
  Star,
  Pin,
  Clock,
  Folder,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Plus,
  Trash2,
  Table as TableIcon,
  Key,
  FileCode,
  Layers,
} from 'lucide-react';
import { usePlaygroundStore } from '../../stores/usePlaygroundStore';
import { useSQLEngineStore } from '../../stores/useSQLEngineStore';
import { PRACTICE_DATABASES } from '../../data/playgroundDatabases';
import { SQL_TEMPLATES } from '../../data/sqlTemplatesData';
import { Button } from '../ui/Button';

interface SidebarProps {
  onSelectDatabase: (dbId: string) => void;
  activeDatabaseId: string;
}

export const PlaygroundSidebar: React.FC<SidebarProps> = ({
  onSelectDatabase,
  activeDatabaseId,
}) => {
  const {
    savedQueries,
    createNewTab,
    updateTabContent,
    activeTabId,
    tabs,
    toggleFavoriteQuery,
    togglePinQuery,
    deleteSavedQuery,
  } = usePlaygroundStore();

  const { history } = useSQLEngineStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    databases: true,
    saved: true,
    history: false,
    templates: false,
  });

  const [expandedTable, setExpandedTable] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const activeDb = PRACTICE_DATABASES.find((d) => d.id === activeDatabaseId) || PRACTICE_DATABASES[0];

  const filteredSaved = savedQueries.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.sql.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedQueries = savedQueries.filter((q) => q.isPinned);
  const favoriteQueries = savedQueries.filter((q) => q.isFavorite);

  const appendToEditor = (sql: string) => {
    if (activeTab) {
      const newSql = activeTab.sql ? `${activeTab.sql}\n\n${sql}` : sql;
      updateTabContent(activeTab.id, newSql);
    } else {
      createNewTab('query.sql', sql, activeDatabaseId);
    }
  };

  return (
    <div className="w-full h-full bg-[#1B1B1E] border-r border-[#2D2D31] flex flex-col font-sans select-none text-xs">
      {/* Search Header */}
      <div className="p-3 border-b border-[#2D2D31] space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono font-bold text-[#FFFFFF] text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#62DF7D]" />
            SQL Workspace
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => createNewTab()}
            title="Create New Query Tab"
            leftIcon={<Plus className="w-3.5 h-3.5 text-[#62DF7D]" />}
          >
            New
          </Button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#8A8A90] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schemas, queries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D] transition-colors"
          />
        </div>
      </div>

      {/* Accordion List Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar">
        {/* SECTION 1: PRACTICE DATABASES & SCHEMAS */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSection('databases')}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#232326] text-[#FFFFFF] font-bold transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#3B82F6]" />
              Practice Databases ({PRACTICE_DATABASES.length})
            </span>
            {openSections.databases ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#8A8A90]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#8A8A90]" />
            )}
          </button>

          {openSections.databases && (
            <div className="pl-2 space-y-2 border-l border-[#2D2D31]/60 my-1">
              {/* Database Selector Dropdown */}
              <select
                value={activeDatabaseId}
                onChange={(e) => onSelectDatabase(e.target.value)}
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-lg p-1.5 text-xs text-[#62DF7D] font-mono focus:outline-none cursor-pointer"
              >
                {PRACTICE_DATABASES.map((db) => (
                  <option key={db.id} value={db.id}>
                    {db.name} ({db.dialect})
                  </option>
                ))}
              </select>

              {/* Schema Table Browser */}
              <div className="space-y-1">
                <p className="text-[10px] text-[#8A8A90] font-mono uppercase tracking-wider px-1">
                  Active Schema: {activeDb.name}
                </p>

                {activeDb.tables.map((table) => {
                  const isExpanded = expandedTable === table.name;
                  return (
                    <div
                      key={table.name}
                      className="rounded-lg bg-[#131315]/80 border border-[#2D2D31]/80 overflow-hidden"
                    >
                      <div
                        onClick={() => setExpandedTable(isExpanded ? null : table.name)}
                        className="p-2 flex items-center justify-between hover:bg-[#232326] cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-1.5 font-mono text-[#FFFFFF]">
                          <TableIcon className="w-3 h-3 text-[#62DF7D]" />
                          {table.name}
                        </span>
                        <span className="text-[10px] text-[#8A8A90] font-mono">
                          {table.rowCount} rows
                        </span>
                      </div>

                      {/* Expanded Columns */}
                      {isExpanded && (
                        <div className="p-2 bg-[#0D0D0F] border-t border-[#2D2D31]/60 space-y-1.5 font-mono text-[11px]">
                          {table.columns.map((col) => (
                            <div
                              key={col.name}
                              className="flex items-center justify-between text-[#8A8A90] hover:text-[#FFFFFF]"
                            >
                              <span className="flex items-center gap-1">
                                {col.isPrimaryKey ? (
                                  <Key className="w-3 h-3 text-[#F59E0B]" />
                                ) : col.isForeignKey ? (
                                  <Key className="w-3 h-3 text-[#3B82F6]" />
                                ) : (
                                  <span className="w-3" />
                                )}
                                <span className={col.isPrimaryKey ? 'text-[#F59E0B] font-bold' : ''}>
                                  {col.name}
                                </span>
                              </span>
                              <span className="text-[9px] text-[#8A8A90] uppercase">{col.type}</span>
                            </div>
                          ))}

                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full mt-2 text-[10px]"
                            onClick={() => appendToEditor(`SELECT * FROM ${table.name} LIMIT 10;`)}
                          >
                            + Insert SELECT Query
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: SAVED & PINNED QUERIES */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSection('saved')}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#232326] text-[#FFFFFF] font-bold transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-[#F59E0B]" />
              Saved Queries ({filteredSaved.length})
            </span>
            {openSections.saved ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#8A8A90]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#8A8A90]" />
            )}
          </button>

          {openSections.saved && (
            <div className="pl-2 space-y-1 border-l border-[#2D2D31]/60 my-1">
              {filteredSaved.length === 0 ? (
                <p className="text-[11px] text-[#8A8A90] italic p-1">No saved queries yet.</p>
              ) : (
                filteredSaved.map((sq) => (
                  <div
                    key={sq.id}
                    className="group p-2 rounded-lg bg-[#131315]/60 border border-[#2D2D31]/60 hover:border-[#62DF7D]/60 flex items-center justify-between gap-2 cursor-pointer transition-colors"
                  >
                    <div
                      className="min-w-0 flex-1 space-y-0.5"
                      onClick={() => createNewTab(`${sq.title}.sql`, sq.sql, sq.databaseId)}
                    >
                      <p className="text-xs font-bold text-[#FFFFFF] truncate group-hover:text-[#62DF7D]">
                        {sq.title}
                      </p>
                      <p className="text-[10px] text-[#8A8A90] font-mono truncate">{sq.sql}</p>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => togglePinQuery(sq.id)}
                        className={`p-1 hover:text-[#F59E0B] ${sq.isPinned ? 'text-[#F59E0B]' : 'text-[#8A8A90]'}`}
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => toggleFavoriteQuery(sq.id)}
                        className={`p-1 hover:text-[#F59E0B] ${sq.isFavorite ? 'text-[#F59E0B]' : 'text-[#8A8A90]'}`}
                      >
                        <Star className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteSavedQuery(sq.id)}
                        className="p-1 text-[#8A8A90] hover:text-[#EF4444]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* SECTION 3: EXECUTION HISTORY */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSection('history')}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#232326] text-[#FFFFFF] font-bold transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#62DF7D]" />
              Execution History ({history.length})
            </span>
            {openSections.history ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#8A8A90]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#8A8A90]" />
            )}
          </button>

          {openSections.history && (
            <div className="pl-2 space-y-1 border-l border-[#2D2D31]/60 my-1">
              {history.length === 0 ? (
                <p className="text-[11px] text-[#8A8A90] italic p-1">No execution history yet.</p>
              ) : (
                history.slice(0, 10).map((h, idx) => (
                  <div
                    key={idx}
                    onClick={() => appendToEditor(h.query)}
                    className="p-2 rounded-lg bg-[#131315]/60 border border-[#2D2D31]/60 hover:border-[#62DF7D] cursor-pointer space-y-1 font-mono transition-colors"
                  >
                    <div className="flex justify-between text-[10px] text-[#8A8A90]">
                      <span className="text-[#62DF7D] font-bold">{h.executionTimeMs}ms</span>
                      <span>{h.executedAt}</span>
                    </div>
                    <p className="text-[11px] text-[#FFFFFF] truncate">{h.query}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* SECTION 4: STARTER TEMPLATES */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSection('templates')}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#232326] text-[#FFFFFF] font-bold transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
              Starter Templates ({SQL_TEMPLATES.length})
            </span>
            {openSections.templates ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#8A8A90]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#8A8A90]" />
            )}
          </button>

          {openSections.templates && (
            <div className="pl-2 space-y-1 border-l border-[#2D2D31]/60 my-1">
              {SQL_TEMPLATES.slice(0, 8).map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => createNewTab(`${tmpl.title.toLowerCase().replace(/\s+/g, '_')}.sql`, tmpl.sql, activeDatabaseId)}
                  className="p-2 rounded-lg bg-[#131315]/60 border border-[#2D2D31]/60 hover:border-[#A855F7] cursor-pointer space-y-1 transition-colors"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="px-1.5 py-0.2 rounded bg-[#A855F7]/20 text-[#A855F7] font-mono font-bold">
                      {tmpl.category}
                    </span>
                    <span className="text-[#8A8A90] font-mono">{tmpl.difficulty}</span>
                  </div>
                  <p className="text-xs font-bold text-[#FFFFFF] truncate">{tmpl.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
