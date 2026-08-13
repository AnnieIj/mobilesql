import React from 'react';
import {
  Sliders,
  Palette,
  Type,
  Database,
  Sparkles,
  Keyboard,
  Globe,
  Eye,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { useAccountStore } from '../../stores/useAccountStore';
import { useUIStore } from '../../stores/useUIStore';

export const UserPreferencesTab: React.FC = () => {
  const { addToast, setCurrentDialect } = useUIStore();
  const { preferences, updatePreferences } = useAccountStore();

  const handleDialectChange = (dialect: 'PostgreSQL' | 'SQLite' | 'MySQL') => {
    updatePreferences({ sqlDialect: dialect });
    setCurrentDialect(dialect);
    addToast({ title: 'Engine Updated', message: `Default dialect set to ${dialect}.`, type: 'info' });
  };

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF]">
      {/* Visual Theme & Typography */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <Palette className="w-4 h-4 text-[#62DF7D]" /> Visual Theme & Typography
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Theme selection */}
          <div className="space-y-2">
            <label className="text-[#8A8A90] block">Color Theme Palette:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'dark-emerald', name: 'Dark Emerald', color: '#62DF7D', bg: '#131315' },
                { id: 'obsidian', name: 'Obsidian Night', color: '#3B82F6', bg: '#0A0A0C' },
                { id: 'midnight', name: 'Midnight Blue', color: '#A855F7', bg: '#0F172A' },
                { id: 'high-contrast', name: 'High Contrast', color: '#F59E0B', bg: '#000000' },
              ].map((thm) => (
                <button
                  key={thm.id}
                  onClick={() => {
                    updatePreferences({ theme: thm.id as any });
                    addToast({ title: 'Theme Applied', message: `Switched palette to ${thm.name}.`, type: 'info' });
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    preferences.theme === thm.id
                      ? 'border-[#62DF7D] bg-[#232326] text-[#FFFFFF]'
                      : 'border-[#2D2D31] bg-[#131315] text-[#8A8A90] hover:border-[#8A8A90]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: thm.color }} />
                    <span className="font-bold text-[11px]">{thm.name}</span>
                  </div>
                  {preferences.theme === thm.id && <Check className="w-3.5 h-3.5 text-[#62DF7D]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[#8A8A90] mb-1">
                <span>Monaco Editor Font Size:</span>
                <span className="text-[#62DF7D] font-bold">{preferences.fontSize}px</span>
              </div>
              <input
                type="range"
                min={12}
                max={20}
                value={preferences.fontSize}
                onChange={(e) => updatePreferences({ fontSize: Number(e.target.value) })}
                className="w-full accent-[#62DF7D]"
              />
            </div>

            <div>
              <label className="text-[#8A8A90] block mb-1">Editor Monospace Font Family:</label>
              <select
                value={preferences.editorFont}
                onChange={(e) => updatePreferences({ editorFont: e.target.value as any })}
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
              >
                <option value="JetBrains Mono">JetBrains Mono (Ligatures Enabled)</option>
                <option value="Fira Code">Fira Code (Monospaced Ligatures)</option>
                <option value="Source Code Pro">Source Code Pro (Adobe Monospace)</option>
                <option value="Inter">Inter Monospace</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SQL Dialect & Database Defaults */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <Database className="w-4 h-4 text-[#3B82F6]" /> SQL Dialect & Database Engine Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div>
            <label className="text-[#8A8A90] block mb-1">Default Dialect Engine:</label>
            <select
              value={preferences.sqlDialect}
              onChange={(e) => handleDialectChange(e.target.value as any)}
              className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
            >
              <option value="PostgreSQL">PostgreSQL v16 (In-Memory WASM Engine)</option>
              <option value="SQLite">SQLite v3.45 (Standard Client Kernel)</option>
              <option value="MySQL">MySQL v8.0 Compatible Dialect</option>
            </select>
          </div>

          <div>
            <label className="text-[#8A8A90] block mb-1">Default Sandbox Database Schema:</label>
            <select
              value={preferences.defaultDatabase}
              onChange={(e) => updatePreferences({ defaultDatabase: e.target.value })}
              className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#62DF7D]"
            >
              <option value="main_production">main_production (Sales & Customers)</option>
              <option value="analytics_dw">analytics_dw (Data Warehouse Starschema)</option>
              <option value="sandbox_db">sandbox_db (Scratchpad)</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Assistant & Keyboard Shortcuts */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <Sparkles className="w-4 h-4 text-[#A855F7]" /> AI Copilot Style & Keybindings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div>
            <label className="text-[#8A8A90] block mb-1">AI Response Style:</label>
            <select
              value={preferences.aiResponseStyle}
              onChange={(e) => updatePreferences({ aiResponseStyle: e.target.value as any })}
              className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#A855F7]"
            >
              <option value="Concise Code-First">Concise Code-First (Minimal explanations, pure SQL)</option>
              <option value="Deep Architectural">Deep Architectural (Query plan analysis & performance tips)</option>
              <option value="Interview Coach Mode">Interview Coach Mode (Socratic guidance & hint breakdown)</option>
            </select>
          </div>

          <div>
            <label className="text-[#8A8A90] block mb-1">Keyboard Shortcuts Preset:</label>
            <select
              value={preferences.keyboardShortcuts}
              onChange={(e) => updatePreferences({ keyboardShortcuts: e.target.value as any })}
              className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#A855F7]"
            >
              <option value="VS Code">VS Code Standard (⌘K ⌘S, ⌘Enter)</option>
              <option value="Vim">Vim Keybindings (hjkl, :w, :q)</option>
              <option value="Emacs">Emacs Mode</option>
            </select>
          </div>
        </div>
      </div>

      {/* Time Zone, Language & Accessibility */}
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2 border-b border-[#2D2D31] pb-3">
          <Eye className="w-4 h-4 text-[#F59E0B]" /> Localization & Accessibility Controls
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="space-y-3">
            <div>
              <label className="text-[#8A8A90] block mb-1">Primary Time Zone:</label>
              <select
                value={preferences.timeZone}
                onChange={(e) => updatePreferences({ timeZone: e.target.value })}
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#F59E0B]"
              >
                <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                <option value="America/New_York (EST)">America/New_York (EST)</option>
                <option value="UTC (Universal Coordinated Time)">UTC (Universal Coordinated Time)</option>
                <option value="Europe/London (GMT/BST)">Europe/London (GMT/BST)</option>
                <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST)</option>
              </select>
            </div>

            <div>
              <label className="text-[#8A8A90] block mb-1">Interface Language:</label>
              <select
                value={preferences.language}
                onChange={(e) => updatePreferences({ language: e.target.value })}
                className="w-full bg-[#131315] border border-[#2D2D31] rounded-xl p-2.5 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#F59E0B]"
              >
                <option value="English (US)">English (US)</option>
                <option value="Spanish (Español)">Spanish (Español)</option>
                <option value="German (Deutsch)">German (Deutsch)</option>
                <option value="Japanese (日本語)">Japanese (日本語)</option>
                <option value="Mandarin (中文)">Mandarin (中文)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[#8A8A90] block">Accessibility Toggles:</span>
            {[
              { key: 'highContrast', label: 'High Contrast Mode', desc: 'Maximum color distinction' },
              { key: 'reducedMotion', label: 'Reduced Motion', desc: 'Disable heavy transition effects' },
              { key: 'largeTouchTargets', label: 'Large Touch Targets', desc: 'Expanded click bounds for mobile' },
              { key: 'screenReaderOptimized', label: 'Screen Reader Mode', desc: 'Enhanced ARIA announcements' },
            ].map((item) => (
              <label
                key={item.key}
                className="p-2.5 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-center justify-between cursor-pointer hover:border-[#F59E0B]/50 transition-all"
              >
                <div>
                  <p className="font-bold text-[#FFFFFF]">{item.label}</p>
                  <p className="text-[10px] text-[#8A8A90]">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={(preferences as any)[item.key]}
                  onChange={(e) => updatePreferences({ [item.key]: e.target.checked })}
                  className="w-4 h-4 accent-[#F59E0B]"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
