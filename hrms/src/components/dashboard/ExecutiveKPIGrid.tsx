'use client';

import React from 'react';
import { BOSS_KPIS } from '@/lib/boss-dashboard-data';
import { 
  UserCheck, 
  UserX, 
  ClockAlert, 
  Home, 
  FolderGit2, 
  AlertTriangle, 
  IndianRupee, 
  Video,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  UserCheck: <UserCheck className="w-5 h-5" />,
  UserX: <UserX className="w-5 h-5" />,
  ClockAlert: <ClockAlert className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  FolderGit2: <FolderGit2 className="w-5 h-5" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5" />,
  IndianRupee: <IndianRupee className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
};

const colorStyles: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-600 dark:text-emerald-400', ring: 'group-hover:border-emerald-500/40' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-600 dark:text-rose-400', ring: 'group-hover:border-rose-500/40' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-600 dark:text-amber-400', ring: 'group-hover:border-amber-500/40' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/60', text: 'text-blue-600 dark:text-blue-400', ring: 'group-hover:border-blue-500/40' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/60', text: 'text-indigo-600 dark:text-indigo-400', ring: 'group-hover:border-indigo-500/40' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-600 dark:text-purple-400', ring: 'group-hover:border-purple-500/40' },
  sky: { bg: 'bg-sky-50 dark:bg-sky-950/60', text: 'text-sky-600 dark:text-sky-400', ring: 'group-hover:border-sky-500/40' },
};

export const ExecutiveKPIGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {BOSS_KPIS.map((kpi) => {
        const theme = colorStyles[kpi.color] || colorStyles.indigo;
        const icon = iconMap[kpi.iconName] || <FolderGit2 className="w-5 h-5" />;

        return (
          <div
            key={kpi.id}
            className={`group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${theme.ring}`}
          >
            {/* Top Row: Icon + Label */}
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider line-clamp-1">
                {kpi.title}
              </span>
              <div className={`p-2.5 rounded-xl ${theme.bg} ${theme.text} shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                {icon}
              </div>
            </div>

            {/* Middle Row: Value */}
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {kpi.value}
              </div>
            </div>

            {/* Bottom Row: Comparison Trend + Sparkline preview */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <div className="flex items-center gap-1">
                {kpi.comparisonType === 'positive' && (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
                {kpi.comparisonType === 'negative' && (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                )}
                {kpi.comparisonType === 'neutral' && (
                  <Minus className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span
                  className={`text-[11px] font-semibold ${
                    kpi.comparisonType === 'positive'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : kpi.comparisonType === 'negative'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {kpi.comparison}
                </span>
              </div>

              {/* Subtle mini sparkline bars */}
              <div className="flex items-end gap-0.5 h-4">
                {kpi.sparkline.map((val, idx) => {
                  const max = Math.max(...kpi.sparkline);
                  const min = Math.min(...kpi.sparkline);
                  const heightPercent = max === min ? 50 : Math.round(((val - min) / (max - min || 1)) * 60 + 30);

                  return (
                    <span
                      key={idx}
                      className={`w-1 rounded-xs transition-all ${theme.text} bg-current opacity-40 group-hover:opacity-80`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
