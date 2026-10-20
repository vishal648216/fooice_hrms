'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { MOCK_MILESTONES, EXTENDED_PROJECTS, MilestoneItem } from '@/lib/projects-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Flag, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileCheck2, 
  UserCheck, 
  Calendar, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const MilestonesView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [milestones, setMilestones] = useState<MilestoneItem[]>(MOCK_MILESTONES);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Milestone Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newProjectId, setNewProjectId] = useState(EXTENDED_PROJECTS[0].id);
  const [newDueDate, setNewDueDate] = useState('2026-11-15');
  const [newDeliverableText, setNewDeliverableText] = useState('Production Deployment & Security Audit Signoff');

  const filteredMilestones = milestones.filter(m => {
    return selectedProjectId === 'ALL' || m.projectId === selectedProjectId;
  });

  const toggleDeliverable = (milestoneId: string, delId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        const updatedDels = m.deliverables.map(d => 
          d.id === delId ? { ...d, completed: !d.completed } : d
        );
        const completedCount = updatedDels.filter(d => d.completed).length;
        const newPercent = Math.round((completedCount / updatedDels.length) * 100);
        return {
          ...m,
          deliverables: updatedDels,
          progressPercent: newPercent,
          status: newPercent === 100 ? 'COMPLETED' : 'IN_PROGRESS'
        };
      }
      return m;
    }));

    addToast({ title: 'Deliverable Updated', description: 'Progress recalculated.', type: 'info' });
  };

  const handleApproveMilestone = (milestoneId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        return {
          ...m,
          status: 'COMPLETED',
          progressPercent: 100,
          clientSignoff: {
            status: 'APPROVED',
            signedBy: 'Alexander Vance (Super Admin & Boss)',
            signedAt: new Date().toISOString().split('T')[0],
            feedback: 'Executive sign-off granted on behalf of client steering committee.'
          }
        };
      }
      return m;
    }));

    addToast({
      title: 'Milestone Approved',
      description: 'Formal digital sign-off recorded in audit log.',
      type: 'success'
    });
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const proj = EXTENDED_PROJECTS.find(p => p.id === newProjectId) || EXTENDED_PROJECTS[0];
    const newMs: MilestoneItem = {
      id: `ms-${Date.now()}`,
      projectId: proj.id,
      projectName: proj.name,
      title: newTitle,
      description: newDescription || 'Delivery milestone with key acceptance criteria.',
      dueDate: newDueDate,
      status: 'UPCOMING',
      progressPercent: 0,
      deliverables: [
        { id: `del-${Date.now()}-1`, title: newDeliverableText, completed: false, assigneeName: 'Sarah Montgomery' },
        { id: `del-${Date.now()}-2`, title: 'Client Acceptance Test Script Execution', completed: false, assigneeName: 'Arjun Nambiar' }
      ],
      clientSignoff: {
        status: 'PENDING',
        feedback: 'Awaiting formal staging environment hand-off.'
      }
    };

    setMilestones(prev => [newMs, ...prev]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    addToast({ title: 'Milestone Added', description: `${newMs.title} scheduled.`, type: 'success' });
  };

  const statusBadge = {
    COMPLETED: { variant: 'success' as const, label: 'Delivered & Approved' },
    IN_PROGRESS: { variant: 'primary' as const, label: 'In Progress' },
    AT_RISK: { variant: 'danger' as const, label: 'Schedule At Risk' },
    UPCOMING: { variant: 'neutral' as const, label: 'Scheduled Ahead' }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400">
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">Contract Milestones & Client Sign-offs</h3>
            <p className="text-[11px] text-slate-500">Track contractual deliverables, acceptance criteria, and legal signoffs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Projects (Milestones)</option>
            {EXTENDED_PROJECTS.map(p => (
              <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
            ))}
          </select>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Milestone
          </Button>
        </div>
      </div>

      {/* Milestones Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredMilestones.map((ms) => {
          const cfg = statusBadge[ms.status] || statusBadge.IN_PROGRESS;

          return (
            <Card
              key={ms.id}
              className="p-5 flex flex-col justify-between space-y-4 border border-slate-200 dark:border-slate-800"
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {ms.projectName}
                  </span>
                  <Badge variant={cfg.variant} size="sm">
                    {cfg.label}
                  </Badge>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {ms.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {ms.description}
                </p>
              </div>

              {/* Progress Bar & Due Date */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Target Date: <strong className="text-slate-700 dark:text-slate-300">{ms.dueDate}</strong>
                  </span>
                  <span className="font-mono font-bold text-indigo-600">{ms.progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${ms.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Deliverables Checklist ({ms.deliverables.filter(d => d.completed).length}/{ms.deliverables.length})
                </div>

                <div className="space-y-1.5">
                  {ms.deliverables.map((del) => (
                    <div
                      key={del.id}
                      onClick={() => toggleDeliverable(ms.id, del.id)}
                      className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                        del.completed
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-slate-500'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${del.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'}`}>
                          {del.completed && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className={del.completed ? 'line-through' : 'font-medium'}>{del.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{del.assigneeName.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Sign-off Status Banner */}
              <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                ms.clientSignoff.status === 'APPROVED'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Client Sign-off: {ms.clientSignoff.status}</span>
                  </div>
                  {ms.clientSignoff.signedAt && (
                    <span className="font-mono text-[10px]">Signed {ms.clientSignoff.signedAt}</span>
                  )}
                </div>

                {ms.clientSignoff.signedBy && (
                  <div className="text-[11px] opacity-90">
                    Signee: <strong>{ms.clientSignoff.signedBy}</strong>
                  </div>
                )}

                {ms.clientSignoff.feedback && (
                  <p className="text-[11px] italic opacity-85">
                    "{ms.clientSignoff.feedback}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                {ms.clientSignoff.status !== 'APPROVED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApproveMilestone(ms.id)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Grant Boss Approval
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-600 text-white">
                  <Flag className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Schedule Project Milestone</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Milestone Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Milestone 4: Production Security Audit & Launch"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Target Project</label>
                  <select
                    value={newProjectId}
                    onChange={(e) => setNewProjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {EXTENDED_PROJECTS.map(p => (
                      <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Scope Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of SLA targets and client deliverables..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Primary Key Deliverable</label>
                <input
                  type="text"
                  value={newDeliverableText}
                  onChange={(e) => setNewDeliverableText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Milestone
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
