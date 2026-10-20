'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { InvoicesListView } from './InvoicesListView';
import { PaymentsLedgerView } from './PaymentsLedgerView';
import { ExpensesManagerView } from './ExpensesManagerView';
import { BudgetsForecastView } from './BudgetsForecastView';
import { 
  Receipt, 
  CreditCard, 
  Wallet, 
  PieChart 
} from 'lucide-react';

export const FinanceRouter: React.FC = () => {
  const { activePath, setActivePath } = useOfficeOS();

  // Navigation tabs for finance module
  const tabs = [
    { id: '/finance/invoices', label: 'Itemized Invoices', icon: <Receipt className="w-3.5 h-3.5" /> },
    { id: '/finance/payments', label: 'Payments & Wire Ledger', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: '/finance/expenses', label: 'Corporate Expenses', icon: <Wallet className="w-3.5 h-3.5" /> },
    { id: '/finance/budgets', label: 'Budgets & Forecasting', icon: <PieChart className="w-3.5 h-3.5" /> },
  ];

  // Helper for Breadcrumbs
  const pathParts = activePath.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, i) => ({
    label: part.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    href: '/' + pathParts.slice(0, i + 1).join('/')
  }));

  // Determine current active view
  let currentView = <InvoicesListView />;
  let title = 'Financial Management & Itemized Invoicing';
  let subtitle = 'Corporate billing ledger, client invoices, incoming wire tracking, and tax compliance';

  if (activePath.includes('payment')) {
    currentView = <PaymentsLedgerView />;
    title = 'Corporate Payments & Wire Settlement Ledger';
    subtitle = 'Real-time incoming client wire receipts, Stripe ACH transfers, and banking reconciliation';
  } else if (activePath.includes('expense')) {
    currentView = <ExpensesManagerView />;
    title = 'Corporate Expenses & Vendor Claims';
    subtitle = 'Infrastructure hosting, SaaS seat licenses, IT equipment disbursements, and executive authorization';
  } else if (activePath.includes('budget')) {
    currentView = <BudgetsForecastView />;
    title = 'Departmental Budgets & Fiscal Forecasting';
    subtitle = 'Quarterly capital allocation caps, burn velocity monitors, and variance thresholds';
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
      />

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto select-none border border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const isActive = activePath === tab.id || (tab.id === '/finance/invoices' && activePath === '/finance');

          return (
            <button
              key={tab.id}
              onClick={() => setActivePath(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active View */}
      {currentView}
    </div>
  );
};
