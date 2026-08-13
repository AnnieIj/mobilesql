import React, { useState } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Zap,
  Code,
  Copy,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useSqlLabStore } from '../../stores/useSqlLabStore';
import { useUIStore } from '../../stores/useUIStore';

export const AiDatasetAssistantPanel: React.FC = () => {
  const { addToast } = useUIStore();
  const {
    assistantMessages,
    sendAssistantMessage,
    isAssistantOpen,
    setAssistantOpen,
    createNewTab,
  } = useSqlLabStore();

  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendAssistantMessage(inputText);
    setInputText('');
  };

  const handleRunSnippet = (sql: string) => {
    createNewTab('AI Optimization', sql);
    addToast({ title: 'Query Injected into SQL Lab', message: 'Ready to execute optimization snippet.', type: 'success' });
  };

  if (!isAssistantOpen) {
    return (
      <button
        onClick={() => setAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-mono text-xs font-bold shadow-2xl flex items-center gap-2 cursor-pointer transition-all border border-[#131315]"
      >
        <Bot className="w-4 h-4" /> AI Schema & SQL Assistant
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] shadow-2xl flex flex-col overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="bg-[#232326] px-4 py-3 border-b border-[#2D2D31] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#62DF7D]" />
          <span className="font-bold text-[#FFFFFF]">AI Dataset Assistant</span>
        </div>
        <button onClick={() => setAssistantOpen(false)} className="text-[#8A8A90] hover:text-[#FFFFFF]">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-3 h-80 overflow-y-auto bg-[#131315]">
        {assistantMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-xl max-w-[85%] space-y-2 ${
              msg.sender === 'user'
                ? 'bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#FFFFFF] ml-auto'
                : 'bg-[#1B1B1E] border border-[#2D2D31] text-[#C8C8CC]'
            }`}
          >
            <p className="leading-relaxed">{msg.text}</p>
            {msg.actionableQuery && (
              <div className="p-2.5 rounded-lg bg-[#131315] border border-[#2D2D31] space-y-1.5">
                <code className="text-[#62DF7D] text-[10px] block font-mono">{msg.actionableQuery}</code>
                <button
                  onClick={() => handleRunSnippet(msg.actionableQuery!)}
                  className="px-2 py-1 rounded bg-[#62DF7D] text-[#131315] text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3" /> Run in SQL Lab
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Footer */}
      <div className="p-3 bg-[#1B1B1E] border-t border-[#2D2D31] flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask AI: 'Suggest indexes' or 'How to normalize?'"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-[#131315] border border-[#2D2D31] rounded-xl px-3 py-2 text-xs text-[#FFFFFF] placeholder-[#8A8A90] focus:outline-none focus:border-[#62DF7D]"
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-xl bg-[#62DF7D] text-[#131315] font-bold cursor-pointer hover:bg-[#52cc6c]"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
