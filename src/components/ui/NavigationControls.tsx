import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/cn';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTabId,
  onChange,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-1 p-1 bg-[#1B1B1E] border border-[#2D2D31] rounded-xl overflow-x-auto scrollbar-none', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 select-none focus-visible:outline-none',
              isActive ? 'text-[#FFFFFF]' : 'text-[#8A8A90] hover:text-[#C8C8CC]'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-[#232326] border border-[#2D2D31] rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon && <span className={isActive ? 'text-[#62DF7D]' : 'text-[#8A8A90]'}>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                    isActive ? 'bg-[#62DF7D]/20 text-[#62DF7D]' : 'bg-[#232326] text-[#8A8A90]'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}

export interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: DropdownMenuItem[];
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onClose,
  items,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#232326] border border-[#2D2D31] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150',
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left',
            item.danger
              ? 'text-[#EF4444] hover:bg-[#EF4444]/10'
              : 'text-[#C8C8CC] hover:bg-[#1B1B1E] hover:text-[#FFFFFF]'
          )}
        >
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};
