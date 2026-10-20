'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Building2, 
  Network, 
  Clock, 
  Edit, 
  MessageSquare, 
  Video, 
  CheckSquare, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  FolderGit2, 
  TrendingUp, 
  Sparkles,
  Download,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Award,
  Layers
} from 'lucide-react';
import { OfficeEmployee, INITIAL_EMPLOYEES } from '@/lib/office-module-data';

interface EmployeeProfileViewProps {
  employeeId: string;
  onBack: () => void;
  onNavigateToAttendance?: (empId: string) => void;
  showToast?: (title: string, desc?: string) => void;
}

export const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({
  employeeId,
  onBack,
  onNavigateToAttendance,
  showToast,
}) => {
  const employee = INITIAL_EMPLOYEES.find(e => e.id === employeeId) || INITIAL_EMPLOYEES[1]; // Rahul Sharma default
  const [activeTab, setActiveTab] = useState<'Overview' | 'Attendance' | 'Tasks' | 'Projects' | 'Time Tracking' | 'Leave' | 'Meetings' | 'Files' | 'Activity'>('Overview');

  const tabs = [
    'Overview',
    'Attendance',
    'Tasks',
    'Projects',
    'Time Tracking',
    'Leave',
    'Meetings',
    'Files',
    'Activity'
  ] as const;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Employees Directory</span>
      </button>

      {/* Profile Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative">
              <img 
                src={employee.avatar} 
                alt={employee.name} 
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-lg" 
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                employee.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{employee.name}</h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {employee.employeeId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {employee.status}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">{employee.role}</p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  {employee.department}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Network className="w-3.5 h-3.5 text-slate-500" />
                  {employee.team}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {employee.workLocation} ({employee.timezone})
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            <button
              onClick={() => showToast?.('Edit Employee', `Editing profile settings for ${employee.name}`)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => showToast?.('Message User', `Chat initiated with ${employee.name}`)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Message</span>
            </button>
            <button
              onClick={() => showToast?.('Schedule Call', `Scheduling 1-on-1 Google Meet sync with ${employee.name}`)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              <Video className="w-3.5 h-3.5 text-sky-400" />
              <span>Schedule</span>
            </button>
            <button
              onClick={() => showToast?.('Assign Task', `Opening task assignment modal for ${employee.name}`)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Assign Task</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-slate-800 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-semibold transition-all relative ${
                activeTab === tab
                  ? 'text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
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

      {/* Tab Contents */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Work & Contact Information */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                Work &amp; Professional Details
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Department</span>
                  <div className="font-semibold text-white mt-0.5">{employee.department}</div>
                </div>
                <div>
                  <span className="text-slate-400">Team</span>
                  <div className="font-semibold text-white mt-0.5">{employee.team}</div>
                </div>
                <div>
                  <span className="text-slate-400">Reporting Manager</span>
                  <div className="font-semibold text-white mt-0.5">{employee.manager}</div>
                </div>
                <div>
                  <span className="text-slate-400">Joining Date</span>
                  <div className="font-semibold text-white mt-0.5">{employee.joiningDate}</div>
                </div>
                <div>
                  <span className="text-slate-400">Employment Type</span>
                  <div className="font-semibold text-white mt-0.5">{employee.employmentType}</div>
                </div>
                <div>
                  <span className="text-slate-400">Shift</span>
                  <div className="font-semibold text-white mt-0.5">{employee.shift}</div>
                </div>
              </div>

              {/* Skills */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400 block mb-2 font-medium">Core Technical Stack &amp; Skills:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {employee.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Projects */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-indigo-400" />
                  Active Client Projects ({employee.currentProjects.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {employee.currentProjects.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{p.name}</h4>
                        <span className="text-[11px] text-indigo-400 font-medium">{p.role}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-300">{p.progress}%</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Target: {p.deadline}</span>
                      <span>{p.hoursLogged} logged</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Tasks */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                Active Assigned Tasks ({employee.currentTasks.length})
              </h3>

              <div className="space-y-2">
                {employee.currentTasks.map((t) => (
                  <div key={t.id} className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-slate-500" />
                      <div>
                        <div className="font-semibold text-white">{t.title}</div>
                        <span className="text-[11px] text-slate-400">Due: {t.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {t.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-700 text-slate-300">
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 text-xs">
              <h3 className="text-sm font-bold text-white">Contact Info</h3>
              <div className="space-y-2.5 text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>TechNova HQ, Floor 4, Ahmedabad</span>
                </div>
              </div>
            </div>

            {/* Attendance Summary Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-400" />
                  Attendance Summary
                </h3>
                <span className="text-xs text-slate-400">{employee.attendanceSummary.avgWorkingHours} avg/day</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-lg font-bold text-emerald-400">{employee.attendanceSummary.presentDays}</div>
                  <div className="text-[10px] text-emerald-400/80">Present</div>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-lg font-bold text-blue-400">{employee.attendanceSummary.wfhDays}</div>
                  <div className="text-[10px] text-blue-400/80">WFH</div>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="text-lg font-bold text-amber-400">{employee.attendanceSummary.lateDays}</div>
                  <div className="text-[10px] text-amber-400/80">Late</div>
                </div>
              </div>

              {/* Workload Progress */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Current Sprint Capacity</span>
                  <span className="font-bold text-white">{employee.workload}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      employee.workload >= 90 ? 'bg-rose-500' : employee.workload >= 75 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${employee.workload}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => onNavigateToAttendance?.(employee.id)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Full Attendance</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Leave Balance Overview */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Leave Balance</span>
                <span className="text-indigo-400 font-bold">{employee.leaveBalance.remaining} days left</span>
              </h3>

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2 bg-slate-800/40 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Annual Leave</span>
                  <strong className="text-white text-sm">{employee.leaveBalance.annual}</strong> days
                </div>
                <div className="p-2 bg-slate-800/40 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Sick Leave</span>
                  <strong className="text-white text-sm">{employee.leaveBalance.sick}</strong> days
                </div>
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-white">Recent Activities</h3>
              <div className="space-y-3 relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 text-xs">
                {employee.recentActivities.map((act) => (
                  <div key={act.id} className="relative">
                    <span className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-indigo-500" />
                    <div className="font-semibold text-white">{act.action}</div>
                    <div className="text-indigo-400 text-[11px]">{act.resource}</div>
                    <div className="text-slate-500 text-[10px] mt-0.5">{act.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'Attendance' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Attendance &amp; Shift Logs</h3>
              <p className="text-xs text-slate-400">Detailed punch-in timestamps, GPS location, and biometric sync records</p>
            </div>
            <button
              onClick={() => onNavigateToAttendance?.(employee.id)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
            >
              Open Full Attendance Dashboard
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Total Working Days</span>
              <div className="text-xl font-bold text-white mt-1">22</div>
            </div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Present Days</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">{employee.attendanceSummary.presentDays}</div>
            </div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Late Days</span>
              <div className="text-xl font-bold text-amber-400 mt-1">{employee.attendanceSummary.lateDays}</div>
            </div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">WFH Days</span>
              <div className="text-xl font-bold text-blue-400 mt-1">{employee.attendanceSummary.wfhDays}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'Tasks' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white">Assigned Sprint Tickets</h3>
          <div className="space-y-3">
            {employee.currentTasks.map((t) => (
              <div key={t.id} className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{t.title}</div>
                  <div className="text-slate-400 mt-0.5">Due: {t.dueDate}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 font-semibold">{t.priority}</span>
                  <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20 font-semibold">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'Projects' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white">Project Involvements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employee.currentProjects.map((p) => (
              <div key={p.id} className="p-5 bg-slate-800/40 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white">{p.name}</h4>
                    <span className="text-xs text-indigo-400">{p.role}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{p.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${p.progress}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Target Date: {p.deadline}</span>
                  <span>{p.hoursLogged} logged</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other tabs fallback container */}
      {['Time Tracking', 'Leave', 'Meetings', 'Files', 'Activity'].includes(activeTab) && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
          <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h4 className="font-bold text-slate-200 text-sm">{activeTab} Details for {employee.name}</h4>
          <p className="mt-1">All {activeTab.toLowerCase()} records are synchronized with the TechNova central database.</p>
        </div>
      )}
    </div>
  );
};
