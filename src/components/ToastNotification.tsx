import React, { useEffect } from 'react';
import { CheckCircle2, Sparkles, AlertCircle, X } from 'lucide-react';
import { useStudioStore } from '../store/useStudioStore';

export const ToastNotification: React.FC = () => {
  const toast = useStudioStore((s) => s.toast);
  const hideToast = useStudioStore((s) => s.hideToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast?.id, hideToast]);

  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'error':
        return {
          border: 'border-rose-500/40',
          bg: 'bg-[#14080B]/95',
          iconBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
          icon: <AlertCircle className="w-4 h-4" />,
        };
      case 'info':
        return {
          border: 'border-indigo-500/40',
          bg: 'bg-[#0B0E1B]/95',
          iconBg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
          icon: <Sparkles className="w-4 h-4" />,
        };
      case 'success':
      default:
        return {
          border: 'border-emerald-500/40',
          bg: 'bg-[#08140E]/95',
          iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-2xl border shadow-[0_12px_36px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-200 animate-fade-in max-w-[90vw] sm:max-w-md select-none ${style.bg} ${style.border}"
      style={{
        backgroundColor: toast.type === 'error' ? 'rgba(20, 8, 11, 0.95)' : toast.type === 'info' ? 'rgba(11, 14, 27, 0.95)' : 'rgba(8, 20, 14, 0.95)'
      }}
    >
      <span className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${style.iconBg}`}>
        {style.icon}
      </span>
      <span className="text-xs font-mono font-medium text-slate-200 truncate">
        {toast.message}
      </span>
      <button
        type="button"
        onClick={hideToast}
        className="ml-1 p-1 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800/50 transition shrink-0 cursor-pointer"
        title="Cerrar notificación"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
