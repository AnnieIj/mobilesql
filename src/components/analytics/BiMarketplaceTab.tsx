import React, { useState } from 'react';
import {
  Globe,
  Star,
  Download,
  Copy,
  Bookmark,
  Search,
  Check,
  User,
} from 'lucide-react';
import { useAnalyticsStore } from '../../stores/useAnalyticsStore';

export const BiMarketplaceTab: React.FC = () => {
  const { marketplaceTemplates, cloneTemplate } = useAnalyticsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [clonedSuccessId, setClonedSuccessId] = useState<string | null>(null);

  const categories = ['All', 'SaaS', 'E-Commerce', 'DevOps', 'Executive', 'Financial'];

  const filteredTemplates = marketplaceTemplates.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClone = (id: string) => {
    cloneTemplate(id);
    setClonedSuccessId(id);
    setTimeout(() => setClonedSuccessId(null), 3000);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#FFFFFF]">
      {/* Marketplace Header Banner */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-[#62DF7D] font-bold text-sm">
          <Globe className="w-5 h-5" />
          <span>MobileSQL Business Intelligence Community Marketplace</span>
        </div>
        <p className="text-xs text-[#8A8A90]">
          Explore, clone, bookmark, and publish production-grade dashboard templates created by SQL engineers and BI architects worldwide.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8A8A90] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search BI templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap text-[11px] ${
                selectedCategory === cat
                  ? 'bg-[#62DF7D] text-[#131315]'
                  : 'bg-[#131315] text-[#8A8A90] hover:text-[#FFFFFF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const isBookmarked = bookmarkedIds.includes(template.id);
          const isCloned = clonedSuccessId === template.id;

          return (
            <div
              key={template.id}
              className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl overflow-hidden hover:border-[#62DF7D]/50 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              {/* Header Visual Box */}
              <div
                className={`h-28 bg-gradient-to-br ${template.previewImageBg} p-4 flex flex-col justify-between relative`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#131315]/80 backdrop-blur border border-[#2D2D31] text-[10px] font-bold text-[#62DF7D]">
                    {template.category}
                  </span>
                  <button
                    onClick={() => toggleBookmark(template.id)}
                    className="p-1.5 rounded-lg bg-[#131315]/80 text-[#8A8A90] hover:text-[#F59E0B] cursor-pointer"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#F59E0B] text-[#F59E0B]' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#FFFFFF] font-bold drop-shadow">
                  <span className="flex items-center gap-1 text-[#F59E0B]">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B]" /> {template.stars}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5 text-[#3B82F6]" /> {template.clones} clones
                  </span>
                </div>
              </div>

              {/* Template Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-[#FFFFFF]">{template.title}</h3>
                  <p className="text-[11px] text-[#8A8A90] leading-relaxed">{template.description}</p>
                </div>

                <div className="pt-3 border-t border-[#2D2D31] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-[#8A8A90]">
                    <User className="w-3.5 h-3.5 text-[#62DF7D]" />
                    <span>{template.author}</span>
                  </div>

                  <button
                    onClick={() => handleClone(template.id)}
                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      isCloned
                        ? 'bg-[#10B981] text-[#FFFFFF]'
                        : 'bg-[#62DF7D] text-[#131315] hover:bg-[#52ce6d]'
                    }`}
                  >
                    {isCloned ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Cloned to Workspace</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Clone Dashboard</span>
                      </>
                    )}
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
