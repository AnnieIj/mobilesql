import React from 'react';
import { Navbar, Sidebar, BottomNavigation, FloatingActionButton } from './Navigation';
import { GlobalSearchModal } from '../shell/GlobalSearchModal';
import { CopilotDrawerModal } from '../shell/CopilotDrawerModal';
import { AuthModal } from '../account/AuthModal';
import { useUIStore } from '../../stores/useUIStore';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none font-sans">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border border-[#2D2D31] bg-[#131315]/95 backdrop-blur-xl shadow-2xl text-sm transition-all duration-200 animate-in fade-in slide-in-from-top-2 cursor-pointer"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />}
          {toast.type === 'xp' && <Sparkles className="w-5 h-5 text-[#62DF7D] shrink-0 mt-0.5" />}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs text-[#FFFFFF] truncate">{toast.title}</p>
            <p className="text-[11px] text-[#8A8A90] mt-0.5 leading-snug">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#131315] text-[#FFFFFF] font-sans antialiased selection:bg-[#62DF7D]/30 selection:text-[#62DF7D] flex flex-col">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Top Navigation */}
      <Navbar />

      {/* Main Body (Sidebar + Content Canvas) */}
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar />

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 pb-20 lg:pb-8">
          {children}
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <FloatingActionButton />

      {/* Mobile Bottom Dock */}
      <BottomNavigation />

      {/* Command Palette Modal (Ctrl+K / Cmd+K) */}
      <GlobalSearchModal />

      {/* AI Copilot Drawer */}
      <CopilotDrawerModal />

      {/* Enterprise Auth Modal */}
      <AuthModal />
    </div>
  );
};
