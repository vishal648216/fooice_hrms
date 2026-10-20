'use client';

import React, { useState, useEffect } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { MOCK_TIMESHEET_ENTRIES, EXTENDED_PROJECTS, EXTENDED_TASKS, TimesheetEntry } from '@/lib/projects-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Send,
  Timer
} from 'lucide-react';

export const TimesheetsView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [entries, setEntries] = useState<TimesheetEntry[]>(MOCK_TIMESHEET_ENTRIES);
  const [selectedTaskForTimer, setSelectedTaskForTimer] = useState(EXTENDED_TASKS[0].id);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(4820); // 1h 20m 20s
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual Log Form State
  const [manualTaskId, setManualTaskId] = useState(EXTENDED_TASKS[0].id);
  const [manualHours, setManualHours] = useState(3.5);
  const [manualDate, setManualDate] = useState('2026-09-29');
  const [manualBillable, setManualBillable] = useState(true);
  const [manualNotes, setManualNotes] = useState('');

  // Live Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopAndSaveTimer = () => {
    setIsTimerRunning(false);
    const activeTask = EXTENDED_TASKS.find(t => t.id === selectedTaskForTimer) || EXTENDED_TASKS[0];
    const loggedHrs = Math.round((timerSeconds / 3600) * 10) / 10;

    const newEntry: TimesheetEntry = {
      id: `ts-${Date.now()}`,
      userId: 'usr-3',
      userName: 'Arjun Nambiar',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      userRole: 'Lead Full-Stack Engineer',
      projectId: activeTask.projectId,
      projectName: activeTask.projectName,
      taskId: activeTask.id,
      taskTitle: activeTask.title,
      date: new Date().toISOString().split('T')[0],
      hours: loggedHrs,
      billable: true,
      hourlyRate: 110,
      notes: `Live active session recorded on ${activeTask.code}`,
      status: 'PENDING'
    };

    setEntries(prev => [newEntry, ...prev]);
    setTimerSeconds(0);
    addToast({
      title: 'Time Log Saved',
      description: `Logged ${loggedHrs}h to ${activeTask.code}`,
      type: 'success'
    });
  };

  const handleCreateManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    const task = EXTENDED_TASKS.find(t => t.id === manualTaskId) || EXTENDED_TASKS[0];

    const newEntry: TimesheetEntry = {
      id: `ts-${Date.now()}`,
      userId: 'usr-3',
      userName: 'Arjun Nambiar',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      userRole: 'Lead Full-Stack Engineer',
      projectId: task.projectId,
      projectName: task.projectName,
      taskId: task.id,
      taskTitle: task.title,
      date: manualDate,
      hours: Number(manualHours),
      billable: manualBillable,
      hourlyRate: 110,
      notes: manualNotes || 'Standard development tasks.',
      status: 'PENDING'
    };

    setEntries(prev => [newEntry, ...prev]);
    setShowManualModal(false);
    setManualNotes('');
    addToast({
      title: 'Manual Time Registered',
      description: `Logged ${manualHours}h for ${manualDate}`,
      type: 'success'
    });
  };

  // KPIs
  const totalHoursWeek = entries.reduce((acc, e) => acc + e.hours, 0);
  const billableHours = entries.filter(e => e.billable).reduce((acc, e) => acc + e.hours, 0);
  const billablePercent = totalHoursWeek > 0 ? Math.round((billableHours / totalHoursWeek) * 100) : 0;
  const totalRevenue = entries.filter(e => e.billable).reduce((acc, e) => acc + (e.hours * e.hourlyRate), 0);

  const daysOfWeek = ['Mon 09/22', 'Tue 09/23', 'Wed 09/24', 'Thu 09/25', 'Fri 09/26', 'Sat 09/27', 'Sun 09/28'];

  return (
    <div className="space-y-6">
      {/* Top Stopwatch Widget & Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live Stopwatch Card */}
        <Card className="p-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white border-indigo-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-200">Active Task Stopwatch</span>
            </div>
            {isTimerRunning && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800 animate-pulse">
                ● Recording Live
              </span>
            )}
          </div>

          {/* Clock Display */}
          <div className="text-center py-2">
            <div className="text-4xl font-extrabold font-mono tracking-wider text-white">
              {formatTimer(timerSeconds)}
            </div>
            <div className="text-xs text-indigo-300/80 mt-1">
              Hourly Rate: <span className="font-mono font-bold text-white">$110.00 / hr</span> (Billable)
            </div>
          </div>

          {/* Task Selector */}
          <div className="space-y-1 text-xs">
            <label className="text-[11px] text-indigo-200 font-semibold">Active Work Item:</label>
            <select
              value={selectedTaskForTimer}
              onChange={(e) => setSelectedTaskForTimer(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-800/90 border border-indigo-700 text-xs text-white focus:outline-none"
            >
              {EXTENDED_TASKS.map(t => (
                <option key={t.id} value={t.id}>{t.code} — {t.title}</option>
              ))}
            </select>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-2 pt-1">
            {!isTimerRunning ? (
              <Button
                variant="primary"
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 border-none"
                onClick={() => setIsTimerRunning(true)}
                leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
              >
                Start Timer
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 bg-amber-600 hover:bg-amber-700 border-none text-white"
                onClick={() => setIsTimerRunning(false)}
                leftIcon={<Pause className="w-3.5 h-3.5 fill-current" />}
              >
                Pause Timer
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="text-white border-slate-700 hover:bg-slate-800"
              onClick={handleStopAndSaveTimer}
              disabled={timerSeconds === 0}
            >
              Save & Log
            </Button>
          </div>
        </Card>

        {/* Weekly Productivity & Billable KPIs */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">Weekly Total Hours</span>
            <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">
              {totalHoursWeek.toFixed(1)} hrs
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              Target: 40.0 hrs / week (100% capacity)
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">Billable Ratio</span>
            <div className="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-2">
              {billablePercent}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {billableHours.toFixed(1)} billable / {(totalHoursWeek - billableHours).toFixed(1)} internal
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-medium">Billable Value Generated</span>
            <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Auto-invoiced on monthly billing cycle
            </div>
          </Card>
        </div>
      </div>

      {/* Timesheet Table & Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Logged Timesheet Entries</h3>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                addToast({ title: 'Timesheet Submitted', description: 'Sent to manager for approval.', type: 'success' });
              }}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Submit Timesheet
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowManualModal(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Manual Entry
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Project & Task</th>
                  <th className="p-3.5">Work Notes</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5 font-mono">Hours</th>
                  <th className="p-3.5 font-mono">Amount</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-mono font-medium text-slate-500">{entry.date}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{entry.taskTitle}</div>
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400">{entry.projectName}</div>
                    </td>
                    <td className="p-3.5 text-slate-500 max-w-xs truncate">{entry.notes}</td>
                    <td className="p-3.5">
                      <Badge variant={entry.billable ? 'success' : 'neutral'} size="sm">
                        {entry.billable ? 'Billable' : 'Internal'}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">{entry.hours} hrs</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${(entry.hours * entry.hourlyRate).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={entry.status === 'APPROVED' ? 'success' : 'warning'} size="sm">
                        {entry.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Manual Time Entry Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Log Manual Work Time</h3>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualLog} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Target Task</label>
                <select
                  value={manualTaskId}
                  onChange={(e) => setManualTaskId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {EXTENDED_TASKS.map(t => (
                    <option key={t.id} value={t.id}>{t.code} — {t.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Date Worked</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="24"
                    value={manualHours}
                    onChange={(e) => setManualHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="billableCheck"
                  checked={manualBillable}
                  onChange={(e) => setManualBillable(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="billableCheck" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Billable to client invoice ($110.00 / hr)
                </label>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Work Description / Deliverables</label>
                <textarea
                  rows={3}
                  placeholder="Summary of commits, bug fixes, or design iterations..."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowManualModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Timesheet Entry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
