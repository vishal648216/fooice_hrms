'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { 
  X, 
  Bell, 
  CheckCheck, 
  AtSign, 
  CheckSquare, 
  Video, 
  FileBadge, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotificationsDrawer: React.FC = () => {
  const { 
    isNotificationsOpen, 
    setNotificationsOpen, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    setActivePath,
    currentRole
  } = useOfficeOS();

  const [activeTab, setActiveTab] = useState<string>('ALL');

  if (!isNotificationsOpen) return null;

  const roleFiltered = notifications.filter(n => {
    if (!n.allowedRoles) return true;
    return n.allowedRoles.includes(currentRole);
  });

  const filtered = roleFiltered.filter(n => {
    if (activeTab === 'MENTIONS') return n.category === 'MENTION';
    if (activeTab === 'TASKS') return n.category === 'TASK';
    if (activeTab === 'APPROVALS') return n.category === 'APPROVAL';
    return true;
  });

  const categoryIcons = {
    MENTION: <AtSign className="w-3.5 h-3.5 text-blue-500" />,
    TASK: <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />,
    MEETING: <Video className="w-3.5 h-3.5 text-rose-500" />,
    APPROVAL: <FileBadge className="w-3.5 h-3.5 text-amber-500" />,
    SYSTEM: <Bell className="w-3.5 h-3.5 text-slate-500" />,
  };

  const handleNotificationClick = (id: string, actionUrl?: string) => {
    markNotificationAsRead(id);
    if (actionUrl) {
      setActivePath(actionUrl);
      setNotificationsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Notifications
              </h2>
              <p className="text-[11px] text-slate-500">
                Real-time activity alerts and team updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={markAllNotificationsAsRead}
              title="Mark All as Read"
              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'MENTIONS', label: 'Mentions' },
            { id: 'TASKS', label: 'Tasks' },
            { id: 'APPROVALS', label: 'Approvals' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No notifications in this filter category.
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n.id, n.actionUrl)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 group ${
                  !n.read
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200/80 dark:border-indigo-800/60'
                    : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {categoryIcons[n.category] || <Bell className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {n.description}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{n.timestamp}</span>
                    </span>
                    {n.actionUrl && (
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5">
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500">
          <span>{notifications.filter(n => !n.read).length} unread alerts</span>
          <Button variant="ghost" size="sm" onClick={() => setNotificationsOpen(false)}>
            Close Drawer
          </Button>
        </div>

      </div>
    </div>
  );
};
