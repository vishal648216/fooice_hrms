'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Users, 
  CheckSquare, 
  Clock, 
  Video, 
  AlertCircle, 
  TrendingUp, 
  Shield, 
  Briefcase, 
  UserCheck,
  ArrowRight,
  Send,
  Calendar
} from 'lucide-react';

export default function OverviewDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { currentRole, currentUser, users, tasks, groups, meetings, announcements, activityLogs } = useApp();

  const myTasks = tasks.filter(t => t.assignedToUserId === currentUser.id);
  const pendingReviews = tasks.filter(t => t.status === 'SUBMITTED_FOR_REVIEW');
  const activeTasks = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'TODO');
  const approvedTasks = tasks.filter(t => t.status === 'APPROVED');

  return (
    <div className="space-y-6">
      
      {/* Dynamic Role Hero Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl text-white shadow-xl relative overflow-hidden ${
        currentRole === 'ADMIN'
          ? 'bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 border border-indigo-700/50'
          : currentRole === 'MANAGER'
          ? 'bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 border border-emerald-700/50'
          : 'bg-gradient-to-r from-blue-900 via-sky-800 to-slate-900 border border-blue-700/50'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
              {currentRole === 'ADMIN' && <Shield className="w-3.5 h-3.5 text-indigo-300" />}
              {currentRole === 'MANAGER' && <Briefcase className="w-3.5 h-3.5 text-emerald-300" />}
              {currentRole === 'USER' && <UserCheck className="w-3.5 h-3.5 text-sky-300" />}
              <span>{currentRole} WORKSPACE ACTIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="mt-2 text-sm text-slate-200 max-w-2xl leading-relaxed">
              {currentRole === 'ADMIN' && 'Full system control active. Manage remote users, group chat rules, activity audits, and system storage.'}
              {currentRole === 'MANAGER' && 'Project oversight active. Assign tasks, track deadlines, review work submissions, and host Google Meet syncs.'}
              {currentRole === 'USER' && 'Member workspace active. Work on your assigned tasks, submit completed deliverables for manager review, and collaborate with your team.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('tasks')}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 shadow-md transition-all flex items-center gap-2"
            >
              <span>{currentRole === 'USER' ? 'My Tasks' : 'Manage Tasks'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium text-sm transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Team Chat</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow decoration */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {currentRole === 'USER' ? 'My Assigned Tasks' : 'Total Tasks'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentRole === 'USER' ? myTasks.length : tasks.length}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-medium">{activeTasks.length} in progress</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Awaiting Review
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {pendingReviews.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Needs manager review & approval
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Upcoming Meetings
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {meetings.length}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-medium">Google Meet ready</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Members
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {users.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Across {groups.length} active teams
            </div>
          </div>
        </div>

      </div>

      {/* Two-Column Grid: Task Pipeline & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Task Review Pipeline */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Task Lifecycle & Approval Pipeline
              </h2>
              <p className="text-xs text-slate-500">
                Directly from Excalidraw Module 6: Create &rarr; Assign &rarr; Submit &rarr; Review
              </p>
            </div>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View All ({tasks.length})
            </button>
          </div>

          <div className="space-y-3">
            {tasks.slice(0, 4).map((task) => {
              const statusColors: Record<string, { bg: string; text: string; label: string }> = {
                TODO: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', label: 'To Do' },
                IN_PROGRESS: { bg: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300', label: 'In Progress' },
                SUBMITTED_FOR_REVIEW: { bg: 'bg-amber-100 dark:bg-amber-950', text: 'text-amber-700 dark:text-amber-300', label: 'Submitted for Review' },
                APPROVED: { bg: 'bg-emerald-100 dark:bg-emerald-950', text: 'text-emerald-700 dark:text-emerald-300', label: 'Approved' },
                NEED_EDITS: { bg: 'bg-rose-100 dark:bg-rose-950', text: 'text-rose-700 dark:text-rose-300', label: 'Needs Edits' },
              };
              const statusInfo = statusColors[task.status] || statusColors.TODO;

              return (
                <div 
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 bg-slate-50/50 dark:bg-slate-800/40 transition gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        Assigned to: <strong className="text-slate-700 dark:text-slate-300">{task.assignedToName}</strong>
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {task.title}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Due: {task.deadline}</span>
                    </div>
                    <button
                      onClick={() => onNavigate('tasks')}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition"
                    >
                      {currentRole === 'USER' && task.status === 'IN_PROGRESS' ? 'Submit Work' : 'Details'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Broadcast Announcements & Logs */}
        <div className="space-y-6">
          
          {/* Announcements Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Announcements
              </h3>
              <button
                onClick={() => onNavigate('announcements')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
              >
                View ({announcements.length})
              </button>
            </div>
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {ann.title}
                    </span>
                    {ann.priority === 'IMPORTANT' && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-extrabold px-1.5 py-0.5 rounded">
                        HOT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-2">
                    By {ann.authorName} ({ann.authorRole})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Meetings Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-4 h-4 text-emerald-500" />
                <span>Google Meet Sync</span>
              </h3>
              <button
                onClick={() => onNavigate('meetings')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"
              >
                Schedule
              </button>
            </div>
            <div className="space-y-3">
              {meetings.slice(0, 2).map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {m.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {m.date} at {m.time} &bull; {m.groupName}
                  </div>
                  <a
                    href={m.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Meet</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
