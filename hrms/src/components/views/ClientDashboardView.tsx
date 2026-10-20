'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_INVOICES, MOCK_PROJECTS } from '@/lib/officeos-data';
import { 
  Building2, 
  Video, 
  FileCheck, 
  Receipt, 
  Check, 
  Clock, 
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const ClientDashboardView: React.FC = () => {
  const { setActivePath, addToast } = useOfficeOS();

  const clientProjects = MOCK_PROJECTS.filter(p => p.clientId === 'cli-1');
  const clientInvoices = MOCK_INVOICES.filter(i => i.clientName.includes('Nova Capital'));

  const handleApproveRequirement = (title: string) => {
    addToast({
      title: 'Requirement Approved',
      description: `Officially signed off on "${title}". The engineering squad has been notified.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Client Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-stone-900 border border-amber-800/40 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase text-amber-300">
              <Building2 className="w-3.5 h-3.5" />
              <span>NOVA CAPITAL PARTNERS &bull; CLIENT PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Project Delivery & Sign-Off Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Transparent live status of your subscribed software deliverables, engineering milestones, pending requirement sign-offs, and statements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setActivePath('/communication/meetings')}
              leftIcon={<Video className="w-4 h-4 text-emerald-500" />}
            >
              Sprint Delivery Sync (10:30 AM)
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hoverable className="p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Active Contract</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-2">NovaPay Mobile v2.0</div>
          <div className="text-xs text-emerald-600 mt-1 font-semibold">Sprint 14 in active delivery</div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Pending Sign-offs</span>
            <FileCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-indigo-600 mt-2">1 Requirement</div>
          <div className="text-xs text-slate-500 mt-1">Awaiting client authorization</div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Pending Invoice</span>
            <Receipt className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-2">$45,000.00</div>
          <div className="text-xs text-slate-500 mt-1">Due on September 30, 2026</div>
        </Card>
      </div>

      {/* Two Column: Project Milestone Progress & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Project Delivery Tracker */}
        <Card>
          <CardHeader
            title="Subscribed Project Progress"
            subtitle="Verified deliverable velocity and completion percentage"
          />
          <CardBody className="space-y-4">
            {clientProjects.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</span>
                  <Badge variant="success" size="sm">{p.progressPercent}% COMPLETE</Badge>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${p.progressPercent}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Target Release: {p.targetEndDate}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{p.tasksSummary.done}/{p.tasksSummary.total} Deliverables Delivered</span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Pending Client Requirements Approvals */}
        <Card>
          <CardHeader
            title="Pending Scope & Requirement Approvals"
            subtitle="Your sign-off triggers deployment into production"
          />
          <CardBody className="space-y-3">
            <div className="p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-amber-700 dark:text-amber-400">REQ-202-84</span>
                <Badge variant="warning" size="sm">Awaiting Sign-off</Badge>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Multi-Factor Biometric Authentication (WebAuthn / Passkeys)
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Engineering team completed staging implementation with 100% test coverage. Authorize deployment to UAT client environment.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/60">
                <button
                  onClick={() => handleApproveRequirement('Multi-Factor Biometric Authentication')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" /> Approve & Sign Off
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

      </div>

    </div>
  );
};
