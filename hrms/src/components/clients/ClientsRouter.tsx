'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { ClientsListView } from './ClientsListView';
import { ClientPortalView } from './ClientPortalView';
import { ClientApprovalsView } from './ClientApprovalsView';
import { ClientTicketsView } from './ClientTicketsView';
import { 
  Building2, 
  ExternalLink, 
  FileBadge, 
  LifeBuoy 
} from 'lucide-react';

export const ClientsRouter: React.FC = () => {
  const { activePath, setActivePath } = useOfficeOS();

  // Navigation tabs for clients module
  const tabs = [
    { id: '/clients', label: 'All Clients', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: '/client-portal', label: 'Dedicated Client Portal', icon: <ExternalLink className="w-3.5 h-3.5" /> },
    { id: '/clients/approvals', label: 'Approvals & Sign-offs', icon: <FileBadge className="w-3.5 h-3.5" /> },
    { id: '/clients/support-tickets', label: 'Support & SLA Tickets', icon: <LifeBuoy className="w-3.5 h-3.5" /> },
  ];

  // Helper for Breadcrumbs
  const pathParts = activePath.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, i) => ({
    label: part.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    href: '/' + pathParts.slice(0, i + 1).join('/')
  }));

  // Determine current active view
  let currentView = <ClientsListView />;
  let title = 'Enterprise Client Accounts & Contract Portfolios';
  let subtitle = 'Unified client relationships, active master services agreements, financial ledgers, and delivery oversight';

  if (activePath.includes('portal')) {
    currentView = <ClientPortalView />;
    title = 'Dedicated Client Portal & Executive Dashboard';
    subtitle = 'White-label client experience for tracking active delivery progress, milestone sign-offs, and communication';
  } else if (activePath.includes('approvals')) {
    currentView = <ClientApprovalsView />;
    title = 'Client Sign-offs & Digital Verification Queue';
    subtitle = 'Cryptographic audit trail for contractual deliverables, SOW amendments, and production releases';
  } else if (activePath.includes('ticket') || activePath.includes('support')) {
    currentView = <ClientTicketsView />;
    title = 'Client Support Desk & SLA Incidents';
    subtitle = 'Priority incident response, automated SLA countdown timers, and on-call engineer dispatch';
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
          const isActive = activePath === tab.id;

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
