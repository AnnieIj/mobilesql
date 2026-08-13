import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Card } from '../ui/Card';

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  className,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2D2D31]', className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FFFFFF]">{title}</h1>
          {badge}
        </div>
        {description && <p className="text-xs sm:text-sm text-[#C8C8CC] leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  action,
  icon,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-between gap-4 pt-2', className)}>
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          {icon && <span className="text-[#62DF7D] shrink-0">{icon}</span>}
          <h2 className="text-sm sm:text-base font-bold text-[#FFFFFF] tracking-tight">{title}</h2>
        </div>
        {subtitle && <p className="text-xs text-[#8A8A90]">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  delta?: string;
  isPositiveDelta?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  delta,
  isPositiveDelta = true,
  icon,
  className,
}) => {
  return (
    <Card className={cn('space-y-2 p-4 bg-[#1B1B1E] border border-[#2D2D31]', className)}>
      <div className="flex items-center justify-between text-xs font-semibold text-[#8A8A90] uppercase tracking-wider">
        <span>{title}</span>
        {icon && <span className="text-[#62DF7D]">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1.5 font-mono">
        <span className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tracking-tight font-numeric">
          {value}
        </span>
        {unit && <span className="text-xs text-[#8A8A90] font-sans font-medium">{unit}</span>}
      </div>

      {delta && (
        <div className="flex items-center gap-1 text-xs font-mono font-medium pt-1 border-t border-[#2D2D31]/50">
          {isPositiveDelta ? (
            <span className="flex items-center text-[#22C55E]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {delta}
            </span>
          ) : (
            <span className="flex items-center text-[#EF4444]">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {delta}
            </span>
          )}
          <span className="text-[#8A8A90] text-[10px]">vs last session</span>
        </div>
      )}
    </Card>
  );
};
