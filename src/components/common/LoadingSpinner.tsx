import React from 'react';
import { CircleNotch } from 'phosphor-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  text 
}) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-2">
        <CircleNotch className={cn("animate-spin text-primary", sizeClasses[size])} />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );
};

// Full page loading spinner
export const PageLoader: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="xl" text={message} />
    </div>
  );
};

// Overlay loading spinner
export const OverlayLoader: React.FC<{ message?: string; show: boolean }> = ({ 
  message = "Loading...", 
  show 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg border">
        <LoadingSpinner size="lg" text={message} />
      </div>
    </div>
  );
};
