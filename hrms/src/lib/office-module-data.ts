export interface OfficeEmployee {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  employeeId: string;
  role: string;
  department: string;
  team: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Probation' | 'Notice Period';
  attendanceToday: 'Present' | 'Late' | 'WFH' | 'On Leave' | 'Absent' | 'Half Day';
  currentProject: string;
  workload: number;
  joiningDate: string;
  employmentType: 'Full Time' | 'Part Time' | 'Contract' | 'Intern';
  manager: string;
  workLocation: 'Office' | 'Remote' | 'Hybrid';
  shift: string;
  timezone: string;
  skills: string[];
  bio?: string;
  attendanceSummary: {
    presentDays: number;
    absentDays: number;
    lateDays: number;
    wfhDays: number;
    leaveDays: number;
    avgWorkingHours: string;
  };
  currentTasks: { id: string; title: string; priority: 'Critical' | 'High' | 'Medium' | 'Low'; status: string; dueDate: string }[];
  currentProjects: { id: string; name: string; role: string; progress: number; deadline: string; hoursLogged: string }[];
  recentActivities: { id: string; action: string; resource: string; time: string; type: 'task' | 'meeting' | 'project' | 'leave' | 'attendance' | 'file' }[];
  leaveBalance: {
    annual: number;
    sick: number;
    personal: number;
    unpaid: number;
    used: number;
    remaining: number;
  };
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  breakStart: string;
  breakEnd: string;
  checkOut: string;
  workingHours: string;
  overtime: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'WFH' | 'On Leave' | 'Holiday' | 'Weekly Off';
  location: 'Office' | 'Remote' | 'Hybrid';
  device?: string;
  ip?: string;
  lateDuration?: string;
  timeline: { time: string; label: string; type: 'checkin' | 'break' | 'resume' | 'checkout' }[];
}

export interface AttendanceCorrection {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  originalRecord: string;
  requestedChange: string;
  reason: string;
  requestedBy: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created: string;
  evidence?: string;
  reviewerNotes?: string;
}

export interface LeaveItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Emergency Leave' | 'Personal Leave' | 'Unpaid Leave' | 'Other';
  startDate: string;
  endDate: string;
  duration: string;
  isHalfDay: boolean;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Changes Requested';
  requestedOn: string;
  approver: string;
  attachment?: string;
  remainingBalanceAnnual: number;
  remainingBalanceSick: number;
  timeline: { date: string; action: string; user: string }[];
}

export interface TeamItem {
  id: string;
  name: string;
  manager: string;
  managerAvatar?: string;
  memberCount: number;
  activeProjects: number;
  openTasks: number;
  workload: number;
  status: 'Active' | 'High Load' | 'Balanced';
  description: string;
  members: { employeeId: string; name: string; role: string; workload: number; currentProject: string; tasksCount: number; attendance: string }[];
  projects: { id: string; name: string; progress: number; deadline: string }[];
}

export interface DepartmentItem {
  id: string;
  name: string;
  manager: string;
  employeesCount: number;
  projectsCount: number;
  openTasksCount: number;
  avgWorkload: number;
  attendanceRate: number;
  taskCompletionRate: number;
  description: string;
}

export interface HolidayItem {
  id: string;
  name: string;
  date: string;
  day: string;
  type: 'Public Holiday' | 'Company Holiday' | 'Optional Holiday';
  description: string;
  applicableTeams: string;
  status: 'Upcoming' | 'Passed';
}

export interface ShiftItem {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  workingHours: string;
  gracePeriod: string;
  overtimeRule: string;
  workingDays: string[];
  assignedEmployeesCount: number;
}

export interface OfficePolicies {
  gracePeriodMinutes: number;
  lateThresholdMinutes: number;
  overtimeThresholdHours: number;
  maxBreakMinutes: number;
  workingHoursPerDay: number;
  autoClockOutHour: string;
  biometricSyncEnabled: boolean;
  requireLocationForWFH: boolean;
  leaveNoticeDays: number;
}

// ----------------------------------------------------
// INITIAL MOCK DATA
// ----------------------------------------------------

export const INITIAL_EMPLOYEES: OfficeEmployee[] = [
  {
    id: 'emp-1',
    firstName: 'Mayur',
    lastName: 'Patel',
    name: 'Mayur Patel',
    email: 'm.patel@technova.io',
    phone: '+91 98250 11223',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    employeeId: 'TN-001',
    role: 'Director / Admin',
    department: 'Management',
    team: 'Executive Leadership',
    status: 'Active',
    attendanceToday: 'Present',
    currentProject: 'Executive Operations',
    workload: 72,
    joiningDate: '15 Jan 2021',
    employmentType: 'Full Time',
    manager: 'Board of Directors',
    workLocation: 'Office',
    shift: 'General Shift (09:00 AM - 06:00 PM)',
    timezone: 'IST (UTC+05:30)',
    skills: ['Executive Strategy', 'Cloud Governance', 'Enterprise SaaS', 'P&L Management'],
    bio: 'Founder and Chief Executive at TechNova Solutions. Oversees enterprise accounts, architecture milestones, and team operations.',
    attendanceSummary: {
      presentDays: 21,
      absentDays: 0,
      lateDays: 1,
      wfhDays: 2,
      leaveDays: 0,
      avgWorkingHours: '8h 45m',
    },
    currentTasks: [
      { id: 't-101', title: 'Q4 Enterprise expansion review', priority: 'Critical', status: 'In Progress', dueDate: '30 Sep 2026' },
      { id: 't-102', title: 'Bright Retail ERP milestone invoice signoff', priority: 'High', status: 'Pending Review', dueDate: '28 Sep 2026' }
    ],
    currentProjects: [
      { id: 'p-1', name: 'ABC Corporate Website', role: 'Executive Sponsor', progress: 67, deadline: '30 Sep 2026', hoursLogged: '42h' },
      { id: 'p-2', name: 'XYZ Mobile App', role: 'Executive Sponsor', progress: 82, deadline: '15 Oct 2026', hoursLogged: '38h' }
    ],
    recentActivities: [
      { id: 'act-1', action: 'Approved project workspace', resource: 'Bright Retail ERP', time: '2 hours ago', type: 'project' },
      { id: 'act-2', action: 'Attended client sprint call', resource: 'ABC Website Sync', time: '4 hours ago', type: 'meeting' },
      { id: 'act-3', action: 'Completed executive review', resource: 'Q3 Financials', time: '1 day ago', type: 'task' }
    ],
    leaveBalance: { annual: 18, sick: 10, personal: 5, unpaid: 0, used: 2, remaining: 31 }
  },
  {
    id: 'emp-2',
    firstName: 'Rahul',
    lastName: 'Sharma',
    name: 'Rahul Sharma',
    email: 'r.sharma@technova.io',
    phone: '+91 98980 44556',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    employeeId: 'TN-002',
    role: 'Senior Full Stack Developer',
    department: 'Development',
    team: 'Frontend Team',
    status: 'Active',
    attendanceToday: 'Present',
    currentProject: 'ABC Corporate Website',
    workload: 82,
    joiningDate: '01 Mar 2022',
    employmentType: 'Full Time',
    manager: 'Mayur Patel',
    workLocation: 'Office',
    shift: 'General Shift (09:00 AM - 06:00 PM)',
    timezone: 'IST (UTC+05:30)',
    skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TypeScript'],
    bio: 'Lead engineer overseeing frontend architecture, micro-frontends, and performance optimization across client portals.',
    attendanceSummary: {
      presentDays: 20,
      absentDays: 1,
      lateDays: 2,
      wfhDays: 3,
      leaveDays: 1,
      avgWorkingHours: '8h 30m',
    },
    currentTasks: [
      { id: 't-201', title: 'Homepage redesign responsive delivery', priority: 'Critical', status: 'In Progress', dueDate: 'Today, 05:00 PM' },
      { id: 't-202', title: 'Stripe webhook verification refactor', priority: 'High', status: 'In Progress', dueDate: 'Tomorrow, 02:00 PM' },
      { id: 't-203', title: 'Unit test suite coverage for auth tokens', priority: 'Medium', status: 'To Do', dueDate: '02 Oct 2026' }
    ],
    currentProjects: [
      { id: 'p-1', name: 'ABC Corporate Website', role: 'Tech Lead', progress: 67, deadline: '30 Sep 2026', hoursLogged: '128h' },
      { id: 'p-2', name: 'XYZ Mobile App', role: 'Full Stack Dev', progress: 82, deadline: '15 Oct 2026', hoursLogged: '94h' }
    ],
    recentActivities: [
      { id: 'act-201', action: 'Completed task', resource: 'Homepage Frontend Components', time: '42 mins ago', type: 'task' },
      { id: 'act-202', action: 'Submitted attendance correction', resource: '24 Sep Check-out', time: '1 day ago', type: 'attendance' }
    ],
    leaveBalance: { annual: 12, sick: 6, personal: 3, unpaid: 0, used: 4, remaining: 17 }
  },
  {
    id: 'emp-3',
    firstName: 'Priya',
    lastName: 'Shah',
    name: 'Priya Shah',
    email: 'p.shah@technova.io',
    phone: '+91 97240 77889',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    employeeId: 'TN-003',
    role: 'UI/UX Designer',
    department: 'UI/UX',
    team: 'Design Team',
    status: 'Active',
    attendanceToday: 'Late',
    currentProject: 'XYZ Mobile App',
    workload: 93,
    joiningDate: '10 Aug 2022',
    employmentType: 'Full Time',
    manager: 'Mayur Patel',
    workLocation: 'Hybrid',
    shift: 'General Shift (09:00 AM - 06:00 PM)',
    timezone: 'IST (UTC+05:30)',
    skills: ['Figma', 'Design Systems', 'Micro-interactions', 'Prototyping', 'TailwindCSS'],
    bio: 'Senior product designer leading user experience benchmarks, mobile design systems, and client wireframe prototyping.',
    attendanceSummary: {
      presentDays: 19,
      absentDays: 0,
      lateDays: 4,
      wfhDays: 4,
      leaveDays: 0,
      avgWorkingHours: '8h 15m',
    },
    currentTasks: [
      { id: 't-301', title: 'Payment gateway integration UI spec', priority: 'High', status: 'In Progress', dueDate: 'Tomorrow, 06:00 PM' },
      { id: 't-302', title: 'Design system typography and elevation audit', priority: 'Medium', status: 'In Progress', dueDate: '03 Oct 2026' },
      { id: 't-303', title: 'Figma interactive component library update', priority: 'Low', status: 'To Do', dueDate: '05 Oct 2026' }
    ],
    currentProjects: [
      { id: 'p-2', name: 'XYZ Mobile App', role: 'Lead Product Designer', progress: 82, deadline: '15 Oct 2026', hoursLogged: '112h' },
      { id: 'p-1', name: 'ABC Corporate Website', role: 'UI Designer', progress: 67, deadline: '30 Sep 2026', hoursLogged: '86h' }
    ],
    recentActivities: [
      { id: 'act-301', action: 'Submitted Figma design review', resource: 'Mobile Menu Wireframes', time: '3 hours ago', type: 'file' },
      { id: 'act-302', action: 'Attended UX critique sync', resource: 'Checkout Funnel Audit', time: '1 day ago', type: 'meeting' }
    ],
    leaveBalance: { annual: 10, sick: 5, personal: 2, unpaid: 0, used: 5, remaining: 12 }
  },
  {
    id: 'emp-4',
    firstName: 'Amit',
    lastName: 'Joshi',
    name: 'Amit Joshi',
    email: 'a.joshi@technova.io',
    phone: '+91 98255 33441',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    employeeId: 'TN-004',
    role: 'Backend Developer',
    department: 'Development',
    team: 'Backend Team',
    status: 'Active',
    attendanceToday: 'WFH',
    currentProject: 'Bright Retail ERP',
    workload: 65,
    joiningDate: '01 Nov 2022',
    employmentType: 'Full Time',
    manager: 'Rahul Sharma',
    workLocation: 'Remote',
    shift: 'General Shift (09:00 AM - 06:00 PM)',
    timezone: 'IST (UTC+05:30)',
    skills: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'Docker', 'REST & GraphQL'],
    bio: 'Backend systems engineer focused on high-throughput database schemas, event queues, and payment API integrations.',
    attendanceSummary: {
      presentDays: 20,
      absentDays: 0,
      lateDays: 1,
      wfhDays: 5,
      leaveDays: 0,
      avgWorkingHours: '8h 20m',
    },
    currentTasks: [
      { id: 't-401', title: 'Inventory schema migration rollout', priority: 'High', status: 'In Progress', dueDate: '30 Sep 2026' },
      { id: 't-402', title: 'Redis cache invalidation pipeline', priority: 'Medium', status: 'To Do', dueDate: '04 Oct 2026' }
    ],
    currentProjects: [
      { id: 'p-3', name: 'Bright Retail ERP', role: 'Lead Backend Engineer', progress: 42, deadline: '20 Nov 2026', hoursLogged: '140h' }
    ],
    recentActivities: [
      { id: 'act-401', action: 'Deployed database migration', resource: 'Bright ERP Schema v2.1', time: '5 hours ago', type: 'task' }
    ],
    leaveBalance: { annual: 14, sick: 7, personal: 4, unpaid: 0, used: 1, remaining: 24 }
  },
  {
    id: 'emp-5',
    firstName: 'Neha',
    lastName: 'Mehta',
    name: 'Neha Mehta',
    email: 'n.mehta@technova.io',
    phone: '+91 99090 88221',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    employeeId: 'TN-005',
    role: 'QA Engineer',
    department: 'QA',
    team: 'QA Team',
    status: 'On Leave',
    attendanceToday: 'On Leave',
    currentProject: 'ABC Corporate Website',
    workload: 48,
    joiningDate: '15 Feb 2023',
    employmentType: 'Full Time',
    manager: 'Rahul Sharma',
    workLocation: 'Office',
    shift: 'General Shift (09:00 AM - 06:00 PM)',
    timezone: 'IST (UTC+05:30)',
    skills: ['Cypress', 'Playwright', 'Jest', 'API Automation', 'Jira'],
    bio: 'Test automation specialist ensuring zero-regression release cycles across desktop and mobile form factors.',
    attendanceSummary: {
      presentDays: 18,
      absentDays: 0,
      lateDays: 0,
      wfhDays: 2,
      leaveDays: 2,
      avgWorkingHours: '8h 00m',
    },
    currentTasks: [
      { id: 't-501', title: 'Cross-browser safari test verification', priority: 'Medium', status: 'To Do', dueDate: '02 Oct 2026' }
    ],
    currentProjects: [
      { id: 'p-1', name: 'ABC Corporate Website', role: 'Lead QA', progress: 67, deadline: '30 Sep 2026', hoursLogged: '64h' }
    ],
    recentActivities: [
      { id: 'act-501', action: 'Leave request approved', resource: 'Casual Leave (24-25 Sep)', time: '2 days ago', type: 'leave' }
    ],
    leaveBalance: { annual: 8, sick: 4, personal: 1, unpaid: 0, used: 7, remaining: 6 }
  },
  {
    id: 'emp-6',
    firstName: 'Siddharth',
    lastName: 'Verma',
    name: 'Siddharth Verma',
    email: 's.verma@technova.io',
    phone: '+91 98251 66778',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    employeeId: 'TN-006',
    role: 'Mobile App Developer',
    department: 'Development',
    team: 'Frontend Team',
    status: 'Active',
    attendanceToday: 'Present',
    currentProject: 'XYZ Mobile App',
    workload: 76,
    joiningDate: '01 Jun 2023',
    employmentType: 'Full Time',
    manager: 'Rahul Sharma',
    workLocation: 'Hybrid',
    shift: 'General Shift (09:00 AM - 06:00 PM)',
    timezone: 'IST (UTC+05:30)',
    skills: ['React Native', 'Flutter', 'iOS / Swift', 'Android / Kotlin'],
    bio: 'Mobile platform engineer engineering high-performance native iOS and Android modules.',
    attendanceSummary: {
      presentDays: 21,
      absentDays: 0,
      lateDays: 1,
      wfhDays: 3,
      leaveDays: 0,
      avgWorkingHours: '8h 25m',
    },
    currentTasks: [
      { id: 't-601', title: 'Push notification background handler', priority: 'High', status: 'In Progress', dueDate: '01 Oct 2026' }
    ],
    currentProjects: [
      { id: 'p-2', name: 'XYZ Mobile App', role: 'Mobile Dev', progress: 82, deadline: '15 Oct 2026', hoursLogged: '105h' }
    ],
    recentActivities: [
      { id: 'act-601', action: 'Committed branch', resource: 'feature/push-notifications', time: '1 hour ago', type: 'task' }
    ],
    leaveBalance: { annual: 12, sick: 6, personal: 3, unpaid: 0, used: 2, remaining: 19 }
  },
  {
    id: 'emp-7',
    firstName: 'Ananya',
    lastName: 'Deshmukh',
    name: 'Ananya Deshmukh',
    email: 'a.deshmukh@technova.io',
    phone: '+91 99112 44332',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    employeeId: 'TN-007',
    role: 'HR & People Manager',
    department: 'HR',
    team: 'Executive Leadership',
    status: 'Active',
    attendanceToday: 'Present',
    currentProject: 'Talent & Culture Operations',
    workload: 68,
    joiningDate: '10 Jan 2024',
    employmentType: 'Full Time',
    manager: 'Mayur Patel',
    workLocation: 'Office',
    shift: 'General Shift (09:00 AM - 06:00 PM)',
    timezone: 'IST (UTC+05:30)',
    skills: ['Talent Acquisition', 'HR Policies', 'Payroll Compliance', 'Employee Engagement'],
    bio: 'Head of People Operations orchestrating recruitment, compliance policies, and employee wellness initiatives.',
    attendanceSummary: {
      presentDays: 22,
      absentDays: 0,
      lateDays: 0,
      wfhDays: 1,
      leaveDays: 0,
      avgWorkingHours: '8h 40m',
    },
    currentTasks: [
      { id: 't-701', title: 'Quarterly performance appraisal cycle launch', priority: 'High', status: 'In Progress', dueDate: '05 Oct 2026' }
    ],
    currentProjects: [],
    recentActivities: [
      { id: 'act-701', action: 'Onboarded new team member', resource: 'Kunal Singhania (Dev)', time: '3 days ago', type: 'task' }
    ],
    leaveBalance: { annual: 15, sick: 8, personal: 4, unpaid: 0, used: 1, remaining: 26 }
  },
  {
    id: 'emp-8',
    firstName: 'Kunal',
    lastName: 'Singhania',
    name: 'Kunal Singhania',
    email: 'k.singhania@technova.io',
    phone: '+91 97120 55667',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    employeeId: 'TN-008',
    role: 'Junior Frontend Developer',
    department: 'Development',
    team: 'Frontend Team',
    status: 'Probation',
    attendanceToday: 'Present',
    currentProject: 'ABC Corporate Website',
    workload: 60,
    joiningDate: '01 Sep 2026',
    employmentType: 'Full Time',
    manager: 'Rahul Sharma',
    workLocation: 'Office',
    shift: 'General Shift (09:00 AM - 06:00 PM)',
    timezone: 'IST (UTC+05:30)',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Git'],
    bio: 'Junior frontend engineer working on reusable UI components and client landing page styling.',
    attendanceSummary: {
      presentDays: 18,
      absentDays: 0,
      lateDays: 1,
      wfhDays: 0,
      leaveDays: 0,
      avgWorkingHours: '8h 30m',
    },
    currentTasks: [
      { id: 't-801', title: 'Footer copyright and legal links update', priority: 'Low', status: 'In Progress', dueDate: 'Tomorrow, 04:00 PM' }
    ],
    currentProjects: [
      { id: 'p-1', name: 'ABC Corporate Website', role: 'Frontend Junior', progress: 67, deadline: '30 Sep 2026', hoursLogged: '45h' }
    ],
    recentActivities: [
      { id: 'act-801', action: 'Submitted PR', resource: 'fix/footer-mobile-links', time: '2 hours ago', type: 'task' }
    ],
    leaveBalance: { annual: 5, sick: 2, personal: 1, unpaid: 0, used: 0, remaining: 8 }
  }
];

// ----------------------------------------------------
// ATTENDANCE DAILY RECORDS
// ----------------------------------------------------

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'emp-1',
    employeeName: 'Mayur Patel',
    department: 'Management',
    date: '25 Sep 2026',
    checkIn: '08:45 AM',
    breakStart: '01:00 PM',
    breakEnd: '01:45 PM',
    checkOut: '06:00 PM (Active)',
    workingHours: '06h 15m',
    overtime: '00h 00m',
    status: 'Present',
    location: 'Office',
    device: 'MacBook Pro 16" (macOS 15.0)',
    ip: '192.168.1.10 (TechNova HQ)',
    timeline: [
      { time: '08:45 AM', label: 'Office Check-in verified via Portal', type: 'checkin' },
      { time: '01:00 PM', label: 'Lunch Break started', type: 'break' },
      { time: '01:45 PM', label: 'Resumed desk activity', type: 'resume' }
    ]
  },
  {
    id: 'att-2',
    employeeId: 'emp-2',
    employeeName: 'Rahul Sharma',
    department: 'Development',
    date: '25 Sep 2026',
    checkIn: '09:02 AM',
    breakStart: '12:45 PM',
    breakEnd: '01:30 PM',
    checkOut: '06:17 PM',
    workingHours: '08h 30m',
    overtime: '00h 30m',
    status: 'Present',
    location: 'Office',
    device: 'Dell XPS 15 (Ubuntu 24.04)',
    ip: '192.168.1.42 (TechNova HQ)',
    timeline: [
      { time: '09:02 AM', label: 'Check-in verified', type: 'checkin' },
      { time: '12:45 PM', label: 'Break Start', type: 'break' },
      { time: '01:30 PM', label: 'Break End', type: 'resume' },
      { time: '06:17 PM', label: 'Check-out completed', type: 'checkout' }
    ]
  },
  {
    id: 'att-3',
    employeeId: 'emp-3',
    employeeName: 'Priya Shah',
    department: 'UI/UX',
    date: '25 Sep 2026',
    checkIn: '09:35 AM',
    breakStart: '01:15 PM',
    breakEnd: '02:00 PM',
    checkOut: '06:00 PM (Active)',
    workingHours: '05h 25m',
    overtime: '00h 00m',
    status: 'Late',
    location: 'Office',
    device: 'Apple iMac 24" (macOS 14.5)',
    ip: '192.168.1.77 (TechNova HQ)',
    lateDuration: '35 minutes late (Grace period: 10m)',
    timeline: [
      { time: '09:35 AM', label: 'Late check-in logged (Traffic delay flagged)', type: 'checkin' },
      { time: '01:15 PM', label: 'Lunch Break started', type: 'break' },
      { time: '02:00 PM', label: 'Break End', type: 'resume' }
    ]
  },
  {
    id: 'att-4',
    employeeId: 'emp-4',
    employeeName: 'Amit Joshi',
    department: 'Development',
    date: '25 Sep 2026',
    checkIn: '09:00 AM',
    breakStart: '01:00 PM',
    breakEnd: '01:45 PM',
    checkOut: '06:00 PM (Active)',
    workingHours: '06h 00m',
    overtime: '00h 00m',
    status: 'WFH',
    location: 'Remote',
    device: 'ThinkPad T14 (Arch Linux)',
    ip: '122.179.45.12 (Airtel Broadband)',
    timeline: [
      { time: '09:00 AM', label: 'Remote WFH check-in with GPS verification', type: 'checkin' },
      { time: '01:00 PM', label: 'Break Start', type: 'break' },
      { time: '01:45 PM', label: 'Break End', type: 'resume' }
    ]
  },
  {
    id: 'att-5',
    employeeId: 'emp-5',
    employeeName: 'Neha Mehta',
    department: 'QA',
    date: '25 Sep 2026',
    checkIn: '—',
    breakStart: '—',
    breakEnd: '—',
    checkOut: '—',
    workingHours: '00h 00m',
    overtime: '00h 00m',
    status: 'On Leave',
    location: 'Office',
    timeline: [
      { time: '09:00 AM', label: 'Casual Leave day 2 of 2 active', type: 'checkin' }
    ]
  },
  {
    id: 'att-6',
    employeeId: 'emp-6',
    employeeName: 'Siddharth Verma',
    department: 'Development',
    date: '25 Sep 2026',
    checkIn: '08:55 AM',
    breakStart: '01:10 PM',
    breakEnd: '01:50 PM',
    checkOut: '06:00 PM (Active)',
    workingHours: '06h 05m',
    overtime: '00h 00m',
    status: 'Present',
    location: 'Office',
    device: 'MacBook Air M2',
    ip: '192.168.1.88 (TechNova HQ)',
    timeline: [
      { time: '08:55 AM', label: 'On-time check-in recorded', type: 'checkin' },
      { time: '01:10 PM', label: 'Break Start', type: 'break' },
      { time: '01:50 PM', label: 'Break End', type: 'resume' }
    ]
  },
  {
    id: 'att-7',
    employeeId: 'emp-7',
    employeeName: 'Ananya Deshmukh',
    department: 'HR',
    date: '25 Sep 2026',
    checkIn: '08:50 AM',
    breakStart: '01:00 PM',
    breakEnd: '01:40 PM',
    checkOut: '06:00 PM (Active)',
    workingHours: '06h 10m',
    overtime: '00h 00m',
    status: 'Present',
    location: 'Office',
    device: 'HP EliteBook (Windows 11)',
    ip: '192.168.1.15 (TechNova HQ)',
    timeline: [
      { time: '08:50 AM', label: 'Check-in verified', type: 'checkin' }
    ]
  },
  {
    id: 'att-8',
    employeeId: 'emp-8',
    employeeName: 'Kunal Singhania',
    department: 'Development',
    date: '25 Sep 2026',
    checkIn: '09:05 AM',
    breakStart: '01:00 PM',
    breakEnd: '02:00 PM',
    checkOut: '06:00 PM (Active)',
    workingHours: '05h 55m',
    overtime: '00h 00m',
    status: 'Present',
    location: 'Office',
    device: 'Custom Tower (Windows 11 Pro)',
    ip: '192.168.1.92 (TechNova HQ)',
    timeline: [
      { time: '09:05 AM', label: 'Check-in within grace period', type: 'checkin' }
    ]
  }
];

// ----------------------------------------------------
// ATTENDANCE CORRECTIONS
// ----------------------------------------------------

export const INITIAL_CORRECTIONS: AttendanceCorrection[] = [
  {
    id: 'corr-1',
    employeeId: 'emp-2',
    employeeName: 'Rahul Sharma',
    date: '24 Sep 2026',
    originalRecord: 'Check-out: 05:20 PM',
    requestedChange: 'Check-out: 06:00 PM',
    reason: 'Forgot to check out before attending late sprint client call with ABC Pvt Ltd.',
    requestedBy: 'Rahul Sharma',
    status: 'Pending',
    created: '24 Sep 2026, 06:45 PM',
    evidence: 'Google Meet call log attached confirming meeting ended at 06:02 PM.'
  },
  {
    id: 'corr-2',
    employeeId: 'emp-3',
    employeeName: 'Priya Shah',
    date: '22 Sep 2026',
    originalRecord: 'Status: Late (09:45 AM)',
    requestedChange: 'Status: Present (09:05 AM)',
    reason: 'Portal authentication network timeout upon entering office; had to reconnect wifi.',
    requestedBy: 'Priya Shah',
    status: 'Approved',
    created: '22 Sep 2026, 10:15 AM',
    reviewerNotes: 'Verified via security desk visitor log.'
  },
  {
    id: 'corr-3',
    employeeId: 'emp-4',
    employeeName: 'Amit Joshi',
    date: '19 Sep 2026',
    originalRecord: 'Check-out: 06:00 PM',
    requestedChange: 'Check-out: 08:30 PM (Overtime)',
    reason: 'Critical production database patch deployed for Bright Retail ERP rollout.',
    requestedBy: 'Amit Joshi',
    status: 'Approved',
    created: '20 Sep 2026, 09:10 AM',
    reviewerNotes: 'Production deployment confirmed by Mayur Patel.'
  }
];

// ----------------------------------------------------
// LEAVE REQUESTS
// ----------------------------------------------------

export const INITIAL_LEAVES: LeaveItem[] = [
  {
    id: 'lv-1',
    employeeId: 'emp-5',
    employeeName: 'Neha Mehta',
    department: 'QA',
    leaveType: 'Annual Leave',
    startDate: '24 Sep 2026',
    endDate: '25 Sep 2026',
    duration: '2 Days',
    isHalfDay: false,
    reason: 'Family wedding ceremony out of town.',
    status: 'Approved',
    requestedOn: '20 Sep 2026',
    approver: 'Rahul Sharma',
    remainingBalanceAnnual: 8,
    remainingBalanceSick: 4,
    timeline: [
      { date: '20 Sep 2026, 11:30 AM', action: 'Submitted by Neha Mehta', user: 'Neha Mehta' },
      { date: '21 Sep 2026, 09:15 AM', action: 'Approved by Team Lead', user: 'Rahul Sharma' }
    ]
  },
  {
    id: 'lv-2',
    employeeId: 'emp-3',
    employeeName: 'Priya Shah',
    department: 'UI/UX',
    leaveType: 'Sick Leave',
    startDate: '29 Sep 2026',
    endDate: '29 Sep 2026',
    duration: '1 Day',
    isHalfDay: false,
    reason: 'Dental appointment and root canal procedure recovery.',
    status: 'Pending',
    requestedOn: '24 Sep 2026',
    approver: 'Mayur Patel',
    attachment: 'dental_clinic_receipt.pdf',
    remainingBalanceAnnual: 10,
    remainingBalanceSick: 5,
    timeline: [
      { date: '24 Sep 2026, 04:10 PM', action: 'Submitted by Priya Shah', user: 'Priya Shah' },
      { date: '24 Sep 2026, 04:10 PM', action: 'Awaiting manager approval', user: 'System' }
    ]
  },
  {
    id: 'lv-3',
    employeeId: 'emp-2',
    employeeName: 'Rahul Sharma',
    department: 'Development',
    leaveType: 'Personal Leave',
    startDate: '08 Oct 2026',
    endDate: '09 Oct 2026',
    duration: '2 Days',
    isHalfDay: false,
    reason: 'Personal family obligations during festival holidays.',
    status: 'Pending',
    requestedOn: '25 Sep 2026',
    approver: 'Mayur Patel',
    remainingBalanceAnnual: 12,
    remainingBalanceSick: 6,
    timeline: [
      { date: '25 Sep 2026, 08:30 AM', action: 'Submitted by Rahul Sharma', user: 'Rahul Sharma' }
    ]
  }
];

// ----------------------------------------------------
// TEAMS
// ----------------------------------------------------

export const INITIAL_TEAMS: TeamItem[] = [
  {
    id: 'team-1',
    name: 'Frontend Team',
    manager: 'Rahul Sharma',
    managerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    memberCount: 6,
    activeProjects: 3,
    openTasks: 28,
    workload: 82,
    status: 'High Load',
    description: 'Responsible for React, Next.js frontend interfaces, mobile web responsiveness, and client web portals.',
    members: [
      { employeeId: 'emp-2', name: 'Rahul Sharma', role: 'Lead Developer', workload: 82, currentProject: 'ABC Corporate Website', tasksCount: 6, attendance: 'Present' },
      { employeeId: 'emp-6', name: 'Siddharth Verma', role: 'Mobile / React Dev', workload: 76, currentProject: 'XYZ Mobile App', tasksCount: 5, attendance: 'Present' },
      { employeeId: 'emp-8', name: 'Kunal Singhania', role: 'Junior Frontend', workload: 60, currentProject: 'ABC Corporate Website', tasksCount: 3, attendance: 'Present' }
    ],
    projects: [
      { id: 'p-1', name: 'ABC Corporate Website', progress: 67, deadline: '30 Sep 2026' },
      { id: 'p-2', name: 'XYZ Mobile App', progress: 82, deadline: '15 Oct 2026' },
      { id: 'p-3', name: 'Bright Retail ERP', progress: 42, deadline: '20 Nov 2026' }
    ]
  },
  {
    id: 'team-2',
    name: 'Backend Team',
    manager: 'Amit Joshi',
    managerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    memberCount: 5,
    activeProjects: 4,
    openTasks: 22,
    workload: 76,
    status: 'Balanced',
    description: 'Engineers microservices, database schemas, PostgreSQL replication, Redis caches, and payment gateways.',
    members: [
      { employeeId: 'emp-4', name: 'Amit Joshi', role: 'Backend Lead', workload: 65, currentProject: 'Bright Retail ERP', tasksCount: 4, attendance: 'WFH' }
    ],
    projects: [
      { id: 'p-3', name: 'Bright Retail ERP', progress: 42, deadline: '20 Nov 2026' },
      { id: 'p-1', name: 'ABC Corporate Website', progress: 67, deadline: '30 Sep 2026' }
    ]
  },
  {
    id: 'team-3',
    name: 'Design Team',
    manager: 'Priya Shah',
    managerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    memberCount: 3,
    activeProjects: 2,
    openTasks: 12,
    workload: 93,
    status: 'High Load',
    description: 'Creates design systems, wireframes, user journeys, brand assets, and mobile interactive prototypes in Figma.',
    members: [
      { employeeId: 'emp-3', name: 'Priya Shah', role: 'Lead UI/UX Designer', workload: 93, currentProject: 'XYZ Mobile App', tasksCount: 8, attendance: 'Late' }
    ],
    projects: [
      { id: 'p-2', name: 'XYZ Mobile App', progress: 82, deadline: '15 Oct 2026' },
      { id: 'p-1', name: 'ABC Corporate Website', progress: 67, deadline: '30 Sep 2026' }
    ]
  },
  {
    id: 'team-4',
    name: 'QA Team',
    manager: 'Neha Mehta',
    managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    memberCount: 4,
    activeProjects: 3,
    openTasks: 18,
    workload: 68,
    status: 'Balanced',
    description: 'Quality assurance, Cypress automated test runner, manual exploratory testing, and performance stress benchmarks.',
    members: [
      { employeeId: 'emp-5', name: 'Neha Mehta', role: 'Lead QA', workload: 48, currentProject: 'ABC Corporate Website', tasksCount: 3, attendance: 'On Leave' }
    ],
    projects: [
      { id: 'p-1', name: 'ABC Corporate Website', progress: 67, deadline: '30 Sep 2026' },
      { id: 'p-2', name: 'XYZ Mobile App', progress: 82, deadline: '15 Oct 2026' }
    ]
  }
];

// ----------------------------------------------------
// DEPARTMENTS
// ----------------------------------------------------

export const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  {
    id: 'dept-1',
    name: 'Management',
    manager: 'Mayur Patel',
    employeesCount: 3,
    projectsCount: 12,
    openTasksCount: 8,
    avgWorkload: 70,
    attendanceRate: 98,
    taskCompletionRate: 92,
    description: 'Executive vision, strategic capital allocation, client relationships, and business P&L.'
  },
  {
    id: 'dept-2',
    name: 'Development',
    manager: 'Rahul Sharma',
    employeesCount: 12,
    projectsCount: 8,
    openTasksCount: 45,
    avgWorkload: 79,
    attendanceRate: 94,
    taskCompletionRate: 86,
    description: 'Frontend and backend engineering delivering scalable web and mobile software.'
  },
  {
    id: 'dept-3',
    name: 'UI/UX',
    manager: 'Priya Shah',
    employeesCount: 3,
    projectsCount: 4,
    openTasksCount: 14,
    avgWorkload: 91,
    attendanceRate: 92,
    taskCompletionRate: 88,
    description: 'Brand identity, typography, user interface design systems, and Figma component libraries.'
  },
  {
    id: 'dept-4',
    name: 'QA',
    manager: 'Neha Mehta',
    employeesCount: 4,
    projectsCount: 6,
    openTasksCount: 22,
    avgWorkload: 66,
    attendanceRate: 95,
    taskCompletionRate: 94,
    description: 'Continuous integration regression suites, cross-device testing, and bug tracking.'
  },
  {
    id: 'dept-5',
    name: 'Sales & Growth',
    manager: 'Anand Kumar',
    employeesCount: 3,
    projectsCount: 5,
    openTasksCount: 12,
    avgWorkload: 62,
    attendanceRate: 91,
    taskCompletionRate: 85,
    description: 'Enterprise client acquisition, proposal preparation, and inbound partnership management.'
  },
  {
    id: 'dept-6',
    name: 'HR & People Ops',
    manager: 'Ananya Deshmukh',
    employeesCount: 2,
    projectsCount: 2,
    openTasksCount: 9,
    avgWorkload: 68,
    attendanceRate: 97,
    taskCompletionRate: 96,
    description: 'Recruitment, employee onboarding, culture, attendance governance, and payroll.'
  },
  {
    id: 'dept-7',
    name: 'Customer Support',
    manager: 'Vikram Joshi',
    employeesCount: 3,
    projectsCount: 3,
    openTasksCount: 16,
    avgWorkload: 72,
    attendanceRate: 96,
    taskCompletionRate: 90,
    description: 'Tier-1 and Tier-2 incident response, client SLA fulfillment, and ticketing operations.'
  }
];

// ----------------------------------------------------
// HOLIDAYS
// ----------------------------------------------------

export const INITIAL_HOLIDAYS: HolidayItem[] = [
  {
    id: 'hol-1',
    name: 'Gandhi Jayanti',
    date: '02 Oct 2026',
    day: 'Friday',
    type: 'Public Holiday',
    description: 'National holiday commemorating Mahatma Gandhi’s birth anniversary.',
    applicableTeams: 'All Teams (Company-wide)',
    status: 'Upcoming'
  },
  {
    id: 'hol-2',
    name: 'Dussehra (Vijayadashami)',
    date: '20 Oct 2026',
    day: 'Tuesday',
    type: 'Public Holiday',
    description: 'Celebration of the victory of good over evil.',
    applicableTeams: 'All Teams (Company-wide)',
    status: 'Upcoming'
  },
  {
    id: 'hol-3',
    name: 'Diwali (Deepavali)',
    date: '08 Nov 2026',
    day: 'Sunday',
    type: 'Public Holiday',
    description: 'Festival of lights celebrated across India.',
    applicableTeams: 'All Teams (Company-wide)',
    status: 'Upcoming'
  },
  {
    id: 'hol-4',
    name: 'Govardhan Puja & Vikram Samvat New Year',
    date: '09 Nov 2026',
    day: 'Monday',
    type: 'Public Holiday',
    description: 'Auspicious Gujarati New Year and festive day.',
    applicableTeams: 'All Teams (Company-wide)',
    status: 'Upcoming'
  },
  {
    id: 'hol-5',
    name: 'TechNova Foundation Day',
    date: '15 Dec 2026',
    day: 'Tuesday',
    type: 'Company Holiday',
    description: 'Annual corporate celebration honoring company founding and team achievements.',
    applicableTeams: 'All Teams (Company-wide)',
    status: 'Upcoming'
  },
  {
    id: 'hol-6',
    name: 'Christmas Day',
    date: '25 Dec 2026',
    day: 'Friday',
    type: 'Public Holiday',
    description: 'Global festive holiday.',
    applicableTeams: 'All Teams (Company-wide)',
    status: 'Upcoming'
  },
  {
    id: 'hol-7',
    name: 'Independence Day',
    date: '15 Aug 2026',
    day: 'Saturday',
    type: 'Public Holiday',
    description: 'Indian Independence Day celebration.',
    applicableTeams: 'All Teams (Company-wide)',
    status: 'Passed'
  }
];

// ----------------------------------------------------
// SHIFTS
// ----------------------------------------------------

export const INITIAL_SHIFTS: ShiftItem[] = [
  {
    id: 'sh-1',
    name: 'General Shift',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    breakDuration: '60 minutes',
    workingHours: '8 hours',
    gracePeriod: '10 minutes',
    overtimeRule: 'Overtime kicks in after 8.5 hours',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    assignedEmployeesCount: 18
  },
  {
    id: 'sh-2',
    name: 'Early Bird Shift',
    startTime: '08:00 AM',
    endTime: '05:00 PM',
    breakDuration: '60 minutes',
    workingHours: '8 hours',
    gracePeriod: '10 minutes',
    overtimeRule: 'Overtime kicks in after 8.5 hours',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    assignedEmployeesCount: 3
  },
  {
    id: 'sh-3',
    name: 'Late Shift',
    startTime: '11:00 AM',
    endTime: '08:00 PM',
    breakDuration: '60 minutes',
    workingHours: '8 hours',
    gracePeriod: '15 minutes',
    overtimeRule: 'Overtime kicks in after 8.5 hours',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    assignedEmployeesCount: 2
  },
  {
    id: 'sh-4',
    name: 'Flexible Shift',
    startTime: 'Flexible',
    endTime: 'Flexible',
    breakDuration: 'Flexible (Up to 90 min)',
    workingHours: '8 hours mandatory/day',
    gracePeriod: 'N/A',
    overtimeRule: 'Overtime tracked on total monthly delta',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    assignedEmployeesCount: 2
  }
];

// ----------------------------------------------------
// OFFICE POLICIES
// ----------------------------------------------------

export const INITIAL_POLICIES: OfficePolicies = {
  gracePeriodMinutes: 10,
  lateThresholdMinutes: 10,
  overtimeThresholdHours: 8,
  maxBreakMinutes: 60,
  workingHoursPerDay: 8,
  autoClockOutHour: '10:00 PM',
  biometricSyncEnabled: false,
  requireLocationForWFH: true,
  leaveNoticeDays: 3
};
