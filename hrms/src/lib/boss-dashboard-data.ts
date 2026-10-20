export interface KPICardData {
  id: string;
  title: string;
  value: string;
  comparison?: string;
  comparisonType?: 'positive' | 'negative' | 'neutral';
  iconName: string;
  sparkline: number[];
  color: string;
}

export interface AttendanceEmployee {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  department: string;
  checkIn: string;
  status: 'Present' | 'Late' | 'WFH' | 'On Leave';
  workingHours: string;
}

export interface TodayMeeting {
  id: string;
  time: string;
  title: string;
  project: string;
  participants: { name: string; initials: string; avatar?: string }[];
  status: 'Upcoming' | 'In Progress' | 'Completed';
  countdown?: string;
  meetUrl: string;
}

export interface ProjectOverviewItem {
  id: string;
  name: string;
  client: string;
  progress: number;
  deadline: string;
  budget: string;
  received: string;
  pending: string;
  health: 'On Track' | 'At Risk' | 'Delayed';
}

export interface EmployeeWorkloadItem {
  id: string;
  name: string;
  department: string;
  percentage: number;
  tasksCount: number;
  status: 'Healthy' | 'Busy' | 'Overloaded';
}

export interface ProjectHealthItem {
  id: string;
  projectName: string;
  timeline: 'On Track' | 'At Risk' | 'Delayed';
  budget: 'On Track' | 'At Risk' | 'Delayed';
  requirements: 'On Track' | 'At Risk' | 'Delayed';
  payments: 'On Track' | 'At Risk' | 'Delayed';
  clientApproval: 'On Track' | 'At Risk' | 'Delayed';
  overall: 'On Track' | 'At Risk' | 'Delayed';
}

export interface UpcomingDeadlineItem {
  id: string;
  title: string;
  project: string;
  type: 'Task' | 'Milestone' | 'Client Approval' | 'Review';
  deadlineLabel: string;
  deadlineDate: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  assignee: { name: string; initials: string };
}

export interface PendingApprovalItem {
  id: string;
  title: string;
  type: string;
  client: string;
  project: string;
  requestedBy: string;
  date: string;
  status: string;
  details: string;
}

export interface RecentActivityItem {
  id: string;
  user: string;
  initials: string;
  action: string;
  resource: string;
  timestamp: string;
  type: 'project' | 'task' | 'approval' | 'payment' | 'meeting' | 'change_request';
}

// 8 Executive KPI Cards data
export const BOSS_KPIS: KPICardData[] = [
  {
    id: 'kpi-1',
    title: 'Employees Present',
    value: '18',
    comparison: '+2 from yesterday',
    comparisonType: 'positive',
    iconName: 'UserCheck',
    sparkline: [14, 15, 16, 16, 18],
    color: 'emerald',
  },
  {
    id: 'kpi-2',
    title: 'Employees Absent',
    value: '2',
    comparison: '-1 from yesterday',
    comparisonType: 'positive',
    iconName: 'UserX',
    sparkline: [4, 3, 3, 3, 2],
    color: 'rose',
  },
  {
    id: 'kpi-3',
    title: 'Late Employees',
    value: '3',
    comparison: '+1 from yesterday',
    comparisonType: 'negative',
    iconName: 'ClockAlert',
    sparkline: [2, 1, 3, 2, 3],
    color: 'amber',
  },
  {
    id: 'kpi-4',
    title: 'Work From Home',
    value: '4',
    comparison: 'Approved WFH',
    comparisonType: 'neutral',
    iconName: 'Home',
    sparkline: [3, 4, 3, 5, 4],
    color: 'blue',
  },
  {
    id: 'kpi-5',
    title: 'Active Projects',
    value: '12',
    comparison: '2 nearing completion',
    comparisonType: 'neutral',
    iconName: 'FolderGit2',
    sparkline: [10, 11, 11, 12, 12],
    color: 'indigo',
  },
  {
    id: 'kpi-6',
    title: 'Overdue Tasks',
    value: '5',
    comparison: 'Requires attention',
    comparisonType: 'negative',
    iconName: 'AlertTriangle',
    sparkline: [2, 3, 4, 4, 5],
    color: 'rose',
  },
  {
    id: 'kpi-7',
    title: 'Pending Payments',
    value: '₹3,30,000',
    comparison: 'Across 3 invoices',
    comparisonType: 'negative',
    iconName: 'IndianRupee',
    sparkline: [450000, 400000, 380000, 350000, 330000],
    color: 'purple',
  },
  {
    id: 'kpi-8',
    title: "Today's Meetings",
    value: '6',
    comparison: 'Next starts in 12m',
    comparisonType: 'neutral',
    iconName: 'Video',
    sparkline: [4, 5, 6, 5, 6],
    color: 'sky',
  },
];

// Attendance Mock Data
export const ATTENDANCE_BREAKDOWN = {
  present: 18,
  absent: 2,
  late: 3,
  wfh: 4,
  leave: 1,
  totalEmployees: 25,
};

export const WEEKLY_ATTENDANCE_TREND = [
  { day: 'Mon', present: 21, late: 2, wfh: 2 },
  { day: 'Tue', present: 22, late: 1, wfh: 2 },
  { day: 'Wed', present: 20, late: 3, wfh: 2 },
  { day: 'Thu', present: 19, late: 2, wfh: 4 },
  { day: 'Fri', present: 18, late: 3, wfh: 4 },
];

export const ATTENDANCE_EMPLOYEES_LIST: AttendanceEmployee[] = [
  {
    id: 'emp-1',
    name: 'Mayur Patel',
    initials: 'MP',
    avatarColor: 'bg-indigo-600',
    department: 'Executive Leadership',
    checkIn: '08:45 AM',
    status: 'Present',
    workingHours: '6h 15m (Active)',
  },
  {
    id: 'emp-2',
    name: 'Rahul Sharma',
    initials: 'RS',
    avatarColor: 'bg-blue-600',
    department: 'Full-Stack Engineering',
    checkIn: '09:02 AM',
    status: 'Present',
    workingHours: '5h 58m (Active)',
  },
  {
    id: 'emp-3',
    name: 'Priya Shah',
    initials: 'PS',
    avatarColor: 'bg-rose-600',
    department: 'UI/UX Design',
    checkIn: '09:35 AM',
    status: 'Late',
    workingHours: '5h 25m (Active)',
  },
  {
    id: 'emp-4',
    name: 'Amit Joshi',
    initials: 'AJ',
    avatarColor: 'bg-emerald-600',
    department: 'Quality Assurance',
    checkIn: '09:00 AM',
    status: 'WFH',
    workingHours: '6h 00m (Active)',
  },
  {
    id: 'emp-5',
    name: 'Neha Mehta',
    initials: 'NM',
    avatarColor: 'bg-purple-600',
    department: 'Mobile Development',
    checkIn: '—',
    status: 'On Leave',
    workingHours: '0h (Casual Leave)',
  },
];

// Today's Meetings
export const TODAYS_MEETINGS_LIST: TodayMeeting[] = [
  {
    id: 'mtg-101',
    time: '10:00 AM',
    title: 'ABC Website Discussion',
    project: 'ABC Corporate Website',
    participants: [
      { name: 'Mayur Patel', initials: 'MP' },
      { name: 'Rahul Sharma', initials: 'RS' },
      { name: 'Client ABC', initials: 'CA' },
    ],
    status: 'Upcoming',
    countdown: 'Starts in 12 min',
    meetUrl: 'https://meet.google.com/abc-website-sync',
  },
  {
    id: 'mtg-102',
    time: '12:30 PM',
    title: 'Internal Sprint Review',
    project: 'TechNova Engineering Core',
    participants: [
      { name: 'Rahul Sharma', initials: 'RS' },
      { name: 'Priya Shah', initials: 'PS' },
      { name: 'Amit Joshi', initials: 'AJ' },
    ],
    status: 'Upcoming',
    meetUrl: 'https://meet.google.com/internal-sprint-review',
  },
  {
    id: 'mtg-103',
    time: '04:00 PM',
    title: 'Client Project Review',
    project: 'XYZ Mobile App',
    participants: [
      { name: 'Mayur Patel', initials: 'MP' },
      { name: 'Priya Shah', initials: 'PS' },
      { name: 'Client XYZ', initials: 'CX' },
    ],
    status: 'Upcoming',
    meetUrl: 'https://meet.google.com/xyz-project-review',
  },
];

// Project Overview
export const PROJECT_SUMMARY_STATS = {
  active: 12,
  completed: 8,
  atRisk: 2,
  delayed: 1,
};

export const PROJECTS_OVERVIEW_LIST: ProjectOverviewItem[] = [
  {
    id: 'prj-1',
    name: 'ABC Corporate Website',
    client: 'ABC Pvt Ltd',
    progress: 67,
    deadline: '30 Sep 2026',
    budget: '₹5,00,000',
    received: '₹3,00,000',
    pending: '₹2,00,000',
    health: 'At Risk',
  },
  {
    id: 'prj-2',
    name: 'XYZ Mobile App',
    client: 'XYZ Technologies',
    progress: 82,
    deadline: '15 Oct 2026',
    budget: '₹8,50,000',
    received: '₹7,00,000',
    pending: '₹1,50,000',
    health: 'On Track',
  },
  {
    id: 'prj-3',
    name: 'Bright Retail ERP',
    client: 'Bright Retail',
    progress: 42,
    deadline: '20 Nov 2026',
    budget: '₹5,00,000',
    received: '₹2,20,000',
    pending: '₹2,80,000',
    health: 'Delayed',
  },
];

// Financial Overview
export const FINANCIAL_OVERVIEW_DATA = {
  totalProjectValue: '₹18,50,000',
  received: '₹12,20,000',
  pending: '₹6,30,000',
  overdue: '₹1,20,000',
  monthlyRevenue: [
    { month: 'May', received: 180000, target: 200000 },
    { month: 'Jun', received: 250000, target: 250000 },
    { month: 'Jul', received: 310000, target: 300000 },
    { month: 'Aug', received: 220000, target: 280000 },
    { month: 'Sep', received: 260000, target: 320000 },
  ],
};

// Task Overview
export const TASK_ANALYTICS_DATA = {
  completed: 28,
  inProgress: 12,
  pending: 10,
  overdue: 5,
  priorityBreakdown: {
    critical: 3,
    high: 8,
    medium: 24,
    low: 20,
  },
};

// Employee Workload
export const EMPLOYEE_WORKLOAD_LIST: EmployeeWorkloadItem[] = [
  {
    id: 'wl-1',
    name: 'Rahul Sharma',
    department: 'Full-Stack Engineering',
    percentage: 82,
    tasksCount: 6,
    status: 'Busy',
  },
  {
    id: 'wl-2',
    name: 'Priya Shah',
    department: 'UI/UX Design',
    percentage: 93,
    tasksCount: 8,
    status: 'Overloaded',
  },
  {
    id: 'wl-3',
    name: 'Amit Joshi',
    department: 'Quality Assurance',
    percentage: 65,
    tasksCount: 4,
    status: 'Healthy',
  },
  {
    id: 'wl-4',
    name: 'Neha Mehta',
    department: 'Mobile Development',
    percentage: 48,
    tasksCount: 3,
    status: 'Healthy',
  },
  {
    id: 'wl-5',
    name: 'Mayur Patel',
    department: 'Executive Leadership',
    percentage: 72,
    tasksCount: 5,
    status: 'Healthy',
  },
];

// Project Health Matrix
export const PROJECT_HEALTH_LIST: ProjectHealthItem[] = [
  {
    id: 'ph-1',
    projectName: 'ABC Corporate Website',
    timeline: 'At Risk',
    budget: 'On Track',
    requirements: 'At Risk',
    payments: 'At Risk',
    clientApproval: 'At Risk',
    overall: 'At Risk',
  },
  {
    id: 'ph-2',
    projectName: 'XYZ Mobile App',
    timeline: 'On Track',
    budget: 'On Track',
    requirements: 'On Track',
    payments: 'On Track',
    clientApproval: 'On Track',
    overall: 'On Track',
  },
  {
    id: 'ph-3',
    projectName: 'Bright Retail ERP',
    timeline: 'Delayed',
    budget: 'At Risk',
    requirements: 'On Track',
    payments: 'Delayed',
    clientApproval: 'Delayed',
    overall: 'Delayed',
  },
];

// Upcoming Deadlines
export const UPCOMING_DEADLINES_LIST: UpcomingDeadlineItem[] = [
  {
    id: 'dl-1',
    title: 'Homepage redesign delivery',
    project: 'ABC Corporate Website',
    type: 'Task',
    deadlineLabel: 'Due today',
    deadlineDate: 'Today, 05:00 PM',
    priority: 'Critical',
    assignee: { name: 'Rahul Sharma', initials: 'RS' },
  },
  {
    id: 'dl-2',
    title: 'Payment gateway integration page',
    project: 'XYZ Mobile App',
    type: 'Task',
    deadlineLabel: 'Due tomorrow',
    deadlineDate: 'Tomorrow, 06:00 PM',
    priority: 'High',
    assignee: { name: 'Priya Shah', initials: 'PS' },
  },
  {
    id: 'dl-3',
    title: 'Client requirements approval signoff',
    project: 'Bright Retail ERP',
    type: 'Client Approval',
    deadlineLabel: '28 Sep 2026',
    deadlineDate: '28 Sep 2026',
    priority: 'Medium',
    assignee: { name: 'Mayur Patel', initials: 'MP' },
  },
  {
    id: 'dl-4',
    title: 'Alpha milestone delivery & staging deploy',
    project: 'ABC Corporate Website',
    type: 'Milestone',
    deadlineLabel: '30 Sep 2026',
    deadlineDate: '30 Sep 2026',
    priority: 'High',
    assignee: { name: 'Amit Joshi', initials: 'AJ' },
  },
];

// Pending Approvals
export const PENDING_APPROVALS_LIST: PendingApprovalItem[] = [
  {
    id: 'appr-1',
    title: 'Mobile navigation menu redesign approval',
    type: 'Client approval required',
    client: 'ABC Pvt Ltd',
    project: 'ABC Corporate Website',
    requestedBy: 'Priya Shah (Lead Designer)',
    date: '24 Sep 2026',
    status: 'Pending Client Sign-off',
    details: 'Review updated Figma wireframes and interactive mobile bottom sheet specs.',
  },
  {
    id: 'appr-2',
    title: 'Advanced predictive analytics module (CR-18)',
    type: 'Change request approval',
    client: 'XYZ Technologies',
    project: 'XYZ Mobile App',
    requestedBy: 'Rahul Sharma (Tech Lead)',
    date: '23 Sep 2026',
    status: 'Scope Change Review',
    details: 'Client requested adding real-time conversion telemetry. Requires +3 developer days.',
  },
  {
    id: 'appr-3',
    title: 'Milestone 2 progress billing invoice (INV-2026-104)',
    type: 'Invoice approval',
    client: 'Bright Retail',
    project: 'Bright Retail ERP',
    requestedBy: 'Mayur Patel',
    date: '22 Sep 2026',
    status: 'Awaiting Authorization',
    details: 'Itemized milestone invoice for ₹1,20,000 for database schema and auth rollout.',
  },
];

// Recent Activity Audit
export const RECENT_ACTIVITY_LIST: RecentActivityItem[] = [
  {
    id: 'act-1',
    user: 'Mayur Patel',
    initials: 'MP',
    action: 'created project workspace',
    resource: 'ABC Corporate Website',
    timestamp: '15 minutes ago',
    type: 'project',
  },
  {
    id: 'act-2',
    user: 'Rahul Sharma',
    initials: 'RS',
    action: 'completed task',
    resource: 'Homepage Frontend Components',
    timestamp: '42 minutes ago',
    type: 'task',
  },
  {
    id: 'act-3',
    user: 'Client ABC (ABC Pvt Ltd)',
    initials: 'CA',
    action: 'approved requirement spec',
    resource: 'REQ-102 (Stripe Checkout Flow)',
    timestamp: '2 hours ago',
    type: 'approval',
  },
  {
    id: 'act-4',
    user: 'Finance Engine',
    initials: 'FE',
    action: 'received milestone payment',
    resource: '₹1,00,000 via NEFT Bank Wire',
    timestamp: '3 hours ago',
    type: 'payment',
  },
  {
    id: 'act-5',
    user: 'Mayur Patel & Team',
    initials: 'MP',
    action: 'completed video sync',
    resource: 'ABC Website Sprint Discussion',
    timestamp: '4 hours ago',
    type: 'meeting',
  },
  {
    id: 'act-6',
    user: 'Rahul Sharma',
    initials: 'RS',
    action: 'created change request',
    resource: 'CR-18 (Advanced Analytics Expansion)',
    timestamp: '5 hours ago',
    type: 'change_request',
  },
];

// Available Dashboard Widgets for Customization
export interface DashboardWidgetConfig {
  id: string;
  title: string;
  description: string;
  visible: boolean;
}

export const DEFAULT_DASHBOARD_WIDGETS: DashboardWidgetConfig[] = [
  { id: 'kpis', title: 'Executive KPI Cards (8 Metrics)', description: 'Headcount, Attendance, Active Projects, Overdue Tasks, Inward Cash Flow', visible: true },
  { id: 'attendance', title: "Today's Attendance Analytics & Roster", description: 'Live punch-in chart and employee check-in table', visible: true },
  { id: 'meetings', title: "Today's Meetings & Syncs", description: 'Upcoming calls with 12m countdown and join links', visible: true },
  { id: 'projects', title: 'Projects Portfolio & Financial Progress', description: 'Progress bars, budgets, payments received and pending', visible: true },
  { id: 'finances', title: 'Financial Overview & Cash Flow (INR ₹)', description: 'Total value, received, pending, overdue, and collection trend', visible: true },
  { id: 'tasks', title: 'Task Velocity & Priority Breakdown', description: 'Completed, in progress, pending, overdue and critical levels', visible: true },
  { id: 'workload', title: 'Employee Workload & Capacity Monitor', description: 'Individual capacity percentages and overload alert tags', visible: true },
  { id: 'health', title: 'Executive Project Health Matrix', description: '5-axis health checks across timeline, budget, specs, payments', visible: true },
  { id: 'deadlines', title: 'Upcoming Deadlines Timeline', description: 'Chronological list of deliverables due today, tomorrow and this week', visible: true },
  { id: 'approvals', title: 'Pending Management Approvals Queue', description: 'Client approvals, scope change requests, invoice signoffs', visible: true },
  { id: 'activity', title: 'Recent Activity Audit Trail', description: 'Chronological timeline of system and team operations', visible: true },
  { id: 'quick_actions', title: 'Executive Quick Actions Hub', description: 'One-click triggers for projects, meetings, tasks, and billing', visible: true },
];
