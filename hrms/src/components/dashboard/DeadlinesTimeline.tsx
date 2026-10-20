'use client';

import React, { useState } from 'react';
import { 
  CalendarClock, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Flag,
  User,
  ArrowUpRight
} from 'lucide-react';
import { UPCOMING_DEADLINES_LIST, UpcomingDeadlineItem } from '@/lib/boss-dashboard-data';

interface DeadlinesTimelineProps {
  onSelectDeadline?: (deadline: UpcomingDeadlineItem) => void;
}

export const DeadlinesTimeline: React.FC<DeadlinesTimelineProps> = ({
  onSelectDeadline,
}) => {
  const [filter, setFilter] = useState<'All' | 'Today' | 'Tomorrow' | 'This Week'>('All');

  const filtered = UPCOMING_DEADLINES_LIST.filter((item) => {
    if (filter === 'Today') return item.deadlineLabel.toLowerCase().includes('today');
    if (filter === 'Tomorrow') return item.deadlineLabel.toLowerCase().includes('tomorrow');
    if (filter === 'This Week') return true;
    return true;
  });

  const getPriorityBadge = (priority: UpcomingDeadlineItem['priority']) => {
    switch (priority) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Low
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Upcoming Deadlines</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Next 7 Days
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Deliverables, client sign-offs, and critical release milestones
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700/80 text-xs">
          {(['All', 'Today', 'Tomorrow', 'This Week'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filter === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Deadlines List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isToday = item.deadlineLabel.toLowerCase().includes('today');
          return (
            <div
              key={item.id}
              onClick={() => onSelectDeadline && onSelectDeadline(item)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                isToday
                  ? 'bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/30'
                  : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isToday
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-slate-800 text-indigo-400'
                  }`}
                >
                  <CalendarClock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h4>
                    {getPriorityBadge(item.priority)}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="text-slate-300 font-medium">{item.project}</span>
                    <span>•</span>
                    <span className="text-indigo-400 font-medium">{item.type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      {item.assignee.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-right">
                  <div
                    className={`text-xs font-bold ${
                      isToday ? 'text-rose-400 animate-pulse' : 'text-slate-200'
                    }`}
                  >
                    {item.deadlineDate}
                  </div>
                  <div className="text-[11px] text-slate-400">{item.deadlineLabel}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
