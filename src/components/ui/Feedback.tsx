import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'emerald' | 'amber' | 'blue' | 'red';
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'emerald',
  height = 'md',
  animated = true,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorStyles = {
    emerald: 'bg-gradient-to-r from-[#62DF7D] via-[#79F292] to-[#62DF7D] shadow-[0_0_12px_rgba(98,223,125,0.4)]',
    amber: 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    blue: 'bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.4)]',
    red: 'bg-gradient-to-r from-[#EF4444] via-[#F87171] to-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.4)]',
  };

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-mono font-medium text-[#C8C8CC]">
          {label && <span>{label}</span>}
          {showValue && (
            <span className="text-[#8A8A90]">
              {value} / {max} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-[#131315] border border-[#2D2D31] rounded-full overflow-hidden p-0.5 relative', heightStyles[height])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden',
            colorStyles[color]
          )}
          style={{ width: `${percentage}%` }}
        >
          {animated && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
          )}
        </div>
      </div>
    </div>
  );
};

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-4 gap-3 text-[#62DF7D]', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {label && <p className="text-xs font-mono text-[#C8C8CC] tracking-wide">{label}</p>}
    </div>
  );
};

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[#1B1B1E] border border-[#2D2D31] rounded-xl before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[#2D2D31]/40 before:to-transparent',
        className
      )}
    />
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('p-5 bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl space-y-4 shadow-xl', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-5 rounded-lg" />
      <Skeleton className="w-full h-3.5 rounded-md" />
      <Skeleton className="w-2/3 h-3.5 rounded-md" />
      <div className="pt-2 flex justify-between items-center">
        <Skeleton className="w-24 h-4 rounded-md" />
        <Skeleton className="w-20 h-8 rounded-xl" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number; className?: string }> = ({
  rows = 5,
  cols = 4,
  className,
}) => {
  return (
    <div className={cn('bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl p-4 space-y-3 shadow-xl', className)}>
      <div className="flex items-center justify-between pb-2 border-b border-[#2D2D31]">
        <Skeleton className="w-32 h-5 rounded-md" />
        <Skeleton className="w-24 h-8 rounded-xl" />
      </div>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="grid grid-cols-12 gap-3 items-center py-2 border-b border-[#2D2D31]/50 last:border-0">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div key={cIdx} className="col-span-3">
              <Skeleton className="w-full h-4 rounded-md" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const CodeBlockSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('p-4 bg-[#131315] border border-[#2D2D31] rounded-2xl space-y-2.5 font-mono shadow-inner', className)}>
      <Skeleton className="w-1/3 h-4 rounded-md" />
      <Skeleton className="w-3/4 h-4 rounded-md" />
      <Skeleton className="w-1/2 h-4 rounded-md" />
      <Skeleton className="w-5/6 h-4 rounded-md" />
      <Skeleton className="w-2/3 h-4 rounded-md" />
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl space-y-2">
            <Skeleton className="w-20 h-3.5 rounded" />
            <Skeleton className="w-28 h-8 rounded-lg" />
            <Skeleton className="w-16 h-3 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <CardSkeleton />
          <CodeBlockSkeleton />
        </div>
        <div className="lg:col-span-4 space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
};

export const AnimatedXpCounter: React.FC<{ targetXp: number; className?: string }> = ({ targetXp, className }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // 1s
    const steps = 30;
    const increment = targetXp / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetXp) {
        setCurrent(targetXp);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetXp]);

  return (
    <span className={cn('font-mono font-extrabold text-[#62DF7D] tracking-tight transition-all', className)}>
      +{current.toLocaleString()} XP
    </span>
  );
};

export const SuccessCelebrationModal: React.FC<{
  title: string;
  message: string;
  xpReward?: number;
  onClose: () => void;
}> = ({ title, message, xpReward = 150, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#131315]/90 backdrop-blur-xl p-4 flex items-center justify-center animate-fadeIn font-sans">
      <div className="max-w-md w-full bg-[#1B1B1E] border border-[#62DF7D]/50 rounded-2xl p-6 text-center space-y-5 shadow-[0_0_50px_rgba(98,223,125,0.25)] relative">
        <div className="w-16 h-16 rounded-2xl bg-[#62DF7D]/20 border border-[#62DF7D] flex items-center justify-center text-[#62DF7D] mx-auto animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#FFFFFF]">{title}</h2>
          <p className="text-xs text-[#8A8A90] font-mono leading-relaxed">{message}</p>
        </div>

        {xpReward > 0 && (
          <div className="p-3 rounded-xl bg-[#131315] border border-[#2D2D31] flex items-center justify-center gap-2">
            <Award className="w-5 h-5 text-[#F59E0B]" />
            <AnimatedXpCounter targetXp={xpReward} className="text-sm" />
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#62DF7D] hover:bg-[#52cc6c] text-[#131315] font-bold text-xs font-mono cursor-pointer transition-all shadow-md active:scale-95"
        >
          Continue Engineering
        </button>
      </div>
    </div>
  );
};

