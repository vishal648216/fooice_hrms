'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  Workspace, 
  NotificationItem, 
  TaskItem, 
  ProjectItem, 
  MeetingItem, 
  RolePermissions, 
  LeaveRequest,
  Tenant,
  TenantPlan,
  TenantStatus
} from '@/types/officeos';
import { 
  WORKSPACES, 
  MOCK_USERS, 
  MOCK_NOTIFICATIONS, 
  MOCK_TASKS, 
  MOCK_PROJECTS, 
  MOCK_MEETINGS, 
  MOCK_LEAVE_REQUESTS, 
  DEFAULT_ROLE_PERMISSIONS,
  INITIAL_TENANTS
} from '@/lib/officeos-data';
import { api } from '@/lib/api-client';
import { authService, AuthUser } from '@/services/authService';
import { attendanceService } from '@/services/attendanceService';
import { projectService } from '@/services/projectService';
import { taskService } from '@/services/taskService';
import { platformService } from '@/services/platformService';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface OfficeOSContextType {
  isLoggedIn: boolean;
  login: (role: UserRole) => void;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  currentWorkspace: Workspace;
  setCurrentWorkspace: (ws: Workspace) => void;
  activePath: string;
  setActivePath: (path: string) => void;

  // Backend Connection Status
  backendOnline: boolean;
  checkBackendHealth: () => Promise<boolean>;

  // RBAC Permission Checkbox Matrix
  rolePermissions: Record<UserRole, RolePermissions>;
  toggleRolePermission: (role: UserRole, permissionKey: keyof RolePermissions) => void;
  hasPermission: (permissionKey: keyof RolePermissions) => boolean;

  // Super Admin Impersonation ("View As Role")
  impersonatedRole: UserRole | null;
  setImpersonatedRole: (role: UserRole | null) => void;

  // SaaS Multi-Tenant Platform Super Admin
  tenants: Tenant[];
  currentTenant: Tenant;
  isImpersonatingTenant: boolean;
  impersonatedTenant: Tenant | null;
  updateTenantModules: (tenantId: string, modules: Record<string, boolean>) => void;
  updateTenantStatus: (tenantId: string, status: TenantStatus) => void;
  updateTenantPlan: (tenantId: string, plan: TenantPlan) => void;
  addTenant: (newTenant: Tenant) => void;
  deleteTenant: (tenantId: string) => void;
  impersonateTenant: (tenantId: string) => void;
  exitTenantImpersonation: () => void;
  isModuleEnabled: (moduleKey?: string) => boolean;
  
  // Overlays
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isQuickCreateOpen: boolean;
  setQuickCreateOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  // Attendance Simulator / Live API
  isClockedIn: boolean;
  clockInTime: string;
  toggleClockInOut: () => Promise<void>;

  // Data & Mutators
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  tasks: TaskItem[];
  projects: ProjectItem[];
  meetings: MeetingItem[];
  leaveRequests: LeaveRequest[];
  approveLeaveRequest: (id: string) => void;
  refreshBackendData: () => Promise<void>;

  // Toast System
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const OfficeOSContext = createContext<OfficeOSContextType | undefined>(undefined);

export function OfficeOSProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentRole, setCurrentRoleState] = useState<UserRole>('SUPER_ADMIN');
  const [impersonatedRole, setImpersonatedRole] = useState<UserRole | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(WORKSPACES[0]);
  const [activePath, setActivePathState] = useState<string>('/dashboard');
  const [backendOnline, setBackendOnline] = useState<boolean>(false);

  // RBAC permissions state initialized with defaults
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, RolePermissions>>(DEFAULT_ROLE_PERMISSIONS);

  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isQuickCreateOpen, setQuickCreateOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState('');

  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [tasks, setTasks] = useState<TaskItem[]>(MOCK_TASKS);
  const [projects, setProjects] = useState<ProjectItem[]>(MOCK_PROJECTS);
  const [meetings, setMeetings] = useState<MeetingItem[]>(MOCK_MEETINGS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // SaaS Tenants Management State
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [impersonatedTenantId, setImpersonatedTenantId] = useState<string | null>(null);

  // Check Backend Health & Initialize
  const checkBackendHealth = async (): Promise<boolean> => {
    const isOnline = await api.checkHealth();
    setBackendOnline(isOnline);
    return isOnline;
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000); // Heartbeat every 30s
    return () => clearInterval(interval);
  }, []);

  // Sync Live Data from Backend
  const refreshBackendData = async () => {
    try {
      const isOnline = await checkBackendHealth();
      if (!isOnline) return;

      // Check today's attendance
      const attRes = await attendanceService.getTodayAttendance();
      if (attRes.success && attRes.data?.clock_in) {
        setIsClockedIn(!attRes.data.clock_out);
        setClockInTime(new Date(attRes.data.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }

      // Fetch projects
      const projRes = await projectService.getProjects();
      if (projRes.success && projRes.data?.data) {
        const liveProjs: ProjectItem[] = projRes.data.data.map((p: any) => ({
          id: `p-${p.id}`,
          name: p.name,
          code: p.code || `PRJ-${p.id}`,
          clientName: p.client?.company_name || 'Acme Global Corp',
          clientId: String(p.client_id || 'c-1'),
          manager: MOCK_USERS.super_admin,
          team: [MOCK_USERS.super_admin, MOCK_USERS.employee],
          status: (p.status || 'ACTIVE') as any,
          progressPercent: p.progress_percent || 0,
          budget: Number(p.budget || 0),
          spent: Number(p.spent || 0),
          startDate: p.start_date || '2026-09-01',
          targetEndDate: p.target_end_date || '2026-12-31',
          tasksSummary: { total: p.tasks_count || 2, done: 1, inReview: 0 },
          repoUrl: p.repo_url || undefined,
        }));
        if (liveProjs.length > 0) {
          setProjects(liveProjs);
        }
      }

      // Fetch tasks
      const taskRes = await taskService.getTasks();
      if (taskRes.success && Array.isArray(taskRes.data)) {
        const liveTasks: TaskItem[] = taskRes.data.map((t: any) => ({
          id: `t-${t.id}`,
          title: t.title,
          code: t.code || `TASK-${t.id}`,
          description: t.description || '',
          projectId: String(t.project_id || 'p-1'),
          projectName: t.project?.name || 'General Project',
          assignee: MOCK_USERS.employee,
          reporter: MOCK_USERS.super_admin,
          priority: (t.priority || 'MEDIUM') as any,
          status: (t.status || 'TODO') as any,
          dueDate: t.due_date ? new Date(t.due_date).toLocaleDateString() : 'Upcoming',
          estimatedHours: Number(t.estimated_hours || 0),
          loggedHours: Number(t.logged_hours || 0),
          labels: t.labels || ['Development'],
          commentsCount: t.comments_count || 0,
          attachmentsCount: t.attachments_count || 0,
        }));
        if (liveTasks.length > 0) {
          setTasks(liveTasks);
        }
      }
    } catch {
      // Graceful fallback to mock data
    }
  };

  // Load saved state from localStorage if available
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('officeos_role') as UserRole;
      if (savedRole && ['SUPER_ADMIN', 'MANAGER', 'EMPLOYEE', 'HR', 'CLIENT'].includes(savedRole)) {
        setCurrentRoleState(savedRole);
      }
      const savedPermissions = localStorage.getItem('officeos_permissions');
      if (savedPermissions) {
        setRolePermissions(JSON.parse(savedPermissions));
      }
      const savedTenants = localStorage.getItem('officeos_tenants');
      if (savedTenants) {
        setTenants(JSON.parse(savedTenants));
      }
      refreshBackendData();
    } catch {}
  }, []);

  // Sync tenants updates to localStorage
  const saveTenants = (updatedTenants: Tenant[]) => {
    setTenants(updatedTenants);
    try {
      localStorage.setItem('officeos_tenants', JSON.stringify(updatedTenants));
    } catch {}
  };

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setQuickCreateOpen(false);
        setNotificationsOpen(false);
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loginWithCredentials = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data?.user) {
        const user = res.data.user;
        const role = (user.role || 'EMPLOYEE') as UserRole;
        setCurrentRoleState(role);
        setIsLoggedIn(true);
        setActivePath('/dashboard');
        
        // Sync company name to workspace
        if (user.tenant) {
          setCurrentWorkspace({
            id: `ws-${user.tenant.id}`,
            name: user.tenant.company_name,
            slug: user.tenant.slug,
            logo: user.tenant.company_name.slice(0, 2).toUpperCase(),
            plan: user.tenant.plan as any,
            memberCount: 50,
            tenantId: String(user.tenant.id),
          });
        }

        addToast({
          title: `Welcome back, ${user.name}!`,
          description: `Logged in to ${user.tenant?.company_name || 'TechCorp'}.`,
          type: 'success',
        });

        refreshBackendData();
        return { success: true };
      } else {
        return { success: false, message: res.message || 'Invalid email or password.' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Connection error.' };
    }
  };

  const login = (role: UserRole) => {
    setCurrentRoleState(role);
    setImpersonatedRole(null);
    setIsLoggedIn(true);
    setActivePath('/dashboard');
    try {
      localStorage.setItem('officeos_role', role);
    } catch {}
    addToast({
      title: `Welcome to OfficeOS`,
      description: `Authenticated as ${role.replace('_', ' ')}. Portal initialized.`,
      type: 'success',
    });
  };

  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
    addToast({
      title: `Logged Out`,
      description: `Session terminated. Redirected to login portal.`,
      type: 'info',
    });
  };

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setImpersonatedRole(null);
    try {
      localStorage.setItem('officeos_role', role);
    } catch {}
    addToast({
      title: `Active Role: ${role.replace('_', ' ')}`,
      description: `Permissions and dashboard refreshed to ${role.toLowerCase()} context.`,
      type: 'info',
    });
  };

  const setActivePath = (path: string) => {
    setActivePathState(path);
    setMobileSidebarOpen(false);
  };

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Toggle role permission checkbox (Super Admin control)
  const toggleRolePermission = (role: UserRole, permissionKey: keyof RolePermissions) => {
    setRolePermissions(prev => {
      const currentVal = prev[role][permissionKey];
      const updated = {
        ...prev,
        [role]: {
          ...prev[role],
          [permissionKey]: !currentVal,
        }
      };
      try {
        localStorage.setItem('officeos_permissions', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    addToast({
      title: `Permission Updated`,
      description: `Updated "${permissionKey}" for ${role.replace('_', ' ')}.`,
      type: 'info',
    });
  };

  // Active role effective check (considering Super Admin impersonation)
  const effectiveRole = impersonatedRole || currentRole;

  const hasPermission = (permissionKey: keyof RolePermissions): boolean => {
    // Super admin always has 100% access unless currently testing in impersonation mode
    if (currentRole === 'SUPER_ADMIN' && !impersonatedRole) return true;
    return !!rolePermissions[effectiveRole]?.[permissionKey];
  };

  const toggleClockInOut = async () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isClockedIn) {
      setIsClockedIn(false);
      
      // Live API Call
      await attendanceService.clockOut();

      // Push notification
      const newNotif: NotificationItem = {
        id: `notif-clockout-${Date.now()}`,
        title: `${currentUser.name} Clocked Out (${now})`,
        description: `${currentUser.title} has clocked out. Daily shift duration logged to HR records.`,
        timestamp: 'Just now',
        category: 'SYSTEM',
        read: false,
        actionUrl: '/office/attendance',
        allowedRoles: ['SUPER_ADMIN', 'MANAGER', 'HR'],
      };
      setNotifications(prev => [newNotif, ...prev]);

      addToast({
        title: 'Clocked Out Successfully',
        description: 'Shift time logged into HR attendance system (Boss, HR & Manager notified).',
        type: 'warning',
      });
    } else {
      setIsClockedIn(true);
      setClockInTime(now);

      // Live API Call
      await attendanceService.clockIn({ address: 'Office Location' }, 'Punched from OfficeOS Web Portal');

      // Push notification
      const newNotif: NotificationItem = {
        id: `notif-clockin-${Date.now()}`,
        title: `${currentUser.name} Clocked In (${now})`,
        description: `${currentUser.title} registered biometric punch. Telemetry broadcasted to Boss, HR & Manager.`,
        timestamp: 'Just now',
        category: 'SYSTEM',
        read: false,
        actionUrl: '/office/attendance',
        allowedRoles: ['SUPER_ADMIN', 'MANAGER', 'HR'],
      };
      setNotifications(prev => [newNotif, ...prev]);

      addToast({
        title: 'Clocked In Successfully',
        description: `Punch registered at ${now}. Boss, HR & Team Leader notified.`,
        type: 'success',
      });
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast({
      title: 'Notifications Cleared',
      description: 'All notifications marked as read.',
      type: 'info',
    });
  };

  const approveLeaveRequest = (id: string) => {
    setLeaveRequests(prev => prev.map(lr => lr.id === id ? { ...lr, status: 'APPROVED' } : lr));
    addToast({
      title: 'Leave Approved',
      description: 'The employee leave request has been officially approved.',
      type: 'success',
    });
  };

  // Current Tenant Resolution
  const currentTenant: Tenant = 
    tenants.find(t => t.id === impersonatedTenantId) ||
    tenants.find(t => t.id === currentWorkspace.tenantId) ||
    tenants.find(t => t.companyName.toLowerCase() === currentWorkspace.name.toLowerCase()) ||
    tenants[0];

  const impersonatedTenant = impersonatedTenantId ? (tenants.find(t => t.id === impersonatedTenantId) || null) : null;
  const isImpersonatingTenant = !!impersonatedTenantId;

  const updateTenantModules = (tenantId: string, modules: Record<string, boolean>) => {
    const updated = tenants.map(t => t.id === tenantId ? { ...t, modules } : t);
    saveTenants(updated);
    platformService.updateTenantModules(tenantId, modules);
    const target = tenants.find(t => t.id === tenantId);
    addToast({
      title: 'Module Access Updated',
      description: `Modules updated for ${target?.companyName || 'tenant'}.`,
      type: 'success',
    });
  };

  const updateTenantStatus = (tenantId: string, status: TenantStatus) => {
    const updated = tenants.map(t => t.id === tenantId ? { ...t, status } : t);
    saveTenants(updated);
    platformService.updateTenantStatus(tenantId, status);
    const target = tenants.find(t => t.id === tenantId);
    addToast({
      title: `Tenant Status: ${status}`,
      description: `${target?.companyName || 'Tenant'} status updated.`,
      type: status === 'ACTIVE' ? 'success' : status === 'SUSPENDED' ? 'error' : 'warning',
    });
  };

  const updateTenantPlan = (tenantId: string, plan: TenantPlan) => {
    const updated = tenants.map(t => t.id === tenantId ? { ...t, plan } : t);
    saveTenants(updated);
    platformService.updateTenantPlan(tenantId, plan);
    const target = tenants.find(t => t.id === tenantId);
    addToast({
      title: `Plan Changed to ${plan}`,
      description: `${target?.companyName || 'Tenant'} subscription updated.`,
      type: 'info',
    });
  };

  const addTenant = (newTenant: Tenant) => {
    const updated = [newTenant, ...tenants];
    saveTenants(updated);
    platformService.createTenant({
      company_name: newTenant.companyName,
      owner_name: newTenant.ownerName,
      owner_email: newTenant.ownerEmail,
      plan: newTenant.plan,
    });
    addToast({
      title: 'Business Tenant Registered',
      description: `${newTenant.companyName} onboarded successfully with ${newTenant.plan} plan.`,
      type: 'success',
    });
  };

  const deleteTenant = (tenantId: string) => {
    const target = tenants.find(t => t.id === tenantId);
    const updated = tenants.filter(t => t.id !== tenantId);
    saveTenants(updated);
    if (impersonatedTenantId === tenantId) {
      setImpersonatedTenantId(null);
      setCurrentWorkspace(WORKSPACES[0]);
    }
    addToast({
      title: 'Tenant Removed',
      description: `${target?.companyName || 'Business'} has been deleted.`,
      type: 'warning',
    });
  };

  const impersonateTenant = (tenantId: string) => {
    const target = tenants.find(t => t.id === tenantId);
    if (!target) return;
    setImpersonatedTenantId(tenantId);
    setCurrentWorkspace({
      id: `ws-${target.id}`,
      name: target.companyName,
      slug: target.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      logo: target.companyName.slice(0, 2).toUpperCase(),
      plan: target.plan,
      memberCount: target.employeeCount,
      tenantId: target.id,
    });
    setActivePathState('/dashboard');
    addToast({
      title: `Impersonating: ${target.companyName}`,
      description: `Viewing workspace with this tenant's modules & plan limits.`,
      type: 'info',
    });
  };

  const exitTenantImpersonation = () => {
    setImpersonatedTenantId(null);
    setCurrentWorkspace(WORKSPACES[0]);
    setActivePathState('/admin/platform-super-admin');
    addToast({
      title: 'Returned to Platform Super Admin',
      description: 'Back in root SaaS platform administration view.',
      type: 'success',
    });
  };

  const isModuleEnabled = (moduleKey?: string): boolean => {
    if (!moduleKey) return true;
    if (currentRole === 'SUPER_ADMIN' && !impersonatedTenantId && !impersonatedRole) {
      return true;
    }
    return currentTenant?.modules?.[moduleKey] !== false;
  };

  // Determine active user based on role
  let currentUser = MOCK_USERS.super_admin;
  if (effectiveRole === 'MANAGER') currentUser = MOCK_USERS.manager;
  if (effectiveRole === 'EMPLOYEE') currentUser = MOCK_USERS.employee;
  if (effectiveRole === 'HR') currentUser = MOCK_USERS.hr;
  if (effectiveRole === 'CLIENT') currentUser = MOCK_USERS.client;

  return (
    <OfficeOSContext.Provider
      value={{
        isLoggedIn,
        login,
        loginWithCredentials,
        logout,
        currentRole: effectiveRole,
        setCurrentRole,
        currentUser,
        currentWorkspace,
        setCurrentWorkspace,
        activePath,
        setActivePath,
        backendOnline,
        checkBackendHealth,
        rolePermissions,
        toggleRolePermission,
        hasPermission,
        impersonatedRole,
        setImpersonatedRole,
        tenants,
        currentTenant,
        isImpersonatingTenant,
        impersonatedTenant,
        updateTenantModules,
        updateTenantStatus,
        updateTenantPlan,
        addTenant,
        deleteTenant,
        impersonateTenant,
        exitTenantImpersonation,
        isModuleEnabled,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        isQuickCreateOpen,
        setQuickCreateOpen,
        isNotificationsOpen,
        setNotificationsOpen,
        isMobileSidebarOpen,
        setMobileSidebarOpen,
        isClockedIn,
        clockInTime,
        toggleClockInOut,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        tasks,
        projects,
        meetings,
        leaveRequests,
        approveLeaveRequest,
        refreshBackendData,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </OfficeOSContext.Provider>
  );
}

export function useOfficeOS() {
  const context = useContext(OfficeOSContext);
  if (!context) {
    throw new Error('useOfficeOS must be used within an OfficeOSProvider');
  }
  return context;
}
