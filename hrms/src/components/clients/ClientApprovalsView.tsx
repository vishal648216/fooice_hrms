'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { MOCK_CLIENT_APPROVALS, ClientApprovalItem, EXTENDED_CLIENTS } from '@/lib/clients-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  FileBadge, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Paperclip, 
  ShieldCheck, 
  Calendar, 
  User, 
  Sparkles,
  DollarSign,
  Send,
  MessageSquare
} from 'lucide-react';

export const ClientApprovalsView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [approvals, setApprovals] = useState<ClientApprovalItem[]>(MOCK_CLIENT_APPROVALS);
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeSignModalItem, setActiveSignModalItem] = useState<ClientApprovalItem | null>(null);
  const [signNotes, setSignNotes] = useState('');
  const [signatoryName, setSignatoryName] = useState('Marcus Sterling (Client Sponsor)');

  const filteredApprovals = approvals.filter(a => {
    const matchesClient = selectedClientId === 'ALL' || a.clientId === selectedClientId;
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    return matchesClient && matchesCat;
  });

  const handleConfirmSignature = (approved: boolean) => {
    if (!activeSignModalItem) return;

    setApprovals(prev => prev.map(a => {
      if (a.id === activeSignModalItem.id) {
        return {
          ...a,
          status: approved ? 'APPROVED' : 'CHANGES_REQUESTED',
          signedBy: signatoryName,
          signedAt: new Date().toISOString().split('T')[0],
          comments: signNotes || (approved ? 'Approved by client executive sponsor.' : 'Revisions requested by client.')
        };
      }
      return a;
    }));

    setActiveSignModalItem(null);
    setSignNotes('');
    addToast({
      title: approved ? 'Deliverable Approved' : 'Feedback Sent',
      description: `Cryptographic audit stamp attached to ${activeSignModalItem.title}`,
      type: approved ? 'success' : 'warning'
    });
  };

  const categoryBadges = {
    DELIVERABLE: { bg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800', label: 'Milestone Deliverable' },
    SOW_AMENDMENT: { bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800', label: 'SOW Scope Change' },
    DESIGN_SIGN_OFF: { bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800', label: 'Architecture & Design' },
    INVOICE_PAYMENT: { bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', label: 'Invoice Sign-off' },
    RELEASE_DEPLOYMENT: { bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800', label: 'Release Production Go-Live' },
  };

  const statusBadgeMap = {
    PENDING: { variant: 'warning' as const, label: 'Pending Client Signature' },
    APPROVED: { variant: 'success' as const, label: 'Legally Signed & Approved ✓' },
    CHANGES_REQUESTED: { variant: 'danger' as const, label: 'Revisions Requested' },
    REJECTED: { variant: 'neutral' as const, label: 'Declined' },
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400">
            <FileBadge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">Client Sign-offs & Approvals Queue</h3>
            <p className="text-[11px] text-slate-500">Legal verification for project milestones, scope adjustments, and release sign-offs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Client Filter */}
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Clients</option>
            {EXTENDED_CLIENTS.map(c => (
              <option key={c.id} value={c.id}>{c.companyName}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="DELIVERABLE">Milestone Deliverables</option>
            <option value="SOW_AMENDMENT">SOW Amendments</option>
            <option value="DESIGN_SIGN_OFF">Design Sign-offs</option>
            <option value="RELEASE_DEPLOYMENT">Release Deployments</option>
          </select>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.map((appr) => {
          const catConfig = categoryBadges[appr.category] || categoryBadges.DELIVERABLE;
          const statusConfig = statusBadgeMap[appr.status] || statusBadgeMap.PENDING;

          return (
            <Card
              key={appr.id}
              className="p-5 space-y-4 border border-slate-200 dark:border-slate-800"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={appr.clientLogo}
                    alt=""
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${catConfig.bg}`}>
                        {catConfig.label}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {appr.clientName}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                      {appr.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={statusConfig.variant} size="sm">
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>

              {/* Description & Value */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                <div className="lg:col-span-2 space-y-2">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {appr.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> Requested by: <strong className="text-slate-700 dark:text-slate-300">{appr.requestedBy}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Date: <strong className="text-slate-700 dark:text-slate-300">{appr.requestDate}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Due: <strong className="text-amber-600">{appr.dueDate}</strong>
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px]">Financial Impact / Value:</span>
                    <div className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                      ${appr.valueImpact?.toLocaleString() || '0'} USD
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="flex items-center gap-1">
                      <Paperclip className="w-3.5 h-3.5" /> {appr.attachmentsCount} Attachments
                    </span>
                    <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
                      View Documents
                    </span>
                  </div>
                </div>
              </div>

              {/* Digital Sign-off Banner if approved */}
              {appr.status === 'APPROVED' && (
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Cryptographically Signed by {appr.signedBy}</span>
                    </div>
                    <span className="font-mono text-[10px]">Timestamp: {appr.signedAt} 14:02:19 UTC</span>
                  </div>
                  {appr.comments && (
                    <p className="text-[11px] italic opacity-85 mt-0.5">"{appr.comments}"</p>
                  )}
                </div>
              )}

              {/* Actions if pending */}
              {appr.status === 'PENDING' && (
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveSignModalItem(appr);
                    }}
                  >
                    Request Revisions
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setActiveSignModalItem(appr);
                    }}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Sign & Approve Deliverable
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Signature Confirmation Modal */}
      {activeSignModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Execute Digital Sign-Off</h3>
                  <p className="text-xs text-slate-400">{activeSignModalItem.clientName}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveSignModalItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">{activeSignModalItem.title}</div>
                <p className="text-slate-500 text-[11px] leading-relaxed">{activeSignModalItem.description}</p>
                <div className="font-mono font-bold text-emerald-600 pt-1">
                  Value Impact: ${activeSignModalItem.valueImpact?.toLocaleString()} USD
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Signatory Representative Name</label>
                <input
                  type="text"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Comments or Feedback (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Feedback or acceptance notes for the engineering team..."
                  value={signNotes}
                  onChange={(e) => setSignNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200">
                Signing creates a legally binding audit record in the OfficeOS enterprise ledger.
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConfirmSignature(false)}
                >
                  Request Changes
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleConfirmSignature(true)}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Confirm & Apply Digital Stamp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
