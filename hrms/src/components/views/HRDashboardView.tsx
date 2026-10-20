'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_ATTENDANCE } from '@/lib/officeos-data';
import { 
  Users, 
  Fingerprint, 
  CalendarOff, 
  Palmtree, 
  Check, 
  X, 
  ArrowRight, 
  UserPlus, 
  Clock,
  Sparkles,
  Building
} from 'lucide-react';

export const HRDashboardView: React.FC = () => {
  const { leaveRequests, approveLeaveRequest, setActivePath, setQuickCreateOpen } = useOfficeOS();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HR Header Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/40 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase text-purple-300">
              <Users className="w-3.5 h-3.5" />
              <span>HR OPERATIONS & TALENT WORKSPACE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              People & Workplace Operations Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Manage company attendance records, review employee leave requests, manage departments, and coordinate staff onboarding.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setActivePath('/office/employees')}
              leftIcon={<Users className="w-4 h-4" />}
            >
              Staff Directory
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setQuickCreateOpen(true)}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Add Employee
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Total Headcount</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">148 Employees</div>
          <div className="text-xs text-emerald-600 mt-1 font-semibold">Across 6 engineering departments</div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Today's Attendance</span>
            <Fingerprint className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">94.2% Present</div>
          <div className="text-xs text-slate-500 mt-1">138 punched in • 3 late • 7 on leave</div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Pending Leaves</span>
            <CalendarOff className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">
            {leaveRequests.filter(l => l.status === 'PENDING').length} Requests
          </div>
          <div className="text-xs text-slate-500 mt-1">Requires HR Manager approval</div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Upcoming Holiday</span>
            <Palmtree className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-2">Oct 2 &bull; National Holiday</div>
          <div className="text-xs text-slate-500 mt-1">Paid company day off</div>
        </Card>
      </div>

      {/* Two Column: Pending Leave Approvals & Today's Attendance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Leave Requests */}
        <Card>
          <CardHeader
            title="Pending Employee Leave Requests"
            subtitle="Review vacation, casual, and medical leave applications"
          />
          <CardBody className="space-y-3">
            {leaveRequests.map((lr) => (
              <div
                key={lr.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {lr.employeeName}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-2">
                      ({lr.department})
                    </span>
                  </div>
                  <Badge variant={lr.status === 'APPROVED' ? 'success' : 'warning'} size="sm">
                    {lr.status}
                  </Badge>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>{lr.leaveType} LEAVE:</strong> {lr.startDate} to {lr.endDate} ({lr.days} days)
                  <p className="text-[11px] text-slate-400 mt-0.5 italic">"{lr.reason}"</p>
                </div>

                {lr.status === 'PENDING' && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <button
                      onClick={() => approveLeaveRequest(lr.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-1 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Leave
                    </button>
                  </div>
                )}
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Live Attendance List */}
        <Card>
          <CardHeader
            title="Today's Employee Punch-In List"
            subtitle="Real-time check-ins and shift logging"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActivePath('/office/attendance')}>
                View Full Sheet &rarr;
              </Button>
            }
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3 pl-5">Employee</th>
                    <th className="p-3">Clock In</th>
                    <th className="p-3">Total Time</th>
                    <th className="p-3 pr-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {MOCK_ATTENDANCE.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3 pl-5 font-bold text-slate-900 dark:text-white">{att.employeeName}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 font-semibold">{att.clockIn}</td>
                      <td className="p-3 text-slate-500">{att.totalHours}</td>
                      <td className="p-3 pr-5 text-right">
                        <Badge variant={att.status === 'ON_TIME' ? 'success' : 'warning'} size="sm">
                          {att.status.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

      </div>

    </div>
  );
};
