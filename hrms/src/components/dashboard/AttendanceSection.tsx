'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { 
  ATTENDANCE_BREAKDOWN, 
  WEEKLY_ATTENDANCE_TREND, 
  ATTENDANCE_EMPLOYEES_LIST 
} from '@/lib/boss-dashboard-data';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Fingerprint, 
  ArrowRight, 
  UserCheck, 
  UserX, 
  Clock, 
  Home, 
  CalendarOff,
  ChevronRight
} from 'lucide-react';

export const AttendanceSection: React.FC = () => {
  const { setActivePath } = useOfficeOS();
  const [timeframe, setTimeframe] = useState<'Today' | 'This Week' | 'This Month'>('Today');

  const statusVariantMap = {
    Present: 'success',
    Late: 'warning',
    WFH: 'info',
    'On Leave': 'danger',
  } as const;

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title={
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <span>Today's Attendance & Shift Operations</span>
              <div className="text-xs font-normal text-slate-500 mt-0.5">
                Total 25 Staff &bull; 18 Present &bull; 4 Remote &bull; 3 Late &bull; 2 Absent
              </div>
            </div>
          </div>
        }
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['Today', 'This Week', 'This Month'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    timeframe === t
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivePath('/office/attendance')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View Full Attendance
            </Button>
          </div>
        }
      />

      <CardBody className="space-y-6">
        
        {/* Top: Attendance Breakdown Stats + Visual Progress Distribution Bar */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
              <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                <span>Present</span>
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300 mt-1">
                {ATTENDANCE_BREAKDOWN.present}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400/80">72% of workforce</div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-400 font-bold">
                <span>Work From Home</span>
                <Home className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-extrabold text-blue-800 dark:text-blue-300 mt-1">
                {ATTENDANCE_BREAKDOWN.wfh}
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400/80">Approved remote</div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
              <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-bold">
                <span>Late Arrival</span>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-extrabold text-amber-800 dark:text-amber-300 mt-1">
                {ATTENDANCE_BREAKDOWN.late}
              </div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400/80">Checked in after 09:15</div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
              <div className="flex items-center justify-between text-xs text-rose-700 dark:text-rose-400 font-bold">
                <span>Absent</span>
                <UserX className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-extrabold text-rose-800 dark:text-rose-300 mt-1">
                {ATTENDANCE_BREAKDOWN.absent}
              </div>
              <div className="text-[10px] text-rose-600 dark:text-rose-400/80">Unexcused</div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-xs text-purple-700 dark:text-purple-400 font-bold">
                <span>On Leave</span>
                <CalendarOff className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-extrabold text-purple-800 dark:text-purple-300 mt-1">
                {ATTENDANCE_BREAKDOWN.leave}
              </div>
              <div className="text-[10px] text-purple-600 dark:text-purple-400/80">Casual leave</div>
            </div>
          </div>

          {/* Visual Distribution Bar */}
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden p-0.5 gap-0.5">
            <div style={{ width: '72%' }} className="bg-emerald-500 rounded-l-full" title="Present (72%)" />
            <div style={{ width: '16%' }} className="bg-blue-500" title="WFH (16%)" />
            <div style={{ width: '12%' }} className="bg-amber-500" title="Late (12%)" />
            <div style={{ width: '8%' }} className="bg-rose-500" title="Absent (8%)" />
            <div style={{ width: '4%' }} className="bg-purple-500 rounded-r-full" title="On Leave (4%)" />
          </div>
        </div>

        {/* Middle: Weekly Attendance Trend Chart */}
        <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Weekly Attendance Trend (Mon - Fri)
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Present</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Late</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> WFH</span>
            </div>
          </div>

          {/* Clean CSS-rendered Bar Chart */}
          <div className="grid grid-cols-5 gap-3 h-28 items-end pt-4">
            {WEEKLY_ATTENDANCE_TREND.map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full max-w-[36px] flex items-end justify-center gap-0.5 h-20">
                  <div
                    style={{ height: `${(item.present / 25) * 100}%` }}
                    className="w-3 bg-emerald-500 rounded-t-sm"
                    title={`${item.present} Present`}
                  />
                  <div
                    style={{ height: `${(item.late / 25) * 100}%` }}
                    className="w-2 bg-amber-500 rounded-t-sm"
                    title={`${item.late} Late`}
                  />
                  <div
                    style={{ height: `${(item.wfh / 25) * 100}%` }}
                    className="w-2 bg-blue-500 rounded-t-sm"
                    title={`${item.wfh} WFH`}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Compact Employee Attendance Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Today's Key Employee Shift Roster
            </span>
            <span className="text-xs text-slate-400">Showing 5 key members</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Employee</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4">Check In</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Working Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {ATTENDANCE_EMPLOYEES_LIST.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg ${emp.avatarColor} text-white font-extrabold text-[10px] flex items-center justify-center shrink-0`}>
                          {emp.initials}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {emp.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {emp.department}
                    </td>

                    <td className="py-2.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {emp.checkIn}
                    </td>

                    <td className="py-2.5 px-4">
                      <Badge variant={statusVariantMap[emp.status]} size="sm">
                        {emp.status}
                      </Badge>
                    </td>

                    <td className="py-2.5 px-4 text-right text-slate-500 font-mono">
                      {emp.workingHours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </CardBody>
    </Card>
  );
};
