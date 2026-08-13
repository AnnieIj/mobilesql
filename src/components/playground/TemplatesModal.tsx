import React, { useState } from 'react';
import { Search, Sparkles, X, Code2, Plus, ArrowRight } from 'lucide-react';
import { SQL_TEMPLATES } from '../../data/sqlTemplatesData';
import { usePlaygroundStore } from '../../stores/usePlaygroundStore';
import { Button } from '../ui/Button';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  'All',
  'SELECT',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'INNER JOIN',
  'LEFT JOIN',
  'SELF JOIN',
  'Window Functions',
  'Ranking',
  'CTE',
  'Recursive CTE',
  'JSON',
  'Optimization',
  'Indexes',
];

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createNewTab } = usePlaygroundStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = SQL_TEMPLATES.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.sql.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#131315]/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#2D2D31] bg-[#131315] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#62DF7D]" />
            <div>
              <h2 className="text-base font-bold text-[#FFFFFF]">SQL Starter Templates</h2>
              <p className="text-xs text-[#8A8A90]">
                Hundreds of production-grade SQL patterns and optimization snippets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8A8A90] hover:text-[#FFFFFF] hover:bg-[#232326] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3 border-b border-[#2D2D31] bg-[#1B1B1E] space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8A8A90] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SQL templates (e.g. Recursive CTE, Window Functions, Indexes)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl pl-9 pr-3 py-2 text-xs text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#62DF7D] text-[#131315] font-bold'
                    : 'bg-[#131315] text-[#8A8A90] hover:text-[#FFFFFF] border border-[#2D2D31]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
          {filtered.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-[#131315] border border-[#2D2D31] hover:border-[#62DF7D] rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#62DF7D]/15 text-[#62DF7D] font-bold">
                    {tmpl.category}
                  </span>
                  <span className="text-[#8A8A90]">{tmpl.difficulty}</span>
                </div>

                <h3 className="font-bold text-[#FFFFFF] text-sm group-hover:text-[#62DF7D] transition-colors">
                  {tmpl.title}
                </h3>
                <p className="text-xs text-[#8A8A90] leading-relaxed">{tmpl.description}</p>

                <pre className="p-2.5 bg-[#0D0D0F] border border-[#2D2D31] rounded-lg text-[11px] font-mono text-[#62DF7D] overflow-x-auto max-h-32">
                  {tmpl.sql}
                </pre>
              </div>

              <Button
                size="sm"
                variant="primary"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => {
                  createNewTab(`${tmpl.title.toLowerCase().replace(/\s+/g, '_')}.sql`, tmpl.sql);
                  onClose();
                }}
                className="w-full mt-2"
              >
                Insert Template into Workspace
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
