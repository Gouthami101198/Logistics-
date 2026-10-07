import React from 'react';
import { LucideIcon, Search, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  resetFilterAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Search,
  title,
  description,
  actionText,
  onAction,
  resetFilterAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 glass-card animate-fade-in-up transition-colors duration-300">
      <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-xs animate-float">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1.5 leading-relaxed">{description}</p>

      <div className="flex items-center gap-3 mt-6">
        {resetFilterAction && (
          <button
            type="button"
            onClick={resetFilterAction}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 dark:text-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:border-slate-700/80 cursor-pointer"
          >
            Clear Filters
          </button>
        )}
        {actionText && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95"
          >
            <Plus className="h-4 w-4" />
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};
