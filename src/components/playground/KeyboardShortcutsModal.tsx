import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Ctrl + Enter', action: 'Execute Active SQL Query' },
  { key: 'Ctrl + Shift + F', action: 'Auto-Format SQL Code' },
  { key: 'Ctrl + Space', action: 'Trigger Schema Autocomplete' },
  { key: 'Ctrl + S', action: 'Save Query to Workspace' },
  { key: 'Ctrl + N', action: 'Open New SQL Tab' },
  { key: 'Ctrl + /', action: 'Toggle Line Comment' },
  { key: 'Ctrl + B', action: 'Toggle Left Sidebar' },
  { key: 'Ctrl + Shift + A', action: 'Open AI Copilot' },
];

export const KeyboardShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131315]/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#2D2D31] pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#62DF7D]" />
            <h2 className="text-sm font-bold text-[#FFFFFF]">SQL Playground Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8A8A90] hover:text-[#FFFFFF] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {SHORTCUTS.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg bg-[#131315] border border-[#2D2D31]"
            >
              <span className="text-[#8A8A90] font-sans">{sc.action}</span>
              <kbd className="px-2 py-0.5 rounded bg-[#232326] text-[#62DF7D] font-bold border border-[#2D2D31]">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
