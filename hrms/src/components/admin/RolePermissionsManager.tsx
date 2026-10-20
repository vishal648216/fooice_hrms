'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { UserRole, RolePermissions } from '@/types/officeos';
import { 
  Key, 
  Check, 
  ShieldCheck, 
  Briefcase, 
  User as UserIcon, 
  Users, 
  Building2, 
  Eye, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

interface PermissionMeta {
  key: keyof RolePermissions;
  label: string;
  description: string;
  category: string;
}

export const RolePermissionsManager: React.FC = () => {
  const { 
    currentRole, 
    rolePermissions, 
    toggleRolePermission, 
    setCurrentRole,
    setImpersonatedRole,
    addToast 
  } = useOfficeOS();

  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('CLIENT');

  const permissionsList: PermissionMeta[] = [
    { key: 'canAccessMeetings', label: 'Video Meetings (Google Meet style) & AI Notes', description: 'Schedule and join video calls, access transcripts and AI notes', category: 'Communication' },
    { key: 'canAccessChat', label: 'Team Chat & WhatsApp-Style Messaging', description: 'Access channels, direct messages, and document sharing', category: 'Communication' },
    { key: 'canAccessWhiteboards', label: 'Collaborative Visual Whiteboards (Excalidraw)', description: 'View and edit vector architecture diagrams', category: 'Communication' },
    { key: 'canAccessProjects', label: 'Projects & Milestones', description: 'View project timelines, deliverables, and progress tracking', category: 'Projects' },
    { key: 'canAccessRequirements', label: 'Requirements & Change Requests', description: 'Review, approve, or submit engineering change requests', category: 'Projects' },
    { key: 'canAccessTasks', label: 'Sprint Tasks & Kanban Board', description: 'Manage developer tasks, backlog, and sprint boards', category: 'Work' },
    { key: 'canAccessAttendance', label: 'Attendance & Punch Timesheet', description: 'Daily clock-in, shift tracking, and leave requests', category: 'Office' },
    { key: 'canAccessHR', label: 'HR Operations (Employees, Leave Approvals)', description: 'Employee directory, department structure, and leave approvals', category: 'Office' },
    { key: 'canAccessFinance', label: 'Invoices, Payments & Expenses', description: 'Itemized invoices, wire payments, and tax receipts', category: 'Finance' },
    { key: 'canAccessClients', label: 'Clients & Client Portal', description: 'Customer directory and dedicated client portal hub', category: 'Clients' },
    { key: 'canAccessAI', label: 'AI Company Assistant & Meeting Intelligence', description: 'Query company assistant and automated meeting summaries', category: 'AI' },
    { key: 'canAccessFiles', label: 'Files & Knowledge Base', description: 'Company documents, guides, and shared team assets', category: 'Knowledge' },
    { key: 'canAccessAnalytics', label: 'Reports & Analytics', description: 'Export telemetry, financial charts, and team velocity', category: 'Analytics' },
    { key: 'canAccessAdmin', label: 'System Administration & Audit Logs', description: 'Role matrices, security logs, and company settings', category: 'Administration' },
  ];

  const rolesTabs: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'CLIENT', label: 'Client Partner', icon: <Building2 className="w-4 h-4" /> },
    { role: 'EMPLOYEE', label: 'Developer / Employee', icon: <UserIcon className="w-4 h-4" /> },
    { role: 'HR', label: 'HR Manager', icon: <Users className="w-4 h-4" /> },
    { role: 'MANAGER', label: 'Team Manager / PM', icon: <Briefcase className="w-4 h-4" /> },
    { role: 'SUPER_ADMIN', label: 'Super Admin', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleTestViewAs = (role: UserRole) => {
    setCurrentRole(role);
    addToast({
      title: `Testing as ${role.replace('_', ' ')}`,
      description: `Sidebar now shows only the permissions checked for this role.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Granular Role & Client Access Matrix (RBAC)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Super Admin Access Controller: Check or uncheck any module (e.g. WhatsApp Chat, Video Meet, Invoices, Whiteboards) to dynamically grant or revoke access for any role or client in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleTestViewAs(selectedRoleTab)}
            leftIcon={<Eye className="w-4 h-4" />}
          >
            Test View as {selectedRoleTab.replace('_', ' ')}
          </Button>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {rolesTabs.map((tab) => (
          <button
            key={tab.role}
            onClick={() => setSelectedRoleTab(tab.role)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedRoleTab === tab.role
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.role === 'CLIENT' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 font-extrabold">
                Customizable
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Permission Checkboxes Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Feature & Module Access Permissions for {selectedRoleTab.replace('_', ' ')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedRoleTab === 'SUPER_ADMIN' 
                ? 'Super Admin has permanent full system access.' 
                : 'Ticking a box immediately enables that menu item and feature in the sidebar and navigation.'}
            </p>
          </div>

          <Badge variant={selectedRoleTab === 'CLIENT' ? 'warning' : 'primary'} size="md">
            {selectedRoleTab} PERMISSIONS
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {permissionsList.map((perm) => {
            const isChecked = rolePermissions[selectedRoleTab]?.[perm.key] ?? false;
            const isSuperAdmin = selectedRoleTab === 'SUPER_ADMIN';

            return (
              <label
                key={perm.key}
                className={`p-4 rounded-2xl border transition flex items-start gap-3.5 cursor-pointer ${
                  isChecked
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/80 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                } ${isSuperAdmin ? 'opacity-80 cursor-default' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isSuperAdmin}
                  onChange={() => toggleRolePermission(selectedRoleTab, perm.key)}
                  className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {perm.label}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {perm.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {perm.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Any checkbox changes are saved automatically and take effect instantly.</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleTestViewAs(selectedRoleTab)}
          >
            Apply & Switch to {selectedRoleTab.replace('_', ' ')} View
          </Button>
        </div>
      </Card>

    </div>
  );
};
