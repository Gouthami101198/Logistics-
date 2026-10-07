import React from 'react';
import { VehicleStatus, DriverStatus, ShipmentStatus, ShipmentPriority } from '../../types';

interface StatusBadgeProps {
  status: VehicleStatus | DriverStatus | ShipmentStatus | ShipmentPriority | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      // Vehicle & Driver Statuses
      case 'Available':
      case 'On Duty':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
          dot: 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
        };
      case 'In Transit':
      case 'On Delivery':
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20',
          dot: 'bg-indigo-500 dark:bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.6)]',
        };
      case 'Maintenance':
      case 'Resting':
      case 'Delayed':
        return {
          bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
          dot: 'bg-amber-500 dark:bg-amber-400',
        };
      case 'Out of Service':
      case 'Off Duty':
      case 'Cancelled':
        return {
          bg: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20',
          dot: 'bg-rose-500 dark:bg-rose-400',
        };
      // Shipment Statuses
      case 'Delivered':
        return {
          bg: 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-500/20',
          dot: 'bg-teal-500 dark:bg-teal-400',
        };
      case 'Dispatched':
        return {
          bg: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/20',
          dot: 'bg-sky-500 dark:bg-sky-400',
        };
      case 'Pending':
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          dot: 'bg-slate-400 dark:bg-slate-400',
        };
      // Priorities
      case 'Urgent':
        return {
          bg: 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30 font-semibold animate-urgent-glow',
          dot: 'bg-rose-500 dark:bg-rose-400 animate-ping',
        };
      case 'Express':
        return {
          bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 font-medium',
          dot: 'bg-amber-500 dark:bg-amber-400',
        };
      case 'Standard':
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          dot: 'bg-slate-400 dark:bg-slate-400',
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          dot: 'bg-slate-400 dark:bg-slate-400',
        };
    }
  };

  const style = getBadgeStyle();
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  }[size];

  const isLiveEntity = status === 'In Transit' || status === 'On Delivery';

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-sm transition-all duration-300 ${style.bg} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span className="relative flex items-center justify-center shrink-0">
          {isLiveEntity && (
            <span className="absolute h-3 w-3 rounded-full bg-indigo-400/60 dark:bg-indigo-400/80 animate-beacon-halo pointer-events-none" />
          )}
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
        </span>
      )}
      <span>{status}</span>
    </span>
  );
};
