'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { MOCK_GANTT_ITEMS, EXTENDED_PROJECTS } from '@/lib/projects-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  GitCommit, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Layers, 
  Sparkles, 
  Flag, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

export const GanttTimelineView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<'MONTHS' | 'WEEKS'>('MONTHS');

  const filteredItems = MOCK_GANTT_ITEMS.filter(item => {
    return selectedProjectId === 'ALL' || item.projectId === selectedProjectId;
  });

  // 2026 Timeline calendar timeline headers (May 2026 – Dec 2026)
  const months = [
    { name: 'May 2026', start: '2026-05-01', end: '2026-05-31' },
    { name: 'Jun 2026', start: '2026-06-01', end: '2026-06-30' },
    { name: 'Jul 2026', start: '2026-07-01', end: '2026-07-31' },
    { name: 'Aug 2026', start: '2026-08-01', end: '2026-08-31' },
    { name: 'Sep 2026 (Now)', start: '2026-09-01', end: '2026-09-30', isCurrent: true },
    { name: 'Oct 2026', start: '2026-10-01', end: '2026-10-31' },
    { name: 'Nov 2026', start: '2026-11-01', end: '2026-11-30' },
    { name: 'Dec 2026', start: '2026-12-01', end: '2026-12-31' },
  ];

  // Helper to calculate bar offset and width relative to total timeline (May 1 to Dec 31 = ~245 days)
  const timelineStart = new Date('2026-05-01').getTime();
  const timelineEnd = new Date('2026-12-31').getTime();
  const totalDuration = timelineEnd - timelineStart;

  const calculateBarPosition = (startDateStr: string, endDateStr: string) => {
    const start = new Date(startDateStr).getTime();
    const end = new Date(endDateStr).getTime();

    const leftPercent = Math.max(0, Math.min(100, ((start - timelineStart) / totalDuration) * 100));
    const rightPercent = Math.max(0, Math.min(100, ((end - timelineStart) / totalDuration) * 100));
    const widthPercent = Math.max(3, rightPercent - leftPercent);

    return { left: `${leftPercent}%`, width: `${widthPercent}%` };
  };

  const statusIcons = {
    COMPLETED: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
    IN_PROGRESS: <Clock className="w-3.5 h-3.5 text-indigo-500" />,
    NOT_STARTED: <Calendar className="w-3.5 h-3.5 text-slate-400" />,
    AT_RISK: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
            <GitCommit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">Sprint & Delivery Roadmaps</h3>
            <p className="text-[11px] text-slate-500">Cross-project critical path & dependency Gantt</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Project Filter */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Projects (Overview)</option>
            {EXTENDED_PROJECTS.map(p => (
              <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
            ))}
          </select>

          {/* Zoom Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setZoomLevel('MONTHS')}
              className={`px-3 py-1 rounded-lg transition-all ${zoomLevel === 'MONTHS' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              Months
            </button>
            <button
              onClick={() => setZoomLevel('WEEKS')}
              className={`px-3 py-1 rounded-lg transition-all ${zoomLevel === 'WEEKS' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              Sprints
            </button>
          </div>
        </div>
      </div>

      {/* Main Gantt Canvas */}
      <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Timeline Header Months */}
            <div className="grid grid-cols-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <div className="col-span-4 p-3.5 border-r border-slate-200 dark:border-slate-800 font-bold">
                Work Item / Sprint Phase
              </div>
              <div className="col-span-8 grid grid-cols-8 text-center text-[11px] font-mono">
                {months.map((m, i) => (
                  <div
                    key={i}
                    className={`p-3.5 border-r last:border-r-0 border-slate-200 dark:border-slate-800 ${
                      m.isCurrent ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold' : ''
                    }`}
                  >
                    {m.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Gantt Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredItems.map((item) => {
                const pos = calculateBarPosition(item.startDate, item.endDate);

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition items-center"
                  >
                    {/* Left Column Item Info */}
                    <div className="col-span-4 p-3.5 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        {statusIcons[item.status]}
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {item.projectName} • {item.startDate.slice(5)} to {item.endDate.slice(5)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {item.progressPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Right Column Visual Bar Track */}
                    <div className="col-span-8 p-3.5 relative h-12 flex items-center">
                      {/* Grid background lines */}
                      <div className="absolute inset-0 grid grid-cols-8 pointer-events-none opacity-30">
                        {months.map((_, idx) => (
                          <div key={idx} className="border-r border-slate-200 dark:border-slate-700 h-full" />
                        ))}
                      </div>

                      {/* Current Today Marker Line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 z-10 pointer-events-none"
                        style={{ left: '56%' }}
                        title="Today (Sep 29, 2026)"
                      />

                      {/* Item Bar */}
                      {item.type === 'MILESTONE' ? (
                        <div
                          className="absolute z-20 flex items-center gap-1 -translate-x-1/2 cursor-pointer group"
                          style={{ left: pos.left }}
                          onClick={() => addToast({ title: item.name, description: `Target: ${item.endDate}`, type: 'info' })}
                        >
                          <div className="w-5 h-5 rotate-45 bg-amber-500 border-2 border-white shadow-md flex items-center justify-center text-white text-[9px] group-hover:scale-125 transition-transform" />
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 ml-1 whitespace-nowrap drop-shadow-sm">
                            ★ {item.name}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="absolute h-6 rounded-lg shadow-sm flex items-center px-2 text-[10px] font-bold text-white overflow-hidden transition-all hover:brightness-110 cursor-pointer"
                          style={{
                            left: pos.left,
                            width: pos.width,
                            backgroundColor: item.color || '#6366f1',
                          }}
                          onClick={() => addToast({ title: item.name, description: `${item.progressPercent}% Completed • Dates: ${item.startDate} to ${item.endDate}`, type: 'info' })}
                        >
                          {/* Inner Progress fill bar */}
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-black/20"
                            style={{ width: `${item.progressPercent}%` }}
                          />
                          <span className="relative z-10 truncate drop-shadow-sm">
                            {item.name} ({item.progressPercent}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-indigo-600" />
            <span>Active Sprint</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rotate-45 bg-amber-500" />
            <span>Milestone Target</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-0.5 h-3 bg-indigo-500" />
            <span>Today (Sep 29)</span>
          </div>
        </div>
        <div className="text-[11px]">
          All schedules sync with Jira / GitHub Issues webhooks.
        </div>
      </div>
    </div>
  );
};
