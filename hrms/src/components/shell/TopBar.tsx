'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { UserRole } from '@/types/officeos';
import { 
  Menu, 
  Search, 
  Plus, 
  Bell, 
  MessageSquare, 
  Video, 
  HelpCircle, 
  Check, 
  ShieldCheck, 
  Briefcase, 
  User as UserIcon, 
  Users,
  Building2,
  Clock,
  Sparkles,
  Crown
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentUser, 
    setCommandPaletteOpen, 
    setQuickCreateOpen, 
    setNotificationsOpen, 
    notifications, 
    setMobileSidebarOpen,
    setActivePath,
    activePath,
    isClockedIn,
    toggleClockInOut,
    isImpersonatingTenant,
    impersonatedTenant,
    exitTenantImpersonation,
    backendOnline
  } = useOfficeOS();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roleFilteredNotifications = notifications.filter(n => {
    if (!n.allowedRoles) return true;
    return n.allowedRoles.includes(currentRole);
  });

  const unreadCount = roleFilteredNotifications.filter(n => !n.read).length;

  const rolesList: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    { 
      role: 'SUPER_ADMIN', 
      label: 'Super Admin / Boss', 
      icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
      desc: 'Complete organizational access & governance'
    },
    { 
      role: 'MANAGER', 
      label: 'Manager / PM', 
      icon: <Briefcase className="w-4 h-4 text-emerald-500" />,
      desc: 'Team, project, client & sprint management'
    },
    { 
      role: 'EMPLOYEE', 
      label: 'Employee / Dev', 
      icon: <UserIcon className="w-4 h-4 text-blue-500" />,
      desc: 'Assigned tasks, meetings, time tracking'
    },
    { 
      role: 'HR', 
      label: 'HR Manager', 
      icon: <Users className="w-4 h-4 text-purple-500" />,
      desc: 'Employee directory, live attendance & leaves'
    },
    { 
      role: 'CLIENT', 
      label: 'Client Portal', 
      icon: <Building2 className="w-4 h-4 text-amber-500" />,
      desc: 'Restricted client portal & requirements view'
    },
  ];

  return (
    <div className="sticky top-0 z-20 w-full">
      {/* SaaS Impersonation Banner */}
      {isImpersonatingTenant && impersonatedTenant && (
        <div className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 truncate">
            <span className="p-1 rounded-md bg-white/20">
              <Crown className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">
              Viewing as Business Tenant: <strong className="underline underline-offset-2">{impersonatedTenant.companyName}</strong> ({impersonatedTenant.plan} Plan · {impersonatedTenant.employeeCount} Users)
            </span>
          </div>
          <button
            onClick={exitTenantImpersonation}
            className="ml-3 px-3 py-1 rounded-lg bg-white/20 hover:bg-white text-white hover:text-amber-800 font-extrabold text-[11px] whitespace-nowrap transition shadow-sm"
          >
            Exit Impersonation
          </button>
        </div>
      )}

      <header className="w-full h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 transition-colors">
        <div className="flex items-center justify-between h-full gap-3 max-w-full">
          
          {/* Left Section: Mobile Menu + Global Search Trigger */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Input Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-150 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-400 dark:text-slate-400 transition shadow-2xs group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Search people, projects, tasks, meetings...
                </span>
              </div>

              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 shadow-2xs">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Right Section: Meeting Pill, Attendance, Quick Create, Notifications, Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Platform Super Admin Button */}
            {currentRole === 'SUPER_ADMIN' && (
              <button
                onClick={() => setActivePath('/admin/platform-super-admin')}
                title="Platform Super Admin Panel (SaaS Multi-Tenancy)"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition shadow-2xs ${
                  activePath.includes('platform-super-admin')
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/30'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
                <span className="hidden sm:inline">Super Admin</span>
              </button>
            )}
          
          {/* Upcoming Meeting Indicator (1-click Join) */}
          <button
            onClick={() => setActivePath('/communication/meetings')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[140px] lg:max-w-none">
              NovaPay Sprint 14
            </span>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
              12m
            </span>
            <Video className="w-3.5 h-3.5 ml-0.5" />
          </button>

          {/* Live Backend API Status Badge */}
          <div 
            title={backendOnline ? "Backend Live: Laravel MySQL Connected" : "Backend Offline: Running in Standalone Mode"}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
              backendOnline 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800' 
                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{backendOnline ? 'Laravel API Connected' : 'Standalone Mode'}</span>
          </div>

          {/* Quick Attendance Clock In / Out Toggle */}
          <button
            onClick={toggleClockInOut}
            title={isClockedIn ? "You are Clocked In. Click to Clock Out" : "You are Clocked Out. Click to Clock In"}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition shadow-2xs ${
              isClockedIn
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300'
                : 'bg-slate-100 border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isClockedIn ? 'Clocked In' : 'Clock Out'}</span>
          </button>

          {/* Quick Create Global Button */}
          <button
            onClick={() => setQuickCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </button>

          {/* Chat Shortcut */}
          <button
            onClick={() => setActivePath('/communication/chat')}
            title="Open Team Chat"
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setNotificationsOpen(true)}
            title="Open Notifications"
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Help Center */}
          <button
            onClick={() => setActivePath('/knowledge-base')}
            title="Knowledge Base & Help"
            className="hidden sm:flex p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Role Switcher Pill & Dropdown */}
          <div className="relative pl-1 border-l border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setRoleMenuOpen(prev => !prev)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Click to Switch Role Perspective"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden xl:block text-left pr-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
                  {currentRole.replace('_', ' ')}
                </div>
              </div>
            </button>

            {/* Role Switcher Dropdown Modal */}
            {roleMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Switch User Role
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Live UI updates instantly to test permissions
                  </div>
                </div>

                <div className="space-y-1">
                  {rolesList.map((r) => {
                    const isSelected = currentRole === r.role;
                    return (
                      <button
                        key={r.role}
                        onClick={() => setCurrentRole(r.role)}
                        className={`w-full text-left p-2.5 rounded-xl transition flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="p-1 rounded-lg bg-white dark:bg-slate-800 shadow-2xs mt-0.5">
                            {r.icon}
                          </span>
                          <div>
                            <div className="text-xs font-bold flex items-center gap-1.5">
                              <span>{r.label}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                              {r.desc}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  </div>
);
};
