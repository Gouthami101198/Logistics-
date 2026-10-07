import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Radio, 
  RotateCcw, 
  Menu, 
  Truck,
  Plus,
  Sun,
  Moon,
  ChevronDown,
  Check,
  LogOut
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenNewShipment?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenNewShipment }) => {
  const { 
    alerts, 
    toggleNotificationDrawer, 
    isLiveSimulationActive, 
    toggleLiveSimulation,
    resetData,
    refreshAll,
    addToast
  } = useLogistics();

  const { toggleTheme, isDark } = useTheme();

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<'Dispatch Director' | 'Fleet Operations Manager' | 'Safety & Compliance Lead'>('Dispatch Director');
  const [dutyStatus, setDutyStatus] = useState<'On Duty' | 'Away' | 'Resting'>('On Duty');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await refreshAll();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsProfileOpen(false);
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 px-4 md:px-6 backdrop-blur-xl shadow-xs dark:shadow-lg dark:shadow-black/20 transition-all duration-300">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden transition-colors cursor-pointer"
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="relative group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30 p-1 text-white animate-float">
              <Truck className="h-5 w-5" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-slate-900 dark:text-white">LogiTrack</span>
              <span className="rounded bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 uppercase tracking-widest flex items-center gap-1 shadow-xs">
                <span>PRO</span>
                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">Fleet & Logistics Operations</p>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex items-center max-w-md w-full mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tracking ID, vehicle plate, or driver..."
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 py-1.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Live Simulation Control */}
        <button
          type="button"
          onClick={toggleLiveSimulation}
          className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            isLiveSimulationActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 shadow-xs'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:bg-slate-800/60 dark:border-slate-700/60 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
          }`}
          title="Toggle live telemetry simulation for in-transit trucks"
        >
          {isLiveSimulationActive ? (
            <div className="flex items-end gap-0.5 h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 pb-0.5">
              <span className="w-1 bg-current rounded-full animate-soundbar-1" />
              <span className="w-1 bg-current rounded-full animate-soundbar-2" />
              <span className="w-1 bg-current rounded-full animate-soundbar-3" />
            </div>
          ) : (
            <Radio className="h-3.5 w-3.5 text-slate-400" />
          )}
          <span>{isLiveSimulationActive ? 'Telemetry LIVE' : 'Telemetry Paused'}</span>
        </button>

        {/* Quick New Shipment Button */}
        {onOpenNewShipment && (
          <button
            type="button"
            onClick={onOpenNewShipment}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-102 cursor-pointer active:scale-98"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Shipment</span>
          </button>
        )}



        {/* Theme Toggle (Dark / Light) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700/60 cursor-pointer group shadow-xs active:scale-95"
          aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? (
            <>
              <Sun className="h-4 w-4 text-amber-400 transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" />
              <span className="hidden sm:inline text-xs font-semibold">Light</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-indigo-600 transition-transform duration-500 group-hover:-rotate-45 group-hover:scale-110" />
              <span className="hidden sm:inline text-xs font-semibold">Dark</span>
            </>
          )}
        </button>

        {/* Refresh Fleet Telemetry */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Refresh Fleet Telemetry & Live GPS"
          aria-label="Refresh Fleet Telemetry"
          className={`relative p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 cursor-pointer active:scale-90 ${
            isRefreshing
              ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30'
              : ''
          }`}
        >
          <RotateCcw
            className={`h-4 w-4 transition-transform duration-500 ${
              isRefreshing ? 'animate-spin text-indigo-600 dark:text-indigo-400' : 'hover:-rotate-45'
            }`}
          />
          {isRefreshing && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
          )}
        </button>

        {/* Notifications Bell */}
        <button
          type="button"
          onClick={toggleNotificationDrawer}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 cursor-pointer"
          aria-label="View notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Trigger & Interactive Dropdown Menu */}
        <div className="relative pl-1 border-l border-slate-200 dark:border-slate-800" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-expanded={isProfileOpen}
            aria-label="User Profile and Operator Controls"
            className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 group border ${
              isProfileOpen
                ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-500/15 dark:border-indigo-500/30 shadow-xs'
                : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700/60'
            }`}
          >
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=96"
                alt="Alex Rivera - Dispatch Director"
                className="h-8 w-8 rounded-xl object-cover ring-1 ring-slate-300 dark:ring-slate-700 shadow-xs transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                }}
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                  dutyStatus === 'On Duty'
                    ? 'bg-emerald-500'
                    : dutyStatus === 'Away'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              >
                {dutyStatus === 'On Duty' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
              </span>
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                <span>Alex Rivera</span>
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{currentRole}</p>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                isProfileOpen ? 'rotate-180 text-indigo-500' : 'group-hover:text-slate-600 dark:group-hover:text-slate-200'
              }`}
            />
          </button>

          {/* User Profile Popover / Dropdown Drawer */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-900/25 dark:shadow-black/80 p-4 z-50 animate-scale-in text-xs space-y-3.5 backdrop-blur-xl">
              {/* Header profile info */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200/90 dark:border-slate-800">
                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128"
                    alt="Alex Rivera"
                    className="h-12 w-12 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center justify-center ${
                      dutyStatus === 'On Duty'
                        ? 'bg-emerald-500'
                        : dutyStatus === 'Away'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white text-sm truncate">Alex Rivera</span>
                    <span className="rounded bg-indigo-50 dark:bg-indigo-500/15 px-1.5 py-0.2 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 uppercase">
                      PRO
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">alex.rivera@logitrack.io</p>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">ID: OP-7824 • NYC Terminal</p>
                </div>
              </div>

              {/* Duty Status Selector */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
                  Duty Status
                </span>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-950/70 p-1 rounded-xl border border-slate-200/90 dark:border-slate-800">
                  {(['On Duty', 'Away', 'Resting'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setDutyStatus(status);
                        addToast(`Operator status set to "${status}"`, 'success');
                      }}
                      className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        dutyStatus === status
                          ? status === 'On Duty'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : status === 'Away'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Console Role Switcher */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
                  Console Role
                </span>
                <div className="space-y-1">
                  {[
                    { role: 'Dispatch Director', desc: 'Full dispatch & route authority' },
                    { role: 'Fleet Operations Manager', desc: 'Asset maintenance & telematics' },
                    { role: 'Safety & Compliance Lead', desc: 'DOT safety & driver scoring' },
                  ].map((item) => (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => {
                        setCurrentRole(item.role as any);
                        addToast(`Switched active console role to "${item.role}"`, 'info');
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer border ${
                        currentRole === item.role
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/15 dark:border-indigo-500/30 dark:text-indigo-300 font-semibold shadow-xs'
                          : 'border-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold leading-tight">{item.role}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">{item.desc}</p>
                      </div>
                      {currentRole === item.role && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Navigation Items */}
              <div className="pt-2 border-t border-slate-200/90 dark:border-slate-800 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    toggleNotificationDrawer();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Bell className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Operational Alerts</span>
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {unreadCount} unread
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    resetData();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
                  <span>Reset Demo Simulation Data</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    addToast('Operator console locked. Session saved.', 'info');
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Lock Console Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
