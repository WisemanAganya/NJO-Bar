import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  children?: ReactNode;
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
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full glass-card p-8 rounded-2xl text-center space-y-6 border-red-500/20"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="text-red-500 w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
              <p className="text-white/40 text-sm">
                We encountered an unexpected error while rendering this section.
              </p>
            </div>
            
            <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 text-left">
              <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-1">Error Detail</p>
              <p className="text-xs text-white/60 font-mono break-all line-clamp-3">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full bg-amber-500 text-black hover:bg-amber-600 font-bold"
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Reload Application
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/'} 
                className="text-white/40 hover:text-white"
              >
                <Home className="w-4 h-4 mr-2" /> Back to Home
              </Button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
