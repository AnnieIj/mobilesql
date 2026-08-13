import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  BookOpen,
  Terminal,
  Trophy,
  Award,
  FileText,
  Code2,
  FolderGit2,
  X,
  CornerDownLeft,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { useUIStore } from '../../stores/useUIStore';
import type { ActiveTab } from '../../types';

interface SearchResultItem {
  id: string;
  category: 'Lessons' | 'Projects' | 'SQL Keywords' | 'Documentation' | 'Achievements' | 'Certificates';
  title: string;
  subtitle: string;
  tabTarget?: ActiveTab;
  codeSnippet?: string;
  icon: React.ReactNode;
}

const MOCK_SEARCH_DATA: SearchResultItem[] = [
  // Lessons
  {
    id: 's_lesson_1',
    category: 'Lessons',
    title: 'Advanced Window Functions & PARTITION BY',
    subtitle: 'Master ROW_NUMBER(), DENSE_RANK(), and frame clauses in PostgreSQL',
    tabTarget: 'academy',
    icon: <BookOpen className="w-4 h-4 text-[#62DF7D]" />,
  },
  {
    id: 's_lesson_2',
    category: 'Lessons',
    title: 'Recursive Common Table Expressions (CTEs)',
    subtitle: 'Query hierarchical org trees and graph structures with WITH RECURSIVE',
    tabTarget: 'academy',
    icon: <BookOpen className="w-4 h-4 text-[#62DF7D]" />,
  },
  {
    id: 's_lesson_3',
    category: 'Lessons',
    title: 'Subquery Optimization & Correlated Joins',
    subtitle: 'Eliminate N+1 subquery bottlenecks using LATERAL joins',
    tabTarget: 'academy',
    icon: <BookOpen className="w-4 h-4 text-[#62DF7D]" />,
  },

  // Projects
  {
    id: 's_proj_1',
    category: 'Projects',
    title: 'E-Commerce Realtime Analytics Engine',
    subtitle: 'Cohort retention analysis, LTV calculation, and churn prediction',
    tabTarget: 'projects',
    icon: <FolderGit2 className="w-4 h-4 text-[#3B82F6]" />,
  },
  {
    id: 's_proj_2',
    category: 'Projects',
    title: 'SaaS Billing & Subscription Ledger Schema',
    subtitle: 'Double-entry ledger architecture with proration window functions',
    tabTarget: 'projects',
    icon: <FolderGit2 className="w-4 h-4 text-[#3B82F6]" />,
  },

  // SQL Keywords
  {
    id: 's_kw_1',
    category: 'SQL Keywords',
    title: 'GROUP BY CUBE & ROLLUP',
    subtitle: 'Generate subtotal aggregation sets in a single pass',
    codeSnippet: 'GROUP BY CUBE (year, region, department)',
    tabTarget: 'editor',
    icon: <Code2 className="w-4 h-4 text-[#F59E0B]" />,
  },
  {
    id: 's_kw_2',
    category: 'SQL Keywords',
    title: 'COALESCE & NULLIF',
    subtitle: 'Handle null propagation and guard against divide-by-zero errors',
    codeSnippet: 'COALESCE(discount, 0) / NULLIF(total, 0)',
    tabTarget: 'editor',
    icon: <Code2 className="w-4 h-4 text-[#F59E0B]" />,
  },
  {
    id: 's_kw_3',
    category: 'SQL Keywords',
    title: 'EXPLAIN ANALYZE (BUF, VERBOSE)',
    subtitle: 'Inspect actual vs estimated query execution plans and buffer hits',
    codeSnippet: 'EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders;',
    tabTarget: 'editor',
    icon: <Code2 className="w-4 h-4 text-[#F59E0B]" />,
  },

  // Documentation
  {
    id: 's_doc_1',
    category: 'Documentation',
    title: 'PostgreSQL 16 Query Planner & Indexing',
    subtitle: 'B-Tree, BRIN, GIN, and GiST index selection heuristics',
    tabTarget: 'help',
    icon: <FileText className="w-4 h-4 text-[#C8C8CC]" />,
  },
  {
    id: 's_doc_2',
    category: 'Documentation',
    title: 'SQLite WASM Memory & VFS Limits',
    subtitle: 'In-browser persistent virtual file systems and WAL mode performance',
    tabTarget: 'help',
    icon: <FileText className="w-4 h-4 text-[#C8C8CC]" />,
  },

  // Achievements
  {
    id: 's_ach_1',
    category: 'Achievements',
    title: '10ms Speedster Badge',
    subtitle: 'Execute 10 complex queries under 10ms latency',
    tabTarget: 'achievements',
    icon: <Trophy className="w-4 h-4 text-[#62DF7D]" />,
  },
  {
    id: 's_ach_2',
    category: 'Achievements',
    title: 'SQL Master Architect Badge',
    subtitle: 'Complete all 12 advanced schema design modules',
    tabTarget: 'achievements',
    icon: <Trophy className="w-4 h-4 text-[#62DF7D]" />,
  },

  // Certificates
  {
    id: 's_cert_1',
    category: 'Certificates',
    title: 'SQL Master Architect Verification',
    subtitle: 'Official shareable credential credentialed on-chain',
    tabTarget: 'certificates',
    icon: <Award className="w-4 h-4 text-[#22C55E]" />,
  },
];

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, setActiveTab, addToast } = useUIStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global Keyboard listener for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  // Filter items
  const filtered = MOCK_SEARCH_DATA.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.codeSnippet && item.codeSnippet.toLowerCase().includes(q))
    );
  });

  // Group by category
  const categories = Array.from(new Set(filtered.map((item) => item.category)));

  const handleSelect = (item: SearchResultItem) => {
    if (item.tabTarget) {
      setActiveTab(item.tabTarget);
    }
    addToast({
      title: item.title,
      message: `Navigated to ${item.category} module.`,
      type: 'info',
    });
    setSearchOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#131315] border border-[#2D2D31] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-[#2D2D31] bg-[#1B1B1E] gap-3">
              <Search className="w-5 h-5 text-[#8A8A90] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search lessons, projects, SQL keywords, docs, badges..."
                autoFocus
                className="w-full bg-transparent text-[#FFFFFF] text-sm placeholder-[#8A8A90] focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-[#8A8A90] hover:text-[#FFFFFF] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="px-2 py-0.5 text-[10px] font-mono text-[#8A8A90] bg-[#232326] border border-[#2D2D31] rounded">
                ESC
              </kbd>
            </div>

            {/* Results Canvas */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-4 divide-y divide-[#2D2D31]/40">
              {filtered.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <Terminal className="w-8 h-8 text-[#8A8A90] mx-auto opacity-50" />
                  <p className="text-sm font-semibold text-[#FFFFFF]">No matching results</p>
                  <p className="text-xs text-[#8A8A90]">Try searching for 'WINDOW', 'PostgreSQL', or 'Speedster'</p>
                </div>
              ) : (
                categories.map((cat) => {
                  const catItems = filtered.filter((i) => i.category === cat);
                  return (
                    <div key={cat} className="pt-2 first:pt-0 space-y-1">
                      <p className="px-3 py-1 text-[10px] font-mono font-bold text-[#8A8A90] uppercase tracking-wider">
                        {cat}
                      </p>
                      {catItems.map((item) => {
                        const globalIndex = filtered.indexOf(item);
                        const isSelected = globalIndex === selectedIndex;

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              'group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer select-none',
                              isSelected
                                ? 'bg-[#1B1B1E] border border-[#2D2D31] shadow-sm'
                                : 'hover:bg-[#1B1B1E]/60 border border-transparent'
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={cn(
                                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors',
                                  isSelected
                                    ? 'bg-[#232326] border-[#62DF7D]/40'
                                    : 'bg-[#1B1B1E] border-[#2D2D31]'
                                )}
                              >
                                {item.icon}
                              </div>

                              <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-bold text-[#FFFFFF] truncate">{item.title}</p>
                                  {item.codeSnippet && (
                                    <code className="hidden sm:inline-block text-[10px] font-mono text-[#62DF7D] bg-[#232326] px-1.5 py-0.5 rounded border border-[#2D2D31]">
                                      {item.codeSnippet}
                                    </code>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#8A8A90] truncate">{item.subtitle}</p>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="flex items-center gap-1 text-[10px] font-mono text-[#62DF7D] shrink-0 pl-2">
                                <span>Jump</span>
                                <CornerDownLeft className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-2.5 bg-[#1B1B1E] border-t border-[#2D2D31] flex items-center justify-between text-[11px] text-[#8A8A90] font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[#232326] border border-[#2D2D31] rounded">↑↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[#232326] border border-[#2D2D31] rounded">↵</kbd> select
                </span>
              </div>
              <span className="text-[#62DF7D]">Raycast Style Command Engine</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
