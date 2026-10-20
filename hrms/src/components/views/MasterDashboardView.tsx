'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  FolderGit2, 
  CheckSquare, 
  Clock, 
  DollarSign, 
  Video, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Fingerprint, 
  ShieldCheck, 
  Briefcase, 
  User as UserIcon, 
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  FileCheck,
  CreditCard
} from 'lucide-react';

import { HRDashboardView } from './HRDashboardView';
import { ClientDashboardView } from './ClientDashboardView';
import { BossDashboardView } from '@/components/dashboard/BossDashboardView';

export const MasterDashboardView: React.FC = () => {
  const { 
    currentRole, 
    currentUser, 
    projects, 
    tasks, 
    meetings, 
    isClockedIn, 
    clockInTime, 
    toggleClockInOut,
    setActivePath,
    setQuickCreateOpen
  } = useOfficeOS();

  // Role-Specific Targeted Dashboard Views
  if (currentRole === 'SUPER_ADMIN') {
    return <BossDashboardView />;
  }

  if (currentRole === 'HR') {
    return <HRDashboardView />;
  }

  if (currentRole === 'CLIENT') {
    return <ClientDashboardView />;
  }

  const businessFlowSteps = [
    { label: 'Client', path: '/clients' },
    { label: 'Project', path: '/projects' },
    { label: 'Requirements', path: '/projects/requirements' },
    { label: 'Meeting', path: '/communication/meetings' },
    { label: 'AI Notes', path: '/ai/meeting-intelligence' },
    { label: 'Action Items', path: '/my-work/tasks' },
    { label: 'Tasks', path: '/my-work/tasks' },
    { label: 'Time Tracking', path: '/my-work/time' },
    { label: 'Approval', path: '/clients/approvals' },
    { label: 'Payment', path: '/finance/payments' },
    { label: 'Complete', path: '/projects' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Dynamic Role Greeting Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden transition-all duration-300 ${
        (currentRole as string) === 'MANAGER'
          ? 'bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 border border-emerald-800/40'
          : 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-800/40'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase">
              {(currentRole as string) === 'MANAGER' && <Briefcase className="w-3.5 h-3.5 text-emerald-300" />}
              {(currentRole as string) === 'EMPLOYEE' && <UserIcon className="w-3.5 h-3.5 text-blue-300" />}
              <span>{currentRole.replace('_', ' ')} WORKSPACE ACTIVE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {(currentRole as string) === 'MANAGER' && 'Delivery management view active. Track milestone completion, assign developer tasks, review pull requests, and organize client requirement syncs.'}
              {(currentRole as string) === 'EMPLOYEE' && 'Developer personal hub active. Clocked in for today. Work on your assigned tasks, review meeting transcripts, and submit deliverables for approval.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setActivePath('/my-work/tasks')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {currentRole === 'EMPLOYEE' ? 'My Sprint Tasks' : 'All Project Tasks'}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setQuickCreateOpen(true)}
            >
              + Quick Create
            </Button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Connected Business Flow Banner */}
      <Card className="border-indigo-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                OfficeOS Connected Business Flow
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
              Single Source of Truth Workflow
            </span>
          </div>

          {/* Stepper Trail */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
            {businessFlowSteps.map((step, idx) => {
              const isLast = idx === businessFlowSteps.length - 1;
              return (
                <React.Fragment key={step.label}>
                  <button
                    onClick={() => setActivePath(step.path)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition whitespace-nowrap shadow-2xs group shrink-0"
                  >
                    <span className="w-4 h-4 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                      {idx + 1}
                    </span>
                    <span>{step.label}</span>
                  </button>
                  {!isLast && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </Card>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Projects
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {projects.length}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">14 Milestones</span>
              <span>on schedule</span>
            </div>
          </div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {currentRole === 'EMPLOYEE' ? 'My Assigned Tasks' : 'Open Tasks'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {tasks.length}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-amber-600 font-bold">3 in review</span>
              <span>• 1 urgent blocker</span>
            </div>
          </div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Attendance & Time
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{isClockedIn ? '5h 42m' : 'Clocked Out'}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>{isClockedIn ? `Since ${clockInTime}` : 'Shift paused'}</span>
              <button
                onClick={toggleClockInOut}
                className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                {isClockedIn ? 'Clock Out' : 'Clock In'}
              </button>
            </div>
          </div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Invoiced Billing
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              $135,500
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">$90,500 collected</span>
              <span>• $45,000 pending</span>
            </div>
          </div>
        </Card>

      </div>

      {/* Two Column Section: Project Progress & Upcoming Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Projects Health & Sprints */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Active Client Deliveries & Project Health"
            subtitle="Real-time engineering progress, budgets, and milestone completion"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActivePath('/projects')}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                All Projects
              </Button>
            }
          />
          <CardBody className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-200 dark:hover:border-slate-700 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                        {project.code}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {project.name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Client: <strong>{project.clientName}</strong> • Target: {project.targetEndDate}
                    </div>
                  </div>

                  <Badge variant={project.status === 'ACTIVE' ? 'success' : 'primary'} size="sm">
                    {project.status}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Progress: {project.tasksSummary.done}/{project.tasksSummary.total} tasks completed</span>
                    <span className="font-bold text-slate-900 dark:text-white">{project.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {project.team.map((member, i) => (
                        <img
                          key={i}
                          src={member.avatar}
                          alt={member.name}
                          className="inline-block w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                        />
                      ))}
                    </div>
                    <span className="text-[11px]">Managed by {project.manager.name}</span>
                  </div>

                  <button
                    onClick={() => setActivePath('/projects')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    View Details &rarr;
                  </button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Right 1 Col: Upcoming Meetings & AI Intelligence */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Today's Meetings"
              subtitle="Google Meet & AI Transcripts"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActivePath('/communication/meetings')}
                >
                  Schedule
                </Button>
              }
            />
            <CardBody className="space-y-3">
              {meetings.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {m.title}
                    </div>
                    {m.hasAiNotes && (
                      <Badge variant="primary" size="sm" dot>
                        AI Notes
                      </Badge>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{m.date} at {m.startTime} - {m.endTime}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[10px] text-slate-400">
                      {m.participants.length} participants
                    </div>

                    <a
                      href={m.meetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-2xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meet</span>
                    </a>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Quick AI Intelligence Card */}
          <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-indigo-800">
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-300" />
                <h4 className="font-bold text-sm">OfficeOS AI Assistant</h4>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed">
                "Meeting with Nova Capital transcribed. 4 action items extracted and assigned to engineering sprint."
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={() => setActivePath('/ai/meeting-intelligence')}
              >
                Inspect AI Meeting Intelligence
              </Button>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
