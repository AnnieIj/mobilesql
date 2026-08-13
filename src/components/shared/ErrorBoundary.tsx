import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary] Caught error in ${this.props.moduleName || 'App'}:`, error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center space-y-5 bg-[#1B1B1E] border border-[#EF4444]/30 rounded-2xl m-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] shadow-inner">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-md">
            <span className="px-3 py-1 rounded-full bg-[#EF4444]/20 text-[#EF4444] font-mono text-[11px] font-bold tracking-wider uppercase">
              Isolated Execution Fault
            </span>
            <h2 className="text-lg font-bold text-[#FFFFFF]">
              {this.props.moduleName ? `${this.props.moduleName} Interrupted` : 'Component Rendering Error'}
            </h2>
            <p className="text-xs text-[#8A8A90] font-mono leading-relaxed">
              {this.state.error?.message || 'An unexpected runtime state was encountered. The host environment remains protected.'}
            </p>
          </div>

          {this.state.error?.stack && (
            <div className="w-full max-w-lg text-left bg-[#131315] p-3 rounded-xl border border-[#2D2D31] text-[10px] font-mono text-[#8A8A90] overflow-x-auto max-h-32">
              {this.state.error.stack.split('\n').slice(0, 4).join('\n')}
            </div>
          )}

          <div className="flex items-center gap-3 font-mono text-xs pt-1">
            <Button
              size="sm"
              variant="danger"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={this.handleReset}
            >
              Recover View
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Terminal className="w-3.5 h-3.5 text-[#62DF7D]" />}
              onClick={() => window.location.reload()}
            >
              Hard Reload
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
