'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShieldCheck, 
  Activity, 
  Clock, 
  User, 
  Database, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function ActivityLogsView() {
  const { activityLogs, dbStatus, retryDbConnection } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600" />
            <span>System Activity Logs & Audits</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Excalidraw Module 1 & 4: Activity Logs & Storage &bull; Real-time audit trail of role actions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Database:</span>
            <span className="font-semibold text-emerald-600">{dbStatus}</span>
          </div>
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="space-y-3">
          {activityLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-200 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {log.action}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {log.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {log.details}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 self-end sm:self-auto">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{log.performedBy}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{log.timestamp}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
