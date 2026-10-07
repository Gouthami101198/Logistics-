import React, { useState } from 'react';
import { 
  X, 
  CheckCheck, 
  AlertTriangle, 
  Wrench, 
  CheckCircle2, 
  UserCheck, 
  Trash2, 
  Filter, 
  Bell 
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { AlertType } from '../../types';

export const NotificationDrawer: React.FC = () => {
  const { 
    alerts, 
    isNotificationDrawerOpen, 
    setIsNotificationDrawerOpen, 
    markAlertAsRead, 
    markAllAlertsAsRead,
    dismissAlert 
  } = useLogistics();

  const [activeTab, setActiveTab] = useState<'all' | AlertType>('all');

  if (!isNotificationDrawerOpen) return null;

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'all') return true;
    return a.type === activeTab;
  });

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'delayed_shipment':
        return <AlertTriangle className="h-4.5 w-4.5 text-amber-500 dark:text-amber-400" />;
      case 'vehicle_maintenance':
        return <Wrench className="h-4.5 w-4.5 text-rose-500 dark:text-rose-400" />;
      case 'delivery_update':
        return <CheckCircle2 className="h-4.5 w-4.5 text-teal-500 dark:text-teal-400" />;
      case 'driver_status':
        return <UserCheck className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />;
      default:
        return <Bell className="h-4.5 w-4.5 text-slate-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'medium':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/60';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsNotificationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl shadow-black/80 flex flex-col text-slate-900 dark:text-slate-100 transition-all duration-300 animate-slide-in-right">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/90 dark:bg-slate-900/90">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Notifications & Alerts</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{alerts.length} operational events</p>
              </div>
            </div>
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Action toolbar & filters */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter by Type:</span>
              </div>
              <button
                onClick={() => markAllAlertsAsRead()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'delayed_shipment', label: 'Delays' },
                { id: 'vehicle_maintenance', label: 'Maintenance' },
                { id: 'delivery_update', label: 'Deliveries' },
                { id: 'driver_status', label: 'Drivers' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'all' | AlertType)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white dark:border-slate-700/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alert List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100/40 dark:bg-slate-950/20">
            {filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 dark:text-emerald-400 mb-2" />
                <p className="text-sm font-semibold text-slate-800 dark:text-white">All clear!</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">No alerts matching current filter.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`group relative rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${
                    alert.isRead
                      ? 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-500/30 text-slate-900 dark:text-slate-200 shadow-md ring-1 ring-indigo-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                      {getAlertIcon(alert.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">{alert.title}</span>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${getSeverityBadge(
                            alert.severity
                          )}`}
                        >
                          {alert.severity}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2.5">{alert.description}</p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <div className="flex items-center gap-2">
                          {!alert.isRead && (
                            <button
                              onClick={() => markAlertAsRead(alert.id)}
                              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-0.5 cursor-pointer"
                            title="Dismiss alert"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
