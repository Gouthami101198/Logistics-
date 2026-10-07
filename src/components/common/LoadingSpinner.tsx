import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading data...',
  size = 'md',
  fullPage = false,
}) => {
  const sizeClass = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }[size];

  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-center">
      <Loader2 className={`${sizeClass} text-indigo-500 animate-spin`} />
      {message && <p className="text-sm font-medium text-slate-400 animate-pulse">{message}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="min-h-[50vh] flex items-center justify-center">{content}</div>;
  }

  return content;
};
