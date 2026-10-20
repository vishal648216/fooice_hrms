'use client';

import React from 'react';
import { X, Sliders, Check, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { DashboardWidgetConfig, DEFAULT_DASHBOARD_WIDGETS } from '@/lib/boss-dashboard-data';

interface DashboardCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: DashboardWidgetConfig[];
  onToggleWidget: (id: string) => void;
  onResetWidgets: () => void;
}

export const DashboardCustomizerModal: React.FC<DashboardCustomizerModalProps> = ({
  isOpen,
  onClose,
  widgets,
  onToggleWidget,
  onResetWidgets,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Customize Executive Dashboard</h3>
              <p className="text-xs text-slate-400">Show or hide modular command panels</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list of widget toggles */}
        <div className="py-4 overflow-y-auto space-y-2.5 flex-1 pr-1">
          {widgets.map((w) => (
            <div
              key={w.id}
              onClick={() => onToggleWidget(w.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                w.visible
                  ? 'bg-slate-800/60 border-indigo-500/30 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-60'
              }`}
            >
              <div className="min-w-0">
                <div className="text-xs font-bold flex items-center gap-2">
                  <span>{w.title}</span>
                  {w.visible && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{w.description}</div>
              </div>

              <div
                className={`p-1.5 rounded-lg border transition-colors ${
                  w.visible
                    ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {w.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={onResetWidgets}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to default</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
