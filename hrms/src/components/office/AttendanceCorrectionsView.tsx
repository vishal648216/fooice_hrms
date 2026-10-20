'use client';

import React, { useState } from 'react';
import { 
  FileEdit, 
  Check, 
  X, 
  Clock, 
  AlertCircle, 
  FileText, 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  HelpCircle,
  Calendar,
  User
} from 'lucide-react';
import { AttendanceCorrection, INITIAL_CORRECTIONS } from '@/lib/office-module-data';

interface AttendanceCorrectionsViewProps {
  onBackToAttendance: () => void;
  showToast?: (title: string, desc?: string) => void;
}

export const AttendanceCorrectionsView: React.FC<AttendanceCorrectionsViewProps> = ({
  onBackToAttendance,
  showToast,
}) => {
  const [corrections, setCorrections] = useState<AttendanceCorrection[]>(INITIAL_CORRECTIONS);
  const [selectedCorrection, setSelectedCorrection] = useState<AttendanceCorrection | null>(null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleApprove = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCorrections(prev => prev.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
    showToast?.('Correction Approved', 'Attendance punch record has been updated.');
    if (selectedCorrection?.id === id) {
      setSelectedCorrection(prev => prev ? { ...prev, status: 'Approved' } : null);
    }
  };

  const handleReject = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCorrections(prev => prev.map(c => c.id === id ? { ...c, status: 'Rejected' } : c));
    showToast?.('Correction Rejected', 'The attendance correction request was rejected.');
    if (selectedCorrection?.id === id) {
      setSelectedCorrection(prev => prev ? { ...prev, status: 'Rejected' } : null);
    }
  };

  const filtered = corrections.filter((item) => {
    const matchesSearch = item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Back button */}
      <button
        onClick={onBackToAttendance}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Attendance Overview</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileEdit className="w-7 h-7 text-indigo-400" />
            Attendance Corrections
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review and authorize punch-in adjustments, missed checkout corrections, and overtime logs.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800 rounded-lg p-1 text-xs">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterStatus === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 uppercase text-[11px] font-semibold text-slate-400 tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-3">Original Record</th>
                <th className="py-3.5 px-3">Requested Change</th>
                <th className="py-3.5 px-3">Reason</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Created</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedCorrection(item)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.employeeName}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 font-medium">{item.date}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-400">{item.originalRecord}</td>
                  <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">{item.requestedChange}</td>
                  <td className="py-3.5 px-3 text-slate-300 max-w-[200px] truncate" title={item.reason}>
                    {item.reason}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                      item.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : item.status === 'Rejected'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 text-[11px]">{item.created}</td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    {item.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => handleReject(item.id, e)}
                          title="Reject"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleApprove(item.id, e)}
                          title="Approve"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCorrection && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-base">Correction Request Review</h3>
                  <p className="text-xs text-slate-400">{selectedCorrection.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCorrection(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400">Employee</span>
                  <div className="font-bold text-white mt-0.5">{selectedCorrection.employeeName}</div>
                </div>
                <div>
                  <span className="text-slate-400">Submitted At</span>
                  <div className="font-medium text-slate-300 mt-0.5">{selectedCorrection.created}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Original Record:</span>
                  <span className="font-mono text-slate-300">{selectedCorrection.originalRecord}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                  <span className="text-emerald-400 font-semibold">Requested Change:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedCorrection.requestedChange}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Reason for Adjustment</span>
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200 leading-relaxed">
                  {selectedCorrection.reason}
                </div>
              </div>

              {selectedCorrection.evidence && (
                <div>
                  <span className="text-slate-400 block mb-1">Attached Evidence</span>
                  <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 text-slate-300 font-mono text-[11px]">
                    {selectedCorrection.evidence}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  showToast?.('Clarification Requested', `Message sent to ${selectedCorrection.employeeName}`);
                  setSelectedCorrection(null);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                Request Clarification
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCorrection(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
                {selectedCorrection.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleReject(selectedCorrection.id)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedCorrection.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Correction</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
