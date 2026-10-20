'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProjectsListView } from './ProjectsListView';
import { KanbanBoardView } from './KanbanBoardView';
import { GanttTimelineView } from './GanttTimelineView';
import { MilestonesView } from './MilestonesView';
import { RequirementsView } from './RequirementsView';
import { TimesheetsView } from './TimesheetsView';
import { 
  FolderGit2, 
  Kanban, 
  GitCommit, 
  Flag, 
  FileCheck, 
  Clock, 
  CheckSquare 
} from 'lucide-react';

export const ProjectsRouter: React.FC = () => {
  const { activePath, setActivePath } = useOfficeOS();

  // Navigation tabs for projects suite
  const tabs = [
    { id: '/projects', label: 'All Projects', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
    { id: '/projects/kanban', label: 'Kanban Board', icon: <Kanban className="w-3.5 h-3.5" /> },
    { id: '/projects/gantt', label: 'Gantt Timeline', icon: <GitCommit className="w-3.5 h-3.5" /> },
    { id: '/projects/milestones', label: 'Milestones & SLA', icon: <Flag className="w-3.5 h-3.5" /> },
    { id: '/projects/requirements', label: 'Requirements (SOW)', icon: <FileCheck className="w-3.5 h-3.5" /> },
    { id: '/my-work/time', label: 'Time Tracking', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  // Helper for Breadcrumbs
  const pathParts = activePath.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, i) => ({
    label: part.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    href: '/' + pathParts.slice(0, i + 1).join('/')
  }));

  // Determine current active view
  let currentView = <ProjectsListView />;
  let title = 'Project Portfolio & Delivery Operations';
  let subtitle = 'Enterprise tracking across multi-sprint software projects, budgets, and engineering throughput';

  if (activePath.includes('kanban') || activePath === '/my-work/tasks' || activePath === '/my-work/todo') {
    currentView = <KanbanBoardView />;
    title = 'Interactive Kanban & Sprint Workflows';
    subtitle = '6-stage delivery pipeline: Backlog, To Do, In Progress, In Review, Client Approval, and Done';
  } else if (activePath.includes('gantt') || activePath.includes('timeline')) {
    currentView = <GanttTimelineView />;
    title = 'Delivery Gantt & Dependency Roadmaps';
    subtitle = 'High-level chronological view of sprints, release milestones, and critical path items';
  } else if (activePath.includes('milestones')) {
    currentView = <MilestonesView />;
    title = 'Contract Milestones & Client Sign-offs';
    subtitle = 'Track contractual deliverables, acceptance criteria verification, and legal client sign-offs';
  } else if (activePath.includes('requirements') || activePath.includes('sow')) {
    currentView = <RequirementsView />;
    title = 'Requirements & Scope Change Control (SOW)';
    subtitle = 'Functional specifications, client sign-off audit trail, and budget impact Change Requests';
  } else if (activePath.includes('time') || activePath.includes('timesheet')) {
    currentView = <TimesheetsView />;
    title = 'Time Tracking & Live Work Stopwatch';
    subtitle = 'Task-level stopwatch timers, weekly billable hour logs, and client billing ledger';
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
          const isActive = activePath === tab.id || 
            (tab.id === '/projects/kanban' && (activePath === '/my-work/tasks' || activePath === '/my-work/todo'));

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
