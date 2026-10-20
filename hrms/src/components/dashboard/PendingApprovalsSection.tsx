'use client';

import React, { useState } from 'react';
import { 
  FileCheck2, 
  Check, 
  X, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  FileText,
  DollarSign,
  Layers,
  Sparkles
} from 'lucide-react';
import { PENDING_APPROVALS_LIST, PendingApprovalItem } from '@/lib/boss-dashboard-data';

interface PendingApprovalsSectionProps {
  onApprove?: (approvalId: string) => void;
  onReject?: (approvalId: string) => void;
  onViewDetails?: (item: PendingApprovalItem) => void;
}

export const PendingApprovalsSection: React.FC<PendingApprovalsSectionProps> = ({
  onApprove,
  onReject,
  onViewDetails,
}) => {
  const [approvals, setApprovals] = useState(PENDING_APPROVALS_LIST);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<PendingApprovalItem | null>(null);

  const handleApprove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setApprovedIds((prev) => [...prev, id]);
    if (onApprove) onApprove(id);
  };

  const handleReject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    if (onReject) onReject(id);
  };

  const getTypeIcon = (type: string) => {
    if (type.toLowerCase().includes('invoice')) {
      return <DollarSign className="w-4 h-4 text-emerald-400" />;
    }
    if (type.toLowerCase().includes('change request')) {
      return <Layers className="w-4 h-4 text-amber-400" />;
    }
    return <FileText className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Pending Management Approvals</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                {approvals.filter(a => !approvedIds.includes(a.id)).length} Actionable
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Client requirement sign-offs, scope change requests, and milestone invoices awaiting boss signature
            </p>
          </div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-3">
        {approvals.map((item) => {
          const isApproved = approvedIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => {
                setSelectedApproval(item);
                if (onViewDetails) onViewDetails(item);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                isApproved
                  ? 'bg-emerald-500/5 border-emerald-500/30 opacity-75'
                  : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                  {getTypeIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400">{item.project}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.details}</p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span>Requested by: <strong className="text-slate-300">{item.requestedBy}</strong></span>
                    <span>•</span>
                    <span>Client: <strong className="text-slate-300">{item.client}</strong></span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {isApproved ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/30">
                    <Check className="w-3.5 h-3.5" />
                    <span>Approved</span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={(e) => handleReject(item.id, e)}
                      title="Decline or request revision"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleApprove(item.id, e)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Preview Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-base">Approval Review Spec</h3>
                  <p className="text-xs text-slate-400">{selectedApproval.type}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApproval(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Subject</label>
                <div className="text-sm font-bold text-white mt-0.5">{selectedApproval.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-slate-400">Project</label>
                  <div className="font-semibold text-slate-200 mt-0.5">{selectedApproval.project}</div>
                </div>
                <div>
                  <label className="text-slate-400">Client</label>
                  <div className="font-semibold text-slate-200 mt-0.5">{selectedApproval.client}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-slate-400">Initiated By</label>
                  <div className="font-semibold text-slate-200 mt-0.5">{selectedApproval.requestedBy}</div>
                </div>
                <div>
                  <label className="text-slate-400">Submission Date</label>
                  <div className="font-semibold text-slate-200 mt-0.5">{selectedApproval.date}</div>
                </div>
              </div>

              <div className="pt-2">
                <label className="text-slate-400">Detailed Scope Description</label>
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200 mt-1 leading-relaxed">
                  {selectedApproval.details}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedApproval(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Close Preview
              </button>
              <button
                onClick={(e) => {
                  handleApprove(selectedApproval.id, e);
                  setSelectedApproval(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Sign &amp; Authorize</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
