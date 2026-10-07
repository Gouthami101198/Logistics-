import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useLogistics, ToastMessage } from '../../context/LogisticsContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useLogistics();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: () => void }> = ({ toast, onRemove }) => {
  const getIconAndColors = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
          border: 'border-emerald-500/30',
          bg: 'bg-slate-900/95',
          titleColor: 'text-emerald-400',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
          border: 'border-amber-500/30',
          bg: 'bg-slate-900/95',
          titleColor: 'text-amber-400',
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />,
          border: 'border-rose-500/30',
          bg: 'bg-slate-900/95',
          titleColor: 'text-rose-400',
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-indigo-400 shrink-0" />,
          border: 'border-indigo-500/30',
          bg: 'bg-slate-900/95',
          titleColor: 'text-indigo-400',
        };
    }
  };

  const { icon, border, bg, titleColor } = getIconAndColors();

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${border} ${bg} backdrop-blur-md shadow-xl shadow-black/50 text-slate-100 transition-all animate-toast-slide-in`}
    >
      {icon}
      <div className="flex-1 text-sm">
        {toast.title && <p className={`font-semibold text-xs uppercase tracking-wider mb-0.5 ${titleColor}`}>{toast.title}</p>}
        <p className="text-slate-300 leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={onRemove}
        className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
