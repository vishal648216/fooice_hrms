'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { 
  MONTHLY_TRENDS_2026, 
  DEPARTMENT_METRICS, 
  SCHEDULED_REPORTS, 
  ExecutiveReportSchedule 
} from '@/lib/analytics-data';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Plus, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Clock, 
  Mail, 
  FileSpreadsheet, 
  Sparkles,
  Filter
} from 'lucide-react';

export const ReportsOverviewView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [reportsList, setReportsList] = useState<ExecutiveReportSchedule[]>(SCHEDULED_REPORTS);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'Q3_2026' | 'YTD' | 'MONTHLY'>('Q3_2026');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // New Schedule Form State
  const [newTitle, setNewTitle] = useState('');
  const [newFrequency, setNewFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY'>('WEEKLY');
  const [newFormat, setNewFormat] = useState<'PDF' | 'EXCEL' | 'CSV'>('PDF');
  const [newEmail, setNewEmail] = useState('');

  const handleCreateReportSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReport: ExecutiveReportSchedule = {
      id: `rep-${Date.now()}`,
      title: newTitle,
      frequency: newFrequency,
      recipients: newEmail ? [newEmail] : ['executive-team@apextech.io'],
      lastGenerated: 'Just now',
      format: newFormat,
      status: 'ACTIVE',
    };

    setReportsList(prev => [newReport, ...prev]);
    setIsScheduleModalOpen(false);
    setNewTitle('');
    setNewEmail('');
    addToast({
      title: 'Report Schedule Created',
      description: `Automated ${newFrequency.toLowerCase()} dispatch configured.`,
      type: 'success',
    });
  };

  const handleInstantExport = (format: 'PDF' | 'CSV' | 'EXCEL') => {
    addToast({
      title: `Generated ${format} Executive Report`,
      description: `Full Q3 2026 analytical snapshot downloaded to your device.`,
      type: 'success',
    });
  };

  const handleTriggerReport = (title: string) => {
    addToast({
      title: 'Report Dispatched',
      description: `Sent "${title}" to subscribed recipients.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Timeline:</span>
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
            {[
              { id: 'Q3_2026', label: 'Q3 (Jul - Sep 2026)' },
              { id: 'YTD', label: 'YTD 2026' },
              { id: 'MONTHLY', label: 'Current Month' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTimeRange(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  selectedTimeRange === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Export Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={() => handleInstantExport('CSV')} className="flex-1 sm:flex-initial">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleInstantExport('PDF')} className="flex-1 sm:flex-initial">
            <FileText className="w-3.5 h-3.5 text-rose-500" /> Download PDF
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsScheduleModalOpen(true)} className="flex-1 sm:flex-initial">
            <Plus className="w-3.5 h-3.5" /> Schedule Report
          </Button>
        </div>
      </div>

      {/* KPI Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="p-4 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Q3 Revenue</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            ₹38.20L
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> +14.8% vs Q2 2026
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Net Operating Margin</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            49.7%
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            ₹19.00L Net Profit
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-cyan-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Tasks Shipped</span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            574
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
            96.4% On-time delivery
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Avg Attendance Rate</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            96.2%
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            148 Active Org Members
          </div>
        </Card>

      </div>

      {/* Monthly Revenue vs Expense Visual Chart */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Monthly Revenue vs Operating Expenses Trend (2026)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inward client revenue receipts mapped against operational cost centers
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-600 inline-block" /> Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-400 dark:bg-slate-600 inline-block" /> Expenses
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Profit Margin
            </span>
          </div>
        </div>

        {/* Bar Graph Visualizer */}
        <div className="grid grid-cols-9 gap-3 pt-4 items-end min-h-[220px]">
          {MONTHLY_TRENDS_2026.map((m) => (
            <div key={m.month} className="flex flex-col items-center gap-2 group">
              <div className="w-full flex items-end justify-center gap-1 h-44 bg-slate-50 dark:bg-slate-900/60 rounded-xl p-1 relative border border-slate-200/60 dark:border-slate-800">
                {/* Revenue Bar */}
                <div
                  className="w-1/2 bg-indigo-600 rounded-t transition-all group-hover:bg-indigo-500"
                  style={{ height: `${(m.revenue / 15) * 100}%` }}
                  title={`Revenue: ₹${m.revenue}L`}
                />
                {/* Expenses Bar */}
                <div
                  className="w-1/2 bg-slate-400 dark:bg-slate-600 rounded-t transition-all group-hover:bg-slate-300"
                  style={{ height: `${(m.expenses / 15) * 100}%` }}
                  title={`Expenses: ₹${m.expenses}L`}
                />
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-full">
                {m.month.split(' ')[0]}
              </div>
              <div className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">
                +₹{m.profit}L
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Department Breakdown & Scheduled Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Productivity & Capacity */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-500" />
              Department Operational Efficiency
            </h3>
            <Badge variant="primary" size="sm">6 Departments</Badge>
          </div>

          <div className="space-y-3.5">
            {DEPARTMENT_METRICS.map((dept) => (
              <div key={dept.name} className="space-y-1.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dept.color }} />
                    <span className="font-bold text-slate-900 dark:text-slate-100">{dept.name}</span>
                    <span className="text-[11px] text-slate-400">({dept.headcount} members)</span>
                  </div>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {dept.productivityIndex}% Index
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${dept.productivityIndex}%`, backgroundColor: dept.color }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Budget Utilized: {dept.budgetUtilization}%</span>
                  <span>Tasks Completed: {dept.tasksCount}</span>
                  <span>Attendance: {dept.attendanceAverage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Scheduled Executive Reports */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-500" />
              Automated Scheduled Executive Reports
            </h3>
            <Button variant="outline" size="sm" onClick={() => setIsScheduleModalOpen(true)}>
              + Schedule
            </Button>
          </div>

          <div className="space-y-3">
            {reportsList.map((rep) => (
              <div
                key={rep.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:border-indigo-500 transition"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs shrink-0">
                    {rep.format === 'PDF' ? <FileText className="w-4 h-4 text-rose-500" /> : <FileSpreadsheet className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {rep.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{rep.frequency}</span>
                      <span>•</span>
                      <span>Last: {rep.lastGenerated}</span>
                      <span>•</span>
                      <span>{rep.recipients.length} Recipient(s)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTriggerReport(rep.title)}
                    className="text-[10px] h-7 px-2"
                  >
                    Send Now
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInstantExport(rep.format)}
                    className="h-7 w-7 p-0"
                    title="Download Report File"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Schedule Report Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Plus className="w-4 h-4" /> Schedule Automated Executive Report
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReportSchedule} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Executive Board Summary"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Frequency</label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="DAILY">Daily (9 AM)</option>
                    <option value="WEEKLY">Weekly (Monday 8 AM)</option>
                    <option value="MONTHLY">Monthly (1st of month)</option>
                    <option value="QUARTERLY">Quarterly</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">File Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="PDF">PDF Executive Document</option>
                    <option value="EXCEL">Excel Spreadsheet (.xlsx)</option>
                    <option value="CSV">Raw CSV Data</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Recipient Email(s)</label>
                <input
                  type="email"
                  placeholder="v.singhania@apextech.io"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsScheduleModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
