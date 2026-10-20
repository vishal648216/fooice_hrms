'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { 
  MOCK_REQUIREMENTS, 
  MOCK_CHANGE_REQUESTS, 
  EXTENDED_PROJECTS,
  RequirementItem,
  ChangeRequestItem
} from '@/lib/projects-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  FileCheck, 
  Plus, 
  Search, 
  GitPullRequest, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Calendar, 
  Sparkles, 
  FileText,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const RequirementsView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [activeTab, setActiveTab] = useState<'REQUIREMENTS' | 'CHANGE_REQUESTS'>('REQUIREMENTS');
  const [requirements, setRequirements] = useState<RequirementItem[]>(MOCK_REQUIREMENTS);
  const [changeRequests, setChangeRequests] = useState<ChangeRequestItem[]>(MOCK_CHANGE_REQUESTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCRModal, setShowAddCRModal] = useState(false);

  // New CR Form State
  const [crTitle, setCrTitle] = useState('');
  const [crProjectId, setCrProjectId] = useState(EXTENDED_PROJECTS[0].id);
  const [crRequestedBy, setCrRequestedBy] = useState('Marcus Sterling (Client VP)');
  const [crCostDelta, setCrCostDelta] = useState(15000);
  const [crDaysDelta, setCrDaysDelta] = useState(14);
  const [crScopeImpact, setCrScopeImpact] = useState('');
  const [crRationale, setCrRationale] = useState('');

  const filteredRequirements = requirements.filter(r => {
    const matchesProj = selectedProjectId === 'ALL' || r.projectId === selectedProjectId;
    const matchesQuery = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProj && matchesQuery;
  });

  const filteredCRs = changeRequests.filter(cr => {
    const matchesProj = selectedProjectId === 'ALL' || cr.projectId === selectedProjectId;
    const matchesQuery = cr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cr.crNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProj && matchesQuery;
  });

  const handleApproveCR = (crId: string) => {
    setChangeRequests(prev => prev.map(cr => {
      if (cr.id === crId) {
        return {
          ...cr,
          status: 'APPROVED_BY_CLIENT',
          approvedBy: 'Alexander Vance (Super Admin) & Client Lead',
          approvedDate: new Date().toISOString().split('T')[0]
        };
      }
      return cr;
    }));

    addToast({
      title: 'Change Request Approved',
      description: 'Scope amendment signed and budget updated.',
      type: 'success'
    });
  };

  const handleCreateCR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crTitle.trim() || !crScopeImpact.trim()) return;

    const proj = EXTENDED_PROJECTS.find(p => p.id === crProjectId) || EXTENDED_PROJECTS[0];
    const newCR: ChangeRequestItem = {
      id: `cr-${Date.now()}`,
      crNumber: `CR-${proj.code}-2026-${Math.floor(10 + Math.random() * 90)}`,
      projectId: proj.id,
      projectName: proj.name,
      title: crTitle,
      requestedBy: crRequestedBy,
      requestDate: new Date().toISOString().split('T')[0],
      scopeImpact: crScopeImpact,
      costDelta: Number(crCostDelta),
      timelineDeltaDays: Number(crDaysDelta),
      status: 'PENDING_APPROVAL',
      rationale: crRationale || 'Client requested enhancement.'
    };

    setChangeRequests(prev => [newCR, ...prev]);
    setShowAddCRModal(false);
    setCrTitle('');
    setCrScopeImpact('');
    setCrRationale('');
    addToast({
      title: 'CR Logged',
      description: `Change Request ${newCR.crNumber} submitted for steering review.`,
      type: 'success'
    });
  };

  const signoffBadges = {
    APPROVED: { variant: 'success' as const, label: 'Client Sign-off Verified' },
    UNDER_REVIEW: { variant: 'warning' as const, label: 'Under Review' },
    CHANGE_REQUESTED: { variant: 'danger' as const, label: 'CR Pending' },
    DRAFT: { variant: 'neutral' as const, label: 'Internal Draft' }
  };

  const crStatusBadges = {
    APPROVED_BY_CLIENT: { variant: 'success' as const, label: 'Approved & Budgeted' },
    PENDING_APPROVAL: { variant: 'warning' as const, label: 'Pending Approval' },
    IMPLEMENTED: { variant: 'primary' as const, label: 'Merged into Sprint' },
    REJECTED: { variant: 'danger' as const, label: 'Declined' }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">Requirements & Change Control (SOW)</h3>
            <p className="text-[11px] text-slate-500">Formal functional specifications, client sign-off audit trail, and budget impact</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Project Filter */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Projects (SOW)</option>
            {EXTENDED_PROJECTS.map(p => (
              <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
            ))}
          </select>

          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('REQUIREMENTS')}
              className={`px-3 py-1 rounded-lg transition-all ${activeTab === 'REQUIREMENTS' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              SOW Specs ({requirements.length})
            </button>
            <button
              onClick={() => setActiveTab('CHANGE_REQUESTS')}
              className={`px-3 py-1 rounded-lg transition-all ${activeTab === 'CHANGE_REQUESTS' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              Change Requests ({changeRequests.length})
            </button>
          </div>

          {activeTab === 'CHANGE_REQUESTS' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddCRModal(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              New CR
            </Button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'REQUIREMENTS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRequirements.map((req) => {
            const badge = signoffBadges[req.signoffStatus] || signoffBadges.DRAFT;

            return (
              <Card key={req.id} className="p-5 flex flex-col justify-between space-y-4 border border-slate-200 dark:border-slate-800">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        {req.code}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {req.category}
                      </span>
                    </div>
                    <Badge variant={badge.variant} size="sm">
                      {badge.label}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {req.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                {/* Acceptance Criteria */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider mb-1">
                    Acceptance Criteria
                  </div>
                  {req.acceptanceCriteria.map((ac, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{ac}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Sign-off Info */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Version: <strong>{req.version}</strong></span>
                  {req.signoffBy && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Signed by {req.signoffBy}
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Change Requests (CR) Tab */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40">
              <span className="text-xs text-slate-500 font-medium">Total CR Value Delta</span>
              <div className="text-xl font-bold font-mono text-indigo-600 mt-1">
                +${changeRequests.reduce((a, b) => a + b.costDelta, 0).toLocaleString()}
              </div>
            </Card>
            <Card className="p-4 bg-amber-50/40 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40">
              <span className="text-xs text-slate-500 font-medium">Approved Schedule Extension</span>
              <div className="text-xl font-bold font-mono text-amber-600 mt-1">
                +{changeRequests.filter(c => c.status === 'APPROVED_BY_CLIENT').reduce((a, b) => a + b.timelineDeltaDays, 0)} Calendar Days
              </div>
            </Card>
            <Card className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40">
              <span className="text-xs text-slate-500 font-medium">Client Acceptance Rate</span>
              <div className="text-xl font-bold text-emerald-600 mt-1">
                {Math.round((changeRequests.filter(c => c.status !== 'REJECTED').length / changeRequests.length) * 100)}% Signed
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {filteredCRs.map((cr) => {
              const badge = crStatusBadges[cr.status] || crStatusBadges.PENDING_APPROVAL;

              return (
                <Card key={cr.id} className="p-5 space-y-4 border border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                        {cr.crNumber}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {cr.title}
                      </h3>
                    </div>
                    <Badge variant={badge.variant} size="sm">
                      {badge.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                    <div className="lg:col-span-2 space-y-2">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Technical Scope Impact:</span>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{cr.scopeImpact}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Client Rationale:</span>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 italic">{cr.rationale}</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Cost Adjustment:</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+${cr.costDelta.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Timeline Impact:</span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">+{cr.timelineDeltaDays} Days</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                        <span>Requested By:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{cr.requestedBy}</span>
                      </div>
                    </div>
                  </div>

                  {cr.status === 'PENDING_APPROVAL' && (
                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveCR(cr.id)}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Approve & Bill Change Request
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* New CR Modal */}
      {showAddCRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-600 text-white">
                  <GitPullRequest className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Submit Scope Change Request (CR)</h3>
              </div>
              <button
                onClick={() => setShowAddCRModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCR} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Change Request Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Add Multi-Currency Ledger Support"
                  value={crTitle}
                  onChange={(e) => setCrTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Target Project</label>
                  <select
                    value={crProjectId}
                    onChange={(e) => setCrProjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {EXTENDED_PROJECTS.map(p => (
                      <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Requested By</label>
                  <input
                    type="text"
                    value={crRequestedBy}
                    onChange={(e) => setCrRequestedBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Cost Impact (+$ USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={crCostDelta}
                    onChange={(e) => setCrCostDelta(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Timeline Impact (+Days)</label>
                  <input
                    type="number"
                    min="0"
                    value={crDaysDelta}
                    onChange={(e) => setCrDaysDelta(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Technical Scope & Impact *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe modified architectural components..."
                  value={crScopeImpact}
                  onChange={(e) => setCrScopeImpact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Client Business Rationale</label>
                <input
                  type="text"
                  placeholder="e.g. Expand reach to European banking clients"
                  value={crRationale}
                  onChange={(e) => setCrRationale(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddCRModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Log Change Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
