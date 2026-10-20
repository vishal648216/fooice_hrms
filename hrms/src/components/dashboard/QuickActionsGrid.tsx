'use client';

import React from 'react';
import { 
  Plus, 
  FolderPlus, 
  Video, 
  CheckSquare, 
  FileText, 
  UserCheck, 
  Megaphone, 
  UserPlus, 
  Briefcase, 
  Download,
  Zap
} from 'lucide-react';

interface QuickActionsGridProps {
  onActionClick?: (actionId: string) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onActionClick,
}) => {
  const actions = [
    {
      id: 'new_project',
      label: 'Create Project',
      desc: 'Launch workspace & scope',
      icon: FolderPlus,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'schedule_meeting',
      label: 'Schedule Meeting',
      desc: 'Google Meet sync call',
      icon: Video,
      color: 'from-sky-600 to-cyan-600',
    },
    {
      id: 'assign_task',
      label: 'Assign Task',
      desc: 'Sprint ticket & deadline',
      icon: CheckSquare,
      color: 'from-purple-600 to-violet-600',
    },
    {
      id: 'generate_invoice',
      label: 'Generate Invoice',
      desc: 'Milestone billing in INR',
      icon: FileText,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'approve_leave',
      label: 'Review Leaves',
      desc: '1 pending employee leave',
      icon: UserCheck,
      color: 'from-amber-600 to-orange-600',
    },
    {
      id: 'broadcast',
      label: 'Broadcast News',
      desc: 'Company-wide memo',
      icon: Megaphone,
      color: 'from-rose-600 to-pink-600',
    },
    {
      id: 'add_employee',
      label: 'Onboard Staff',
      desc: 'New team member profile',
      icon: UserPlus,
      color: 'from-indigo-600 to-blue-600',
    },
    {
      id: 'add_client',
      label: 'Register Client',
      desc: 'Client portal & access',
      icon: Briefcase,
      color: 'from-teal-600 to-emerald-600',
    },
    {
      id: 'export_report',
      label: 'Export Analytics',
      desc: 'Financial & velocity PDF',
      icon: Download,
      color: 'from-slate-700 to-slate-800',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Executive Command Shortcuts</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              One-click management actions to delegate, bill, schedule, and configure
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onActionClick && onActionClick(act.id)}
              className="p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left flex items-start gap-3 group"
            >
              <div
                className={`w-9 h-9 rounded-lg bg-gradient-to-br ${act.color} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                  {act.label}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{act.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
