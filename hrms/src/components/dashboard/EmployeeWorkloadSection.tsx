'use client';

import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp,
  SlidersHorizontal,
  ShieldAlert
} from 'lucide-react';
import { EMPLOYEE_WORKLOAD_LIST, EmployeeWorkloadItem } from '@/lib/boss-dashboard-data';

interface EmployeeWorkloadSectionProps {
  onRebalanceWorkload?: () => void;
  onViewEmployee?: (empId: string) => void;
}

export const EmployeeWorkloadSection: React.FC<EmployeeWorkloadSectionProps> = ({
  onRebalanceWorkload,
  onViewEmployee,
}) => {
  const overloadedEmp = EMPLOYEE_WORKLOAD_LIST.find((e) => e.status === 'Overloaded');

  const getStatusBadge = (status: EmployeeWorkloadItem['status']) => {
    switch (status) {
      case 'Overloaded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Overloaded
          </span>
        );
      case 'Busy':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Busy
          </span>
        );
      case 'Healthy':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Healthy
          </span>
        );
    }
  };

  const getBarColor = (status: EmployeeWorkloadItem['status']) => {
    switch (status) {
      case 'Overloaded':
        return 'bg-gradient-to-r from-rose-500 to-red-400';
      case 'Busy':
        return 'bg-gradient-to-r from-amber-500 to-yellow-400';
      case 'Healthy':
        return 'bg-gradient-to-r from-indigo-500 to-blue-400';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Employee Workload &amp; Capacity</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                1 Overloaded Alert
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual sprint allocation, bandwidth thresholds, and burnout prevention
            </p>
          </div>
        </div>

        <button
          onClick={onRebalanceWorkload}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Rebalance Capacity</span>
        </button>
      </div>

      {/* Burnout Prevention Alert Banner */}
      {overloadedEmp && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 mb-5">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="font-bold text-rose-300">
              Capacity Warning: {overloadedEmp.name} is currently at {overloadedEmp.percentage}% capacity ({overloadedEmp.tasksCount} active tasks)
            </div>
            <p className="text-slate-300 mt-0.5">
              UI/UX design bandwidth is stretched across ABC Website and XYZ Mobile App. Recommend reassigning upcoming wireframe reviews to prevent sprint delays.
            </p>
          </div>
          <button
            onClick={onRebalanceWorkload}
            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold shrink-0 transition-colors"
          >
            Reassign Now
          </button>
        </div>
      )}

      {/* Employee List Progress Rows */}
      <div className="space-y-4">
        {EMPLOYEE_WORKLOAD_LIST.map((emp) => (
          <div
            key={emp.id}
            onClick={() => onViewEmployee && onViewEmployee(emp.id)}
            className="p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800/80 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {emp.name}
                  </h4>
                  <span className="text-[11px] text-slate-400">{emp.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  <strong className="text-white font-semibold">{emp.tasksCount}</strong> tasks assigned
                </span>
                {getStatusBadge(emp.status)}
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="w-full">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Bandwidth Utilized</span>
                <span className="font-bold text-white">{emp.percentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-700/60 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(emp.status)}`}
                  style={{ width: `${emp.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
