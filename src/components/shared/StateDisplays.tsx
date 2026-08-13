import React from 'react';
import {
  Database,
  AlertTriangle,
  RefreshCw,
  Plus,
  Terminal,
  Upload,
  BookOpen,
  WifiOff,
  ShieldAlert,
  Clock,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useUIStore } from '../../stores/useUIStore';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Projects Found',
  description = 'You have not created or imported any SQL schemas yet. Get started by initializing a new dataset or running a query.',
  icon = <Database className="w-8 h-8 text-[#62DF7D]" />,
  primaryActionLabel = 'Start Your First Project',
  onPrimaryAction,
  secondaryActionLabel = 'Open Playground',
  onSecondaryAction,
  className,
}) => {
  const { setActiveTab } = useUIStore();

  return (
    <Card
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-5 bg-[#1B1B1E] border border-[#2D2D31] rounded-2xl shadow-xl relative overflow-hidden group hover:border-[#62DF7D]/40 transition-all',
        className
      )}
    >
      <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-[#62DF7D]/5 rounded-full blur-2xl group-hover:bg-[#62DF7D]/10 transition-all pointer-events-none" />

      <div className="w-16 h-16 rounded-2xl bg-[#131315] border border-[#2D2D31] flex items-center justify-center text-[#62DF7D] shadow-inner group-hover:scale-110 transition-transform">
        {icon}
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base font-bold text-[#FFFFFF] font-sans">{title}</h3>
        <p className="text-xs text-[#8A8A90] font-mono leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
        <Button
          size="sm"
          variant="glow"
          leftIcon={<Plus className="w-4 h-4 text-[#131315]" />}
          onClick={onPrimaryAction || (() => setActiveTab('playground'))}
        >
          {primaryActionLabel}
        </Button>

        <Button
          size="sm"
          variant="outline"
          leftIcon={<Terminal className="w-4 h-4 text-[#62DF7D]" />}
          onClick={onSecondaryAction || (() => setActiveTab('playground'))}
        >
          {secondaryActionLabel}
        </Button>
      </div>
    </Card>
  );
};

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'SQL Execution Error',
  message = 'Syntax error near SELECT statement at position 14.',
  onRetry,
  className,
}) => {
  return (
    <Card
      className={cn(
        'flex flex-col items-center justify-center p-6 text-center space-y-3 bg-[#EF4444]/5 border border-[#EF4444]/30 rounded-2xl shadow-lg',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444]">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-sm font-bold text-[#EF4444] font-sans">{title}</h3>
        <p className="text-xs font-mono text-[#C8C8CC] bg-[#131315] p-3 rounded-xl border border-[#2D2D31] text-left overflow-x-auto">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button size="sm" variant="danger" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRetry}>
          Retry Query
        </Button>
      )}
    </Card>
  );
};

/* Custom Full Error Pages */

export const PageNotFound404: React.FC<{ onGoHome?: () => void }> = ({ onGoHome }) => {
  const { setActiveTab } = useUIStore();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6 font-sans">
      <div className="w-20 h-20 rounded-3xl bg-[#1B1B1E] border border-[#2D2D31] flex items-center justify-center text-[#F59E0B] shadow-2xl">
        <HelpCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="px-3 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] font-mono text-xs font-bold">
          404 — Route Not Found
        </span>
        <h1 className="text-2xl font-extrabold text-[#FFFFFF]">Query Schema Does Not Exist</h1>
        <p className="text-xs text-[#8A8A90] font-mono leading-relaxed">
          The requested table or view path could not be located in the WASM memory buffer.
        </p>
      </div>

      <div className="flex items-center gap-3 font-mono text-xs">
        <Button variant="glow" onClick={onGoHome || (() => setActiveTab('dashboard'))}>
          Back to Dashboard
        </Button>
        <Button variant="outline" onClick={() => setActiveTab('playground')}>
          Open Playground
        </Button>
      </div>
    </div>
  );
};

export const SystemError500: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  const { setActiveTab } = useUIStore();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6 font-sans">
      <div className="w-20 h-20 rounded-3xl bg-[#EF4444]/10 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] shadow-2xl">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="px-3 py-1 rounded-full bg-[#EF4444]/20 text-[#EF4444] font-mono text-xs font-bold">
          500 — Engine Execution Panic
        </span>
        <h1 className="text-2xl font-extrabold text-[#FFFFFF]">PostgreSQL WASM Memory Error</h1>
        <p className="text-xs text-[#8A8A90] font-mono leading-relaxed">
          An unhandled exception occurred during transaction commit. The in-memory buffer has been safe-halted.
        </p>
      </div>

      <div className="flex items-center gap-3 font-mono text-xs">
        <Button variant="danger" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={onRetry || (() => window.location.reload())}>
          Reset Engine Buffer
        </Button>
        <Button variant="outline" onClick={() => setActiveTab('help')}>
          View Diagnostic Logs
        </Button>
      </div>
    </div>
  );
};

export const NetworkOfflineState: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6 font-sans">
      <div className="w-20 h-20 rounded-3xl bg-[#3B82F6]/10 border border-[#3B82F6]/40 flex items-center justify-center text-[#3B82F6] shadow-2xl">
        <WifiOff className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="px-3 py-1 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] font-mono text-xs font-bold">
          Network Connection Offline
        </span>
        <h1 className="text-2xl font-extrabold text-[#FFFFFF]">Running in Offline WASM Mode</h1>
        <p className="text-xs text-[#8A8A90] font-mono leading-relaxed">
          MobileSQL is currently executing purely in local browser memory. Cloud backups will resume once connectivity is restored.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-[#1B1B1E] border border-[#2D2D31] text-xs font-mono text-[#62DF7D]">
        ✓ SQLite WASM Kernel Active (0ms Network Latency)
      </div>
    </div>
  );
};

export const UnauthorizedState: React.FC = () => {
  const { setActiveTab } = useUIStore();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6 font-sans">
      <div className="w-20 h-20 rounded-3xl bg-[#A855F7]/10 border border-[#A855F7]/40 flex items-center justify-center text-[#A855F7] shadow-2xl">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="px-3 py-1 rounded-full bg-[#A855F7]/20 text-[#A855F7] font-mono text-xs font-bold">
          403 — Restricted Schema
        </span>
        <h1 className="text-2xl font-extrabold text-[#FFFFFF]">Enterprise Permission Required</h1>
        <p className="text-xs text-[#8A8A90] font-mono leading-relaxed">
          Your current role (SQL Query Architect) requires Pro Architect or DBA authorization to modify system catalog tables.
        </p>
      </div>

      <Button variant="glow" onClick={() => setActiveTab('career')}>
        Elevate Role in Career Center
      </Button>
    </div>
  );
};

export const SessionExpiredState: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6 font-sans">
      <div className="w-20 h-20 rounded-3xl bg-[#F59E0B]/10 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B] shadow-2xl">
        <Clock className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="px-3 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] font-mono text-xs font-bold">
          Session Expired
        </span>
        <h1 className="text-2xl font-extrabold text-[#FFFFFF]">Re-authentication Required</h1>
        <p className="text-xs text-[#8A8A90] font-mono leading-relaxed">
          Your secure token session has concluded. Re-verify your credentials to continue query execution.
        </p>
      </div>

      <Button variant="glow" onClick={() => window.location.reload()}>
        Refresh Session Token
      </Button>
    </div>
  );
};

