import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Package, 
  Truck, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  X,
  Compass
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { stats, shipments, vehicles, drivers } = useLogistics();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      to: '/tracking',
      label: 'Live Tracking',
      icon: MapPin,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 animate-pulse',
    },
    {
      to: '/shipments',
      label: 'Shipments',
      icon: Package,
      badge: shipments.length,
      badgeColor: 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30',
    },
    {
      to: '/vehicles',
      label: 'Vehicles & Fleet',
      icon: Truck,
      badge: vehicles.length,
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    },
    {
      to: '/drivers',
      label: 'Driver Roster',
      icon: Users,
      badge: drivers.length,
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    },
    {
      to: '/analytics',
      label: 'Analytics & Reports',
      icon: BarChart3,
      badge: undefined,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/90 dark:border-slate-800/80 bg-white/95 lg:bg-white/80 dark:bg-slate-900/95 dark:lg:bg-slate-900/60 backdrop-blur-xl p-4 transition-all duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header Mobile Close */}
        <div className="flex items-center justify-between px-2 pb-4 pt-2 lg:hidden border-b border-slate-200 dark:border-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">Navigation</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 mt-1">
            Operations
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-500/30 shadow-xs dark:shadow-indigo-500/10'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:text-indigo-500" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full border px-1.5 py-0.2 text-[10px] font-semibold transition-all ${
                      item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Live Operational Status Card at bottom */}
        <div className="mt-auto pt-3">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/70 p-3 border border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-inner transition-colors duration-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">System Telemetry</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-xs animate-pulse" />
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Active in Transit</span>
                <span className="font-semibold text-slate-900 dark:text-white">{stats.inTransitShipments} units</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>On-Time Rate</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.onTimeDeliveryRate}%</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Fleet Drivers</span>
                <span className="font-semibold text-slate-900 dark:text-white">{stats.onDutyDrivers} on duty</span>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                DOT Compliant
              </span>
              <span>v2.4 LTS</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
