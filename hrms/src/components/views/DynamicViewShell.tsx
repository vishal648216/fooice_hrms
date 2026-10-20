'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { 
  MOCK_CLIENTS, 
  MOCK_INVOICES, 
  MOCK_ATTENDANCE, 
  MOCK_TASKS, 
  MOCK_PROJECTS, 
  MOCK_MEETINGS 
} from '@/lib/officeos-data';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  PenTool, 
  Fingerprint, 
  Download, 
  Sparkles, 
  Bot, 
  Building2, 
  Receipt, 
  Calendar, 
  Clock, 
  ExternalLink,
  Kanban,
  FileCheck,
  GitPullRequest,
  Shield,
  Key,
  FolderGit2,
  HardDrive,
  Lock,
  Crown
} from 'lucide-react';

import { PlatformSuperAdminPanel } from '@/components/platform-admin/PlatformSuperAdminPanel';
import { RolePermissionsManager } from '@/components/admin/RolePermissionsManager';
import UsersAndGroupsManager from '@/components/admin/UsersAndGroupsManager';
import ActivityLogsView from '@/components/admin/ActivityLogsView';
import { OfficeManagementRouter } from '@/components/office/OfficeManagementRouter';
import { CalendarView } from '@/components/calendar/CalendarView';
import { MeetingsRouter } from '@/components/calendar/MeetingsRouter';
import { ChatView } from '@/components/chat/ChatView';
import { ProjectsRouter } from '@/components/projects/ProjectsRouter';
import { ClientsRouter } from '@/components/clients/ClientsRouter';
import { FinanceRouter } from '@/components/finance/FinanceRouter';
import { FilesRouter } from '@/components/files/FilesRouter';
import { WhiteboardRouter } from '@/components/whiteboard/WhiteboardRouter';
import { AnalyticsRouter } from '@/components/analytics/AnalyticsRouter';
import { AIRouter } from '@/components/ai/AIRouter';

export const DynamicViewShell: React.FC = () => {
  const { activePath, setActivePath, setQuickCreateOpen, addToast, isModuleEnabled, currentTenant, currentRole } = useOfficeOS();
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Sarah Montgomery (Manager)', time: '09:30 AM', text: 'Good morning team! Please submit task updates before 11 AM.' },
    { sender: 'Arjun Nambiar (Dev)', time: '09:42 AM', text: 'WebAuthn passkeys PR has been pushed to staging for review.' },
    { sender: 'Marcus Sterling (Client)', time: '10:05 AM', text: 'Looking forward to our sprint delivery review call at 10:30.' }
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'You', time: 'Just now', text: chatMessage }
    ]);
    setChatMessage('');
    addToast({
      title: 'Message Sent',
      description: 'Broadcast to #general-engineering channel.',
      type: 'success',
    });
  };

  // Helper for Breadcrumbs
  const pathParts = activePath.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, i) => ({
    label: part.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    href: '/' + pathParts.slice(0, i + 1).join('/')
  }));

  // Route: /admin/platform-super-admin (SaaS Tenants, Plans & Module Management)
  if (
    activePath.includes('platform-super-admin') || 
    activePath.includes('platform-admin') || 
    activePath === '/super-admin' || 
    activePath.includes('tenants')
  ) {
    return <PlatformSuperAdminPanel />;
  }

  // Route: /admin/* (RBAC, Users, Audit Logs)
  if (activePath.includes('roles')) {
    return <RolePermissionsManager />;
  }
  if (activePath.includes('users') || activePath === '/admin/users') {
    return <UsersAndGroupsManager />;
  }
  if (activePath.includes('audit-logs') || activePath.includes('log')) {
    return <ActivityLogsView />;
  }

  // SaaS Tenant Module Subscription Guard
  const getPathModuleKey = (path: string): string | null => {
    if (path.startsWith('/office/attendance') || path.startsWith('/office/shifts')) return 'attendance';
    if (path.startsWith('/office/leave') || path.startsWith('/office/holidays')) return 'leave';
    if (path.startsWith('/office')) return 'employees';
    if (path.startsWith('/projects') || path.includes('kanban') || path.includes('gantt') || path.includes('milestones')) return 'projects';
    if (path.startsWith('/my-work/tasks') || path.startsWith('/my-work/todo')) return 'tasks';
    if (path.includes('chat') || path.includes('groups')) return 'chat';
    if (path.startsWith('/communication/meetings') || path.startsWith('/meetings')) return 'meetings';
    if (path.includes('whiteboard')) return 'whiteboard';
    if (path.includes('client') || path.startsWith('/clients')) return 'clients';
    if (path.startsWith('/finance') || path.includes('invoice') || path.includes('payment') || path.includes('expense') || path.includes('budget')) return 'finance';
    if (path.startsWith('/files') || path.startsWith('/documents') || path.includes('knowledge')) return 'files';
    if (path.startsWith('/analytics') || path.startsWith('/reports')) return 'analytics';
    if (path.startsWith('/ai')) return 'ai';
    return null;
  };

  const pathModuleKey = getPathModuleKey(activePath);
  if (pathModuleKey && !isModuleEnabled(pathModuleKey)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] p-8 text-center max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 ring-8 ring-amber-500/5">
          <Lock className="w-8 h-8" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-3">
          Module Disabled by Super Admin
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Module Not Subscribed
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          The <strong className="text-slate-800 dark:text-slate-200 uppercase">{pathModuleKey}</strong> module is currently deactivated for <strong>{currentTenant?.companyName}</strong> on the <strong>{currentTenant?.plan}</strong> plan.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          To enable this feature for your business workspace, please contact your Platform Super Admin to update your tenant subscription package.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => setActivePath('/dashboard')}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Back to Dashboard
          </button>
          {currentRole === 'SUPER_ADMIN' && (
            <button
              onClick={() => setActivePath('/admin/platform-super-admin')}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm shadow-indigo-600/20 flex items-center gap-2"
            >
              <Crown className="w-3.5 h-3.5" />
              Open Platform Super Admin
            </button>
          )}
        </div>
      </div>
    );
  }

  // Route: /my-work/calendar
  if (activePath.startsWith('/my-work/calendar') || activePath === '/calendar') {
    return <CalendarView />;
  }

  // Route: /communication/meetings
  if (activePath.startsWith('/communication/meetings') || activePath.startsWith('/meetings')) {
    return <MeetingsRouter />;
  }

  // Route: /projects/* or /my-work/tasks, /my-work/todo, /my-work/time
  if (
    activePath.startsWith('/projects') || 
    activePath.startsWith('/my-work/tasks') || 
    activePath.startsWith('/my-work/todo') || 
    activePath.startsWith('/my-work/time') ||
    activePath.includes('kanban') ||
    activePath.includes('gantt') ||
    activePath.includes('milestones') ||
    activePath.includes('requirements')
  ) {
    return <ProjectsRouter />;
  }

  // Route: /communication/chat or /communication/groups
  if (activePath.includes('chat') || activePath.includes('groups') || activePath.includes('direct-messages')) {
    return <ChatView />;
  }

  // Route: /communication/whiteboards (Collaborative Excalidraw Engine)
  if (activePath.includes('whiteboard')) {
    return <WhiteboardRouter />;
  }

  // Route: /office/* (Office Management Module)
  if (activePath.startsWith('/office')) {
    return <OfficeManagementRouter />;
  }

  // Route: /clients, /client-portal, /clients/approvals, /clients/support-tickets
  if (activePath.includes('client') || activePath.startsWith('/clients') || activePath === '/client-portal') {
    return <ClientsRouter />;
  }

  // Route: /finance, /finance/invoices, /finance/payments, /finance/expenses, /finance/budgets
  if (
    activePath.startsWith('/finance') || 
    activePath.includes('invoice') || 
    activePath.includes('payment') || 
    activePath.includes('expense') ||
    activePath.includes('budget')
  ) {
    return <FinanceRouter />;
  }

  // Route: /files, /documents, /knowledge-base, /wiki
  if (
    activePath.startsWith('/files') || 
    activePath.startsWith('/documents') || 
    activePath.includes('knowledge') || 
    activePath.includes('wiki')
  ) {
    return <FilesRouter />;
  }

  // Route: /analytics/* (Enterprise BI & Reports Suite)
  if (
    activePath.startsWith('/analytics') || 
    activePath.includes('report') || 
    activePath.includes('performance') ||
    activePath.includes('analytics')
  ) {
    return <AnalyticsRouter />;
  }

  // Route: /ai/assistant or /ai/meeting-intelligence
  if (activePath.includes('ai') || activePath.startsWith('/ai')) {
    return <AIRouter />;
  }

  // Default Fallback View for other routes
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title={pathParts[pathParts.length - 1]?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Module View'}
        subtitle={`Enterprise production module for ${activePath}`}
        breadcrumbs={breadcrumbs}
        actions={
          <Button variant="primary" size="sm" onClick={() => setQuickCreateOpen(true)}>
            + Quick Action
          </Button>
        }
      />

      <Card className="p-8">
        <EmptyState
          icon={<FolderGit2 className="w-6 h-6" />}
          title={`Active Workspace View: ${activePath}`}
          description="All enterprise records, data tables, and live event webhooks for this section are connected to the central OfficeOS state."
          actionLabel="Create First Record"
          onAction={() => setQuickCreateOpen(true)}
        />
      </Card>
    </div>
  );
};
