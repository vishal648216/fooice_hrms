'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { EXTENDED_CLIENTS, MOCK_CLIENT_APPROVALS } from '@/lib/clients-data';
import { EXTENDED_PROJECTS, MOCK_MILESTONES } from '@/lib/projects-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Video, 
  MessageSquare, 
  Download, 
  CreditCard, 
  Clock, 
  FolderGit2, 
  FileText, 
  Sparkles,
  Zap,
  DollarSign,
  Send,
  Building2,
  Users
} from 'lucide-react';

export const ClientPortalView: React.FC = () => {
  const { setActivePath, addToast } = useOfficeOS();
  const [selectedClientIndex, setSelectedClientIndex] = useState(0);
  const client = EXTENDED_CLIENTS[selectedClientIndex];
  const project = EXTENDED_PROJECTS.find(p => p.clientName.includes(client.companyName.split(' ')[0])) || EXTENDED_PROJECTS[0];

  const pendingApprovals = MOCK_CLIENT_APPROVALS.filter(a => a.clientId === client.id && a.status === 'PENDING');
  const milestones = MOCK_MILESTONES.filter(m => m.projectId === project.id);

  const handleApprovePendingItem = (approvalId: string) => {
    addToast({
      title: 'Digital Sign-off Confirmed',
      description: 'Signed on behalf of client. Notified engineering lead.',
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {/* Client Switcher Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={client.avatar}
            alt={client.companyName}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-400/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-white">{client.companyName} Dedicated Portal</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                White-Label Client View
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Logged in as <strong className="text-white">{client.contactPerson}</strong>
            </p>
          </div>
        </div>

        {/* Switch Client Simulation */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Viewing Client:</span>
          <select
            value={selectedClientIndex}
            onChange={(e) => setSelectedClientIndex(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none"
          >
            {EXTENDED_CLIENTS.map((c, i) => (
              <option key={c.id} value={i}>{c.companyName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Delivery Health & SOW Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Project Delivery Pulse */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {project.code}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  ● Active Sprint Delivery
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Target Hand-off: <strong>{project.targetEndDate}</strong>
              </span>
            </div>

            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {project.name}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {project.activeSprint} — All automated regression suites and WebAuthn multi-factor passkeys deployed to UAT staging.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Overall Contract Scope Completion</span>
              <span className="font-mono text-indigo-600 text-sm">{project.progressPercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${project.progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>{project.tasksSummary.done} deliverables approved & delivered</span>
              <span>{project.tasksSummary.inReview} awaiting final client sign-off</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SLA Guarantee: <strong>99.98% Uptime & 15m Critical Response</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivePath('/communication/meetings')}
                leftIcon={<Video className="w-3.5 h-3.5" />}
              >
                Join Sprint Sync
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActivePath('/clients/approvals')}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Review Approvals ({pendingApprovals.length})
              </Button>
            </div>
          </div>
        </Card>

        {/* Assigned Dedicated Engineering Team */}
        <Card className="p-6 flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <Users className="w-4 h-4" />
              <h3 className="font-bold text-xs uppercase tracking-wider">Dedicated Engineering Pod</h3>
            </div>
            <p className="text-xs text-slate-500">
              Direct access to senior architecture leads assigned to your account.
            </p>
          </div>

          <div className="space-y-3">
            {/* Account Manager */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <img
                  src={client.assignedAccountManager.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {client.assignedAccountManager.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {client.assignedAccountManager.role}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActivePath('/communication/chat');
                  addToast({ title: 'Direct Chat', description: `Opened direct channel with ${client.assignedAccountManager.name}`, type: 'info' });
                }}
              >
                Chat
              </Button>
            </div>

            {/* Lead Engineer */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    Arjun Nambiar
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Lead Full-Stack Engineer
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActivePath('/communication/chat');
                  addToast({ title: 'Direct Chat', description: 'Opened direct channel with Arjun Nambiar', type: 'info' });
                }}
              >
                Chat
              </Button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Next Scheduled Sync:
            </div>
            <div className="text-[11px]">
              Friday at 10:30 AM EST (Sprint 14 Review & Sign-off)
            </div>
          </div>
        </Card>
      </div>

      {/* Contract Milestones & Pending Sign-Offs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Milestones Card */}
        <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Contractual Milestones & Release Schedule
            </h3>
            <span className="text-xs font-mono font-bold text-indigo-600">
              {milestones.filter(m => m.status === 'COMPLETED').length} / {milestones.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {milestones.map((ms) => (
              <div
                key={ms.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {ms.title}
                  </h4>
                  <Badge variant={ms.status === 'COMPLETED' ? 'success' : 'primary'} size="sm">
                    {ms.status === 'COMPLETED' ? 'Delivered & Signed' : 'In Progress'}
                  </Badge>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {ms.description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Due: {ms.dueDate}</span>
                  <span className="font-bold text-indigo-600">{ms.progressPercent}% Complete</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Financial Billing & Invoice Card */}
        <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-indigo-600" />
                Billing Ledger & Invoices
              </h3>
              <Badge variant={client.pendingInvoices > 0 ? 'warning' : 'success'} size="sm">
                {client.pendingInvoices > 0 ? '1 Invoice Pending' : 'Current'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Paid to Date:</span>
                <div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ${client.totalSpent.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Pending Due:</span>
                <div className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400">
                  ${client.pendingInvoices.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">INV-2026-089</div>
                  <div className="text-[11px] text-slate-500">Sprint 13 Delivery & Stripe Rails • Due Sep 30, 2026</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900 dark:text-white">$45,000.00</div>
                  <span className="text-[10px] text-amber-600 font-bold">Pending Approval</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs opacity-75">
                <div>
                  <div className="font-mono font-bold text-slate-500">INV-2026-064</div>
                  <div className="text-[11px] text-slate-500">Phase 1 Inception & KYC Module • Paid Aug 15, 2026</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900 dark:text-white">$75,000.00</div>
                  <span className="text-[10px] text-emerald-600 font-bold">Paid via Wire ✓</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Payment method: Corporate ACH Wire</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addToast({ title: 'Invoice Statement', description: 'Downloaded PDF ledger.', type: 'info' })}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download PDF Statement
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
