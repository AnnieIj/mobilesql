import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Database,
  ArrowRight,
  Star,
  Download,
  CheckCircle2,
  SlidersHorizontal,
  Table,
  Zap,
} from 'lucide-react';
import { useDatasetStore } from '../../stores/useDatasetStore';
import { useUIStore } from '../../stores/useUIStore';
import { DatasetCategory, FullDataset } from '../../types/dataset';

export const DatasetTemplatesTab: React.FC = () => {
  const { addToast } = useUIStore();
  const { datasets, setCurrentDataset, setActiveSubTab } = useDatasetStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<FullDataset>(datasets[0]);

  const CATEGORIES: Array<DatasetCategory | 'All'> = [
    'All',
    'E-Commerce',
    'Banking',
    'Healthcare',
    'Education',
    'HR',
    'CRM',
    'ERP',
    'Retail',
    'Logistics',
    'Airlines',
    'Hotels',
    'Social Media',
    'Movie Streaming',
    'Food Delivery',
    'Insurance',
    'Government',
    'Telecommunications',
    'Manufacturing',
    'Real Estate',
    'SaaS Analytics',
  ];

  const filteredTemplates = datasets.filter((ds) => {
    const matchesCategory = selectedCategoryFilter === 'All' || ds.category === selectedCategoryFilter;
    const matchesSearch =
      ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLoadTemplate = (template: FullDataset) => {
    setCurrentDataset(template);
    addToast({
      title: 'Template Loaded',
      message: `Set active dataset to "${template.name}".`,
      type: 'success',
    });
    setActiveSubTab('designer');
  };

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF]">
      {/* Header & Controls */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D2D31] pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#FFFFFF] flex items-center gap-2 font-mono">
              <BookOpen className="w-5 h-5 text-[#62DF7D]" /> Industry Dataset Template Catalog (20 Domains)
            </h2>
            <p className="text-xs text-[#8A8A90] font-mono mt-0.5">
              Production-grade relational schemas with realistic mock data, ER mappings, and SQL exercises across 20 industries.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#62DF7D] font-bold">
              {datasets.length} Total Schemas
            </span>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8A8A90] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search templates by industry, table name, or scenario (e.g. Banking, E-Commerce, Hospital)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar font-mono text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap text-[11px] ${
                  selectedCategoryFilter === cat
                    ? 'bg-[#62DF7D] text-[#131315] shadow-md'
                    : 'bg-[#131315] border border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF] hover:border-[#62DF7D]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates Grid (2 Cols) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => {
            const isSelected = activePreviewTemplate.id === template.id;

            return (
              <div
                key={template.id}
                onClick={() => setActivePreviewTemplate(template)}
                className={`p-5 rounded-2xl bg-[#1B1B1E] border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-[#62DF7D] ring-2 ring-[#62DF7D]/20 shadow-xl'
                    : 'border-[#2D2D31] hover:border-[#8A8A90]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#62DF7D]/15 text-[#62DF7D] border border-[#62DF7D]/30 font-mono text-[10px] font-bold">
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1 text-[#F59E0B] text-xs font-mono">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{template.stars}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#FFFFFF]">{template.name}</h3>
                  <p className="text-xs text-[#8A8A90] font-mono line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#2D2D31] flex items-center justify-between text-[11px] font-mono text-[#C8C8CC]">
                  <span className="flex items-center gap-1">
                    <Table className="w-3.5 h-3.5 text-[#3B82F6]" /> {template.tables.length} Tables
                  </span>
                  <span className="text-[#62DF7D] font-bold flex items-center gap-1">
                    Inspect Schema <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Template Details Panel (1 Col) */}
        <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4 font-mono text-xs">
            <div className="border-b border-[#2D2D31] pb-3">
              <span className="text-[10px] text-[#62DF7D] font-bold uppercase">{activePreviewTemplate.category}</span>
              <h3 className="text-base font-bold text-[#FFFFFF] mt-0.5">{activePreviewTemplate.name}</h3>
              <p className="text-[11px] text-[#8A8A90] mt-1 leading-relaxed">{activePreviewTemplate.description}</p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-[#8A8A90] uppercase font-bold">Business Context:</p>
              <p className="text-[11px] text-[#C8C8CC] bg-[#131315] p-3 rounded-xl border border-[#2D2D31] leading-relaxed">
                {activePreviewTemplate.businessContext}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-[#8A8A90] uppercase font-bold">Tables Included:</p>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {activePreviewTemplate.tables.map((tbl) => (
                  <div key={tbl.id} className="p-2.5 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#FFFFFF] text-[11px]">{tbl.name}</p>
                      <p className="text-[10px] text-[#8A8A90]">{tbl.description}</p>
                    </div>
                    <span className="text-[10px] text-[#62DF7D] font-mono">{tbl.columns.length} Cols</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2D2D31] space-y-2">
            <button
              onClick={() => handleLoadTemplate(activePreviewTemplate)}
              className="w-full py-3 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap className="w-4 h-4" /> Load Schema into Visual Designer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
