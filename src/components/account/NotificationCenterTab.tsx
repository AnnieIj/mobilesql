import React from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  Sparkles,
  Trophy,
  Award,
  Briefcase,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useAccountStore } from '../../stores/useAccountStore';
import { useUIStore } from '../../stores/useUIStore';

export const NotificationCenterTab: React.FC = () => {
  const { addToast } = useUIStore();
  const { notifications, updateNotifications } = useAccountStore();

  const handleToggle = (key: string, value: boolean, title: string) => {
    updateNotifications({ [key]: value });
    addToast({
      title: 'Notification Updated',
      message: `${title} set to ${value ? 'Enabled' : 'Disabled'}.`,
      type: 'info',
    });
  };

  const NOTIF_ITEMS = [
    {
      key: 'email',
      title: 'Email Security & System Alerts',
      desc: 'Receive critical login alerts, password changes, and account receipts via work email.',
      icon: <Mail className="w-4 h-4 text-[#62DF7D]" />,
    },
    {
      key: 'push',
      title: 'Mobile Push Notifications',
      desc: 'Real-time mobile push notifications for streak retention and daily query milestones.',
      icon: <Smartphone className="w-4 h-4 text-[#3B82F6]" />,
    },
    {
      key: 'inApp',
      title: 'In-App Toast Banners',
      desc: 'Live execution feedback, query latency metrics, and instant XP gain notifications.',
      icon: <Bell className="w-4 h-4 text-[#F59E0B]" />,
    },
    {
      key: 'weeklyReport',
      title: 'Weekly Performance Digest',
      desc: 'Automated weekly analytics breakdown covering queries executed, accuracy %, and XP growth.',
      icon: <Calendar className="w-4 h-4 text-[#A855F7]" />,
    },
    {
      key: 'aiRecommendations',
      title: 'AI Copilot Tuning & Tips',
      desc: 'Proactive index recommendations and execution plan optimization hints from Gemini AI.',
      icon: <Sparkles className="w-4 h-4 text-[#3B82F6]" />,
    },
    {
      key: 'challengeReminders',
      title: 'Daily Challenge Reminders',
      desc: 'Gentle morning notifications so you never break your 14-day streak.',
      icon: <Trophy className="w-4 h-4 text-[#F59E0B]" />,
    },
    {
      key: 'certificateEarned',
      title: 'Certificate Issuance Alerts',
      desc: 'Instant verification alerts when completing advanced academy learning paths.',
      icon: <Award className="w-4 h-4 text-[#62DF7D]" />,
    },
    {
      key: 'portfolioCompleted',
      title: 'Portfolio Milestone Alerts',
      desc: 'Updates when employer recruiters view your published SQL workspace projects.',
      icon: <Briefcase className="w-4 h-4 text-[#A855F7]" />,
    },
  ];

  return (
    <div className="space-y-6 font-sans text-[#FFFFFF]">
      <div className="bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="border-b border-[#2D2D31] pb-3">
          <h3 className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#62DF7D]" /> Notification Preference Center
          </h3>
          <p className="text-xs text-[#8A8A90] font-mono mt-0.5">
            Configure delivery channels (Email, Push, In-App) and granular triggers for alerts and AI suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {NOTIF_ITEMS.map((item) => (
            <div
              key={item.key}
              className="p-4 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-start justify-between gap-3 hover:border-[#62DF7D]/40 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1B1B1E] border border-[#2D2D31] flex items-center justify-center shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-[#FFFFFF] text-[11px]">{item.title}</p>
                  <p className="text-[10px] text-[#8A8A90] leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={(notifications as any)[item.key]}
                onChange={(e) => handleToggle(item.key, e.target.checked, item.title)}
                className="w-4 h-4 accent-[#62DF7D] cursor-pointer shrink-0 mt-1"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
