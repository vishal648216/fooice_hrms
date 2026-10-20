export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'HR' | 'CLIENT';

export type UserStatus = 'ONLINE' | 'IN_MEETING' | 'BUSY' | 'AWAY' | 'OFFLINE';

export interface RolePermissions {
  canAccessDashboard: boolean;
  canAccessTasks: boolean;
  canAccessChat: boolean;
  canAccessMeetings: boolean;
  canAccessWhiteboards: boolean;
  canAccessAttendance: boolean;
  canAccessHR: boolean; // Employees, Teams, Leave, Holidays
  canAccessProjects: boolean;
  canAccessRequirements: boolean;
  canAccessClients: boolean;
  canAccessFinance: boolean; // Invoices, Payments, Expenses
  canAccessFiles: boolean;
  canAccessAnalytics: boolean;
  canAccessAI: boolean;
  canAccessAdmin: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  avatar: string;
  status: UserStatus;
  hourlyRate?: number;
  assignedProjectsCount?: number;
}

export type TenantPlan = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'EXPIRED' | 'CANCELLED';

export interface Tenant {
  id: string;
  companyName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  plan: TenantPlan;
  status: TenantStatus;
  employeeCount: number;
  joinedDate: string;
  trialEndsAt?: string;
  nextBillingDate?: string;
  monthlyRevenue: number;
  storageUsedGB: number;
  storageCapGB: number;
  modules: Record<string, boolean>;
  lastLoginAt: string;
  location: string;
  industry: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo: string;
  plan: 'ENTERPRISE' | 'PRO' | 'STARTER' | 'FREE';
  memberCount: number;
  tenantId?: string;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  badge?: string;
  badgeVariant?: 'primary' | 'warning' | 'danger' | 'success' | 'neutral';
  permissionKey: keyof RolePermissions;
  allowedRoles?: UserRole[];
  moduleKey?: string;
}

export interface NavCategory {
  id: string;
  title: string;
  permissionKey?: keyof RolePermissions;
  moduleKey?: string;
  items: NavItem[];
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'CLIENT_APPROVAL' | 'DONE';

export interface TaskItem {
  id: string;
  title: string;
  code: string;
  description: string;
  projectId: string;
  projectName: string;
  assignee: UserProfile;
  reporter: UserProfile;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  estimatedHours: number;
  loggedHours: number;
  labels: string[];
  commentsCount: number;
  attachmentsCount: number;
}

export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'IN_REVIEW' | 'COMPLETED';

export interface ProjectItem {
  id: string;
  name: string;
  code: string;
  clientName: string;
  clientId: string;
  manager: UserProfile;
  team: UserProfile[];
  status: ProjectStatus;
  progressPercent: number;
  budget: number;
  spent: number;
  startDate: string;
  targetEndDate: string;
  tasksSummary: { total: number; done: number; inReview: number };
  repoUrl?: string;
}

export interface MeetingItem {
  id: string;
  title: string;
  projectName?: string;
  organizer: UserProfile;
  participants: UserProfile[];
  startTime: string;
  endTime: string;
  date: string;
  isUpcoming: boolean;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'RECORDED';
  meetUrl: string;
  hasAiNotes?: boolean;
  actionItemsCount?: number;
}

export interface ClientItem {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  activeProjects: number;
  totalSpent: number;
  pendingInvoices: number;
  status: 'ACTIVE' | 'LEAD' | 'INACTIVE';
  avatar: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  projectName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'DRAFT';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours: string;
  status: 'ON_TIME' | 'LATE' | 'REMOTE' | 'ON_LEAVE';
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  leaveType: 'SICK' | 'CASUAL' | 'VACATION';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: 'MENTION' | 'TASK' | 'MEETING' | 'APPROVAL' | 'SYSTEM';
  read: boolean;
  actionUrl?: string;
  allowedRoles?: UserRole[];
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'PEOPLE' | 'PROJECTS' | 'TASKS' | 'MEETINGS' | 'CLIENTS' | 'INVOICES' | 'FILES';
  actionUrl: string;
  badge?: string;
}
