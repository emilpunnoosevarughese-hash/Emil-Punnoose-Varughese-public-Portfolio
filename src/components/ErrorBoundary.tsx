import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-sans">
          <div className="max-w-xl text-center space-y-6">
            <h1 className="text-4xl font-bold text-red-500">System Error</h1>
            <p className="text-gray-400">The application encountered an unexpected error and could not recover.</p>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-mono text-sm overflow-auto text-left">
              {this.state.errorMsg}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary-dark transition-colors"
            >
              Restart Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
