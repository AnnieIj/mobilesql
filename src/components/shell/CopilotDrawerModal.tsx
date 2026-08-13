import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Zap,
  CheckCircle2,
  Cpu,
  Send,
  Code2,
  Terminal,
  Bot,
  Lightbulb,
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { Button } from '../ui/Button';

export const CopilotDrawerModal: React.FC = () => {
  const { isCopilotOpen, setCopilotOpen, addToast } = useUIStore();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; code?: string }>>([
    {
      role: 'assistant',
      content:
        'Hello! I am MobileSQL AI Copilot. Ask me to write, optimize, or explain any SQL query or database schema.',
      code: 'EXPLAIN (ANALYZE, BUFFERS)\nSELECT u.id, u.email, COUNT(o.id) AS total_orders\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.email\nHAVING COUNT(o.id) > 5;',
    },
  ]);

  if (!isCopilotOpen) return null;

  const handleSend = () => {
    if (!prompt.trim()) return;

    const userText = prompt;
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setPrompt('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Optimized plan generated for "${userText}". Added composite B-Tree index on (created_at DESC, user_id). Reduced estimated execution cost from 412.00 to 4.12.`,
          code: `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_created \nON orders (user_id, created_at DESC);\n\n-- Optimized Query using CTE:\nWITH recent_orders AS (\n  SELECT user_id, id FROM orders WHERE created_at >= NOW() - INTERVAL '30 days'\n)\nSELECT u.name, COUNT(ro.id)\nFROM users u\nJOIN recent_orders ro ON u.id = ro.user_id\nGROUP BY u.name;`,
        },
      ]);
      addToast({
        title: 'Copilot Recommendation Ready',
        message: 'B-Tree index and query optimization generated.',
        type: 'xp',
      });
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCopilotOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md h-full bg-[#131315] border-l border-[#2D2D31] shadow-2xl flex flex-col z-10 font-sans select-none"
        >
          {/* Drawer Header */}
          <div className="p-4 bg-[#1B1B1E] border-b border-[#2D2D31] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#62DF7D]/10 border border-[#62DF7D]/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#62DF7D]" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#FFFFFF] flex items-center gap-1.5">
                  MobileSQL AI Copilot
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#62DF7D]/20 text-[#62DF7D]">
                    PostgreSQL v16
                  </span>
                </h2>
                <p className="text-[11px] text-[#8A8A90]">Query Optimizer & Index Auditor</p>
              </div>
            </div>

            <button
              onClick={() => setCopilotOpen(false)}
              className="p-1.5 text-[#8A8A90] hover:text-[#FFFFFF] rounded-lg hover:bg-[#232326] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Prompts Pill Bar */}
          <div className="px-4 py-2 bg-[#1B1B1E]/60 border-b border-[#2D2D31]/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setPrompt('Optimize query execution plan and check index coverage');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#232326] border border-[#2D2D31] text-[11px] text-[#C8C8CC] hover:text-[#62DF7D] hover:border-[#62DF7D]/40 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-[#F59E0B]" />
              Optimize Plan
            </button>

            <button
              onClick={() => {
                setPrompt('Convert natural language to SQL window function');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#232326] border border-[#2D2D31] text-[11px] text-[#C8C8CC] hover:text-[#62DF7D] hover:border-[#62DF7D]/40 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <Code2 className="w-3 h-3 text-[#3B82F6]" />
              NL to SQL
            </button>

            <button
              onClick={() => {
                setPrompt('Audit table foreign keys and index bloat');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#232326] border border-[#2D2D31] text-[11px] text-[#C8C8CC] hover:text-[#62DF7D] hover:border-[#62DF7D]/40 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <Cpu className="w-3 h-3 text-[#62DF7D]" />
              Index Auditor
            </button>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 border text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#62DF7D]/10 border-[#62DF7D]/30 text-[#FFFFFF] rounded-br-none'
                      : 'bg-[#1B1B1E] border-[#2D2D31] text-[#C8C8CC] rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase font-mono tracking-wider">
                    {m.role === 'user' ? (
                      <span className="text-[#62DF7D]">You</span>
                    ) : (
                      <span className="text-[#3B82F6] flex items-center gap-1">
                        <Bot className="w-3 h-3" /> Copilot
                      </span>
                    )}
                  </div>

                  <p>{m.content}</p>

                  {m.code && (
                    <div className="mt-2 bg-[#131315] border border-[#2D2D31] rounded-xl p-3 font-mono text-[11px] text-[#62DF7D] overflow-x-auto space-y-1">
                      <div className="flex justify-between items-center text-[9px] text-[#8A8A90] pb-1 border-b border-[#2D2D31]">
                        <span>Suggested SQL Code</span>
                        <span>PostgreSQL v16</span>
                      </div>
                      <pre className="whitespace-pre-wrap">{m.code}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#1B1B1E] border-t border-[#2D2D31] space-y-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Copilot (e.g. 'Add index for user search'...)"
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl px-3.5 py-2.5 text-xs text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D] transition-colors pr-10"
              />
              <button
                onClick={handleSend}
                disabled={!prompt.trim()}
                className="absolute right-2 p-1.5 rounded-lg bg-[#62DF7D] text-[#131315] disabled:opacity-30 disabled:hover:bg-[#62DF7D] hover:bg-[#79F292] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#8A8A90] font-mono px-1">
              <span className="flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-[#F59E0B]" /> Powered by Gemini 2.5 Flash
              </span>
              <span>Latency Est: ~12ms</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
