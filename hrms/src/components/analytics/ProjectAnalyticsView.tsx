'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { PROJECT_ANALYTICS } from '@/lib/analytics-data';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  FolderGit2, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  CheckCircle2, 
  Zap, 
  Target,
  ArrowRight
} from 'lucide-react';

export const ProjectAnalyticsView: React.FC = () => {
  const { setActivePath, addToast } = useOfficeOS();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Project Delivery Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="p-4 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Project Portfolio</span>
            <FolderGit2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            14 Active
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            100% Client On-Track
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Budget Value</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            ₹66.00L
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            ₹44.6L Burned (67.5% Utilized)
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-cyan-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Avg Sprint Velocity</span>
            <Zap className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            34.5 Pts / wk
          </div>
          <div className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
            +8.2% vs last quarter
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Milestone Hit Ratio</span>
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            94.8%
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            38/40 Milestones Cleared
          </div>
        </Card>

      </div>

      {/* Deep Project Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECT_ANALYTICS.map((proj) => {
          const budgetBurnPercent = Math.round((proj.budgetSpent / proj.budgetAllocated) * 100);

          return (
            <Card key={proj.id} className="p-5 space-y-4 hover:border-indigo-500/80 transition">
              
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-indigo-500" />
                    {proj.title}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Client: <span className="font-semibold text-slate-700 dark:text-slate-300">{proj.client}</span>
                  </div>
                </div>

                <Badge variant={proj.onTrack ? 'success' : 'warning'} size="sm">
                  {proj.onTrack ? '✓ On Track' : '⚠️ Attention'}
                </Badge>
              </div>

              {/* Progress & Budget Utilization Bars */}
              <div className="space-y-3">
                {/* Delivery Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Sprint Delivery Progress</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{proj.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${proj.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Budget Utilization */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Budget Spent vs Allocated</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      ₹{proj.budgetSpent}L / ₹{proj.budgetAllocated}L ({budgetBurnPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        budgetBurnPercent > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${budgetBurnPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Task Breakdown & ETA */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-[10px] text-slate-400">Tasks Completed</div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">{proj.tasksDone} done</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Pending Sprints</div>
                    <div className="font-bold text-slate-700 dark:text-slate-300">{proj.tasksRemaining} left</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Velocity</div>
                    <div className="font-bold text-indigo-600 dark:text-indigo-400">{proj.sprintVelocity} pts/wk</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Target ETA</div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    {proj.estimatedCompletion}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={() => setActivePath('/projects/all')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 transition"
                >
                  View Kanban & Gantt <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </Card>
          );
        })}
      </div>

    </div>
  );
};
