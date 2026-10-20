export interface MonthlyTrendData {
  month: string;
  revenue: number; // in thousands (INR Lakhs)
  expenses: number;
  profit: number;
  tasksCompleted: number;
  attendanceRate: number; // percentage
}

export interface TeamMemberPerformance {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  tasksCompleted: number;
  avgResolutionHours: number;
  codeReviewsDone: number;
  efficiencyScore: number; // 0 - 100
  attendancePercent: number;
  burnoutRisk: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ProjectAnalyticsItem {
  id: string;
  title: string;
  client: string;
  budgetAllocated: number; // in Lakhs
  budgetSpent: number;
  progressPercent: number;
  sprintVelocity: number; // story points / week
  onTrack: boolean;
  tasksDone: number;
  tasksRemaining: number;
  estimatedCompletion: string;
}

export interface DepartmentMetric {
  name: string;
  headcount: number;
  productivityIndex: number; // %
  budgetUtilization: number; // %
  attendanceAverage: number; // %
  tasksCount: number;
  color: string;
}

export interface AttendanceHeatmapDay {
  date: string;
  dayOfWeek: string;
  presentCount: number;
  wfhCount: number;
  absentCount: number;
  lateCount: number;
  healthLevel: 0 | 1 | 2 | 3 | 4; // 0: weekend/holiday, 1: low, 4: max 100%
}

export interface ExecutiveReportSchedule {
  id: string;
  title: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  recipients: string[];
  lastGenerated: string;
  format: 'PDF' | 'EXCEL' | 'CSV';
  status: 'ACTIVE' | 'PAUSED';
}

export const MONTHLY_TRENDS_2026: MonthlyTrendData[] = [
  { month: 'Jan 2026', revenue: 9.8, expenses: 5.2, profit: 4.6, tasksCompleted: 142, attendanceRate: 94 },
  { month: 'Feb 2026', revenue: 10.5, expenses: 5.6, profit: 4.9, tasksCompleted: 156, attendanceRate: 96 },
  { month: 'Mar 2026', revenue: 11.2, expenses: 5.8, profit: 5.4, tasksCompleted: 168, attendanceRate: 93 },
  { month: 'Apr 2026', revenue: 10.9, expenses: 5.4, profit: 5.5, tasksCompleted: 160, attendanceRate: 95 },
  { month: 'May 2026', revenue: 11.8, expenses: 6.1, profit: 5.7, tasksCompleted: 175, attendanceRate: 97 },
  { month: 'Jun 2026', revenue: 12.4, expenses: 6.3, profit: 6.1, tasksCompleted: 184, attendanceRate: 95 },
  { month: 'Jul 2026', revenue: 12.0, expenses: 6.0, profit: 6.0, tasksCompleted: 178, attendanceRate: 94 },
  { month: 'Aug 2026', revenue: 12.8, expenses: 6.5, profit: 6.3, tasksCompleted: 192, attendanceRate: 96 },
  { month: 'Sep 2026', revenue: 13.4, expenses: 6.8, profit: 6.6, tasksCompleted: 204, attendanceRate: 98 },
];

export const DEPARTMENT_METRICS: DepartmentMetric[] = [
  { name: 'Product Engineering', headcount: 68, productivityIndex: 94, budgetUtilization: 88, attendanceAverage: 96, tasksCount: 124, color: '#6366f1' },
  { name: 'UI/UX & Product Design', headcount: 18, productivityIndex: 92, budgetUtilization: 79, attendanceAverage: 95, tasksCount: 42, color: '#06b6d4' },
  { name: 'QA & Test Automation', headcount: 22, productivityIndex: 96, budgetUtilization: 82, attendanceAverage: 97, tasksCount: 56, color: '#10b981' },
  { name: 'DevOps & Cloud Infra', headcount: 14, productivityIndex: 98, budgetUtilization: 92, attendanceAverage: 98, tasksCount: 38, color: '#f59e0b' },
  { name: 'HR & Talent Ops', headcount: 12, productivityIndex: 91, budgetUtilization: 74, attendanceAverage: 94, tasksCount: 28, color: '#a855f7' },
  { name: 'Client Accounts & Delivery', headcount: 14, productivityIndex: 95, budgetUtilization: 85, attendanceAverage: 96, tasksCount: 34, color: '#f43f5e' },
];

export const TEAM_PERFORMANCES: TeamMemberPerformance[] = [
  {
    id: 'emp-1',
    name: 'Arjun Nambiar',
    role: 'Staff Backend Architect',
    department: 'Product Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tasksCompleted: 38,
    avgResolutionHours: 4.2,
    codeReviewsDone: 52,
    efficiencyScore: 98,
    attendancePercent: 98,
    burnoutRisk: 'LOW',
  },
  {
    id: 'emp-2',
    name: 'Rohan Deshmukh',
    role: 'Lead UI/UX Designer',
    department: 'UI/UX & Product Design',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tasksCompleted: 29,
    avgResolutionHours: 5.8,
    codeReviewsDone: 18,
    efficiencyScore: 94,
    attendancePercent: 96,
    burnoutRisk: 'LOW',
  },
  {
    id: 'emp-3',
    name: 'Priya Sundaram',
    role: 'Senior QA Automation Lead',
    department: 'QA & Test Automation',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tasksCompleted: 44,
    avgResolutionHours: 3.5,
    codeReviewsDone: 34,
    efficiencyScore: 97,
    attendancePercent: 99,
    burnoutRisk: 'LOW',
  },
  {
    id: 'emp-4',
    name: 'Kabir Mehta',
    role: 'Senior DevOps Specialist',
    department: 'DevOps & Cloud Infra',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    tasksCompleted: 31,
    avgResolutionHours: 2.8,
    codeReviewsDone: 29,
    efficiencyScore: 96,
    attendancePercent: 95,
    burnoutRisk: 'MEDIUM',
  },
  {
    id: 'emp-5',
    name: 'Neha Chawla',
    role: 'Frontend Engineer',
    department: 'Product Engineering',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    tasksCompleted: 33,
    avgResolutionHours: 6.1,
    codeReviewsDone: 22,
    efficiencyScore: 92,
    attendancePercent: 94,
    burnoutRisk: 'LOW',
  },
];

export const PROJECT_ANALYTICS: ProjectAnalyticsItem[] = [
  {
    id: 'proj-1',
    title: 'NovaPay Global Banking Gateway',
    client: 'Nova Capital Partners',
    budgetAllocated: 24.5,
    budgetSpent: 16.2,
    progressPercent: 78,
    sprintVelocity: 42,
    onTrack: true,
    tasksDone: 68,
    tasksRemaining: 18,
    estimatedCompletion: '15 Oct 2026',
  },
  {
    id: 'proj-2',
    title: 'HealthPulse Patient Portal & Telehealth',
    client: 'Apex BioHealth Systems',
    budgetAllocated: 18.0,
    budgetSpent: 11.4,
    progressPercent: 64,
    sprintVelocity: 36,
    onTrack: true,
    tasksDone: 42,
    tasksRemaining: 24,
    estimatedCompletion: '28 Oct 2026',
  },
  {
    id: 'proj-3',
    title: 'UrbanFleet IoT Telematics & Logistics Hub',
    client: 'LogiGlobal Logistics',
    budgetAllocated: 15.0,
    budgetSpent: 12.8,
    progressPercent: 88,
    sprintVelocity: 28,
    onTrack: true,
    tasksDone: 54,
    tasksRemaining: 8,
    estimatedCompletion: '10 Oct 2026',
  },
  {
    id: 'proj-4',
    title: 'CloudSec Compliance & SOC2 Automation',
    client: 'Apex Internal Governance',
    budgetAllocated: 8.5,
    budgetSpent: 4.2,
    progressPercent: 52,
    sprintVelocity: 22,
    onTrack: true,
    tasksDone: 26,
    tasksRemaining: 24,
    estimatedCompletion: '15 Nov 2026',
  },
];

export const ATTENDANCE_HEATMAP_DATA: AttendanceHeatmapDay[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const isWeekend = day % 7 === 0 || day % 7 === 6;
  if (isWeekend) {
    return {
      date: `2026-09-${day.toString().padStart(2, '0')}`,
      dayOfWeek: day % 7 === 6 ? 'Sat' : 'Sun',
      presentCount: 0,
      wfhCount: 0,
      absentCount: 0,
      lateCount: 0,
      healthLevel: 0,
    };
  }
  const present = Math.floor(138 + Math.random() * 10);
  const wfh = Math.floor(4 + Math.random() * 4);
  const absent = Math.floor(2 + Math.random() * 3);
  const late = Math.floor(1 + Math.random() * 4);
  return {
    date: `2026-09-${day.toString().padStart(2, '0')}`,
    dayOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][day % 5],
    presentCount: present,
    wfhCount: wfh,
    absentCount: absent,
    lateCount: late,
    healthLevel: (present > 142 ? 4 : present > 139 ? 3 : 2) as 0 | 1 | 2 | 3 | 4,
  };
});

export const SCHEDULED_REPORTS: ExecutiveReportSchedule[] = [
  {
    id: 'rep-1',
    title: 'Weekly Executive Operational Briefing',
    frequency: 'WEEKLY',
    recipients: ['v.singhania@apextech.io', 'board@apextech.io'],
    lastGenerated: '28 Sept 2026',
    format: 'PDF',
    status: 'ACTIVE',
  },
  {
    id: 'rep-2',
    title: 'Monthly Financial Margins & Inward Ledger',
    frequency: 'MONTHLY',
    recipients: ['v.singhania@apextech.io', 'accounts@apextech.io'],
    lastGenerated: '01 Sept 2026',
    format: 'EXCEL',
    status: 'ACTIVE',
  },
  {
    id: 'rep-3',
    title: 'Engineering Sprint Velocity & PR Bottlenecks',
    frequency: 'WEEKLY',
    recipients: ['s.montgomery@apextech.io', 'lead-engineers@apextech.io'],
    lastGenerated: '29 Sept 2026',
    format: 'PDF',
    status: 'ACTIVE',
  },
  {
    id: 'rep-4',
    title: 'Monthly HR Attendance & Leave Accruals',
    frequency: 'MONTHLY',
    recipients: ['hr@apextech.io', 'payroll@apextech.io'],
    lastGenerated: '01 Sept 2026',
    format: 'CSV',
    status: 'ACTIVE',
  },
];
