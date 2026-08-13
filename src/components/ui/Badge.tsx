import React from 'react';
import { cn } from '../../lib/cn';

export type BadgeVariant =
  | 'neutral'
  | 'success'
  | 'emerald'
  | 'warning'
  | 'error'
  | 'info'
  | 'glow';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-[#1B1B1E] text-[#C8C8CC] border border-[#2D2D31]',
  success: 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30',
  emerald: 'bg-[#62DF7D]/10 text-[#62DF7D] border border-[#62DF7D]/30',
  warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30',
  error: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30',
  info: 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30',
  glow: 'bg-[#62DF7D]/15 text-[#62DF7D] border border-[#62DF7D] shadow-[0_0_12px_rgba(98,223,125,0.25)] font-bold',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-tight shrink-0 select-none',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export interface AvatarProps {
  name: string;
  avatarUrl?: string;
  level?: number;
  status?: 'online' | 'busy' | 'offline';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  avatarUrl,
  level,
  status = 'online',
  className,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const statusColors = {
    online: 'bg-[#22C55E]',
    busy: 'bg-[#F59E0B]',
    offline: 'bg-[#8A8A90]',
  };

  return (
    <div className={cn('relative inline-block select-none', className)}>
      <div className="w-10 h-10 rounded-full bg-[#1B1B1E] border border-[#2D2D31] flex items-center justify-center overflow-hidden shadow-inner">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-mono font-bold text-[#62DF7D]">{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#131315]',
            statusColors[status]
          )}
        />
      )}

      {level !== undefined && (
        <div className="absolute -top-1 -right-1 bg-[#62DF7D] text-[#003914] text-[9px] font-mono font-bold px-1 rounded-full border border-[#131315] shadow-sm">
          {level}
        </div>
      )}
    </div>
  );
};
