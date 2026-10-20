'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { MOCK_BUDGETS, BudgetAllocationItem } from '@/lib/finance-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  PieChart, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Layers, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Calendar
} from 'lucide-react';

export const BudgetsForecastView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [budgets, setBudgets] = useState<BudgetAllocationItem[]>(MOCK_BUDGETS);
  const [showAllocateModal, setShowAllocateModal] = useState(false);

  // New Budget Form State
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('Core Engineering & Design');
  const [newBudgetAmount, setNewBudgetAmount] = useState(25000);
  const [newCategory, setNewCategory] = useState('Developer Tooling & Cloud Services');

  const totalAllocated = budgets.reduce((acc, b) => acc + b.allocatedBudget, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spentToDate, 0);
  const totalCommitted = budgets.reduce((acc, b) => acc + b.committedPending, 0);
  const overallBurnPercent = Math.round((totalSpent / totalAllocated) * 100);

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newBud: BudgetAllocationItem = {
      id: `bud-${Date.now()}`,
      name: newName,
      department: newDept,
      fiscalPeriod: 'Q3 2026 (Jul-Sep)',
      allocatedBudget: Number(newBudgetAmount),
      spentToDate: 0,
      committedPending: 0,
      category: newCategory,
      health: 'ON_TRACK',
      manager: 'Sarah Montgomery',
    };

    setBudgets(prev => [newBud, ...prev]);
    setShowAllocateModal(false);
    setNewName('');
    addToast({
      title: 'Budget Allocated',
      description: `Cap of $${newBud.allocatedBudget.toLocaleString()} established for ${newBud.name}`,
      type: 'success'
    });
  };

  const healthBadges = {
    ON_TRACK: { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800', label: 'On Budget Track' },
    WARNING: { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800', label: 'Near Budget Cap (90%+)' },
    OVER_BUDGET: { bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800', label: 'Budget Exceeded' }
  };

  return (
    <div className="space-y-6">
      {/* Top Budget Allocation Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Approved Cap</span>
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ${totalAllocated.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Q3 Fiscal Operational Cap
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Utilized to Date</span>
            <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ${totalSpent.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">
            {overallBurnPercent}% of quarterly budget consumed
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-100 dark:border-amber-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Committed (POs)</span>
            <div className="p-2 rounded-xl bg-amber-600/10 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            ${totalCommitted.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Pending hardware & vendor invoices
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900 border-purple-100 dark:border-purple-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Available Runway</span>
            <div className="p-2 rounded-xl bg-purple-600/10 text-purple-600">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
            ${(totalAllocated - totalSpent - totalCommitted).toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-purple-600 font-medium">
            Remaining reserve for Q3
          </div>
        </Card>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-600/10 text-purple-600">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">Departmental Budget Allocations</h3>
            <p className="text-[11px] text-slate-500">Track burn velocity and forecast expenditure caps</p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAllocateModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Allocate Department Budget
        </Button>
      </div>

      {/* Budget Allocation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {budgets.map((bud) => {
          const burn = Math.min(100, Math.round((bud.spentToDate / bud.allocatedBudget) * 100));
          const health = healthBadges[bud.health] || healthBadges.ON_TRACK;

          return (
            <Card
              key={bud.id}
              className="p-5 flex flex-col justify-between space-y-4 border border-slate-200 dark:border-slate-800"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    {bud.department}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${health.bg}`}>
                    {health.label}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {bud.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {bud.category}
                </p>
              </div>

              {/* Progress Burn Meter */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Budget Consumed:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ${bud.spentToDate.toLocaleString()} / <span className="text-slate-400">${bud.allocatedBudget.toLocaleString()}</span>
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      burn > 90 ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${burn}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Pending Commitments: ${bud.committedPending.toLocaleString()}</span>
                  <span className="font-mono font-bold text-indigo-600">{burn}% Burn</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Period: <strong className="text-slate-700 dark:text-slate-300">{bud.fiscalPeriod}</strong></span>
                <span>Manager: <strong className="text-slate-700 dark:text-slate-300">{bud.manager}</strong></span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Allocate Budget Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-600 text-white">
                  <PieChart className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Allocate Departmental Budget Cap</h3>
              </div>
              <button
                onClick={() => setShowAllocateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Budget Pool Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile QA Device Lab & Automated Testing"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option>Core Engineering & Design</option>
                    <option>DevOps & Infrastructure</option>
                    <option>AI & Data Science</option>
                    <option>Operations & Facilities</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Quarterly Cap ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Vendor Category Allocation</label>
                <input
                  type="text"
                  placeholder="e.g. BrowserStack, AWS Device Farm, Saucelabs"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowAllocateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Establish Budget Cap
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
