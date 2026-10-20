'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Users, 
  FolderGit2, 
  CheckSquare, 
  ArrowLeft, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  X, 
  CheckCircle2, 
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { DepartmentItem, INITIAL_DEPARTMENTS, INITIAL_EMPLOYEES } from '@/lib/office-module-data';

interface DepartmentsViewProps {
  initialDepartmentId?: string;
  onSelectEmployee?: (id: string) => void;
  showToast?: (title: string, desc?: string) => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  initialDepartmentId,
  onSelectEmployee,
  showToast,
}) => {
  const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(initialDepartmentId || null);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Employees' | 'Projects' | 'Tasks' | 'Attendance' | 'Performance'>('Overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New department form
  const [newDept, setNewDept] = useState({
    name: '',
    manager: 'Mayur Patel',
    description: '',
  });

  const selectedDept = departments.find(d => d.id === selectedDeptId);
  const deptEmployees = INITIAL_EMPLOYEES.filter(e => e.department.toLowerCase().includes(selectedDept?.name.toLowerCase() || ''));

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name) return;

    const created: DepartmentItem = {
      id: `dept-${Date.now()}`,
      name: newDept.name,
      manager: newDept.manager,
      employeesCount: 1,
      projectsCount: 1,
      openTasksCount: 4,
      avgWorkload: 55,
      attendanceRate: 95,
      taskCompletionRate: 90,
      description: newDept.description || 'Newly instituted operational division.'
    };

    setDepartments([...departments, created]);
    setIsCreateModalOpen(false);
    setNewDept({ name: '', manager: 'Mayur Patel', description: '' });
    showToast?.('Department Created', `${created.name} department added to TechNova hierarchy.`);
  };

  const tabs = ['Overview', 'Employees', 'Projects', 'Tasks', 'Attendance', 'Performance'] as const;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* If a department is selected, show Department Detail */}
      {selectedDept ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedDeptId(null)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Departments</span>
          </button>

          {/* Department Detail Header */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white tracking-tight">{selectedDept.name} Department</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {selectedDept.employeesCount} Staff Members
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedDept.description}</p>
                  <div className="text-xs text-slate-300 mt-1">Head of Department: <strong>{selectedDept.manager}</strong></div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-center text-xs">
                  <span className="text-slate-400 block text-[11px]">Avg Workload</span>
                  <div className="text-base font-bold text-white mt-0.5">{selectedDept.avgWorkload}%</div>
                </div>
                <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-center text-xs">
                  <span className="text-slate-400 block text-[11px]">Attendance</span>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">{selectedDept.attendanceRate}%</div>
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
                    activeTab === tab ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-t-full shadow-[0_-2px_8px_rgba(20,184,166,0.6)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Total Employees</span>
                <div className="text-2xl font-bold text-white mt-1">{selectedDept.employeesCount}</div>
                <span className="text-[11px] text-slate-500">Active profiles</span>
              </div>
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Projects Managed</span>
                <div className="text-2xl font-bold text-indigo-400 mt-1">{selectedDept.projectsCount}</div>
                <span className="text-[11px] text-slate-500">Milestones ongoing</span>
              </div>
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Open Tickets</span>
                <div className="text-2xl font-bold text-amber-400 mt-1">{selectedDept.openTasksCount}</div>
                <span className="text-[11px] text-slate-500">In sprint queue</span>
              </div>
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Completion Rate</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{selectedDept.taskCompletionRate}%</div>
                <span className="text-[11px] text-emerald-500/80">SLA adherence</span>
              </div>
            </div>
          )}

          {activeTab === 'Employees' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 uppercase text-[11px] font-semibold text-slate-400 tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Employee</th>
                      <th className="py-3.5 px-3">Role</th>
                      <th className="py-3.5 px-3">Team</th>
                      <th className="py-3.5 px-3">Workload</th>
                      <th className="py-3.5 px-3">Today&apos;s Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {deptEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          Employees enrolled will appear here.
                        </td>
                      </tr>
                    ) : (
                      deptEmployees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">{emp.name}</td>
                          <td className="py-3.5 px-3 text-slate-200">{emp.role}</td>
                          <td className="py-3.5 px-3 text-slate-300">{emp.team}</td>
                          <td className="py-3.5 px-3 font-semibold text-indigo-400">{emp.workload}%</td>
                          <td className="py-3.5 px-3 text-emerald-400 font-medium">{emp.attendanceToday}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => onSelectEmployee?.(emp.id)}
                              className="text-indigo-400 hover:text-indigo-300 font-semibold"
                            >
                              View &rarr;
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {['Projects', 'Tasks', 'Attendance', 'Performance'].includes(activeTab) && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
              <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <h4 className="font-bold text-slate-200 text-sm">{activeTab} Analytics for {selectedDept.name}</h4>
              <p className="mt-1">Real-time metrics compiled across all active client deliverables.</p>
            </div>
          )}
        </div>
      ) : (
        /* Department Cards Grid */
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <Building2 className="w-7 h-7 text-teal-400" />
                Departments
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Oversee corporate divisions, leadership heads, resource capacity, and SLA performance.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create Department</span>
            </button>
          </div>

          {/* Cards Grid: Management, Development, UI/UX, QA, Sales, HR, Support */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-xl p-5 shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                      {dept.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {dept.employeesCount} Staff
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{dept.description}</p>

                  <div className="text-xs text-slate-300 mb-4">
                    Director: <strong className="text-white">{dept.manager}</strong>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800 text-xs mb-3 text-center">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Projects</span>
                      <strong className="text-white font-bold">{dept.projectsCount}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Open Tasks</span>
                      <strong className="text-indigo-400 font-bold">{dept.openTasksCount}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Workload</span>
                      <strong className={`font-bold ${dept.avgWorkload >= 85 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {dept.avgWorkload}%
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-teal-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Department Hub &amp; Roster</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Department Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                  <Building2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-base">Add New Department</h3>
                  <p className="text-xs text-slate-400">Expand the organizational hierarchy</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence Research"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Department Head</label>
                <select
                  value={newDept.manager}
                  onChange={(e) => setNewDept({ ...newDept, manager: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                >
                  <option value="Mayur Patel">Mayur Patel (Director / Admin)</option>
                  <option value="Rahul Sharma">Rahul Sharma (Development Lead)</option>
                  <option value="Ananya Deshmukh">Ananya Deshmukh (People Ops)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Purpose &amp; Description</label>
                <textarea
                  rows={3}
                  placeholder="Departmental objectives and deliverables..."
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
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
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-teal-600/20"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
