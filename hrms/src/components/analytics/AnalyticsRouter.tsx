'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { 
  BarChart3, 
  Users, 
  FolderGit2, 
  DollarSign, 
  Calendar, 
  Download, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { ReportsOverviewView } from './ReportsOverviewView';
import { TeamPerformanceView } from './TeamPerformanceView';
import { ProjectAnalyticsView } from './ProjectAnalyticsView';
import { FinancialAnalyticsView } from './FinancialAnalyticsView';
import { AttendanceAnalyticsView } from './AttendanceAnalyticsView';

export const AnalyticsRouter: React.FC = () => {
  const { activePath, setActivePath, addToast } = useOfficeOS();

  // Sub-tabs navigation configuration
  const tabs = [
    {
      id: 'reports',
      label: 'Executive Reports',
      path: '/analytics/reports',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'team',
      label: 'Team Performance',
      path: '/analytics/team-performance',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'projects',
      label: 'Project Analytics',
      path: '/analytics/project-analytics',
      icon: <FolderGit2 className="w-4 h-4" />,
    },
    {
      id: 'finance',
      label: 'Financial Intelligence',
      path: '/analytics/financial-analytics',
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: 'attendance',
      label: 'Attendance Heatmap',
      path: '/analytics/attendance-analytics',
      icon: <Calendar className="w-4 h-4" />,
    },
  ];

  // Helper for Breadcrumbs
  const pathParts = activePath.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, i) => ({
    label: part.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    href: '/' + pathParts.slice(0, i + 1).join('/')
  }));

  const handleRefreshTelemetry = () => {
    addToast({
      title: 'Telemetry Refreshed',
      description: 'Synchronized live metrics across all department databases.',
      type: 'info',
    });
  };

  const renderActiveView = () => {
    if (activePath.includes('team-performance')) {
      return <TeamPerformanceView />;
    }
    if (activePath.includes('project-analytics')) {
      return <ProjectAnalyticsView />;
    }
    if (activePath.includes('financial-analytics')) {
      return <FinancialAnalyticsView />;
    }
    if (activePath.includes('attendance-analytics')) {
      return <AttendanceAnalyticsView />;
    }
    // Default to Reports Overview
    return <ReportsOverviewView />;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Page Header */}
      <PageHeader
        title="Enterprise Analytics, BI & Executive Intelligence"
        subtitle="Real-time organizational telemetry, developer velocity, financial health, burndown curves, and attendance heatmaps"
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefreshTelemetry}>
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Telemetry
            </Button>
            <Button variant="primary" size="sm" onClick={() => addToast({ title: 'Exporting BI Package', description: 'Generating comprehensive executive analytical pack.', type: 'success' })}>
              <Download className="w-3.5 h-3.5" /> Full BI Export
            </Button>
          </div>
        }
      />

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activePath === tab.path || (tab.id === 'reports' && activePath === '/analytics');
          return (
            <button
              key={tab.id}
              onClick={() => setActivePath(tab.path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sub View */}
      {renderActiveView()}

    </div>
  );
};
