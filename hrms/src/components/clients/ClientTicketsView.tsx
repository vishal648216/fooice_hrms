'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { MOCK_SUPPORT_TICKETS, SupportTicketItem, EXTENDED_CLIENTS } from '@/lib/clients-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  LifeBuoy, 
  Plus, 
  Search, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  User, 
  ShieldCheck, 
  Send,
  X
} from 'lucide-react';

export const ClientTicketsView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [tickets, setTickets] = useState<SupportTicketItem[]>(MOCK_SUPPORT_TICKETS);
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicketDetail, setSelectedTicketDetail] = useState<SupportTicketItem | null>(null);

  // New Ticket Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newClientId, setNewClientId] = useState(EXTENDED_CLIENTS[0].id);
  const [newSeverity, setNewSeverity] = useState<SupportTicketItem['severity']>('HIGH_P1');

  const filteredTickets = tickets.filter(t => {
    const matchesSev = selectedSeverity === 'ALL' || t.severity === selectedSeverity;
    const matchesStat = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchesQuery = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesStat && matchesQuery;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const cli = EXTENDED_CLIENTS.find(c => c.id === newClientId) || EXTENDED_CLIENTS[0];
    const newTkt: SupportTicketItem = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${cli.companyName.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      clientId: cli.id,
      clientName: cli.companyName,
      clientLogo: cli.avatar,
      projectName: cli.activeProjectNames[0] || 'Core Production Platform',
      title: newTitle,
      description: newDescription || 'Production incident logged.',
      severity: newSeverity,
      status: 'OPEN',
      createdAt: 'Just now',
      slaDeadline: 'In 4 hours (SLA Active)',
      assignedEngineer: {
        name: 'Arjun Nambiar',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      messagesCount: 1,
    };

    setTickets(prev => [newTkt, ...prev]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    addToast({
      title: 'Ticket Dispatched',
      description: `${newTkt.ticketNumber} assigned to engineering on-call.`,
      type: 'success'
    });
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: 'RESOLVED' };
      }
      return t;
    }));

    if (selectedTicketDetail && selectedTicketDetail.id === ticketId) {
      setSelectedTicketDetail(prev => prev ? { ...prev, status: 'RESOLVED' } : null);
    }

    addToast({
      title: 'Ticket Marked Resolved',
      description: 'SLA resolution confirmed & client notified.',
      type: 'success'
    });
  };

  const severityBadges = {
    CRITICAL_P0: { bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800', label: 'Critical P0 (15m SLA)' },
    HIGH_P1: { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800', label: 'High P1 (4h SLA)' },
    MEDIUM_P2: { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800', label: 'Medium P2 (24h SLA)' },
    LOW_P3: { bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-800', label: 'Low P3' },
  };

  const statusBadges = {
    OPEN: { variant: 'danger' as const, label: 'Open Incident' },
    IN_PROGRESS: { variant: 'warning' as const, label: 'Investigating' },
    RESOLVED: { variant: 'success' as const, label: 'Resolved ✓' },
    PENDING_CLIENT: { variant: 'neutral' as const, label: 'Waiting on Client' },
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets, clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL_P0">Critical P0 🔥</option>
            <option value="HIGH_P1">High P1</option>
            <option value="MEDIUM_P2">Medium P2</option>
            <option value="LOW_P3">Low P3</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Raise Support Ticket
          </Button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((tkt) => {
          const sevConfig = severityBadges[tkt.severity] || severityBadges.MEDIUM_P2;
          const statusConfig = statusBadges[tkt.status] || statusBadges.OPEN;

          return (
            <Card
              key={tkt.id}
              hoverable
              className="p-5 space-y-3.5 border border-slate-200 dark:border-slate-800 cursor-pointer"
              onClick={() => setSelectedTicketDetail(tkt)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-1 rounded">
                    {tkt.ticketNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sevConfig.bg}`}>
                    {sevConfig.label}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {tkt.clientName}
                  </span>
                </div>

                <Badge variant={statusConfig.variant} size="sm">
                  {statusConfig.label}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {tkt.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {tkt.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <img src={tkt.assignedEngineer.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-slate-600 dark:text-slate-300">{tkt.assignedEngineer.name}</span>
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  <span className="text-amber-600 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> SLA: {tkt.slaDeadline}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> {tkt.messagesCount} updates
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Ticket Details Drawer */}
      {selectedTicketDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-1 rounded">
                  {selectedTicketDetail.ticketNumber}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {selectedTicketDetail.clientName}
                </span>
              </div>
              <button
                onClick={() => setSelectedTicketDetail(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedTicketDetail.title}
              </h2>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedTicketDetail.description}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Assigned Engineer:</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedTicketDetail.assignedEngineer.name}
                </div>
              </div>
              <div>
                <span className="text-slate-400">SLA Response Window:</span>
                <div className="font-mono font-bold text-amber-600 mt-0.5">
                  {selectedTicketDetail.slaDeadline}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              {selectedTicketDetail.status !== 'RESOLVED' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleResolveTicket(selectedTicketDetail.id)}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Confirm Incident Resolved
                </Button>
              ) : (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Incident Resolved & Closed
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Raise Support Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-600 text-white">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Raise Enterprise Support Ticket</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Webhook Delivery Intermittent 500 Error"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Client Organization</label>
                  <select
                    value={newClientId}
                    onChange={(e) => setNewClientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {EXTENDED_CLIENTS.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Severity Tier</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="CRITICAL_P0">Critical P0 (15m SLA)</option>
                    <option value="HIGH_P1">High P1 (4h SLA)</option>
                    <option value="MEDIUM_P2">Medium P2 (24h SLA)</option>
                    <option value="LOW_P3">Low P3 (General)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Incident Details & Reproduction Steps</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail symptoms, error logs, and impact on production..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Dispatch Ticket to On-Call
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
