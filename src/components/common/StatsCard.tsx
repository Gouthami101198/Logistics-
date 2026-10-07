import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'indigo',
  onClick,
}) => {
  const accentStyles = {
    indigo: {
      border: 'hover:border-indigo-500/50',
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
      glow: 'hover:shadow-lg hover:shadow-indigo-500/15',
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
      glow: 'hover:shadow-lg hover:shadow-emerald-500/15',
    },
    amber: {
      border: 'hover:border-amber-500/50',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
      glow: 'hover:shadow-lg hover:shadow-amber-500/15',
    },
    rose: {
      border: 'hover:border-rose-500/50',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
      glow: 'hover:shadow-lg hover:shadow-rose-500/15',
    },
    cyan: {
      border: 'hover:border-cyan-500/50',
      iconBg: 'bg-cyan-50 text-cyan-600 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20',
      glow: 'hover:shadow-lg hover:shadow-cyan-500/15',
    },
    purple: {
      border: 'hover:border-purple-500/50',
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
      glow: 'hover:shadow-lg hover:shadow-purple-500/15',
    },
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`glass-card card-interactive sheen-hover group relative rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs dark:shadow-lg dark:shadow-black/20 ${
        accentStyles.border
      } ${accentStyles.glow} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">{title}</p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${accentStyles.iconBg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] pt-2.5 border-t border-slate-200/90 dark:border-slate-800/80">
          <span
            className={`inline-flex items-center font-semibold ${
              trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3.5 w-3.5 mr-1 inline" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 mr-1 inline" />
            )}
            {trend.value}
          </span>
          {trend.label && <span className="text-slate-500 dark:text-slate-400">{trend.label}</span>}
        </div>
      )}
    </div>
  );
};
