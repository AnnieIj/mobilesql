import React from 'react';
import { Plus, X, FileCode, Sparkles } from 'lucide-react';
import { usePlaygroundStore } from '../../stores/usePlaygroundStore';

export const EditorTabsBar: React.FC = () => {
  const { tabs, activeTabId, setActiveTabId, closeTab, createNewTab } =
    usePlaygroundStore();

  return (
    <div className="bg-[#131315] border-b border-[#2D2D31] flex items-center overflow-x-auto custom-scrollbar select-none text-xs font-mono">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`group px-3 py-2 flex items-center gap-2 border-r border-[#2D2D31] min-w-[140px] max-w-[220px] cursor-pointer transition-all ${
              isActive
                ? 'bg-[#1B1B1E] text-[#62DF7D] font-bold border-t-2 border-t-[#62DF7D]'
                : 'text-[#8A8A90] hover:bg-[#1B1B1E]/60 hover:text-[#FFFFFF]'
            }`}
          >
            <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-[#62DF7D]' : 'text-[#8A8A90]'}`} />

            <span className="truncate flex-1">{tab.title}</span>

            {tab.isUnsaved && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0" title="Unsaved Changes" />
            )}

            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#232326] rounded text-[#8A8A90] hover:text-[#EF4444] transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}

      <button
        onClick={() => createNewTab()}
        className="px-3 py-2 text-[#8A8A90] hover:text-[#62DF7D] hover:bg-[#1B1B1E] transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
        title="Open New Query File"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
