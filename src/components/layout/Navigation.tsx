import React, { useState } from 'react';
import {
  Terminal,
  BookOpen,
  Trophy,
  User,
  Sparkles,
  Search,
  Database,
  Flame,
  LayoutDashboard,
  Bell,
  ChevronDown,
  FolderGit2,
  Briefcase,
  Award,
  Crown,
  Activity,
  Compass,
  Users,
  Settings,
  HelpCircle,
  Zap,
  Menu,
  X,
  Layers,
  Globe,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore } from '../../stores/useUIStore';
import type { ActiveTab, SQLDialect } from '../../types';
import { Badge } from '../ui/Badge';
import { NotificationsPopover } from '../shell/NotificationsPopover';
import { ProfileMenuDropdown } from '../shell/ProfileMenuDropdown';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setSearchOpen,
    isNotificationsOpen,
    setNotificationsOpen,
    isProfileMenuOpen,
    setProfileMenuOpen,
    setCopilotOpen,
    notifications,
    currentDialect,
    setCurrentDialect,
  } = useUIStore();

  const { user, isDemoMode, loadDemoPersona, resetToDefaultGuest } = useAuthStore();
  const [isDialectMenuOpen, setIsDialectMenuOpen] = useState(false);
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const dialects: SQLDialect[] = ['PostgreSQL', 'SQLite', 'MySQL'];

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-[#131315]/90 backdrop-blur-xl border-b border-[#2D2D31] px-3 sm:px-4 flex items-center justify-between select-none font-sans">
      {/* Brand & Database Dialect Header */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 group focus:outline-none shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] flex items-center justify-center text-[#62DF7D] group-hover:border-[#62DF7D]/60 transition-colors shadow-sm">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#FFFFFF] group-hover:text-[#62DF7D] transition-colors">
            Mobile<span className="text-[#62DF7D]">SQL</span>
          </span>
        </button>

        {/* Current Database & Dialect Dropdown */}
        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#2D2D31]">
          <Badge variant="emerald" icon={<Database className="w-3 h-3 text-[#62DF7D]" />}>
            Prod-DB-01
          </Badge>

          {/* SQL Dialect Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDialectMenuOpen(!isDialectMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1B1B1E] border border-[#2D2D31] text-[11px] font-mono text-[#C8C8CC] hover:text-[#FFFFFF] hover:border-[#3F3F46] transition-all"
            >
              <span className="text-[#62DF7D] font-bold">{currentDialect}</span>
              <span className="text-[10px] text-[#8A8A90]">v16</span>
              <ChevronDown className="w-3 h-3 text-[#8A8A90]" />
            </button>

            {isDialectMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-[#131315] border border-[#2D2D31] rounded-xl shadow-xl z-50 p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                {dialects.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setCurrentDialect(d);
                      setIsDialectMenuOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between',
                      currentDialect === d
                        ? 'bg-[#1B1B1E] text-[#62DF7D] font-bold'
                        : 'text-[#C8C8CC] hover:bg-[#1B1B1E]/60 hover:text-[#FFFFFF]'
                    )}
                  >
                    <span>{d}</span>
                    {currentDialect === d && <span className="w-1.5 h-1.5 rounded-full bg-[#62DF7D]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Global Search Command Trigger */}
      <button
        onClick={() => setSearchOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] text-xs text-[#8A8A90] hover:border-[#62DF7D]/40 hover:text-[#C8C8CC] transition-all w-60 xl:w-72 justify-between"
      >
        <span className="flex items-center gap-2 truncate">
          <Search className="w-3.5 h-3.5 text-[#8A8A90]" />
          <span>Search lessons, docs, tables...</span>
        </span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#232326] rounded border border-[#2D2D31] text-[#8A8A90] shrink-0">
          ⌘K
        </kbd>
      </button>

      {/* Gamification Stats, Notifications, AI Copilot & Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 relative">
        {/* Search trigger on small screens */}
        <button
          onClick={() => setSearchOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF] transition-colors"
          aria-label="Open Global Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Demo Mode Trigger / Indicator */}
        <button
          onClick={() => {
            if (isDemoMode) {
              resetToDefaultGuest();
            } else {
              loadDemoPersona();
            }
          }}
          className={cn(
            'hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all border cursor-pointer',
            isDemoMode
              ? 'bg-[#A855F7]/15 border-[#A855F7]/40 text-[#A855F7] hover:bg-[#A855F7]/25'
              : 'bg-[#1B1B1E] border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF] hover:border-[#62DF7D]/50'
          )}
          title={isDemoMode ? 'Click to reset to Guest Mode' : 'Click to load Demo Pro Architect Persona'}
        >
          <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>{isDemoMode ? 'Demo Persona Active' : 'Try Demo Mode'}</span>
        </button>

        {/* Daily Streak Pill */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-xs font-mono font-bold text-[#F59E0B]">
          <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-[#F59E0B]" />
          <span>{user.streakDays}d</span>
        </div>

        {/* Level Badge */}
        <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#62DF7D]/10 border border-[#62DF7D]/30 text-xs font-mono font-bold text-[#62DF7D]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LVL {user.level}</span>
        </div>

        {/* XP Counter */}
        <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#232326] border border-[#2D2D31] text-xs font-mono font-bold text-[#C8C8CC]">
          <span className="text-[#62DF7D]">{user.xp.toLocaleString()}</span>
          <span className="text-[10px] text-[#8A8A90]">XP</span>
        </div>

        {/* Notifications Bell Button */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
            className={cn(
              'p-2 rounded-xl bg-[#1B1B1E] border transition-all relative',
              isNotificationsOpen
                ? 'border-[#62DF7D] text-[#62DF7D] bg-[#232326]'
                : 'border-[#2D2D31] text-[#8A8A90] hover:text-[#FFFFFF] hover:border-[#3F3F46]'
            )}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#62DF7D] text-[#131315] font-mono font-extrabold text-[9px] rounded-full flex items-center justify-center border border-[#131315]">
                {unreadNotifications}
              </span>
            )}
          </button>

          <NotificationsPopover />
        </div>

        {/* AI Copilot Direct Quick Trigger */}
        <button
          onClick={() => setCopilotOpen(true)}
          className="p-2 rounded-xl bg-[#62DF7D]/10 border border-[#62DF7D]/30 text-[#62DF7D] hover:bg-[#62DF7D]/20 transition-all flex items-center gap-1.5 text-xs font-bold"
          title="Open AI Copilot"
        >
          <Sparkles className="w-4 h-4 text-[#62DF7D]" />
          <span className="hidden xl:inline text-[11px]">Copilot</span>
        </button>

        {/* User Profile Avatar Trigger */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
            className={cn(
              'w-8 h-8 rounded-full bg-[#1B1B1E] border flex items-center justify-center font-mono font-bold text-xs text-[#62DF7D] transition-all relative overflow-hidden',
              isProfileMenuOpen ? 'border-[#62DF7D] ring-2 ring-[#62DF7D]/30' : 'border-[#2D2D31] hover:border-[#62DF7D]/60'
            )}
            aria-label="User Profile"
          >
            {user.name.charAt(0)}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#22C55E] border border-[#131315]" />
          </button>

          <ProfileMenuDropdown />
        </div>
      </div>
    </header>
  );
};

export interface SidebarMenuItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  group: 'Core' | 'Learning' | 'Career' | 'System';
}

const SIDEBAR_ITEMS: SidebarMenuItem[] = [
  // Core
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Core' },
  { id: 'academy', label: 'Academy', icon: BookOpen, badge: '12 Modules', group: 'Core' },
  { id: 'playground', label: 'SQL Playground', icon: Terminal, badge: 'Sandbox', group: 'Core' },
  { id: 'dataset-builder', label: 'AI Dataset Builder', icon: Layers, badge: 'STEP 12', group: 'Core' },
  { id: 'sql-lab', label: 'SQL Laboratory', icon: Database, badge: 'EXPLAIN', group: 'Core' },
  { id: 'challenges', label: 'Challenges', icon: Zap, badge: 'Daily', group: 'Core' },

  // Learning & Projects
  { id: 'projects', label: 'Projects', icon: FolderGit2, group: 'Learning' },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase, group: 'Learning' },
  { id: 'certificates', label: 'Certificates', icon: Award, group: 'Learning' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, group: 'Learning' },

  // Career & Community
  { id: 'leaderboard', label: 'Leaderboard', icon: Crown, group: 'Career' },
  { id: 'analytics', label: 'Analytics Studio', icon: Activity, badge: 'STEP 13', group: 'Core' },
  { id: 'career', label: 'Career Center', icon: Compass, group: 'Career' },
  { id: 'community', label: 'Community', icon: Users, group: 'Career' },

  // System & Public
  { id: 'landing', label: 'Explore Landing', icon: Globe, group: 'System' },
  { id: 'docs', label: 'Docs & Guides', icon: BookOpen, badge: 'v1.0', group: 'System' },
  { id: 'admin', label: 'Admin Console', icon: ShieldAlert, badge: 'Internal', group: 'System' },
  { id: 'copilot', label: 'AI Copilot', icon: Sparkles, badge: 'Gemini', group: 'System' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'System' },
  { id: 'help', label: 'Help & Shortcuts', icon: HelpCircle, group: 'System' },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, setCopilotOpen } = useUIStore();

  const groups: Array<SidebarMenuItem['group']> = ['Core', 'Learning', 'Career', 'System'];

  const handleItemClick = (item: SidebarMenuItem) => {
    if (item.id === 'copilot') {
      setCopilotOpen(true);
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-3.5rem)] bg-[#131315] border-r border-[#2D2D31] p-3 space-y-4 shrink-0 select-none overflow-y-auto">
      {groups.map((group) => {
        const items = SIDEBAR_ITEMS.filter((i) => i.group === group);
        return (
          <div key={group} className="space-y-1">
            <p className="px-3 text-[10px] font-mono font-bold text-[#8A8A90] tracking-wider uppercase">
              {group}
            </p>
            <div className="space-y-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-[#1B1B1E] text-[#62DF7D] border border-[#2D2D31] shadow-sm'
                        : 'text-[#C8C8CC] hover:bg-[#1B1B1E]/60 hover:text-[#FFFFFF]'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#62DF7D]' : 'text-[#8A8A90]')} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#232326] text-[#8A8A90] border border-[#2D2D31] shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* System Status Footer Card */}
      <div className="mt-auto pt-2">
        <div className="p-3 rounded-2xl bg-[#1B1B1E] border border-[#2D2D31] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8A8A90] font-mono text-[10px]">WASM Query Engine</span>
            <span className="w-2 h-2 rounded-full bg-[#62DF7D] shadow-[0_0_6px_#62DF7D]" />
          </div>
          <p className="text-[11px] text-[#C8C8CC] leading-snug">
            In-memory SQLite v3.45 active. Latency: <span className="text-[#62DF7D] font-mono font-bold">8ms</span>.
          </p>
        </div>
      </div>
    </aside>
  );
};

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, setCopilotOpen } = useUIStore();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const mainMobileTabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'academy' as const, label: 'Academy', icon: BookOpen },
    { id: 'playground' as const, label: 'Playground', icon: Terminal },
    { id: 'challenges' as const, label: 'Challenges', icon: Zap },
    { id: 'menu' as const, label: 'More', icon: Menu },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileDrawerOpen && (
        <div
          onClick={() => setIsMobileDrawerOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Collapsible Mobile Drawer Sheet */}
      {isMobileDrawerOpen && (
        <div className="fixed bottom-16 left-0 right-0 bg-[#131315] border-t border-[#2D2D31] rounded-t-3xl p-4 z-50 lg:hidden space-y-4 max-h-[70vh] overflow-y-auto font-sans shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between border-b border-[#2D2D31] pb-3">
            <h3 className="text-xs font-bold text-[#FFFFFF] uppercase tracking-wider font-mono">
              All MobileSQL Modules
            </h3>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-1 text-[#8A8A90] hover:text-[#FFFFFF]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'copilot') {
                      setCopilotOpen(true);
                    } else {
                      setActiveTab(item.id);
                    }
                    setIsMobileDrawerOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all text-left',
                    isActive
                      ? 'bg-[#1B1B1E] border-[#62DF7D] text-[#62DF7D]'
                      : 'bg-[#1B1B1E]/60 border-[#2D2D31] text-[#C8C8CC]'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0 text-[#62DF7D]" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#131315]/95 backdrop-blur-2xl border-t border-[#2D2D31] px-2 flex items-center justify-around select-none lg:hidden">
        {mainMobileTabs.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'menu' ? isMobileDrawerOpen : activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'menu') {
                  setIsMobileDrawerOpen(!isMobileDrawerOpen);
                } else {
                  setActiveTab(item.id);
                  setIsMobileDrawerOpen(false);
                }
              }}
              className={cn(
                'flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-150 relative',
                isActive ? 'text-[#62DF7D]' : 'text-[#8A8A90] hover:text-[#C8C8CC]'
              )}
            >
              <Icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
              <span className="text-[10px] font-semibold mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-5 h-0.5 bg-[#62DF7D] rounded-full shadow-[0_0_8px_#62DF7D]" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};

export const FloatingActionButton: React.FC = () => {
  const { setCopilotOpen } = useUIStore();

  return (
    <div className="fixed bottom-20 right-4 z-40 lg:hidden">
      <button
        onClick={() => setCopilotOpen(true)}
        className="w-12 h-12 rounded-full bg-[#62DF7D] text-[#131315] shadow-2xl flex items-center justify-center hover:bg-[#79F292] active:scale-95 transition-all ring-4 ring-[#131315]/80"
        aria-label="Trigger AI Copilot"
      >
        <Sparkles className="w-5 h-5 fill-current" />
      </button>
    </div>
  );
};
