'use client';

import React, { useState } from 'react';
import { 
  CalendarOff, 
  Plus, 
  Calendar, 
  Download, 
  Settings, 
  Check, 
  X, 
  Clock, 
  FileText, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Palmtree,
  Paperclip
} from 'lucide-react';
import { LeaveItem, INITIAL_LEAVES, INITIAL_EMPLOYEES } from '@/lib/office-module-data';

interface LeaveManagementViewProps {
  initialViewMode?: 'requests' | 'all';
  onNavigateToSettings?: () => void;
  showToast?: (title: string, desc?: string) => void;
}

export const LeaveManagementView: React.FC<LeaveManagementViewProps> = ({
  initialViewMode = 'all',
  onNavigateToSettings,
  showToast,
}) => {
  const [leaves, setLeaves] = useState<LeaveItem[]>(INITIAL_LEAVES);
  const [activeTab, setActiveTab] = useState<'requests' | 'calendar' | 'balances'>(
    initialViewMode === 'requests' ? 'requests' : 'requests'
  );
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedLeaveForReview, setSelectedLeaveForReview] = useState<LeaveItem | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  // Request form state
  const [newLeave, setNewLeave] = useState({
    leaveType: 'Annual Leave' as LeaveItem['leaveType'],
    startDate: '2026-10-05',
    endDate: '2026-10-06',
    isHalfDay: false,
    reason: '',
  });

  const handleApprove = (id: string, comment?: string) => {
    setLeaves(prev => prev.map(lv => lv.id === id ? { ...lv, status: 'Approved' } : lv));
    setSelectedLeaveForReview(null);
    showToast?.('Leave Approved', 'Employee leave has been authorized and calendar updated.');
  };

  const handleReject = (id: string, comment?: string) => {
    setLeaves(prev => prev.map(lv => lv.id === id ? { ...lv, status: 'Rejected' } : lv));
    setSelectedLeaveForReview(null);
    showToast?.('Leave Rejected', 'The leave request has been declined.');
  };

  const handleRequestChanges = (id: string) => {
    setLeaves(prev => prev.map(lv => lv.id === id ? { ...lv, status: 'Changes Requested' } : lv));
    setSelectedLeaveForReview(null);
    showToast?.('Changes Requested', 'Notification sent to employee to revise dates/reason.');
  };

  const handleSubmitNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeave.reason) {
      showToast?.('Validation Error', 'Please provide a reason for the leave.');
      return;
    }

    const created: LeaveItem = {
      id: `lv-${Date.now()}`,
      employeeId: 'emp-2',
      employeeName: 'Rahul Sharma',
      department: 'Development',
      leaveType: newLeave.leaveType,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      duration: newLeave.isHalfDay ? '0.5 Day' : '2 Days',
      isHalfDay: newLeave.isHalfDay,
      reason: newLeave.reason,
      status: 'Pending',
      requestedOn: 'Today, 11:45 AM',
      approver: 'Mayur Patel',
      remainingBalanceAnnual: 12,
      remainingBalanceSick: 6,
      timeline: [
        { date: 'Today', action: 'Submitted by Rahul Sharma', user: 'Rahul Sharma' }
      ]
    };

    setLeaves([created, ...leaves]);
    setIsRequestModalOpen(false);
    setNewLeave({
      leaveType: 'Annual Leave',
      startDate: '2026-10-05',
      endDate: '2026-10-06',
      isHalfDay: false,
      reason: '',
    });
    showToast?.('Leave Requested', 'Your leave request has been submitted for approval.');
  };

  const filteredLeaves = leaves.filter((lv) => {
    const matchesSearch = lv.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lv.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || lv.status === filterStatus;
    const matchesType = filterType === 'All' || lv.leaveType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: LeaveItem['status']) => {
    switch (status) {
      case 'Approved':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Approved</span>;
      case 'Pending':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">Pending Review</span>;
      case 'Rejected':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Rejected</span>;
      case 'Changes Requested':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">Changes Requested</span>;
    }
  };

  const getLeaveTypeColor = (type: LeaveItem['leaveType']) => {
    switch (type) {
      case 'Annual Leave': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Sick Leave': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Emergency Leave': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Personal Leave': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CalendarOff className="w-7 h-7 text-purple-400" />
            Leave Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage employee leave requests, balances and approvals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => showToast?.('Export Leaves', 'Exporting leave calendar and history to CSV...')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>

          <button
            onClick={onNavigateToSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Leave Settings</span>
          </button>

          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Request Leave</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Pending Requests, Approved, Rejected, Employees On Leave Today, Upcoming Leaves */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400">Pending Requests</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {leaves.filter(l => l.status === 'Pending').length}
          </div>
          <span className="text-[10px] text-amber-400/80">Requires signoff</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400">Approved</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">14</div>
          <span className="text-[10px] text-emerald-400/80">This month</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400">Rejected</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">1</div>
          <span className="text-[10px] text-rose-400/80">Declined</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400">On Leave Today</span>
          <div className="text-2xl font-bold text-purple-400 mt-1">2</div>
          <span className="text-[10px] text-purple-400/80">Neha M., Priya S.</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400">Upcoming Leaves</span>
          <div className="text-2xl font-bold text-blue-400 mt-1">3</div>
          <span className="text-[10px] text-blue-400/80">Next 7 days</span>
        </div>
      </div>

      {/* Tabs Switcher: Requests Table | Monthly Calendar | Leave Balances */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'requests'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Leave Requests ({leaves.length})
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'calendar'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Monthly Leave Calendar
        </button>
        <button
          onClick={() => setActiveTab('balances')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'balances'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Employee Leave Balances
        </button>
      </div>

      {/* Requests Table Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Changes Requested">Changes Requested</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
            >
              <option value="All">All Leave Types</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 uppercase text-[11px] font-semibold text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-3">Leave Type</th>
                    <th className="py-3.5 px-3">Dates</th>
                    <th className="py-3.5 px-3">Duration</th>
                    <th className="py-3.5 px-3">Reason</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-3">Requested On</th>
                    <th className="py-3.5 px-3">Approver</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredLeaves.map((lv) => (
                    <tr
                      key={lv.id}
                      onClick={() => setSelectedLeaveForReview(lv)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {lv.employeeName}
                        </div>
                        <div className="text-[11px] text-slate-400">{lv.department}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${getLeaveTypeColor(lv.leaveType)}`}>
                          {lv.leaveType}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-slate-200">
                        {lv.startDate} &rarr; {lv.endDate}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-white">{lv.duration}</td>
                      <td className="py-3.5 px-3 text-slate-300 max-w-[180px] truncate" title={lv.reason}>
                        {lv.reason}
                      </td>
                      <td className="py-3.5 px-3">{getStatusBadge(lv.status)}</td>
                      <td className="py-3.5 px-3 text-slate-400 text-[11px]">{lv.requestedOn}</td>
                      <td className="py-3.5 px-3 text-slate-300">{lv.approver}</td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {lv.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedLeaveForReview(lv)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition-all shadow-sm"
                            >
                              Review
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Decided</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Leave Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">September 2026 — Approved Leave Schedule</h3>
              <p className="text-xs text-slate-400">Team absences visualized to prevent sprint bottlenecks</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Annual</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> Sick</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> Personal</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-xs">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
              const hasLeave = d === 24 || d === 25;
              const hasPriya = d === 29;
              return (
                <div
                  key={d}
                  className={`p-3 rounded-xl border min-h-[75px] flex flex-col justify-between ${
                    hasLeave
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                      : hasPriya
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-white">Sep {d}</div>
                  {hasLeave && (
                    <div className="text-[10px] font-semibold bg-purple-500/20 px-1.5 py-0.5 rounded truncate">
                      Neha M. (Annual)
                    </div>
                  )}
                  {hasPriya && (
                    <div className="text-[10px] font-semibold bg-rose-500/20 px-1.5 py-0.5 rounded truncate">
                      Priya S. (Sick)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leave Balances Tab */}
      {activeTab === 'balances' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 uppercase text-[11px] font-semibold text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-3">Annual Leave</th>
                  <th className="py-3.5 px-3">Sick Leave</th>
                  <th className="py-3.5 px-3">Personal Leave</th>
                  <th className="py-3.5 px-3">Unpaid Leave</th>
                  <th className="py-3.5 px-3">Used Days</th>
                  <th className="py-3.5 px-4 text-right">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {INITIAL_EMPLOYEES.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {emp.name}
                      <span className="text-[11px] text-slate-400 block font-normal">{emp.department}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-200">{emp.leaveBalance.annual} days</td>
                    <td className="py-3.5 px-3 text-slate-200">{emp.leaveBalance.sick} days</td>
                    <td className="py-3.5 px-3 text-slate-200">{emp.leaveBalance.personal} days</td>
                    <td className="py-3.5 px-3 text-slate-400">{emp.leaveBalance.unpaid} days</td>
                    <td className="py-3.5 px-3 text-rose-400 font-semibold">{emp.leaveBalance.used} days</td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                      {emp.leaveBalance.remaining} days available
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Leave Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <CalendarOff className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-base">Submit Leave Request</h3>
                  <p className="text-xs text-slate-400">TechNova Solutions Time-Off Request Portal</p>
                </div>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewRequest} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Leave Category *</label>
                <select
                  value={newLeave.leaveType}
                  onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Annual Leave">Annual Leave (12 days remaining)</option>
                  <option value="Sick Leave">Sick Leave (6 days remaining)</option>
                  <option value="Personal Leave">Personal Leave (3 days remaining)</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">End Date *</label>
                  <input
                    type="date"
                    required
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="halfDayCheck"
                  checked={newLeave.isHalfDay}
                  onChange={(e) => setNewLeave({ ...newLeave, isHalfDay: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                />
                <label htmlFor="halfDayCheck" className="text-slate-300">
                  This is a Half Day request (0.5 day deduction)
                </label>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Reason for Leave *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide context or description for manager signoff..."
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Calculated Duration: <strong className="text-white">{newLeave.isHalfDay ? '0.5 Day' : '2 Days'}</strong></span>
                <span>Annual Remaining: <strong className="text-emerald-400">12 days</strong></span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Approval Review Modal */}
      {selectedLeaveForReview && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <CalendarOff className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-base">Leave Approval Review</h3>
                  <p className="text-xs text-slate-400">Requested by {selectedLeaveForReview.employeeName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLeaveForReview(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400">Leave Type</span>
                  <div className="font-bold text-white mt-0.5">{selectedLeaveForReview.leaveType}</div>
                </div>
                <div>
                  <span className="text-slate-400">Duration</span>
                  <div className="font-bold text-emerald-400 mt-0.5">{selectedLeaveForReview.duration}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400">Start &amp; End Dates</span>
                  <div className="font-medium text-slate-200 mt-0.5">
                    {selectedLeaveForReview.startDate} to {selectedLeaveForReview.endDate}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Current Balances</span>
                  <div className="font-medium text-slate-300 mt-0.5">
                    Annual: {selectedLeaveForReview.remainingBalanceAnnual}d | Sick: {selectedLeaveForReview.remainingBalanceSick}d
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Reason Stated</span>
                <div className="p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-200 leading-relaxed">
                  {selectedLeaveForReview.reason}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Manager Note / Comment (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Approved, please hand over sprint tasks to Kunal."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => handleRequestChanges(selectedLeaveForReview.id)}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                Request Changes
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReject(selectedLeaveForReview.id, reviewComment)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedLeaveForReview.id, reviewComment)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Leave</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
