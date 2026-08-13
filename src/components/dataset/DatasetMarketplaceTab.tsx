import React, { useState } from 'react';
import {
  Globe,
  Search,
  Star,
  Download,
  Bookmark,
  CheckCircle2,
  Table,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useDatasetStore } from '../../stores/useDatasetStore';
import { useUIStore } from '../../stores/useUIStore';
import { exportDatasetAsSQL, exportDatasetAsJSON } from '../../services/importExportService';

export const DatasetMarketplaceTab: React.FC = () => {
  const { addToast } = useUIStore();
  const {
    datasets,
    bookmarkedDatasetIds,
    toggleBookmark,
    rateDataset,
    setCurrentDataset,
    setActiveSubTab,
  } = useDatasetStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = datasets.filter((d) => {
    const matchesCategory = categoryFilter === 'All' || d.category === categoryFilter;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCloneDataset = (ds: typeof datasets[0]) => {
    setCurrentDataset(ds);
    addToast({ title: 'Dataset Cloned', message: `Loaded "${ds.name}" into active workspace.`, type: 'success' });
    setActiveSubTab('designer');
  };

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF]">
      {/* Header */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 shadow-xl space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D2D31] pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#FFFFFF] flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#62DF7D]" /> Dataset Community Marketplace
            </h2>
            <p className="text-xs text-[#8A8A90] mt-0.5">
              Discover, clone, bookmark, and share relational datasets contributed by the MobileSQL community.
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#8A8A90] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search dataset marketplace by title or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        {filtered.map((ds) => {
          const isBookmarked = bookmarkedDatasetIds.includes(ds.id);

          return (
            <div key={ds.id} className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-5 space-y-3 shadow-xl flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#62DF7D]/15 text-[#62DF7D] text-[10px] font-bold border border-[#62DF7D]/30">
                    {ds.category}
                  </span>
                  <button
                    onClick={() => toggleBookmark(ds.id)}
                    className={`p-1.5 rounded-lg border ${
                      isBookmarked ? 'bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]' : 'bg-[#131315] border-[#2D2D31] text-[#8A8A90]'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                <h3 className="font-bold text-[#FFFFFF] text-sm">{ds.name}</h3>
                <p className="text-xs text-[#8A8A90] line-clamp-2 leading-relaxed">{ds.description}</p>
              </div>

              <div className="pt-3 border-t border-[#2D2D31] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold">{ds.stars}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportDatasetAsSQL(ds)}
                    className="p-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF]"
                    title="Export SQL"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCloneDataset(ds)}
                    className="px-3 py-1.5 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5" /> Clone
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
