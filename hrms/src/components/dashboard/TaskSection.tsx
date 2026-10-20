'use client';

import React, { useState } from 'react';
import { 
  CheckSquare, 
  AlertCircle, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  KanbanSquare
} from 'lucide-react';
import { TASK_ANALYTICS_DATA } from '@/lib/boss-dashboard-data';

interface TaskSectionProps {
  onNewTask?: () => void;
  onOpenKanban?: () => void;
}

export const TaskSection: React.FC<TaskSectionProps> = ({
  onNewTask,
  onOpenKanban,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'priority'>('status');

  const totalTasks = 
    TASK_ANALYTICS_DATA.completed + 
    TASK_ANALYTICS_DATA.inProgress + 
    TASK_ANALYTICS_DATA.pending + 
    TASK_ANALYTICS_DATA.overdue;

  const totalPriority = 
    TASK_ANALYTICS_DATA.priorityBreakdown.critical +
    TASK_ANALYTICS_DATA.priorityBreakdown.high +
    TASK_ANALYTICS_DATA.priorityBreakdown.medium +
    TASK_ANALYTICS_DATA.priorityBreakdown.low;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Task Velocity &amp; Priority Breakdown</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {totalTasks} Active Tickets
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Team throughput, sprint completion rate, and blocker bottlenecks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700/80 text-xs">
            <button
              onClick={() => setActiveTab('status')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'status'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              By Status
            </button>
            <button
              onClick={() => setActiveTab('priority')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'priority'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              By Priority
            </button>
          </div>

          <button
            onClick={onNewTask}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Completed</span>
            <div className="text-2xl font-bold text-emerald-400 mt-0.5">{TASK_ANALYTICS_DATA.completed}</div>
            <span className="text-[11px] text-emerald-500/80">
              {Math.round((TASK_ANALYTICS_DATA.completed / totalTasks) * 100)}% of sprint
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">In Progress</span>
            <div className="text-2xl font-bold text-blue-400 mt-0.5">{TASK_ANALYTICS_DATA.inProgress}</div>
            <span className="text-[11px] text-blue-400/80">Active in dev</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <PlayCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Pending Backlog</span>
            <div className="text-2xl font-bold text-amber-400 mt-0.5">{TASK_ANALYTICS_DATA.pending}</div>
            <span className="text-[11px] text-amber-400/80">Queued for review</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Overdue Tasks</span>
            <div className="text-2xl font-bold text-rose-400 mt-0.5">{TASK_ANALYTICS_DATA.overdue}</div>
            <span className="text-[11px] text-rose-400/80 font-medium">Critical attention</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Distribution visual progress bar */}
      <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 mb-4">
        {activeTab === 'status' ? (
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-white">Status Distribution</span>
              <span className="text-slate-400">{totalTasks} total sprint items</span>
            </div>
            {/* Multi-segment bar */}
            <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden gap-0.5 p-0.5">
              <div 
                className="bg-emerald-500 rounded-l-full transition-all" 
                style={{ width: `${(TASK_ANALYTICS_DATA.completed / totalTasks) * 100}%` }}
                title={`Completed: ${TASK_ANALYTICS_DATA.completed}`}
              />
              <div 
                className="bg-blue-500 transition-all" 
                style={{ width: `${(TASK_ANALYTICS_DATA.inProgress / totalTasks) * 100}%` }}
                title={`In Progress: ${TASK_ANALYTICS_DATA.inProgress}`}
              />
              <div 
                className="bg-amber-500 transition-all" 
                style={{ width: `${(TASK_ANALYTICS_DATA.pending / totalTasks) * 100}%` }}
                title={`Pending: ${TASK_ANALYTICS_DATA.pending}`}
              />
              <div 
                className="bg-rose-500 rounded-r-full transition-all" 
                style={{ width: `${(TASK_ANALYTICS_DATA.overdue / totalTasks) * 100}%` }}
                title={`Overdue: ${TASK_ANALYTICS_DATA.overdue}`}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Completed ({TASK_ANALYTICS_DATA.completed})</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>In Progress ({TASK_ANALYTICS_DATA.inProgress})</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Pending ({TASK_ANALYTICS_DATA.pending})</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Overdue ({TASK_ANALYTICS_DATA.overdue})</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-white">Priority Distribution</span>
              <span className="text-slate-400">{totalPriority} total items</span>
            </div>
            {/* Multi-segment bar for priority */}
            <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden gap-0.5 p-0.5">
              <div 
                className="bg-rose-500 rounded-l-full transition-all" 
                style={{ width: `${(TASK_ANALYTICS_DATA.priorityBreakdown.critical / totalPriority) * 100}%` }}
                title={`Critical: ${TASK_ANALYTICS_DATA.priorityBreakdown.critical}`}
              />
              <div 
                className="bg-amber-500 transition-all" 
                style={{ width: `${(TASK_ANALYTICS_DATA.priorityBreakdown.high / totalPriority) * 100}%` }}
                title={`High: ${TASK_ANALYTICS_DATA.priorityBreakdown.high}`}
              />
              <div 
                className="bg-indigo-500 transition-all" 
                style={{ width: `${(TASK_ANALYTICS_DATA.priorityBreakdown.medium / totalPriority) * 100}%` }}
                title={`Medium: ${TASK_ANALYTICS_DATA.priorityBreakdown.medium}`}
              />
              <div 
                className="bg-slate-500 rounded-r-full transition-all" 
                style={{ width: `${(TASK_ANALYTICS_DATA.priorityBreakdown.low / totalPriority) * 100}%` }}
                title={`Low: ${TASK_ANALYTICS_DATA.priorityBreakdown.low}`}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Critical ({TASK_ANALYTICS_DATA.priorityBreakdown.critical})</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>High ({TASK_ANALYTICS_DATA.priorityBreakdown.high})</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span>Medium ({TASK_ANALYTICS_DATA.priorityBreakdown.medium})</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                <span>Low ({TASK_ANALYTICS_DATA.priorityBreakdown.low})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer link to Kanban */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <span>Completion Velocity: <strong>84%</strong> on-time delivery rate</span>
        <button
          onClick={onOpenKanban}
          className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
        >
          <KanbanSquare className="w-4 h-4" />
          <span>Open Full Task Kanban &amp; Sprint Board</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
