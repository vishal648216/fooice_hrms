'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Home, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  MoreVertical, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2, 
  Network, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Edit,
  MessageSquare,
  X
} from 'lucide-react';
import { OfficeEmployee, INITIAL_EMPLOYEES } from '@/lib/office-module-data';

interface EmployeesViewProps {
  onSelectEmployee?: (id: string) => void;
  onNavigateToAttendance?: (empId?: string) => void;
  showToast?: (title: string, desc?: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  onSelectEmployee,
  onNavigateToAttendance,
  showToast,
}) => {
  const [employees, setEmployees] = useState<OfficeEmployee[]>(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedAttendance, setSelectedAttendance] = useState('All');
  const [sortField, setSortField] = useState<keyof OfficeEmployee>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Add Employee Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmpForm, setNewEmpForm] = useState<Partial<OfficeEmployee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Frontend Developer',
    department: 'Development',
    team: 'Frontend Team',
    status: 'Active',
    employmentType: 'Full Time',
    workLocation: 'Office',
    shift: 'General Shift (09:00 AM - 06:00 PM)',
    timezone: 'IST (UTC+05:30)',
    joiningDate: '25 Sep 2026',
    manager: 'Rahul Sharma',
    skills: ['React', 'TypeScript'],
    workload: 50,
  });

  // Filtered & Sorted employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesTeam = selectedTeam === 'All' || emp.team === selectedTeam;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
    const matchesAttendance = selectedAttendance === 'All' || emp.attendanceToday === selectedAttendance;

    return matchesSearch && matchesDept && matchesTeam && matchesStatus && matchesAttendance;
  }).sort((a, b) => {
    const aVal = a[sortField] ?? '';
    const bVal = b[sortField] ?? '';
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: keyof OfficeEmployee) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpForm.firstName || !newEmpForm.lastName || !newEmpForm.email) {
      showToast?.('Validation Error', 'Please fill in First Name, Last Name, and Email.');
      return;
    }

    const created: OfficeEmployee = {
      id: `emp-${Date.now()}`,
      firstName: newEmpForm.firstName || '',
      lastName: newEmpForm.lastName || '',
      name: `${newEmpForm.firstName} ${newEmpForm.lastName}`,
      email: newEmpForm.email || '',
      phone: newEmpForm.phone || '+91 98000 00000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      employeeId: `TN-00${employees.length + 1}`,
      role: newEmpForm.role || 'Developer',
      department: newEmpForm.department || 'Development',
      team: newEmpForm.team || 'Frontend Team',
      status: (newEmpForm.status as any) || 'Active',
      attendanceToday: 'Present',
      currentProject: 'TechNova Platform Core',
      workload: Number(newEmpForm.workload) || 45,
      joiningDate: newEmpForm.joiningDate || '25 Sep 2026',
      employmentType: (newEmpForm.employmentType as any) || 'Full Time',
      manager: newEmpForm.manager || 'Mayur Patel',
      workLocation: (newEmpForm.workLocation as any) || 'Office',
      shift: newEmpForm.shift || 'General Shift',
      timezone: newEmpForm.timezone || 'IST (UTC+05:30)',
      skills: newEmpForm.skills || ['React', 'JavaScript'],
      bio: 'Newly onboarded engineer at TechNova Solutions.',
      attendanceSummary: {
        presentDays: 1,
        absentDays: 0,
        lateDays: 0,
        wfhDays: 0,
        leaveDays: 0,
        avgWorkingHours: '8h 00m',
      },
      currentTasks: [],
      currentProjects: [],
      recentActivities: [{ id: 'a1', action: 'Account created', resource: 'Onboarding profile', time: 'Just now', type: 'task' }],
      leaveBalance: { annual: 12, sick: 6, personal: 3, unpaid: 0, used: 0, remaining: 21 },
    };

    setEmployees([created, ...employees]);
    setIsAddModalOpen(false);
    showToast?.('Employee Added', `${created.name} has been enrolled into TechNova Solutions.`);
  };

  const getStatusBadge = (status: OfficeEmployee['status']) => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>;
      case 'Inactive':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">Inactive</span>;
      case 'On Leave':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">On Leave</span>;
      case 'Probation':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Probation</span>;
      case 'Notice Period':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Notice Period</span>;
    }
  };

  const getAttendanceBadge = (att: OfficeEmployee['attendanceToday']) => {
    switch (att) {
      case 'Present':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Present</span>;
      case 'Late':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Late</span>;
      case 'WFH':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>WFH</span>;
      case 'On Leave':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>On Leave</span>;
      case 'Absent':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"><span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>Absent</span>;
      case 'Half Day':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>Half Day</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-400" />
            Employees
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage employees, roles, teams, attendance and workload.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => showToast?.('Import Employees', 'CSV/Excel bulk import dialog ready.')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Import</span>
          </button>

          <button
            onClick={() => showToast?.('Exporting Data', 'Exporting employees list to CSV...')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Employee</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Total Employees 24, Active 22, On Leave 2, Present Today 18, Remote/WFH 4, New This Month 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Staff</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">24</div>
          <div className="text-[11px] text-slate-400 mt-1">TechNova payroll</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">22</div>
          <div className="text-[11px] text-emerald-500/80 mt-1">Operational</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>On Leave</span>
            <UserX className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-2">2</div>
          <div className="text-[11px] text-purple-400/80 mt-1">Approved time off</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Present Today</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-teal-400 mt-2">18</div>
          <div className="text-[11px] text-teal-400/80 mt-1">Checked in office</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Remote / WFH</span>
            <Home className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-2">4</div>
          <div className="text-[11px] text-blue-400/80 mt-1">Approved remote</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>New This Month</span>
            <UserPlus className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2">2</div>
          <div className="text-[11px] text-amber-400/80 mt-1">September intake</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, role, department or employee ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Quick Selectors */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Department */}
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Departments</option>
              <option value="Management">Management</option>
              <option value="Development">Development</option>
              <option value="UI/UX">UI/UX</option>
              <option value="QA">QA</option>
              <option value="HR">HR</option>
            </select>

            {/* Team */}
            <select
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Teams</option>
              <option value="Frontend Team">Frontend Team</option>
              <option value="Backend Team">Backend Team</option>
              <option value="Design Team">Design Team</option>
              <option value="QA Team">QA Team</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
              <option value="Probation">Probation</option>
              <option value="Notice Period">Notice Period</option>
            </select>

            {/* Attendance */}
            <select
              value={selectedAttendance}
              onChange={(e) => {
                setSelectedAttendance(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Attendance</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="WFH">WFH</option>
              <option value="On Leave">On Leave</option>
            </select>

            {(selectedDept !== 'All' || selectedTeam !== 'All' || selectedStatus !== 'All' || selectedAttendance !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedDept('All');
                  setSelectedTeam('All');
                  setSelectedStatus('All');
                  setSelectedAttendance('All');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2 py-1.5"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Employee Data Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 uppercase text-[11px] font-semibold text-slate-400 tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    <span>Employee</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('department')}>
                  <div className="flex items-center gap-1.5">
                    <span>Department</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-3">Role &amp; Team</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Today&apos;s Attendance</th>
                <th className="py-3.5 px-3">Current Project</th>
                <th className="py-3.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('workload')}>
                  <div className="flex items-center gap-1.5">
                    <span>Workload</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-3">Joined</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <div className="font-semibold text-slate-300">No employees match your filters</div>
                    <p className="text-xs text-slate-500 mt-0.5">Try resetting search query or department selections.</p>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr 
                    key={emp.id} 
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectEmployee?.(emp.id)}
                  >
                    {/* Employee Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={emp.avatar} 
                          alt={emp.name} 
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700" 
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5 truncate">
                            <span>{emp.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 px-1 py-0.2 rounded bg-slate-800 border border-slate-700">
                              {emp.employeeId}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-3">
                      <span className="font-medium text-slate-200">{emp.department}</span>
                    </td>

                    {/* Role & Team */}
                    <td className="py-3.5 px-3">
                      <div className="text-slate-200 font-medium">{emp.role}</div>
                      <div className="text-[11px] text-slate-400">{emp.team}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {getStatusBadge(emp.status)}
                    </td>

                    {/* Today's Attendance */}
                    <td className="py-3.5 px-3" onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToAttendance?.(emp.id);
                    }}>
                      {getAttendanceBadge(emp.attendanceToday)}
                    </td>

                    {/* Current Project */}
                    <td className="py-3.5 px-3 text-slate-200 font-medium">
                      <div className="truncate max-w-[150px]" title={emp.currentProject}>
                        {emp.currentProject}
                      </div>
                    </td>

                    {/* Workload */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              emp.workload >= 90 
                                ? 'bg-rose-500' 
                                : emp.workload >= 75 
                                ? 'bg-amber-500' 
                                : 'bg-indigo-500'
                            }`}
                            style={{ width: `${emp.workload}%` }}
                          />
                        </div>
                        <span className={`font-semibold ${
                          emp.workload >= 90 ? 'text-rose-400 font-bold' : 'text-slate-300'
                        }`}>
                          {emp.workload}%
                        </span>
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                      {emp.joiningDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectEmployee?.(emp.id)}
                          title="View Profile"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => showToast?.('Message User', `Opening direct message with ${emp.name}`)}
                          title="Send Message"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{filteredEmployees.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-white">{Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</strong> of{' '}
            <strong className="text-white">{filteredEmployees.length}</strong> employees
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold text-slate-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Onboard New Employee</h3>
                  <p className="text-xs text-slate-400">Enroll new team member into TechNova Solutions directory</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="py-4 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand"
                    value={newEmpForm.firstName}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kumar"
                    value={newEmpForm.lastName}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. a.kumar@technova.io"
                    value={newEmpForm.email}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98250 12345"
                    value={newEmpForm.phone}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Department</label>
                  <select
                    value={newEmpForm.department}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Development">Development</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="QA">QA</option>
                    <option value="Management">Management</option>
                    <option value="HR">HR</option>
                    <option value="Sales & Growth">Sales &amp; Growth</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Team</label>
                  <select
                    value={newEmpForm.team}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, team: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Frontend Team">Frontend Team</option>
                    <option value="Backend Team">Backend Team</option>
                    <option value="Design Team">Design Team</option>
                    <option value="QA Team">QA Team</option>
                    <option value="Executive Leadership">Executive Leadership</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Role Designation</label>
                  <input
                    type="text"
                    value={newEmpForm.role}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Employment Type</label>
                  <select
                    value={newEmpForm.employmentType}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, employmentType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Work Location</label>
                  <select
                    value={newEmpForm.workLocation}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, workLocation: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Office">Office</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Initial Status</label>
                  <select
                    value={newEmpForm.status}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Probation">Probation</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Assigned Reporting Manager</label>
                  <select
                    value={newEmpForm.manager}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, manager: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Mayur Patel">Mayur Patel (Director / Admin)</option>
                    <option value="Rahul Sharma">Rahul Sharma (Lead Developer)</option>
                    <option value="Priya Shah">Priya Shah (Design Lead)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Shift Schedule</label>
                  <select
                    value={newEmpForm.shift}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, shift: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="General Shift (09:00 AM - 06:00 PM)">General Shift (09:00 AM - 06:00 PM)</option>
                    <option value="Early Bird Shift (08:00 AM - 05:00 PM)">Early Bird Shift (08:00 AM - 05:00 PM)</option>
                    <option value="Late Shift (11:00 AM - 08:00 PM)">Late Shift (11:00 AM - 08:00 PM)</option>
                    <option value="Flexible Shift">Flexible Shift</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
