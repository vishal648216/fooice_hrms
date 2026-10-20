'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useOfficeOS();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-200 dark:border-emerald-900',
    warning: 'border-amber-200 dark:border-amber-900',
    error: 'border-rose-200 dark:border-rose-900',
    info: 'border-indigo-200 dark:border-indigo-900',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border ${borderColors[toast.type]} shadow-xl shadow-slate-900/10 text-slate-900 dark:text-white transition-all transform animate-in slide-in-from-bottom-2 duration-200`}
        >
          {icons[toast.type]}
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
