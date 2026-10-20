'use client';

import React, { useState } from 'react';
import { 
  Palmtree, 
  Plus, 
  Calendar, 
  List, 
  Edit, 
  Trash2, 
  X, 
  Clock, 
  CalendarDays,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { HolidayItem, INITIAL_HOLIDAYS } from '@/lib/office-module-data';

interface HolidaysViewProps {
  showToast?: (title: string, desc?: string) => void;
}

export const HolidaysView: React.FC<HolidaysViewProps> = ({
  showToast,
}) => {
  const [holidays, setHolidays] = useState<HolidayItem[]>(INITIAL_HOLIDAYS);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<HolidayItem | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDate, setFormDate] = useState('2026-10-02');
  const [formType, setFormType] = useState<HolidayItem['type']>('Public Holiday');
  const [formDescription, setFormDescription] = useState('');

  const handleSaveHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    if (editingHoliday) {
      setHolidays(prev => prev.map(h => h.id === editingHoliday.id ? {
        ...h,
        name: formName,
        date: formDate,
        type: formType,
        description: formDescription,
      } : h));
      showToast?.('Holiday Updated', `${formName} calendar details updated.`);
      setEditingHoliday(null);
    } else {
      const created: HolidayItem = {
        id: `hol-${Date.now()}`,
        name: formName,
        date: formDate,
        day: 'Scheduled',
        type: formType,
        description: formDescription || 'Official company recognized observance.',
        applicableTeams: 'All Teams (Company-wide)',
        status: 'Upcoming'
      };
      setHolidays([...holidays, created]);
      showToast?.('Holiday Added', `${formName} added to 2026 holiday calendar.`);
    }

    setIsAddModalOpen(false);
    setFormName('');
    setFormDescription('');
  };

  const handleDelete = (id: string, name: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
    showToast?.('Holiday Removed', `${name} removed from holiday calendar.`);
  };

  const openEdit = (h: HolidayItem) => {
    setEditingHoliday(h);
    setFormName(h.name);
    setFormDate(h.date);
    setFormType(h.type);
    setFormDescription(h.description);
    setIsAddModalOpen(true);
  };

  const getTypeBadge = (type: HolidayItem['type']) => {
    switch (type) {
      case 'Public Holiday':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Public Holiday</span>;
      case 'Company Holiday':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Company Holiday</span>;
      case 'Optional Holiday':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Optional Holiday</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Palmtree className="w-7 h-7 text-emerald-400" />
            Holidays
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official company holiday schedule, festive calendar, and mandatory office shutdowns for 2026.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle List/Calendar */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded ${viewMode === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Calendar View"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              setEditingHoliday(null);
              setFormName('');
              setFormDescription('');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Holiday</span>
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">Total Holidays (2026)</span>
          <div className="text-2xl font-bold text-white mt-1">{holidays.length}</div>
        </div>
        <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">Public Holidays</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {holidays.filter(h => h.type === 'Public Holiday').length}
          </div>
        </div>
        <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">Company Observances</span>
          <div className="text-2xl font-bold text-indigo-400 mt-1">
            {holidays.filter(h => h.type === 'Company Holiday').length}
          </div>
        </div>
        <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400">Upcoming This Year</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {holidays.filter(h => h.status === 'Upcoming').length}
          </div>
        </div>
      </div>

      {/* Main View: List or Calendar */}
      {viewMode === 'list' ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 uppercase text-[11px] font-semibold text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Holiday Observance</th>
                  <th className="py-3.5 px-3">Date &amp; Day</th>
                  <th className="py-3.5 px-3">Type</th>
                  <th className="py-3.5 px-3">Description</th>
                  <th className="py-3.5 px-3">Applicable Teams</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {holidays.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <Palmtree className="w-4 h-4 text-emerald-400" />
                      <span>{h.name}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-200">
                      <strong>{h.date}</strong> ({h.day})
                    </td>
                    <td className="py-3.5 px-3">{getTypeBadge(h.type)}</td>
                    <td className="py-3.5 px-3 text-slate-400 max-w-[250px] truncate" title={h.description}>
                      {h.description}
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">{h.applicableTeams}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        h.status === 'Upcoming' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(h)}
                          title="Edit"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(h.id, h.name)}
                          title="Delete"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Calendar View of Holidays */
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-400" />
            2026 Scheduled Holiday Dates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {holidays.map((h) => (
              <div key={h.id} className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div className="font-bold text-white text-sm">{h.name}</div>
                  {getTypeBadge(h.type)}
                </div>
                <div className="text-emerald-400 font-semibold">{h.date} ({h.day})</div>
                <p className="text-slate-400 text-[11px]">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Holiday Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Palmtree className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {editingHoliday ? 'Edit Holiday' : 'Add Corporate Holiday'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure company shutdown date</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHoliday} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Holiday Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Holiday"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  >
                    <option value="Public Holiday">Public Holiday</option>
                    <option value="Company Holiday">Company Holiday</option>
                    <option value="Optional Holiday">Optional Holiday</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Description</label>
                <textarea
                  rows={3}
                  placeholder="Celebration details or notes..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/20"
                >
                  {editingHoliday ? 'Update Holiday' : 'Save Holiday'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
