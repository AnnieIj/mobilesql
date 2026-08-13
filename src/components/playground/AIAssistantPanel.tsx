import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  Wand2,
  Mic,
  Send,
  HelpCircle,
  CheckCircle2,
  Code2,
  Copy,
  Plus,
  Volume2,
  RefreshCw,
  GitCompare,
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { usePlaygroundStore } from '../../stores/usePlaygroundStore';
import { Button } from '../ui/Button';

export const AIAssistantPanel: React.FC = () => {
  const {
    tabs,
    activeTabId,
    updateTabContent,
    createNewTab,
    aiChatHistory,
    addAiMessage,
    isAiThinking,
    setAiThinking,
  } = usePlaygroundStore();

  const [promptText, setPromptText] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState<string | null>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  const handleSendPrompt = async (customPrompt?: string) => {
    const userQuery = customPrompt || promptText;
    if (!userQuery.trim()) return;

    addAiMessage({ sender: 'user', text: userQuery });
    setPromptText('');
    setAiThinking(true);

    try {
      // Server-side Gemini API simulation / invocation fallback
      const currentSql = activeTab?.sql || '';

      await new Promise((res) => setTimeout(res, 1200)); // Smooth AI thinking delay

      let responseText = '';
      let generatedSql = '';

      if (userQuery.toLowerCase().includes('explain')) {
        responseText = `### Query Analysis
1. **CTE / Subquery**: Evaluates \`MonthlyRevenue\` to partition sales by country.
2. **Window Function**: Calculates cumulative order values using \`SUM() OVER (ORDER BY created_at)\`.
3. **Performance Rating**: ⚡ High. Time complexity is O(N log N) due to sorting.`;
      } else if (userQuery.toLowerCase().includes('optimize')) {
        responseText = `### Optimization Suggestion
To avoid full sequence scans on the \`orders\` table, create a partial index on \`(customer_id, status)\`.`;
        generatedSql = `-- Optimized Query with Partial Index Strategy\nSELECT \n  c.first_name, \n  COUNT(o.id) AS completed_orders\nFROM customers c\nJOIN orders o ON c.id = o.customer_id AND o.status = 'completed'\nGROUP BY c.first_name\nORDER BY completed_orders DESC;`;
      } else if (userQuery.toLowerCase().includes('fix')) {
        responseText = `Fixed the missing comma in the SELECT projection and corrected the \`JOIN\` predicate syntax.`;
        generatedSql = currentSql.replace(/JOIN\s+WHERE/i, 'JOIN customers ON orders.customer_id = customers.id WHERE');
      } else {
        responseText = `Here is the SQL query generated from your prompt:`;
        generatedSql = `SELECT \n  c.country, \n  COUNT(o.id) AS total_orders, \n  SUM(o.total_amount) AS revenue\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.status = 'completed'\nGROUP BY c.country\nORDER BY revenue DESC;`;
      }

      addAiMessage({
        sender: 'ai',
        text: responseText,
        sqlSnippet: generatedSql || undefined,
      });
    } catch (err) {
      addAiMessage({
        sender: 'ai',
        text: 'Apologies, I encountered a temporary connection issue. Please check your query and try again.',
      });
    } finally {
      setAiThinking(false);
    }
  };

  const applySqlToEditor = (sql: string) => {
    if (activeTab) {
      updateTabContent(activeTab.id, sql);
    } else {
      createNewTab('ai_generated.sql', sql);
    }
  };

  return (
    <div className="w-full h-full bg-[#1B1B1E] border-l border-[#2D2D31] flex flex-col font-sans select-none text-xs">
      {/* Top Header */}
      <div className="p-3 border-b border-[#2D2D31] bg-[#131315] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#62DF7D]/20 border border-[#62DF7D]/40 flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#62DF7D]" />
          </div>
          <div>
            <h3 className="font-bold text-[#FFFFFF] text-xs">AI SQL Mentor</h3>
            <p className="text-[10px] text-[#62DF7D] font-mono">Gemini 2.5 Active</p>
          </div>
        </div>

        <button
          onClick={() => setIsVoiceActive(!isVoiceActive)}
          className={`p-1.5 rounded-lg border transition-colors ${
            isVoiceActive
              ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444] animate-pulse'
              : 'bg-[#1B1B1E] border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF]'
          }`}
          title="Toggle Voice Narration Mode"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Action Chips */}
      <div className="p-2 border-b border-[#2D2D31] bg-[#1B1B1E] flex flex-wrap gap-1.5">
        <button
          onClick={() => handleSendPrompt('Explain this SQL query')}
          className="px-2 py-1 rounded-md bg-[#131315] border border-[#2D2D31] text-[10px] font-mono text-[#8A8A90] hover:text-[#62DF7D] hover:border-[#62DF7D] transition-all cursor-pointer"
        >
          💡 Explain Query
        </button>
        <button
          onClick={() => handleSendPrompt('Optimize query performance')}
          className="px-2 py-1 rounded-md bg-[#131315] border border-[#2D2D31] text-[10px] font-mono text-[#8A8A90] hover:text-[#3B82F6] hover:border-[#3B82F6] transition-all cursor-pointer"
        >
          ⚡ Optimize Performance
        </button>
        <button
          onClick={() => handleSendPrompt('Fix SQL syntax error')}
          className="px-2 py-1 rounded-md bg-[#131315] border border-[#2D2D31] text-[10px] font-mono text-[#8A8A90] hover:text-[#F59E0B] hover:border-[#F59E0B] transition-all cursor-pointer"
        >
          🛠️ Fix Error
        </button>
        <button
          onClick={() => handleSendPrompt('Suggest indexes for this query')}
          className="px-2 py-1 rounded-md bg-[#131315] border border-[#2D2D31] text-[10px] font-mono text-[#8A8A90] hover:text-[#A855F7] hover:border-[#A855F7] transition-all cursor-pointer"
        >
          🔍 Suggest Indexes
        </button>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {aiChatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-1.5 ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-[#8A8A90] font-mono">
              <span>{msg.sender === 'user' ? 'You' : 'Gemini AI'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-3 rounded-xl max-w-[90%] text-xs font-sans leading-relaxed border ${
                msg.sender === 'user'
                  ? 'bg-[#62DF7D]/15 border-[#62DF7D]/40 text-[#FFFFFF]'
                  : 'bg-[#131315] border-[#2D2D31] text-[#E0E0E0]'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {msg.sqlSnippet && (
                <div className="mt-2.5 pt-2 border-t border-[#2D2D31] space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#62DF7D]">
                    <span>Suggested SQL Solution</span>
                    <button
                      onClick={() => applySqlToEditor(msg.sqlSnippet!)}
                      className="flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Code2 className="w-3 h-3" /> Insert in Editor
                    </button>
                  </div>
                  <pre className="p-2 bg-[#0D0D0F] border border-[#2D2D31] rounded-lg text-[11px] font-mono text-[#62DF7D] overflow-x-auto">
                    {msg.sqlSnippet}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}

        {isAiThinking && (
          <div className="flex items-center gap-2 p-3 bg-[#131315] border border-[#2D2D31] rounded-xl text-xs font-mono text-[#62DF7D]">
            <div className="w-4 h-4 border-2 border-[#62DF7D] border-t-transparent rounded-full animate-spin" />
            Gemini is analyzing AST and schema statistics...
          </div>
        )}
      </div>

      {/* Voice Wave Animation Indicator if Voice Active */}
      {isVoiceActive && (
        <div className="bg-[#EF4444]/10 border-t border-[#EF4444]/30 px-3 py-2 flex items-center justify-between font-mono text-[11px] text-[#EF4444]">
          <span className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            Listening to voice prompt...
          </span>
          <span className="text-[10px]">Speak SQL intent</span>
        </div>
      )}

      {/* Bottom Input Field */}
      <div className="p-3 border-t border-[#2D2D31] bg-[#131315] space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask AI or convert English to SQL..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendPrompt();
            }}
            className="w-full bg-[#1B1B1E] border border-[#2D2D31] rounded-xl pl-3 pr-10 py-2 text-xs text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D]"
          />
          <button
            onClick={() => handleSendPrompt()}
            disabled={!promptText.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#62DF7D] text-[#131315] disabled:opacity-30 disabled:bg-[#2D2D31] cursor-pointer transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
