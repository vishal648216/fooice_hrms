'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { MOCK_PAYMENTS, PaymentTransactionItem, MOCK_EXTENDED_INVOICES } from '@/lib/finance-data';
import { EXTENDED_CLIENTS } from '@/lib/clients-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  CreditCard, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ArrowDownLeft, 
  Building2, 
  FileText, 
  ShieldCheck, 
  Download,
  Landmark
} from 'lucide-react';

export const PaymentsLedgerView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [payments, setPayments] = useState<PaymentTransactionItem[]>(MOCK_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('ALL');
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Record Payment Form State
  const [newClientId, setNewClientId] = useState(EXTENDED_CLIENTS[0].id);
  const [newInvoiceNo, setNewInvoiceNo] = useState(MOCK_EXTENDED_INVOICES[0].invoiceNumber);
  const [newAmount, setNewAmount] = useState(45000);
  const [newMethod, setNewMethod] = useState<'WIRE_TRANSFER' | 'STRIPE_ACH' | 'CREDIT_CARD' | 'DIRECT_DEPOSIT'>('WIRE_TRANSFER');
  const [newRefCode, setNewRefCode] = useState('');

  const filteredPayments = payments.filter(p => {
    const matchesMethod = selectedMethod === 'ALL' || p.paymentMethod === selectedMethod;
    const matchesQuery = p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.referenceCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMethod && matchesQuery;
  });

  const totalCleared = payments.filter(p => p.status === 'CLEARED').reduce((acc, p) => acc + p.amount, 0);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const cli = EXTENDED_CLIENTS.find(c => c.id === newClientId) || EXTENDED_CLIENTS[0];

    const newPayment: PaymentTransactionItem = {
      id: `pay-${Date.now()}`,
      transactionId: `TXN-WIRE-${Math.floor(10000 + Math.random() * 90000)}`,
      invoiceNumber: newInvoiceNo,
      clientName: cli.companyName,
      clientLogo: cli.avatar,
      date: 'Just now (Today)',
      amount: Number(newAmount),
      paymentMethod: newMethod,
      referenceCode: newRefCode || `FW-${Date.now().toString().slice(6)}`,
      status: 'CLEARED',
      clearedByBank: 'Silicon Valley Bank (SVB) Treasury Settlement',
    };

    setPayments(prev => [newPayment, ...prev]);
    setShowRecordModal(false);
    addToast({
      title: 'Payment Reconciled',
      description: `Recorded $${newPayment.amount.toLocaleString()} for ${newPayment.invoiceNumber}`,
      type: 'success'
    });
  };

  const methodBadges = {
    WIRE_TRANSFER: { bg: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400', label: 'Fedwire / ACH Wire' },
    STRIPE_ACH: { bg: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400', label: 'Stripe Treasury ACH' },
    CREDIT_CARD: { bg: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400', label: 'Corporate Card' },
    DIRECT_DEPOSIT: { bg: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400', label: 'Direct Bank Settlement' },
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Settled Inflows</span>
            <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ${totalCleared.toLocaleString()} USD
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">
            100% reconciled with Silicon Valley Bank ledger
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Settlement Time</span>
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            1.2 Days
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Sub-second settlement on Stripe ACH rails
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900 border-purple-100 dark:border-purple-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Primary Settlement Account</span>
            <div className="p-2 rounded-xl bg-purple-600/10 text-purple-600">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white truncate">
            SVB Commercial Treasury
          </div>
          <div className="mt-1 text-xs text-slate-500 font-mono">
            Acc: •••• 9482 (USD)
          </div>
        </Card>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search txn ID, reference, invoice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Payment Channels</option>
            <option value="WIRE_TRANSFER">Fedwire Transfers</option>
            <option value="STRIPE_ACH">Stripe ACH</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowRecordModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Record Incoming Wire
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Remitting Client</th>
                <th className="p-3.5">Linked Invoice</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Settlement Date</th>
                <th className="p-3.5 font-mono">Amount</th>
                <th className="p-3.5 font-mono">Reference Code</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPayments.map((p) => {
                const methodConfig = methodBadges[p.paymentMethod] || methodBadges.WIRE_TRANSFER;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {p.transactionId}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{p.clientName}</div>
                      <div className="text-[10px] text-slate-400">{p.clearedByBank}</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {p.invoiceNumber}
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${methodConfig.bg}`}>
                        {methodConfig.label}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-500">
                      {p.date}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +${p.amount.toLocaleString()} USD
                    </td>
                    <td className="p-3.5 font-mono text-slate-400 text-[11px]">
                      {p.referenceCode}
                    </td>
                    <td className="p-3.5">
                      <Badge variant="success" size="sm">
                        Cleared ✓
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Wire Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-600 text-white">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Record Cleared Wire Payment</h3>
              </div>
              <button
                onClick={() => setShowRecordModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Remitting Client *</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceNo}
                    onChange={(e) => setNewInvoiceNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Amount ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="100"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Payment Channel</label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="WIRE_TRANSFER">Fedwire Transfer</option>
                    <option value="STRIPE_ACH">Stripe ACH Instant</option>
                    <option value="DIRECT_DEPOSIT">Direct Bank Deposit</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Bank Reference Code</label>
                  <input
                    type="text"
                    placeholder="e.g. FW-908129381"
                    value={newRefCode}
                    onChange={(e) => setNewRefCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowRecordModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Record & Reconcile Payment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
