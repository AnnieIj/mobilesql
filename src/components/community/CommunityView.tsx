import React, { useState } from 'react';
import { Users, MessageSquare, ThumbsUp, Code2, Plus, Sparkles, Send } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';

export interface ForumPost {
  id: string;
  author: string;
  title: string;
  snippet: string;
  upvotes: number;
  repliesCount: number;
  category: string;
  timeAgo: string;
}

const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'post_1',
    author: 'Elena Rostova',
    title: 'How to optimize PostgreSQL Window Functions over 50M rows using Index Only Scans',
    snippet: `CREATE INDEX idx_orders_user_date ON orders(user_id, order_date DESC) INCLUDE (amount);\n-- Uses Index Only Scan without heap fetch!`,
    upvotes: 84,
    repliesCount: 16,
    category: 'Optimization',
    timeAgo: '2 hours ago',
  },
  {
    id: 'post_2',
    author: 'Chen Wei',
    title: 'SQLite WASM vs Native Driver query performance benchmarks in browser workers',
    snippet: `EXPLAIN QUERY PLAN SELECT * FROM sales WHERE category = 'Tech';\n-- SEARCH TABLE sales USING COVERING INDEX idx_cat`,
    upvotes: 62,
    repliesCount: 9,
    category: 'WASM & Engine',
    timeAgo: '5 hours ago',
  },
  {
    id: 'post_3',
    author: 'Sofia Vance',
    title: 'Top 5 mistakes in Google SQL interviews (and how to avoid subquery traps)',
    snippet: `WITH ranked_spend AS (\n  SELECT user_id, PERCENT_RANK() OVER (ORDER BY spend) AS pr FROM ads\n)\nSELECT * FROM ranked_spend WHERE pr >= 0.95;`,
    upvotes: 112,
    repliesCount: 24,
    category: 'Interviews',
    timeAgo: 'Yesterday',
  },
];

export const CommunityView: React.FC = () => {
  const { addToast } = useUIStore();
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_POSTS);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSnippet, setNewSnippet] = useState('');

  const handleUpvote = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
    addToast({ title: 'Upvoted', message: 'Supported post author!', type: 'success' });
  };

  const handleCreatePost = () => {
    if (!newTitle.trim()) return;
    const post: ForumPost = {
      id: `post_${Date.now()}`,
      author: 'SQL Query Architect (You)',
      title: newTitle,
      snippet: newSnippet || '-- Sample SQL snippet',
      upvotes: 1,
      repliesCount: 0,
      category: 'Discussion',
      timeAgo: 'Just now',
    };
    setPosts([post, ...posts]);
    setShowNewPostModal(false);
    setNewTitle('');
    setNewSnippet('');
    addToast({ title: 'Discussion Published', message: 'Post shared with community!', type: 'success' });
  };

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-[#FFFFFF] select-none">
      {/* Header */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/40 text-[#3B82F6] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#FFFFFF]">Developer Community & Schema Forum</h1>
              <p className="text-xs text-[#8A8A90] font-mono">
                Discuss query optimizations, schema patterns, and PostgreSQL tips with database engineers worldwide.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNewPostModal(true)}
            className="px-4 py-2 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold text-xs font-mono cursor-pointer flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Start Discussion
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[#1B1B1E] border border-[#2D2D31] hover:border-[#3F3F46] rounded-2xl p-5 space-y-3 transition-all shadow-xl"
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#FFFFFF]">{post.author}</span>
                <span className="text-[#8A8A90]">• {post.timeAgo}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#131315] border border-[#2D2D31] text-[#62DF7D] text-[10px]">
                {post.category}
              </span>
            </div>

            <h2 className="text-base font-bold text-[#FFFFFF]">{post.title}</h2>

            <pre className="p-3 rounded-xl bg-[#131315] border border-[#2D2D31] text-xs font-mono text-[#62DF7D] overflow-x-auto custom-scrollbar">
              {post.snippet}
            </pre>

            <div className="flex items-center gap-4 pt-2 font-mono text-xs border-t border-[#2D2D31]">
              <button
                onClick={() => handleUpvote(post.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131315] border border-[#2D2D31] text-[#8A8A90] hover:text-[#62DF7D] hover:border-[#62DF7D]/40 transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.upvotes} Upvotes</span>
              </button>

              <div className="flex items-center gap-1.5 text-[#8A8A90]">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.repliesCount} Replies</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-[#131315]/90 backdrop-blur-xl p-4 flex items-center justify-center">
          <div className="max-w-xl w-full bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-[#FFFFFF]">Start Community Discussion</h2>
            <div className="space-y-3 font-mono text-xs">
              <input
                type="text"
                placeholder="Topic Title (e.g. Optimizing CTEs in PostgreSQL 16)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-3 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
              />
              <textarea
                rows={4}
                placeholder="Paste SQL snippet or description..."
                value={newSnippet}
                onChange={(e) => setNewSnippet(e.target.value)}
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-3 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
              />
            </div>
            <div className="flex justify-end gap-2 font-mono text-xs pt-2">
              <button
                onClick={() => setShowNewPostModal(false)}
                className="px-4 py-2 rounded-xl bg-[#131315] text-[#8A8A90] hover:text-[#FFFFFF]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 rounded-xl bg-[#62DF7D] text-[#131315] font-bold flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Publish Post
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
