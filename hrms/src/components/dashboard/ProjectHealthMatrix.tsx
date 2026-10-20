'use client';

import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { PROJECT_HEALTH_LIST, ProjectHealthItem } from '@/lib/boss-dashboard-data';

interface ProjectHealthMatrixProps {
  onSelectProject?: (projectId: string) => void;
}

export const ProjectHealthMatrix: React.FC<ProjectHealthMatrixProps> = ({
  onSelectProject,
}) => {
  const renderStatusBadge = (status: ProjectHealthItem['overall']) => {
    switch (status) {
      case 'On Track':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            On Track
          </span>
        );
      case 'At Risk':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-2.5 h-2.5" />
            At Risk
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Clock className="w-2.5 h-2.5" />
            Delayed
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Executive Project Health Matrix</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                5-Axis Audit
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multidimensional risk assessment across delivery, budget, specifications, collections, and client sign-off
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>At Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>Delayed</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 uppercase text-[10px] font-bold text-slate-400 tracking-wider">
            <tr>
              <th className="py-3 px-4">Project Workspace</th>
              <th className="py-3 px-3 text-center">1. Timeline</th>
              <th className="py-3 px-3 text-center">2. Budget</th>
              <th className="py-3 px-3 text-center">3. Specs &amp; CR</th>
              <th className="py-3 px-3 text-center">4. Payments</th>
              <th className="py-3 px-3 text-center">5. Client Sign-off</th>
              <th className="py-3 px-4 text-center">Overall Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {PROJECT_HEALTH_LIST.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => onSelectProject && onSelectProject(item.id)}
                className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-4 font-bold text-white group-hover:text-indigo-300 transition-colors">
                  <div className="flex items-center gap-2">
                    <span>{item.projectName}</span>
                    <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </td>
                <td className="py-3.5 px-3 text-center">{renderStatusBadge(item.timeline)}</td>
                <td className="py-3.5 px-3 text-center">{renderStatusBadge(item.budget)}</td>
                <td className="py-3.5 px-3 text-center">{renderStatusBadge(item.requirements)}</td>
                <td className="py-3.5 px-3 text-center">{renderStatusBadge(item.payments)}</td>
                <td className="py-3.5 px-3 text-center">{renderStatusBadge(item.clientApproval)}</td>
                <td className="py-3.5 px-4 text-center">
                  <div className="inline-block font-bold">
                    {renderStatusBadge(item.overall)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-slate-800/30 border border-slate-800/60 text-xs text-slate-400 flex items-center justify-between">
        <span>
          <strong>Executive Note:</strong> Bright Retail ERP requires immediate boss intervention on payment milestone #2 and client requirement sign-off.
        </span>
        <button 
          onClick={() => onSelectProject && onSelectProject('ph-3')}
          className="text-indigo-400 hover:text-indigo-300 font-semibold shrink-0 ml-3 transition-colors"
        >
          Review Bright Retail ERP &rarr;
        </button>
      </div>
    </div>
  );
};
