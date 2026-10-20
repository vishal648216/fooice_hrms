'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { MOCK_EXTENDED_INVOICES, ExtendedInvoiceItem, InvoiceLineItem } from '@/lib/finance-data';
import { EXTENDED_CLIENTS } from '@/lib/clients-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Receipt, 
  Plus, 
  Search, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Printer, 
  Send, 
  FileText, 
  Calendar, 
  Building2, 
  CreditCard, 
  Trash2,
  X,
  ShieldCheck,
  QrCode
} from 'lucide-react';

export const InvoicesListView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [invoices, setInvoices] = useState<ExtendedInvoiceItem[]>(MOCK_EXTENDED_INVOICES);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedClient, setSelectedClient] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Drawers
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState<ExtendedInvoiceItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Invoice Form State
  const [newClientId, setNewClientId] = useState(EXTENDED_CLIENTS[0].id);
  const [newPoNumber, setNewPoNumber] = useState('');
  const [newIssueDate, setNewIssueDate] = useState('2026-09-29');
  const [newDueDate, setNewDueDate] = useState('2026-10-29');
  const [newNotes, setNewNotes] = useState('Net 30 terms. Please remit wire payment to Apex Technologies Corporate SVB account.');
  const [newLineItems, setNewLineItems] = useState<InvoiceLineItem[]>([
    { id: 'item-1', description: 'Sprint 15 Delivery: Core Architecture & APIs', quantity: 120, unitPrice: 150, amount: 18000 }
  ]);

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = selectedStatus === 'ALL' || inv.status === selectedStatus;
    const matchesClient = selectedClient === 'ALL' || inv.clientId === selectedClient;
    const matchesQuery = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inv.poNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesClient && matchesQuery;
  });

  // KPI Calculations
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalCollected = invoices.filter(inv => inv.status === 'PAID').reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPending = invoices.filter(inv => inv.status === 'PENDING').reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalDraft = invoices.filter(inv => inv.status === 'DRAFT').reduce((acc, inv) => acc + inv.totalAmount, 0);

  const handleAddLineItem = () => {
    setNewLineItems(prev => [
      ...prev,
      { id: `item-${Date.now()}`, description: '', quantity: 1, unitPrice: 150, amount: 150 }
    ]);
  };

  const handleUpdateLineItem = (index: number, field: keyof InvoiceLineItem, value: any) => {
    setNewLineItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        item.amount = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
      }
      updated[index] = item;
      return updated;
    });
  };

  const handleRemoveLineItem = (index: number) => {
    if (newLineItems.length === 1) return;
    setNewLineItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const cli = EXTENDED_CLIENTS.find(c => c.id === newClientId) || EXTENDED_CLIENTS[0];
    const subtotal = newLineItems.reduce((acc, it) => acc + it.amount, 0);

    const newInv: ExtendedInvoiceItem = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-0${Math.floor(96 + Math.random() * 50)}`,
      poNumber: newPoNumber || `PO-${cli.companyName.slice(0, 3).toUpperCase()}-2026`,
      clientId: cli.id,
      clientName: cli.companyName,
      clientEmail: cli.email,
      clientAddress: 'Corporate Headquarters Office',
      clientLogo: cli.avatar,
      projectName: cli.activeProjectNames[0] || 'Enterprise Software Deliverables',
      issueDate: newIssueDate,
      dueDate: newDueDate,
      subtotal: subtotal,
      taxRate: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: subtotal,
      status: 'PENDING',
      paymentMethod: 'WIRE_TRANSFER',
      notes: newNotes,
      lineItems: newLineItems
    };

    setInvoices(prev => [newInv, ...prev]);
    setShowCreateModal(false);
    addToast({
      title: 'Invoice Issued',
      description: `Invoice ${newInv.invoiceNumber} for $${newInv.totalAmount.toLocaleString()} generated.`,
      type: 'success'
    });
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: 'PAID',
          paidDate: new Date().toISOString().split('T')[0]
        };
      }
      return inv;
    }));

    if (selectedInvoiceDetail && selectedInvoiceDetail.id === invoiceId) {
      setSelectedInvoiceDetail(prev => prev ? { ...prev, status: 'PAID', paidDate: new Date().toISOString().split('T')[0] } : null);
    }

    addToast({
      title: 'Payment Reconciled',
      description: 'Invoice marked as cleared in general ledger.',
      type: 'success'
    });
  };

  const statusBadges = {
    PAID: { variant: 'success' as const, label: 'Paid & Cleared ✓' },
    PENDING: { variant: 'warning' as const, label: 'Awaiting Wire Payment' },
    OVERDUE: { variant: 'danger' as const, label: 'Past Due' },
    DRAFT: { variant: 'neutral' as const, label: 'Draft' }
  };

  return (
    <div className="space-y-6">
      {/* Top Financial Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Gross Invoiced (YTD)</span>
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ${totalBilled.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Across {invoices.length} corporate billing statements
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Payments Collected</span>
            <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ${totalCollected.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">
            {Math.round((totalCollected / totalBilled) * 100)}% collection settlement rate
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-100 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Accounts Receivable (A/R)</span>
            <div className="p-2 rounded-xl bg-amber-600/10 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            ${totalPending.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Pending Net 30 corporate payment cycles
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900 border-purple-100 dark:border-purple-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Draft Invoices</span>
            <div className="p-2 rounded-xl bg-purple-600/10 text-purple-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ${totalDraft.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-purple-600 font-medium">
            Ready for client submission
          </div>
        </Card>
      </div>

      {/* Control Bar: Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Invoices' },
            { id: 'PENDING', label: 'Pending Payment' },
            { id: 'PAID', label: 'Paid & Cleared' },
            { id: 'DRAFT', label: 'Drafts' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedStatus === tab.id
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search, Client Filter and New Invoice Action */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice #, client, PO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Itemized Invoice
          </Button>
        </div>
      </div>

      {/* Invoices Table */}
      <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Client & Engagement</th>
                <th className="p-3.5 font-mono">PO Number</th>
                <th className="p-3.5">Issue Date</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5 font-mono">Total Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map((inv) => {
                const badge = statusBadges[inv.status] || statusBadges.PENDING;

                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition cursor-pointer"
                    onClick={() => setSelectedInvoiceDetail(inv)}
                  >
                    <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {inv.invoiceNumber}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{inv.clientName}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{inv.projectName}</div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-500 font-medium">
                      {inv.poNumber}
                    </td>
                    <td className="p-3.5 font-mono text-slate-500">
                      {inv.issueDate}
                    </td>
                    <td className="p-3.5 font-mono text-slate-500">
                      {inv.dueDate}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      ${inv.totalAmount.toLocaleString()} USD
                    </td>
                    <td className="p-3.5">
                      <Badge variant={badge.variant} size="sm">
                        {badge.label}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedInvoiceDetail(inv)}
                        >
                          View PDF
                        </Button>
                        {inv.status === 'PENDING' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsPaid(inv.id)}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Printable Invoice Detail Drawer / Modal */}
      {selectedInvoiceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 overflow-y-auto space-y-6">
            {/* Action Bar at top of invoice preview */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Badge variant={statusBadges[selectedInvoiceDetail.status].variant} size="sm">
                  {statusBadges[selectedInvoiceDetail.status].label}
                </Badge>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {selectedInvoiceDetail.poNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addToast({ title: 'Print Dispatch', description: 'Opening system print dialog...', type: 'info' })}
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                >
                  Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addToast({ title: 'PDF Downloaded', description: `${selectedInvoiceDetail.invoiceNumber}.pdf saved.`, type: 'success' })}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Download PDF
                </Button>
                {selectedInvoiceDetail.status === 'PENDING' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleMarkAsPaid(selectedInvoiceDetail.id)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Mark as Paid & Cleared
                  </Button>
                )}
                <button
                  onClick={() => setSelectedInvoiceDetail(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tax Invoice Document Body */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-6 text-xs text-slate-700 dark:text-slate-300">
              {/* Header: Company vs Client */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                    <span className="p-1.5 rounded-lg bg-indigo-600 text-white font-mono text-xs">OS</span>
                    <span>Apex Technologies Inc.</span>
                  </div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">
                    100 Montgomery St, Suite 1800<br />
                    San Francisco, CA 94104<br />
                    Tax ID: US-EIN 94-8201948<br />
                    billing@apextechnologies.io
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                    TAX INVOICE
                  </div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">
                    {selectedInvoiceDetail.invoiceNumber}
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    Issue Date: {selectedInvoiceDetail.issueDate}<br />
                    Due Date: <strong className="text-amber-600">{selectedInvoiceDetail.dueDate}</strong>
                  </div>
                </div>
              </div>

              {/* Billed To Section */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Billed Client:</span>
                  <div className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                    {selectedInvoiceDetail.clientName}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    {selectedInvoiceDetail.clientAddress}<br />
                    {selectedInvoiceDetail.clientEmail}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engagement / Project:</span>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {selectedInvoiceDetail.projectName}
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    PO Ref: {selectedInvoiceDetail.poNumber}
                  </div>
                </div>
              </div>

              {/* Itemized Line Items Table */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-750 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-500">
                    <tr>
                      <th className="p-3">Deliverable Description</th>
                      <th className="p-3 text-right font-mono">Qty / Hrs</th>
                      <th className="p-3 text-right font-mono">Unit Rate</th>
                      <th className="p-3 text-right font-mono">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {selectedInvoiceDetail.lineItems.map((li) => (
                      <tr key={li.id}>
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{li.description}</td>
                        <td className="p-3 text-right font-mono">{li.quantity}</td>
                        <td className="p-3 text-right font-mono">${li.unitPrice.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">${li.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Summary Breakdown */}
              <div className="flex justify-between items-start pt-2">
                <div className="space-y-1.5 max-w-sm">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Wire & ACH Payment Instructions:</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                    Bank: Silicon Valley Bank, N.A.<br />
                    Routing (ABA): 121140399<br />
                    Account: 3901-8201-9482<br />
                    SWIFT: SVBKUS6S
                  </p>
                </div>

                <div className="w-64 space-y-2 p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold">${selectedInvoiceDetail.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax / VAT (0% Exempt):</span>
                    <span className="font-mono">$0.00</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                    <span>Invoice Total:</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">
                      ${selectedInvoiceDetail.totalAmount.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              </div>

              {/* Signature Stamp */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Digitally Authorized by Apex Technologies Financial Controller</span>
                </div>
                <div className="font-mono">
                  Doc ID: {selectedInvoiceDetail.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Itemized Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <Receipt className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Generate Itemized Tax Invoice</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Client Organization *</label>
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
                  <label className="font-bold text-slate-700 dark:text-slate-300">Client PO Number</label>
                  <input
                    type="text"
                    placeholder="e.g. PO-NOV-2026-88"
                    value={newPoNumber}
                    onChange={(e) => setNewPoNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Issue Date</label>
                  <input
                    type="date"
                    value={newIssueDate}
                    onChange={(e) => setNewIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Payment Due Date (Net 30)</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                    Itemized Deliverables ({newLineItems.length})
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={handleAddLineItem}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Row
                  </Button>
                </div>

                <div className="space-y-2">
                  {newLineItems.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <input
                        type="text"
                        required
                        placeholder="Deliverable description or sprint item..."
                        value={item.description}
                        onChange={(e) => handleUpdateLineItem(idx, 'description', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleUpdateLineItem(idx, 'quantity', Number(e.target.value))}
                        className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-center"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Rate"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateLineItem(idx, 'unitPrice', Number(e.target.value))}
                        className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-center"
                      />
                      <span className="w-24 font-mono font-bold text-right pr-2">
                        ${item.amount.toLocaleString()}
                      </span>
                      {newLineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Subtotal preview */}
                <div className="text-right pt-2 font-bold text-sm text-slate-900 dark:text-white font-mono">
                  Calculated Total: ${newLineItems.reduce((acc, i) => acc + i.amount, 0).toLocaleString()} USD
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Issue & Dispatch Invoice
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
