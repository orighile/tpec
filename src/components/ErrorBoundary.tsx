
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Warning, ArrowsClockwise, House } from 'phosphor-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorInfo: null 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private isProduction = () => {
    return window.location.hostname === 'tpecevents.com';
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const isProduction = this.isProduction();

      if (isProduction) {
        // Production: User-friendly error
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
              <div className="mb-6">
                <Warning className="mx-auto h-16 w-16 text-red-500" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h1>
              
              <p className="text-gray-600 mb-8">
                We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={this.handleRefresh}
                  className="w-full"
                >
                  <ArrowsClockwise className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={this.handleGoHome}
                  className="w-full"
                >
                  <House className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 mt-6">
                If the problem persists, please contact our support team.
              </p>
            </div>
          </div>
        );
      } else {
        // Development: Developer-friendly error
        return (
          <div className="min-h-screen bg-red-50 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <Warning className="h-6 w-6 text-red-500 mr-2" />
                  <h1 className="text-xl font-bold text-red-800">
                    Development Error
                  </h1>
                </div>
                
                <div className="space-y-6">
                  {this.state.error && (
                    <div>
                      <h2 className="font-semibold text-gray-900 mb-2">Error Message:</h2>
                      <div className="bg-red-100 border border-red-300 rounded p-3">
                        <code className="text-red-800 text-sm">
                          {this.state.error.message}
                        </code>
                      </div>
                    </div>
                  )}
                  
                  {this.state.error?.stack && (
                    <div>
                      <h2 className="font-semibold text-gray-900 mb-2">Stack Trace:</h2>
                      <div className="bg-gray-100 border rounded p-3 overflow-auto max-h-64">
                        <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <h2 className="font-semibold text-gray-900 mb-2">Component Stack:</h2>
                      <div className="bg-gray-100 border rounded p-3 overflow-auto max-h-64">
                        <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex gap-4">
                    <Button onClick={this.handleRefresh}>
                      <ArrowsClockwise className="mr-2 h-4 w-4" />
                      Refresh Page
                    </Button>
                    
                    <Button variant="outline" onClick={this.handleGoHome}>
                      <House className="mr-2 h-4 w-4" />
                      Go Home
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
