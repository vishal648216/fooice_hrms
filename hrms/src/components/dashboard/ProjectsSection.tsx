'use client';

import React, { useState } from 'react';
import { 
  FolderGit2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  IndianRupee, 
  ExternalLink, 
  Plus, 
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  LayoutGrid,
  List
} from 'lucide-react';
import { 
  PROJECT_SUMMARY_STATS, 
  PROJECTS_OVERVIEW_LIST, 
  ProjectOverviewItem 
} from '@/lib/boss-dashboard-data';

interface ProjectsSectionProps {
  onNewProject?: () => void;
  onSelectProject?: (projectId: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onNewProject,
  onSelectProject,
}) => {
  const [filterHealth, setFilterHealth] = useState<'All' | 'On Track' | 'At Risk' | 'Delayed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredProjects = PROJECTS_OVERVIEW_LIST.filter((project) => {
    const matchesHealth = filterHealth === 'All' || project.health === filterHealth;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesHealth && matchesSearch;
  });

  const getHealthBadge = (health: ProjectOverviewItem['health']) => {
    switch (health) {
      case 'On Track':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            On Track
          </span>
        );
      case 'At Risk':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            At Risk
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Clock className="w-3 h-3" />
            Delayed
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Project Portfolio &amp; Financials</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                12 Active Engagements
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live milestones, budget billing, and client satisfaction health
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects, clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-800/90 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44 sm:w-56"
            />
          </div>

          {/* Health Filter */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700/80 text-xs">
            {(['All', 'On Track', 'At Risk', 'Delayed'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setFilterHealth(h)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterHealth === h
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Grid/Table Toggle */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700/80">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* New Project */}
          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Active Projects</div>
            <div className="text-xl font-bold text-white mt-0.5">{PROJECT_SUMMARY_STATS.active}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <FolderGit2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Completed</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{PROJECT_SUMMARY_STATS.completed}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">At Risk</div>
            <div className="text-xl font-bold text-amber-400 mt-0.5">{PROJECT_SUMMARY_STATS.atRisk}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Delayed</div>
            <div className="text-xl font-bold text-rose-400 mt-0.5">{PROJECT_SUMMARY_STATS.delayed}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Grid or Table Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject && onSelectProject(project.id)}
              className="cursor-pointer bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-5 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {project.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{project.client}</p>
                  </div>
                  {getHealthBadge(project.health)}
                </div>

                {/* Progress bar */}
                <div className="mt-4 mb-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Milestone Progress</span>
                    <span className="font-bold text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-700/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.health === 'On Track'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : project.health === 'At Risk'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-gradient-to-r from-rose-500 to-red-400'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Financial breakdown */}
                <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-800/80 mb-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Project Budget:</span>
                    <span className="font-semibold text-white">{project.budget}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400/90 flex items-center gap-1">
                      <span>Received:</span>
                    </span>
                    <span className="font-semibold text-emerald-400">{project.received}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400/90 flex items-center gap-1">
                      <span>Pending:</span>
                    </span>
                    <span className="font-semibold text-amber-400">{project.pending}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400">
                  Target: <strong className="text-slate-200">{project.deadline}</strong>
                </span>
                <span className="flex items-center gap-1 text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Details <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/70 uppercase text-[11px] font-semibold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Project &amp; Client</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4">Pending</th>
                <th className="py-3 px-4">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{p.name}</div>
                    <div className="text-slate-400 text-[11px]">{p.client}</div>
                  </td>
                  <td className="py-3 px-4 w-32">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <span className="font-semibold text-white">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">{p.deadline}</td>
                  <td className="py-3 px-4 font-semibold text-white">{p.budget}</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">{p.received}</td>
                  <td className="py-3 px-4 text-amber-400 font-semibold">{p.pending}</td>
                  <td className="py-3 px-4">{getHealthBadge(p.health)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
