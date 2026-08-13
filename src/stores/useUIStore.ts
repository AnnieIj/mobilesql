import { create } from 'zustand';
import type { ActiveTab, SQLDialect } from '../types';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'xp';
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'success' | 'warning' | 'error' | 'info' | 'achievement' | 'certificate' | 'challenge';
}

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif_1',
    title: 'Achievement Unlocked',
    message: 'Speedster Badge earned! Sub-10ms query execution verified.',
    timestamp: '2 min ago',
    read: false,
    type: 'achievement',
  },
  {
    id: 'notif_2',
    title: 'Daily Challenge Completed',
    message: 'Window Function Optimization solved (+250 XP earned).',
    timestamp: '1 hour ago',
    read: false,
    type: 'challenge',
  },
  {
    id: 'notif_3',
    title: 'Certificate Issued',
    message: 'SQL Master Architect Certificate generated (ID: MSQL-9942A).',
    timestamp: 'Yesterday',
    read: false,
    type: 'certificate',
  },
  {
    id: 'notif_4',
    title: 'Index Scan Alert',
    message: 'Query on orders table performed a full seq scan. Add index on (user_id, status).',
    timestamp: '2 days ago',
    read: true,
    type: 'warning',
  },
];

interface UIState {
  activeTab: ActiveTab;
  isSearchOpen: boolean;
  isNotificationsOpen: boolean;
  isProfileMenuOpen: boolean;
  isCopilotOpen: boolean;
  isSqlGeneratorOpen: boolean;
  isAuthModalOpen: boolean;
  isSchemaModalOpen: boolean;
  currentDialect: SQLDialect;
  notifications: SystemNotification[];
  toasts: ToastNotification[];
  
  setActiveTab: (tab: ActiveTab) => void;
  setSearchOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setProfileMenuOpen: (open: boolean) => void;
  setCopilotOpen: (open: boolean) => void;
  setSqlGeneratorOpen: (open: boolean) => void;
  toggleCopilot: () => void;
  setAuthModalOpen: (open: boolean) => void;
  setSchemaModalOpen: (open: boolean) => void;
  setCurrentDialect: (dialect: SQLDialect) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'dashboard',
  isSearchOpen: false,
  isNotificationsOpen: false,
  isProfileMenuOpen: false,
  isCopilotOpen: false,
  isSqlGeneratorOpen: false,
  isAuthModalOpen: false,
  isSchemaModalOpen: false,
  currentDialect: 'PostgreSQL',
  notifications: INITIAL_NOTIFICATIONS,
  toasts: [],

  setActiveTab: (tab) => set({ activeTab: tab, isSearchOpen: false, isNotificationsOpen: false, isProfileMenuOpen: false }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setNotificationsOpen: (open) => set((state) => ({ isNotificationsOpen: open, isProfileMenuOpen: open ? false : state.isProfileMenuOpen })),
  setProfileMenuOpen: (open) => set((state) => ({ isProfileMenuOpen: open, isNotificationsOpen: open ? false : state.isNotificationsOpen })),
  setCopilotOpen: (open) => set({ isCopilotOpen: open }),
  setSqlGeneratorOpen: (open) => set({ isSqlGeneratorOpen: open }),
  toggleCopilot: () => set((state) => ({ isCopilotOpen: !state.isCopilotOpen })),
  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  setSchemaModalOpen: (open) => set({ isSchemaModalOpen: open }),
  setCurrentDialect: (dialect) => set({ currentDialect: dialect }),

  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllNotificationsAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  clearNotifications: () => set({ notifications: [] }),

  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
