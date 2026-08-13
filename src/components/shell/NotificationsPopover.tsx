import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Trophy,
  Award,
  Sparkles,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { useUIStore, type SystemNotification } from '../../stores/useUIStore';
import { Button } from '../ui/Button';

export const NotificationsPopover: React.FC = () => {
  const {
    isNotificationsOpen,
    setNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    addToast,
  } = useUIStore();

  if (!isNotificationsOpen) return null;

  const getIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-[#EF4444]" />;
      case 'info':
        return <Info className="w-4 h-4 text-[#3B82F6]" />;
      case 'achievement':
        return <Trophy className="w-4 h-4 text-[#62DF7D]" />;
      case 'certificate':
        return <Award className="w-4 h-4 text-[#22C55E]" />;
      case 'challenge':
        return <Sparkles className="w-4 h-4 text-[#62DF7D]" />;
      default:
        return <Bell className="w-4 h-4 text-[#8A8A90]" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      <div className="absolute right-12 top-full mt-2 w-80 sm:w-96 bg-[#131315] border border-[#2D2D31] rounded-2xl shadow-2xl z-50 overflow-hidden font-sans select-none animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 bg-[#1B1B1E] border-b border-[#2D2D31] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#62DF7D]" />
            <h3 className="text-xs font-bold text-[#FFFFFF] tracking-tight">System Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#62DF7D]/20 text-[#62DF7D] border border-[#62DF7D]/30">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="p-1 text-[#8A8A90] hover:text-[#62DF7D] transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="p-1 text-[#8A8A90] hover:text-[#EF4444] transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#2D2D31]/50">
          {notifications.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Bell className="w-6 h-6 text-[#8A8A90] mx-auto opacity-40" />
              <p className="text-xs font-semibold text-[#FFFFFF]">All caught up!</p>
              <p className="text-[11px] text-[#8A8A90]">No unread system alerts or achievement notifications.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationAsRead(item.id);
                  addToast({ title: item.title, message: item.message, type: 'info' });
                }}
                className={cn(
                  'p-3.5 flex items-start gap-3 transition-colors cursor-pointer',
                  item.read ? 'bg-[#131315] opacity-70 hover:opacity-100' : 'bg-[#1B1B1E]/80 hover:bg-[#1B1B1E]'
                )}
              >
                <div className="p-2 rounded-lg bg-[#232326] border border-[#2D2D31] shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#FFFFFF] truncate">{item.title}</p>
                    <span className="text-[10px] font-mono text-[#8A8A90] shrink-0">{item.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#C8C8CC] leading-relaxed line-clamp-2">{item.message}</p>
                </div>

                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-[#62DF7D] shrink-0 mt-2 shadow-[0_0_6px_#62DF7D]" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2 bg-[#1B1B1E] border-t border-[#2D2D31] text-center">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-[11px] text-[#8A8A90] hover:text-[#FFFFFF]"
            onClick={() => setNotificationsOpen(false)}
          >
            Close Notifications
          </Button>
        </div>
      </div>
    </AnimatePresence>
  );
};
