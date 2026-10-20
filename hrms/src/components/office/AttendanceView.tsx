'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Download, 
  Settings, 
  FileEdit, 
  UserCheck, 
  UserX, 
  AlertTriangle, 
  Home, 
  Briefcase, 
  Search, 
  Filter, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  Laptop, 
  Smartphone, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  PieChart as PieChartIcon,
  CalendarDays
} from 'lucide-react';
import { AttendanceRecord, INITIAL_ATTENDANCE } from '@/lib/office-module-data';

interface AttendanceViewProps {
  initialEmployeeId?: string;
  onNavigateToCorrections?: () => void;
  onNavigateToSettings?: () => void;
  showToast?: (title: string, desc?: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  initialEmployeeId,
  onNavigateToCorrections,
  onNavigateToSettings,
  showToast,
}) => {
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [datePeriod, setDatePeriod] = useState<'Today' | 'Yesterday' | 'This Week' | 'This Month' | 'Custom'>('Today');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    initialEmployeeId ? attendanceList.find(a => a.employeeId === initialEmployeeId) || null : null
  );
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');

  const filteredRecords = attendanceList.filter((rec) => {
    const matchesSearch = rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || rec.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    switch (status) {
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
      case 'Holiday':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">Holiday</span>;
      case 'Weekly Off':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">Weekly Off</span>;
    }
  };

  // Monthly Calendar Mock Grid (September 2026: 30 days)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const getDayStatus = (day: number) => {
    if (day % 7 === 0 || day % 7 === 6) return { code: 'WO', bg: 'bg-slate-800 text-slate-500', label: 'Weekend Off' };
    if (day === 2) return { code: 'H', bg: 'bg-teal-500/20 text-teal-400 border border-teal-500/30', label: 'Gandhi Jayanti' };
    if (day === 22) return { code: 'L', bg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', label: 'Late' };
    if (day === 24 || day === 25) return { code: 'WFH', bg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', label: 'WFH' };
    if (day === 16) return { code: 'A', bg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30', label: 'Absent' };
    return { code: 'P', bg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', label: 'Present' };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-teal-400" />
            Attendance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor daily attendance, working hours, overtime and employee status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => showToast?.('Report Export', 'Generating detailed Attendance Report PDF/Excel...')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Report</span>
          </button>

          <button
            onClick={onNavigateToSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Attendance Settings</span>
          </button>

          <button
            onClick={onNavigateToCorrections}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>View Corrections (1 Pending)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Present 18, Absent 2, Late 3, WFH 4, On Leave 2, Half Day 1, Overtime 5 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400">Present</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">18</div>
          <span className="text-[10px] text-emerald-500/80">72% of workforce</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400">Absent</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">2</div>
          <span className="text-[10px] text-rose-400/80">Unnotified</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400">Late</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">3</div>
          <span className="text-[10px] text-amber-400/80">&gt; 10m grace</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400">WFH</span>
          <div className="text-2xl font-bold text-blue-400 mt-1">4</div>
          <span className="text-[10px] text-blue-400/80">Approved remote</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400">On Leave</span>
          <div className="text-2xl font-bold text-purple-400 mt-1">2</div>
          <span className="text-[10px] text-purple-400/80">Casual/Sick</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400">Half Day</span>
          <div className="text-2xl font-bold text-yellow-400 mt-1">1</div>
          <span className="text-[10px] text-yellow-400/80">Second half</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400">Overtime</span>
          <div className="text-2xl font-bold text-indigo-400 mt-1">5</div>
          <span className="text-[10px] text-indigo-400/80">&gt; 8.5 hours</span>
        </div>
      </div>

      {/* Date Controls & Live Attendance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls & Breakdown Left 2 Cols */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            {/* Date periods */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 text-xs">
              {(['Today', 'Yesterday', 'This Week', 'This Month', 'Custom'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setDatePeriod(period)}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    datePeriod === period
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Toggle Daily / Monthly */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  viewMode === 'daily' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Daily Table
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  viewMode === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Calendar
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Management">Management</option>
              <option value="Development">Development</option>
              <option value="UI/UX">UI/UX</option>
              <option value="QA">QA</option>
              <option value="HR">HR</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="WFH">WFH</option>
              <option value="On Leave">On Leave</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        {/* Live Attendance Overview Visualization Right 1 Col */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <PieChartIcon className="w-4 h-4 text-indigo-400" />
              Live Shift Distribution
            </h3>
            <span className="text-[11px] text-slate-400">25 Total</span>
          </div>

          {/* Visual Percentage Distribution Bar */}
          <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden gap-0.5 p-0.5">
            <div className="bg-emerald-500 rounded-l-full" style={{ width: '72%' }} title="Present: 72%" />
            <div className="bg-blue-500" style={{ width: '16%' }} title="WFH: 16%" />
            <div className="bg-amber-500" style={{ width: '12%' }} title="Late: 12%" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Present: <strong>72% (18)</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>WFH: <strong>16% (4)</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Late: <strong>12% (3)</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>On Leave: <strong>8% (2)</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main View: Daily Attendance Table OR Monthly Calendar View */}
      {viewMode === 'daily' ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 uppercase text-[11px] font-semibold text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-3">Department</th>
                  <th className="py-3.5 px-3">Check In</th>
                  <th className="py-3.5 px-3">Break</th>
                  <th className="py-3.5 px-3">Check Out</th>
                  <th className="py-3.5 px-3">Working Hours</th>
                  <th className="py-3.5 px-3">Overtime</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Location</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {rec.employeeName}
                      </div>
                      <div className="text-[11px] text-slate-400">{rec.date}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-200">{rec.department}</td>
                    <td className="py-3.5 px-3 font-mono font-medium text-slate-200">{rec.checkIn}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-400">{rec.breakStart} - {rec.breakEnd}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-200">{rec.checkOut}</td>
                    <td className="py-3.5 px-3 font-semibold text-white">{rec.workingHours}</td>
                    <td className="py-3.5 px-3 text-emerald-400 font-mono">{rec.overtime}</td>
                    <td className="py-3.5 px-3">{getStatusBadge(rec.status)}</td>
                    <td className="py-3.5 px-3 text-slate-300">{rec.location}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(rec);
                        }}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px]"
                      >
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Monthly Calendar-Style Attendance View */
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-400" />
                Monthly Attendance Roster — September 2026
              </h3>
              <p className="text-xs text-slate-400">P = Present, A = Absent, L = Late, WFH = Work From Home, WO = Weekly Off, H = Holiday</p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Present</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500"></span> WFH</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Late</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500"></span> Absent</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const info = getDayStatus(day);
              return (
                <div
                  key={day}
                  className={`p-3 rounded-xl border flex flex-col justify-between h-20 transition-all ${info.bg}`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Sep {day}</span>
                    <span className="text-[10px] uppercase font-mono">{info.code}</span>
                  </div>
                  <div className="text-[10px] truncate">{info.label}</div>
                </div>
              );
            })}
          </div>

          {/* Monthly Summary */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>Working Days: <strong className="text-white">22</strong></div>
            <div>Present: <strong className="text-emerald-400">18</strong></div>
            <div>Late: <strong className="text-amber-400">2</strong></div>
            <div>WFH: <strong className="text-blue-400">3</strong></div>
            <div>Absent: <strong className="text-rose-400">1</strong></div>
            <div>Overtime Logged: <strong className="text-indigo-400">4h 30m</strong></div>
          </div>
        </div>
      )}

      {/* Attendance Detail Slide-Over Drawer */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 border-l border-slate-700 max-w-md w-full h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div>
                  <h3 className="font-bold text-white text-base">Attendance Detail Record</h3>
                  <p className="text-xs text-slate-400">{selectedRecord.date}</p>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Employee Summary Card */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 mb-5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white">{selectedRecord.employeeName}</div>
                  {getStatusBadge(selectedRecord.status)}
                </div>
                <div className="text-slate-400">{selectedRecord.department} • {selectedRecord.location}</div>
              </div>

              {/* Working Hours & Overtime */}
              <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Total Working Hours</span>
                  <div className="text-base font-bold text-white mt-1">{selectedRecord.workingHours}</div>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Overtime</span>
                  <div className="text-base font-bold text-emerald-400 mt-1">{selectedRecord.overtime}</div>
                </div>
              </div>

              {/* Timing Metadata */}
              <div className="space-y-3 bg-slate-800/30 p-4 rounded-xl border border-slate-800/80 mb-5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Punch-In:</span>
                  <strong className="text-white font-mono">{selectedRecord.checkIn}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Lunch Break:</span>
                  <strong className="text-slate-300 font-mono">{selectedRecord.breakStart} - {selectedRecord.breakEnd}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Punch-Out:</span>
                  <strong className="text-white font-mono">{selectedRecord.checkOut}</strong>
                </div>
                {selectedRecord.lateDuration && (
                  <div className="flex items-center justify-between text-amber-400 pt-2 border-t border-slate-800">
                    <span>Late Duration:</span>
                    <strong>{selectedRecord.lateDuration}</strong>
                  </div>
                )}
              </div>

              {/* Hardware Device & IP Telemetry */}
              <div className="space-y-2 mb-5 text-xs text-slate-400">
                <div className="font-semibold text-white">Device &amp; Verification Telemetry</div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Laptop className="w-3.5 h-3.5 text-slate-500" />
                  <span>Device: {selectedRecord.device || 'Office Biometric Terminal'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>IP Address: {selectedRecord.ip || '192.168.1.1 (TechNova Gateway)'}</span>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-3">
                <div className="font-semibold text-white text-xs">Day Timeline Log</div>
                <div className="space-y-3 pl-4 relative before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 text-xs">
                  {selectedRecord.timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-indigo-500" />
                      <div className="font-semibold text-slate-200">{item.label}</div>
                      <div className="text-[11px] text-slate-500">{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-6 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedRecord(null);
                  onNavigateToCorrections?.();
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Request Attendance Correction &rarr;
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
