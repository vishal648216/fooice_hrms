'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { EXTENDED_PROJECTS } from '@/lib/projects-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  TrendingUp, 
  Calendar,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const ProjectsListView: React.FC = () => {
  const { setActivePath, addToast } = useOfficeOS();
  const [projects, setProjects] = useState(EXTENDED_PROJECTS);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // New Project Modal Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCode, setNewProjectCode] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newCategory, setNewCategory] = useState('Fintech & Web Platform');
  const [newBudget, setNewBudget] = useState(150000);
  const [newStartDate, setNewStartDate] = useState('2026-10-01');
  const [newEndDate, setNewEndDate] = useState('2027-04-30');
  const [newTechStack, setNewTechStack] = useState('Next.js, Node.js, PostgreSQL');

  const filteredProjects = projects.filter(p => {
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // Calculate high-level summary KPIs
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const activeCount = projects.filter(p => p.status === 'ACTIVE').length;
  const inReviewCount = projects.filter(p => p.status === 'IN_REVIEW').length;
  const healthyCount = projects.filter(p => p.health === 'HEALTHY').length;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectCode.trim() || !newClientName.trim()) {
      addToast({ title: 'Missing Info', description: 'Please fill out all required fields.', type: 'error' });
      return;
    }

    const newProj = {
      id: `proj-${Date.now()}`,
      name: newProjectName,
      code: newProjectCode.toUpperCase(),
      clientName: newClientName,
      clientId: `cli-${Date.now()}`,
      manager: projects[0].manager,
      team: [projects[0].manager, projects[0].team[0]],
      status: 'PLANNING' as const,
      progressPercent: 5,
      budget: Number(newBudget),
      spent: 0,
      startDate: newStartDate,
      targetEndDate: newEndDate,
      tasksSummary: { total: 10, done: 0, inReview: 0 },
      category: newCategory,
      health: 'HEALTHY' as const,
      priority: 'HIGH' as const,
      techStack: newTechStack.split(',').map(s => s.trim()),
      clientContact: `${newClientName} Executive Lead`,
      clientEmail: `contact@${newClientName.toLowerCase().replace(/\s+/g, '')}.com`,
      sprintsCount: 8,
      activeSprint: 'Sprint 1: Architecture Inception',
    };

    setProjects(prev => [newProj, ...prev]);
    setShowNewProjectModal(false);
    setNewProjectName('');
    setNewProjectCode('');
    setNewClientName('');
    addToast({
      title: 'Project Initialized',
      description: `New project ${newProj.name} (${newProj.code}) created successfully.`,
      type: 'success',
    });
  };

  const statusBadgeMap = {
    ACTIVE: { variant: 'success' as const, label: 'Active Sprint' },
    IN_REVIEW: { variant: 'warning' as const, label: 'Client UAT Review' },
    PLANNING: { variant: 'primary' as const, label: 'Planning & SOW' },
    ON_HOLD: { variant: 'danger' as const, label: 'On Hold' },
    COMPLETED: { variant: 'neutral' as const, label: 'Delivered & Closed' },
  };

  const healthBadgeMap = {
    HEALTHY: { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', label: 'On Track' },
    WARNING: { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', label: 'Needs Attention' },
    CRITICAL: { bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20', label: 'At Risk' },
  };

  return (
    <div className="space-y-6">
      {/* Top Executive Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Portfolio Value</span>
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ${totalBudget.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              ${totalSpent.toLocaleString()}
            </span>
            <span>burn to date ({Math.round((totalSpent / totalBudget) * 100)}%)</span>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Delivery Sprints</span>
            <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {activeCount} Projects
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            {healthyCount} of {projects.length} on target schedule
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-100 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Client UAT & Approvals</span>
            <div className="p-2 rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {inReviewCount} Milestones
          </div>
          <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
            Awaiting final client acceptance
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900 border-purple-100 dark:border-purple-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Engineering Workload</span>
            <div className="p-2 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {projects.reduce((a, b) => a + b.tasksSummary.total, 0)} Total Tasks
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            {projects.reduce((a, b) => a + b.tasksSummary.done, 0)} completed this quarter
          </div>
        </Card>
      </div>

      {/* Action and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Projects' },
            { id: 'ACTIVE', label: 'Active Sprints' },
            { id: 'IN_REVIEW', label: 'In Client Review' },
            { id: 'PLANNING', label: 'Planning' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedStatus === tab.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search, View Switch, and New Project Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects, clients, tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              title="Grid Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              title="Compact Table"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowNewProjectModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const statusConfig = statusBadgeMap[project.status] || { variant: 'neutral', label: project.status };
            const healthConfig = healthBadgeMap[project.health] || healthBadgeMap.HEALTHY;
            const burnPercent = Math.min(100, Math.round((project.spent / project.budget) * 100));

            return (
              <Card
                key={project.id}
                hoverable
                className="p-5 flex flex-col justify-between space-y-4 border border-slate-200 dark:border-slate-800"
              >
                {/* Header: Code, Health, Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                        {project.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${healthConfig.bg}`}>
                        ● {healthConfig.label}
                      </span>
                    </div>
                    <Badge variant={statusConfig.variant} size="sm">
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Client: <span className="font-semibold text-slate-700 dark:text-slate-300">{project.clientName}</span>
                  </p>
                </div>

                {/* Active Sprint & Progress */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="font-medium text-[11px] truncate">{project.activeSprint}</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{project.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>

                  {/* Tasks Summary */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{project.tasksSummary.done} of {project.tasksSummary.total} tasks completed</span>
                    {project.tasksSummary.inReview > 0 && (
                      <span className="text-amber-600 font-semibold">{project.tasksSummary.inReview} in review</span>
                    )}
                  </div>
                </div>

                {/* Financial Burn & Tech Stack */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Budget & Burn:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      ${project.spent.toLocaleString()} / <span className="text-slate-400">${project.budget.toLocaleString()}</span>
                    </span>
                  </div>

                  {/* Tech stack chips */}
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: Team & Quick Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center -space-x-1.5">
                    {project.team.map((member, i) => (
                      <img
                        key={i}
                        src={member.avatar}
                        alt={member.name}
                        title={`${member.name} (${member.role})`}
                        className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                      />
                    ))}
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      +{project.sprintsCount}s
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActivePath('/projects/kanban')}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                    >
                      Kanban Board <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Table Mode */
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5">Project Name</th>
                  <th className="p-3.5">Client</th>
                  <th className="p-3.5">Progress</th>
                  <th className="p-3.5">Budget Burn</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Health</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProjects.map((p) => {
                  const statusConfig = statusBadgeMap[p.status] || { variant: 'neutral', label: p.status };
                  const healthConfig = healthBadgeMap[p.health] || healthBadgeMap.HEALTHY;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">{p.code}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.category}</div>
                      </td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">{p.clientName}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${p.progressPercent}%` }} />
                          </div>
                          <span className="font-mono font-bold">{p.progressPercent}%</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono">
                        <span className="font-bold text-slate-900 dark:text-white">${p.spent.toLocaleString()}</span>
                        <span className="text-slate-400 text-[11px]"> / ${p.budget.toLocaleString()}</span>
                      </td>
                      <td className="p-3.5">
                        <Badge variant={statusConfig.variant} size="sm">{statusConfig.label}</Badge>
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${healthConfig.bg}`}>
                          ● {healthConfig.label}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActivePath('/projects/kanban')}
                        >
                          Open Kanban
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Initialize New Project</h3>
                  <p className="text-xs text-slate-500">Create a delivery workspace with budget, client, and sprint parameters</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Omnichannel Commerce Engine"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Code (3-5 chars) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AO-601"
                    value={newProjectCode}
                    onChange={(e) => setNewProjectCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Client Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Global Logistics"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Domain Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option>Fintech & Mobile Banking</option>
                    <option>Healthcare & HIPAA Telemedicine</option>
                    <option>AI Logistics & Telemetry</option>
                    <option>DevOps & Cloud Architecture</option>
                    <option>Cybersecurity & IAM</option>
                    <option>E-Commerce & Retail</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Total Budget ($ USD)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Target Delivery</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="Next.js, Tailwind, TypeScript, Go, Redis"
                  value={newTechStack}
                  onChange={(e) => setNewTechStack(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowNewProjectModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
