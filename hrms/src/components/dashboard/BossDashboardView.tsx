'use client';

import React, { useState, useEffect } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { 
  ShieldCheck, 
  Calendar, 
  Clock, 
  RefreshCw, 
  Sliders, 
  Plus, 
  Building2, 
  Filter, 
  CheckCircle2, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { 
  DEFAULT_DASHBOARD_WIDGETS, 
  DashboardWidgetConfig,
  PendingApprovalItem,
  TodayMeeting,
  UpcomingDeadlineItem
} from '@/lib/boss-dashboard-data';

import { ExecutiveKPIGrid } from './ExecutiveKPIGrid';
import { AttendanceSection } from './AttendanceSection';
import { MeetingsSection } from './MeetingsSection';
import { ProjectsSection } from './ProjectsSection';
import { FinancialSection } from './FinancialSection';
import { TaskSection } from './TaskSection';
import { EmployeeWorkloadSection } from './EmployeeWorkloadSection';
import { ProjectHealthMatrix } from './ProjectHealthMatrix';
import { DeadlinesTimeline } from './DeadlinesTimeline';
import { PendingApprovalsSection } from './PendingApprovalsSection';
import { RecentActivitySection } from './RecentActivitySection';
import { QuickActionsGrid } from './QuickActionsGrid';
import { DashboardCustomizerModal } from './DashboardCustomizerModal';

export const BossDashboardView: React.FC = () => {
  const { 
    currentUser, 
    setActivePath, 
    setQuickCreateOpen 
  } = useOfficeOS();

  // State
  const [timeFilter, setTimeFilter] = useState<'Today' | 'This Week' | 'This Month'>('Today');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All Departments');
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidgetConfig[]>(DEFAULT_DASHBOARD_WIDGETS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      showToast('Dashboard telemetry refreshed with latest data');
    }, 600);
  };

  const toggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  };

  const resetWidgets = () => {
    setWidgets(DEFAULT_DASHBOARD_WIDGETS);
    showToast('Dashboard widgets reset to default layout');
  };

  const isVisible = (id: string) => {
    return widgets.find((w) => w.id === id)?.visible ?? true;
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'new_project':
        setActivePath('/projects');
        setQuickCreateOpen(true);
        break;
      case 'schedule_meeting':
        setActivePath('/communication/meetings');
        setQuickCreateOpen(true);
        break;
      case 'assign_task':
        setActivePath('/my-work/tasks');
        setQuickCreateOpen(true);
        break;
      case 'generate_invoice':
        setActivePath('/finance/invoices');
        showToast('Navigating to Invoice Generator');
        break;
      case 'approve_leave':
        setActivePath('/hr/leaves');
        break;
      case 'broadcast':
        setActivePath('/communication/chat');
        showToast('Opening Company Broadcast Channel');
        break;
      case 'add_employee':
        setActivePath('/team/directory');
        showToast('Opening Employee Onboarding');
        break;
      case 'add_client':
        setActivePath('/clients');
        showToast('Opening Client Registration');
        break;
      case 'export_report':
        showToast('Exporting Executive Report (PDF/Excel)...');
        break;
      default:
        setQuickCreateOpen(true);
    }
  };

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-indigo-400/40 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Executive Header / Welcome Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Super Admin Command Center
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                <Building2 className="w-3 h-3 text-slate-400" />
                TechNova Solutions
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Welcome back. Company operational telemetry is healthy across 12 active client projects, 18 employees checked in, and ₹12.20L inward collections.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {todayFormatted}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Last updated: <strong className="text-slate-200">{lastUpdated}</strong>
              </span>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            {/* Quick time filter */}
            <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700/80 text-xs font-medium">
              {(['Today', 'This Week', 'This Month'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeFilter(period)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    timeFilter === period
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              title="Refresh Telemetry"
              className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>

            {/* Customize */}
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-200 hover:text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Customize</span>
            </button>

            {/* Quick Create */}
            <button
              onClick={() => setQuickCreateOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Create</span>
            </button>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Global Filter Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-200">Global Filtering:</span>
          <span>Showing data for <strong>{timeFilter}</strong></span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Department selector */}
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                showToast(`Filtered by ${e.target.value}`);
              }}
              className="appearance-none bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 pr-8 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="All Departments">All Departments</option>
              <option value="Executive">Executive Leadership</option>
              <option value="Engineering">Full-Stack Engineering</option>
              <option value="Design">UI/UX Design</option>
              <option value="QA">Quality Assurance</option>
              <option value="Mobile">Mobile Development</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={() => setActivePath('/admin/roles')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            RBAC Access Matrix &rarr;
          </button>
        </div>
      </div>

      {/* 2. Executive KPI Cards (Row 1): 8 Metrics */}
      {isVisible('kpis') && (
        <section>
          <ExecutiveKPIGrid />
        </section>
      )}

      {/* 3. Today's Attendance Overview */}
      {isVisible('attendance') && (
        <section>
          <AttendanceSection />
        </section>
      )}

      {/* 4. Today's Meetings & Syncs */}
      {isVisible('meetings') && (
        <section>
          <MeetingsSection
            onScheduleMeeting={() => {
              setActivePath('/communication/meetings');
              setQuickCreateOpen(true);
            }}
            onJoinMeeting={(meeting) => {
              showToast(`Launching Google Meet for ${meeting.title}`);
              window.open(meeting.meetUrl, '_blank');
            }}
            onViewNotes={() => {
              setActivePath('/ai/meeting-intelligence');
            }}
          />
        </section>
      )}

      {/* 5. Projects Overview & Financial Progress */}
      {isVisible('projects') && (
        <section>
          <ProjectsSection
            onNewProject={() => {
              setActivePath('/projects');
              setQuickCreateOpen(true);
            }}
            onSelectProject={(projectId) => {
              setActivePath('/projects');
            }}
          />
        </section>
      )}

      {/* 6. Financial Overview (INR ₹) */}
      {isVisible('finances') && (
        <section>
          <FinancialSection
            onNewInvoice={() => {
              setActivePath('/finance/invoices');
              setQuickCreateOpen(true);
            }}
            onExportReport={() => {
              showToast('Exporting INR Financial Statement to PDF...');
            }}
          />
        </section>
      )}

      {/* 7. Task Velocity & Priority Breakdown */}
      {isVisible('tasks') && (
        <section>
          <TaskSection
            onNewTask={() => {
              setActivePath('/my-work/tasks');
              setQuickCreateOpen(true);
            }}
            onOpenKanban={() => {
              setActivePath('/my-work/tasks');
            }}
          />
        </section>
      )}

      {/* Two Column Grid: Employee Workload & Project Health Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 8. Employee Workload */}
        {isVisible('workload') && (
          <EmployeeWorkloadSection
            onRebalanceWorkload={() => {
              showToast('Opening Sprint Capacity Rebalancer');
              setActivePath('/my-work/tasks');
            }}
            onViewEmployee={(empId) => {
              setActivePath('/team/directory');
            }}
          />
        )}

        {/* 9. Project Health Matrix */}
        {isVisible('health') && (
          <ProjectHealthMatrix
            onSelectProject={(projId) => {
              setActivePath('/projects');
            }}
          />
        )}
      </div>

      {/* Two Column Grid: Upcoming Deadlines & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 10. Upcoming Deadlines */}
        {isVisible('deadlines') && (
          <DeadlinesTimeline
            onSelectDeadline={(item) => {
              showToast(`Inspecting milestone: ${item.title}`);
              setActivePath('/projects');
            }}
          />
        )}

        {/* 11. Pending Approvals */}
        {isVisible('approvals') && (
          <PendingApprovalsSection
            onApprove={(id) => {
              showToast(`Approval authorized and signature recorded`);
            }}
            onReject={(id) => {
              showToast(`Request sent back for revisions`);
            }}
          />
        )}
      </div>

      {/* Two Column Grid: Recent Activity & Quick Actions Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 12. Recent Activity Audit Trail */}
        {isVisible('activity') && (
          <RecentActivitySection />
        )}

        {/* 13. Executive Command Shortcuts */}
        {isVisible('quick_actions') && (
          <QuickActionsGrid
            onActionClick={handleQuickAction}
          />
        )}
      </div>

      {/* Customizer Modal */}
      <DashboardCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        widgets={widgets}
        onToggleWidget={toggleWidget}
        onResetWidgets={resetWidgets}
      />
    </div>
  );
};
