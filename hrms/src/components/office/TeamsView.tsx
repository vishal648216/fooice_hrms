'use client';

import React, { useState } from 'react';
import { 
  Network, 
  Plus, 
  Users, 
  FolderGit2, 
  CheckSquare, 
  ArrowLeft, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  Video, 
  Calendar, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  MessageSquare,
  Eye,
  SlidersHorizontal,
  Search
} from 'lucide-react';
import { TeamItem, INITIAL_TEAMS } from '@/lib/office-module-data';

interface TeamsViewProps {
  initialTeamId?: string;
  onSelectEmployee?: (id: string) => void;
  showToast?: (title: string, desc?: string) => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  initialTeamId,
  onSelectEmployee,
  showToast,
}) => {
  const [teams, setTeams] = useState<TeamItem[]>(INITIAL_TEAMS);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(initialTeamId || null);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Members' | 'Projects' | 'Tasks' | 'Meetings' | 'Performance' | 'Activity'>('Overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New team form
  const [newTeam, setNewTeam] = useState({
    name: '',
    manager: 'Rahul Sharma',
    description: '',
  });

  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name) return;

    const created: TeamItem = {
      id: `team-${Date.now()}`,
      name: newTeam.name,
      manager: newTeam.manager,
      memberCount: 3,
      activeProjects: 1,
      openTasks: 5,
      workload: 50,
      status: 'Balanced',
      description: newTeam.description || 'Newly organized project squad.',
      members: [],
      projects: []
    };

    setTeams([...teams, created]);
    setIsCreateModalOpen(false);
    setNewTeam({ name: '', manager: 'Rahul Sharma', description: '' });
    showToast?.('Team Created', `${created.name} workspace initialized.`);
  };

  const tabs = ['Overview', 'Members', 'Projects', 'Tasks', 'Meetings', 'Performance', 'Activity'] as const;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* If a team is selected, show Team Detail view */}
      {selectedTeam ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedTeamId(null)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Teams</span>
          </button>

          {/* Team Detail Header */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Network className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white tracking-tight">{selectedTeam.name}</h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {selectedTeam.memberCount} Members
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedTeam.description}</p>
                  <div className="text-xs text-slate-300 mt-1">Lead: <strong>{selectedTeam.manager}</strong></div>
                </div>
              </div>

              {/* Team Workload Pill */}
              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs flex items-center gap-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">Sprint Workload</span>
                  <div className="text-lg font-bold text-white">{selectedTeam.workload}%</div>
                </div>
                <div className="w-24 h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      selectedTeam.workload >= 90 ? 'bg-rose-500' : selectedTeam.workload >= 75 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${selectedTeam.workload}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Bar */}
          <div className="border-b border-slate-800 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-xs font-semibold transition-all relative ${
                    activeTab === tab ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full shadow-[0_-2px_8px_rgba(99,102,241,0.6)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
                    <span className="text-xs text-slate-400">Active Projects</span>
                    <div className="text-xl font-bold text-white mt-1">{selectedTeam.activeProjects}</div>
                  </div>
                  <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
                    <span className="text-xs text-slate-400">Open Tasks</span>
                    <div className="text-xl font-bold text-indigo-400 mt-1">{selectedTeam.openTasks}</div>
                  </div>
                  <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
                    <span className="text-xs text-slate-400">Task Velocity</span>
                    <div className="text-xl font-bold text-emerald-400 mt-1">94%</div>
                  </div>
                </div>

                {/* Team Projects */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-white">Active Projects Allocated</h3>
                  <div className="space-y-3">
                    {selectedTeam.projects.map((p) => (
                      <div key={p.id} className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{p.name}</span>
                          <span className="font-bold text-indigo-400">{p.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                        <div className="text-[11px] text-slate-400">Target Delivery: {p.deadline}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 1 Col */}
              <div className="space-y-6">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 text-xs">
                  <h3 className="text-sm font-bold text-white">Team Lead &amp; Squad Hub</h3>
                  <p className="text-slate-400">
                    Lead by <strong>{selectedTeam.manager}</strong>. All members log daily sprints through TechNova Git repositories.
                  </p>
                  <button
                    onClick={() => setActiveTab('Members')}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
                  >
                    View All {selectedTeam.members.length} Members
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Members' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 uppercase text-[11px] font-semibold text-slate-400 tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Member</th>
                      <th className="py-3.5 px-3">Role</th>
                      <th className="py-3.5 px-3">Workload</th>
                      <th className="py-3.5 px-3">Current Project</th>
                      <th className="py-3.5 px-3">Open Tasks</th>
                      <th className="py-3.5 px-3">Today&apos;s Attendance</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {selectedTeam.members.map((m) => (
                      <tr key={m.employeeId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{m.name}</td>
                        <td className="py-3.5 px-3 text-slate-200">{m.role}</td>
                        <td className="py-3.5 px-3">
                          <span className={`font-semibold ${m.workload >= 90 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                            {m.workload}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-300">{m.currentProject}</td>
                        <td className="py-3.5 px-3 text-indigo-400 font-bold">{m.tasksCount} tickets</td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {m.attendance}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onSelectEmployee?.(m.employeeId)}
                            className="text-indigo-400 hover:text-indigo-300 font-semibold"
                          >
                            View Profile &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {['Projects', 'Tasks', 'Meetings', 'Performance', 'Activity'].includes(activeTab) && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
              <Network className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <h4 className="font-bold text-slate-200 text-sm">{activeTab} for {selectedTeam.name}</h4>
              <p className="mt-1">Synchronized with TechNova sprint planning and milestone boards.</p>
            </div>
          )}
        </div>
      ) : (
        /* Team Cards Grid */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <Network className="w-7 h-7 text-indigo-400" />
                Teams
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Organize employees, manage squads, and monitor department workload distribution.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create Team</span>
            </button>
          </div>

          {/* 4 Team Cards: Frontend, Backend, Design, QA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTeamId(t.id)}
                className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-5 shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {t.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      t.workload >= 90 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 font-medium mb-4">
                    Lead: <strong className="text-white">{t.manager}</strong>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-800/40 p-3 rounded-lg border border-slate-800 text-xs mb-4">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Members</span>
                      <strong className="text-white font-bold text-sm">{t.memberCount}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Projects</span>
                      <strong className="text-white font-bold text-sm">{t.activeProjects}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Open Tasks</span>
                      <strong className="text-indigo-400 font-bold text-sm">{t.openTasks}</strong>
                    </div>
                  </div>

                  {/* Workload Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Team Workload Capacity</span>
                      <span className={`font-bold ${t.workload >= 90 ? 'text-rose-400' : 'text-white'}`}>
                        {t.workload}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          t.workload >= 90 ? 'bg-rose-500' : t.workload >= 75 ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${t.workload}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4 text-xs text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Manage Squad &amp; Roster</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Network className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-base">Create New Team</h3>
                  <p className="text-xs text-slate-400">Organize a dedicated project squad</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Team Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud DevOps Squad"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Team Lead / Manager</label>
                <select
                  value={newTeam.manager}
                  onChange={(e) => setNewTeam({ ...newTeam, manager: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                >
                  <option value="Rahul Sharma">Rahul Sharma</option>
                  <option value="Amit Joshi">Amit Joshi</option>
                  <option value="Priya Shah">Priya Shah</option>
                  <option value="Neha Mehta">Neha Mehta</option>
                  <option value="Mayur Patel">Mayur Patel</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Mission &amp; Description</label>
                <textarea
                  rows={3}
                  placeholder="Outline responsibilities and deliverables..."
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
