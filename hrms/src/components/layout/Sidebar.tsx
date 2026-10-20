'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  MessageSquare, 
  Video, 
  Megaphone, 
  Users, 
  Activity, 
  Lock,
  ChevronRight,
  Shield,
  Briefcase,
  User as UserIcon
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, onSelectTab }: SidebarProps) {
  const { currentRole, tasks, announcements } = useApp();

  const pendingCount = tasks.filter(t => t.status === 'SUBMITTED_FOR_REVIEW').length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['ADMIN', 'MANAGER', 'USER'],
    },
    {
      id: 'tasks',
      label: 'Work / Tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingCount > 0 ? `${pendingCount} review` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      roles: ['ADMIN', 'MANAGER', 'USER'],
    },
    {
      id: 'chat',
      label: 'Group Chat',
      icon: <MessageSquare className="w-4 h-4" />,
      roles: ['ADMIN', 'MANAGER', 'USER'],
    },
    {
      id: 'meetings',
      label: 'Google Meet',
      icon: <Video className="w-4 h-4" />,
      roles: ['ADMIN', 'MANAGER', 'USER'],
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: <Megaphone className="w-4 h-4" />,
      badge: `${announcements.length}`,
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
      roles: ['ADMIN', 'MANAGER', 'USER'],
    },
    {
      id: 'users',
      label: 'Users & Groups',
      icon: <Users className="w-4 h-4" />,
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      id: 'logs',
      label: 'Activity Logs',
      icon: <Activity className="w-4 h-4" />,
      roles: ['ADMIN'],
    },
  ];

  return (
    <aside className="w-full lg:w-64 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-4 flex flex-col justify-between shrink-0">
      
      <div className="space-y-6">
        
        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Navigation Menu
          </div>

          {menuItems.map((item) => {
            const hasAccess = item.roles.includes(currentRole);
            const active = activeTab === item.id;

            if (!hasAccess) {
              return (
                <div
                  key={item.id}
                  title={`Restricted to ${item.roles.join(', ')}`}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 opacity-40 cursor-not-allowed select-none"
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <Lock className="w-3 h-3 text-slate-400" />
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={active ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      active ? 'bg-white/20 text-white' : item.badgeColor
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight className="w-3.5 h-3.5 opacity-75" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Excalidraw Architecture Reference Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-purple-50/60 dark:from-slate-800 dark:to-slate-800/60 border border-indigo-100 dark:border-slate-700 text-xs space-y-2">
          <div className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Excalidraw Workflow</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            All 7 blueprint flows integrated: Auth & Role Gates, Task Review Pipeline, Chat Permissions, and Google Meet.
          </p>
        </div>

      </div>

      {/* Role State Banner at bottom of sidebar */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            {currentRole === 'ADMIN' && <Shield className="w-4 h-4" />}
            {currentRole === 'MANAGER' && <Briefcase className="w-4 h-4" />}
            {currentRole === 'USER' && <UserIcon className="w-4 h-4" />}
          </div>
          <div className="text-left truncate">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {currentRole} Access
            </div>
            <div className="text-[10px] text-slate-400">
              Role permissions enabled
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
