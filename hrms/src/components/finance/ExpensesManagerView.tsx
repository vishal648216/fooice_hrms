'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { MOCK_EXPENSES, ExpenseItem } from '@/lib/finance-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Wallet, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Cloud, 
  Laptop, 
  Building, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  Paperclip,
  TrendingDown
} from 'lucide-react';

export const ExpensesManagerView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [expenses, setExpenses] = useState<ExpenseItem[]>(MOCK_EXPENSES);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // New Expense Form State
  const [newVendor, setNewVendor] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState(1200);
  const [newCategory, setNewCategory] = useState<ExpenseItem['category']>('CLOUD_INFRASTRUCTURE');
  const [newDepartment, setNewDepartment] = useState('Core Engineering');

  const filteredExpenses = expenses.filter(exp => {
    const matchesCat = selectedCategory === 'ALL' || exp.category === selectedCategory;
    const matchesStat = selectedStatus === 'ALL' || exp.status === selectedStatus;
    const matchesQuery = exp.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.expenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStat && matchesQuery;
  });

  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
  const pendingApprovals = expenses.filter(e => e.status === 'PENDING_REVIEW');

  const handleApproveExpense = (expenseId: string) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === expenseId) {
        return {
          ...e,
          status: 'APPROVED',
          approvedBy: 'Alexander Vance (Super Admin & Boss)',
          approvedDate: new Date().toISOString().split('T')[0]
        };
      }
      return e;
    }));

    addToast({
      title: 'Expense Approved',
      description: 'Disbursement authorized for corporate reimbursement.',
      type: 'success'
    });
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.trim() || !newDescription.trim()) return;

    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      expenseNumber: `EXP-2026-${Math.floor(120 + Math.random() * 80)}`,
      category: newCategory,
      vendor: newVendor,
      description: newDescription,
      amount: Number(newAmount),
      date: new Date().toISOString().split('T')[0],
      department: newDepartment,
      submittedBy: {
        name: 'Arjun Nambiar',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Lead Full-Stack Engineer',
      },
      status: 'PENDING_REVIEW'
    };

    setExpenses(prev => [newExp, ...prev]);
    setShowSubmitModal(false);
    setNewVendor('');
    setNewDescription('');
    addToast({
      title: 'Expense Claim Filed',
      description: `${newExp.expenseNumber} submitted for manager review.`,
      type: 'success'
    });
  };

  const categoryConfigs = {
    CLOUD_INFRASTRUCTURE: { bg: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400', label: 'Cloud Infrastructure' },
    SOFTWARE_LICENSES: { bg: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400', label: 'Software & SaaS' },
    HARDWARE_EQUIPMENT: { bg: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400', label: 'IT Hardware' },
    OFFICE_FACILITIES: { bg: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400', label: 'Facilities & Rent' },
    TRAVEL_EVENTS: { bg: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400', label: 'Travel & Conferences' }
  };

  const statusBadges = {
    APPROVED: { variant: 'success' as const, label: 'Approved & Reconciled' },
    PENDING_REVIEW: { variant: 'warning' as const, label: 'Pending Boss Approval' },
    REJECTED: { variant: 'danger' as const, label: 'Declined' }
  };

  return (
    <div className="space-y-6">
      {/* Top Expense Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Operating Expenses (Q3)</span>
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ${totalSpent.toLocaleString()} USD
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Across infrastructure, SaaS licenses & team hardware
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-100 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Approval Queue</span>
            <div className="p-2 rounded-xl bg-amber-600/10 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {pendingApprovals.length} Claims
          </div>
          <div className="mt-1 text-xs text-amber-600 font-medium">
            ${pendingApprovals.reduce((a, b) => a + b.amount, 0).toLocaleString()} awaiting authorization
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tax Deductible Business VAT</span>
            <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            100% Tax Compliant
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Digital receipts attached to all ledger items
          </div>
        </Card>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendor, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="CLOUD_INFRASTRUCTURE">Cloud Infrastructure</option>
            <option value="SOFTWARE_LICENSES">Software & SaaS</option>
            <option value="HARDWARE_EQUIPMENT">Hardware & IT</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowSubmitModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Submit Expense Claim
          </Button>
        </div>
      </div>

      {/* Expenses Cards List */}
      <div className="space-y-4">
        {filteredExpenses.map((exp) => {
          const catConfig = categoryConfigs[exp.category] || categoryConfigs.SOFTWARE_LICENSES;
          const statusConfig = statusBadges[exp.status] || statusBadges.APPROVED;

          return (
            <Card
              key={exp.id}
              className="p-5 space-y-3.5 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {exp.expenseNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${catConfig.bg}`}>
                    {catConfig.label}
                  </span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {exp.vendor}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    ${exp.amount.toLocaleString()} USD
                  </span>
                  <Badge variant={statusConfig.variant} size="sm">
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {exp.description}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <img src={exp.submittedBy.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  <span>Submitted by <strong>{exp.submittedBy.name}</strong> ({exp.department})</span>
                  <span className="text-slate-300">•</span>
                  <span>{exp.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  {exp.status === 'PENDING_REVIEW' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproveExpense(exp.id)}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Authorize Expense
                    </Button>
                  ) : (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Authorized by {exp.approvedBy}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Submit Expense Claim Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <Wallet className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Submit Corporate Expense Claim</h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Vendor / Payee Entity *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services (AWS) or Figma"
                  value={newVendor}
                  onChange={(e) => setNewVendor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="CLOUD_INFRASTRUCTURE">Cloud Infrastructure</option>
                    <option value="SOFTWARE_LICENSES">Software & SaaS</option>
                    <option value="HARDWARE_EQUIPMENT">Hardware & IT</option>
                    <option value="OFFICE_FACILITIES">Facilities & Rent</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Amount ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Department Allocation</label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option>Core Engineering</option>
                  <option>DevOps & Infrastructure</option>
                  <option>AI & Data Science</option>
                  <option>Product Design</option>
                  <option>Operations & IT</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Business Purpose & Itemization *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Outline project allocation and justification..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowSubmitModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Submit for Approval
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
