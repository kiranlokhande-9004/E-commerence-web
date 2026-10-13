import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { errorReporter } from '../../services/errorReporter';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorReporter.report(error, {
      componentStack: errorInfo.componentStack || undefined,
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-[#F5F2EC]">
          <div className="max-w-md w-full bg-[#FFFEFB] border border-[#E3DDD2] rounded-3xl p-8 text-center shadow-warm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-extrabold text-[#1C1A17]">Something went wrong</h2>
            <p className="text-xs text-[#6B645A] leading-relaxed">
              We encountered an unexpected rendering error. Our monitoring adapter has logged the issue for inspection.
            </p>

            {this.state.error && (
              <div className="p-3 bg-[#ECE8E0] rounded-xl text-left font-mono text-[11px] text-[#1C1A17] overflow-x-auto max-h-24 border border-[#E3DDD2]">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 bg-[#1A56DB] hover:bg-[#1646B0] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-warm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload App</span>
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = '';
                }}
                className="px-4 py-2.5 bg-[#FFFEFB] border border-[#E3DDD2] hover:bg-[#ECE8E0] text-[#1C1A17] rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-warm"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
