'use client';

import React, { useState } from 'react';
import { ATTENDANCE_HEATMAP_DATA, DEPARTMENT_METRICS } from '@/lib/analytics-data';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Users, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Home, 
  AlertCircle, 
  TrendingUp,
  Flame
} from 'lucide-react';

export const AttendanceAnalyticsView: React.FC = () => {
  const [hoveredDay, setHoveredDay] = useState<any | null>(null);

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 4: return 'bg-emerald-500 hover:bg-emerald-400';
      case 3: return 'bg-emerald-600 hover:bg-emerald-500';
      case 2: return 'bg-emerald-700/70 hover:bg-emerald-600';
      case 1: return 'bg-amber-600 hover:bg-amber-500';
      default: return 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-700'; // Weekend
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Telemetry KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="p-4 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Monthly Attendance Rate</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            96.8%
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +1.2% vs last month
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Average Daily Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            142 / 148
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Active in-office employees
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-cyan-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Work From Home (WFH)</span>
            <Home className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            4.2 Daily Avg
          </div>
          <div className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
            Approved hybrid shift policies
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Average Punctuality</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            9:14 AM
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            Within 15m grace period
          </div>
        </Card>

      </div>

      {/* 30-Day Attendance Heatmap Calendar Grid */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              September 2026 Daily Org Attendance Heatmap
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hover over any day tile to inspect daily presence, late arrivals, and remote WFH telemetry
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Weekend</span>
            <span className="w-3 h-3 rounded-xs bg-slate-800" />
            <span className="w-3 h-3 rounded-xs bg-emerald-700" />
            <span className="w-3 h-3 rounded-xs bg-emerald-600" />
            <span className="w-3 h-3 rounded-xs bg-emerald-500" />
            <span>100% Present</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2.5 pt-2">
          {ATTENDANCE_HEATMAP_DATA.map((day) => (
            <div
              key={day.date}
              onMouseEnter={() => setHoveredDay(day)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 cursor-pointer transition hover:scale-105 hover:border-emerald-500"
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase">
                {day.date.split('-')[2]} Sept
              </div>
              <div
                className={`w-full h-8 rounded-lg transition-all ${getHeatmapColor(day.healthLevel)}`}
              />
              <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400">
                {day.healthLevel === 0 ? 'Off' : `${day.presentCount} In`}
              </div>
            </div>
          ))}
        </div>

        {/* Hover Inspector Box */}
        {hoveredDay && hoveredDay.healthLevel > 0 && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-xs flex items-center justify-between animate-in fade-in duration-100">
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-900 dark:text-white">
                📅 {hoveredDay.date} ({hoveredDay.dayOfWeek}):
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ {hoveredDay.presentCount} Present
              </span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                🏠 {hoveredDay.wfhCount} WFH
              </span>
              <span className="text-rose-500 font-bold">
                ✕ {hoveredDay.absentCount} Absent
              </span>
            </div>
            <span className="text-amber-500 font-bold">
              ⏱️ {hoveredDay.lateCount} Late Clock-ins
            </span>
          </div>
        )}
      </Card>

      {/* Department Breakdown */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            Department Attendance Reliability Ratio
          </h3>
          <Badge variant="primary" size="sm">Org Wide: 96.8%</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {DEPARTMENT_METRICS.map((dept) => (
            <div
              key={dept.name}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: dept.color }}
                >
                  {dept.headcount}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{dept.name}</div>
                  <div className="text-[10px] text-slate-400">{dept.headcount} Employees Active</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {dept.attendanceAverage}%
                </div>
                <div className="text-[10px] text-slate-400">Punctuality Score</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};
