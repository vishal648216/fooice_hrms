'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  FolderGit2, 
  DollarSign, 
  Video, 
  FileCheck, 
  Clock, 
  FileText,
  Filter
} from 'lucide-react';
import { RECENT_ACTIVITY_LIST, RecentActivityItem } from '@/lib/boss-dashboard-data';

export const RecentActivitySection: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = RECENT_ACTIVITY_LIST.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const getActivityIcon = (type: RecentActivityItem['type']) => {
    switch (type) {
      case 'project':
        return <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />;
      case 'task':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'approval':
        return <FileCheck className="w-3.5 h-3.5 text-teal-400" />;
      case 'payment':
        return <DollarSign className="w-3.5 h-3.5 text-purple-400" />;
      case 'meeting':
        return <Video className="w-3.5 h-3.5 text-sky-400" />;
      case 'change_request':
        return <FileText className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Recent Activity Audit Trail</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Live Feed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time chronological timeline of organization operations and team milestones
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700/80 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'task', label: 'Tasks' },
            { id: 'payment', label: 'Finance' },
            { id: 'approval', label: 'Approvals' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterType === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {filtered.map((item) => (
          <div key={item.id} className="relative flex items-start gap-3.5 group">
            {/* Timeline icon bubble */}
            <div className="absolute -left-6 w-5 h-5 rounded-full bg-slate-900 border-2 border-indigo-500/60 flex items-center justify-center shrink-0 z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {item.initials}
            </div>

            <div className="flex-1 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.user}
                </span>
                <span className="text-slate-400">{item.action}</span>
                <span className="font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {item.resource}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 mt-1">
                <Clock className="w-3 h-3" />
                <span>{item.timestamp}</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-800 shrink-0">
              {getActivityIcon(item.type)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
