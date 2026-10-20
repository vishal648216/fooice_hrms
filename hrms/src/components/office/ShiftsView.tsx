'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Settings, 
  Edit, 
  UserCheck, 
  ShieldCheck, 
  Calendar, 
  X, 
  Check, 
  Sliders, 
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react';
import { ShiftItem, OfficePolicies, INITIAL_SHIFTS, INITIAL_POLICIES } from '@/lib/office-module-data';

interface ShiftsViewProps {
  showToast?: (title: string, desc?: string) => void;
}

export const ShiftsView: React.FC<ShiftsViewProps> = ({
  showToast,
}) => {
  const [shifts, setShifts] = useState<ShiftItem[]>(INITIAL_SHIFTS);
  const [policies, setPolicies] = useState<OfficePolicies>(INITIAL_POLICIES);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftItem | null>(null);

  // Shift form
  const [shiftName, setShiftName] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('06:00 PM');
  const [breakDuration, setBreakDuration] = useState('60 minutes');
  const [gracePeriod, setGracePeriod] = useState('10 minutes');

  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftName) return;

    if (editingShift) {
      setShifts(prev => prev.map(s => s.id === editingShift.id ? {
        ...s,
        name: shiftName,
        startTime,
        endTime,
        breakDuration,
        gracePeriod,
      } : s));
      showToast?.('Shift Updated', `${shiftName} timing parameters updated.`);
      setEditingShift(null);
    } else {
      const created: ShiftItem = {
        id: `sh-${Date.now()}`,
        name: shiftName,
        startTime,
        endTime,
        breakDuration,
        workingHours: '8 hours',
        gracePeriod,
        overtimeRule: 'Overtime kicks in after 8.5 hours',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        assignedEmployeesCount: 1
      };
      setShifts([...shifts, created]);
      showToast?.('Shift Created', `${shiftName} added to active schedule.`);
    }

    setIsShiftModalOpen(false);
    setShiftName('');
  };

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    showToast?.('Policies Saved', 'Office attendance, grace period, and overtime policies updated.');
  };

  const openEdit = (s: ShiftItem) => {
    setEditingShift(s);
    setShiftName(s.name);
    setStartTime(s.startTime);
    setEndTime(s.endTime);
    setBreakDuration(s.breakDuration);
    setGracePeriod(s.gracePeriod);
    setIsShiftModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-indigo-400" />
            Shift Management &amp; Office Policies
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure working hours, shift rotations, grace periods, overtime thresholds, and attendance rules.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingShift(null);
            setShiftName('');
            setIsShiftModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Create Shift</span>
        </button>
      </div>

      {/* Shifts Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>Active Shift Rosters</span>
          <span className="text-xs font-normal text-slate-400">({shifts.length} configured)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shifts.map((s) => (
            <div
              key={s.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{s.name}</h3>
                    <div className="text-indigo-400 font-semibold text-xs mt-0.5 font-mono">
                      {s.startTime} - {s.endTime}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {s.assignedEmployeesCount} Staff Assigned
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Break Duration</span>
                    <strong className="text-slate-200">{s.breakDuration}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Grace Period</span>
                    <strong className="text-amber-400">{s.gracePeriod}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 mt-2">
                  <span>Overtime: {s.overtimeRule}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Mon - Fri</span>
                <button
                  onClick={() => openEdit(s)}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Parameters</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Office Policies Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-teal-400" />
              Corporate Attendance &amp; Operational Policies
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Governing compliance rules enforced during daily employee check-ins and overtime calculations
            </p>
          </div>

          <button
            onClick={handleSavePolicies}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/20"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Policies</span>
          </button>
        </div>

        <form onSubmit={handleSavePolicies} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          {/* Late & Grace Policy */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-white">Grace Period &amp; Late Policy</h4>
            <div>
              <label className="text-slate-400 block mb-1">Grace Period (Minutes)</label>
              <input
                type="number"
                value={policies.gracePeriodMinutes}
                onChange={(e) => setPolicies({ ...policies, gracePeriodMinutes: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Punch-in within 10m is marked Present</span>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Late Flagged After</label>
              <input
                type="number"
                value={policies.lateThresholdMinutes}
                onChange={(e) => setPolicies({ ...policies, lateThresholdMinutes: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Working Hours & Overtime */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-white">Working Hours &amp; Overtime</h4>
            <div>
              <label className="text-slate-400 block mb-1">Mandatory Hours / Day</label>
              <input
                type="number"
                value={policies.workingHoursPerDay}
                onChange={(e) => setPolicies({ ...policies, workingHoursPerDay: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Overtime Starts After</label>
              <input
                type="number"
                value={policies.overtimeThresholdHours}
                onChange={(e) => setPolicies({ ...policies, overtimeThresholdHours: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Recorded in monthly payroll timesheet</span>
            </div>
          </div>

          {/* Breaks & Remote WFH Policy */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-white">Breaks &amp; Verification</h4>
            <div>
              <label className="text-slate-400 block mb-1">Maximum Break Duration</label>
              <input
                type="number"
                value={policies.maxBreakMinutes}
                onChange={(e) => setPolicies({ ...policies, maxBreakMinutes: Number(e.target.value) })}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Minutes allowed per active work shift</span>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={policies.requireLocationForWFH}
                  onChange={(e) => setPolicies({ ...policies, requireLocationForWFH: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700"
                />
                <span>Require Geo-location verification for WFH</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* Shift Modal */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {editingShift ? 'Edit Shift Schedule' : 'Create New Shift'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure shift hours and grace allowances</p>
                </div>
              </div>
              <button
                onClick={() => setIsShiftModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Shift Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Support Shift"
                  value={shiftName}
                  onChange={(e) => setShiftName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Break Duration</label>
                  <input
                    type="text"
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Grace Period</label>
                  <input
                    type="text"
                    value={gracePeriod}
                    onChange={(e) => setGracePeriod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsShiftModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  {editingShift ? 'Save Changes' : 'Create Shift'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
