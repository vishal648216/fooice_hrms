export type EventCategory = 
  | 'Meetings' 
  | 'Tasks' 
  | 'Projects' 
  | 'Deadlines' 
  | 'Leave' 
  | 'Holidays' 
  | 'Payments' 
  | 'Milestones';

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'Meeting' | 'Task Deadline' | 'Project Milestone' | 'Leave' | 'Holiday' | 'Payment Due' | 'Client Approval' | 'Personal Reminder';
  category: EventCategory;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:00 AM"
  endTime: string;   // e.g. "11:00 AM"
  project?: string;
  client?: string;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';
  color: string;
  meetingId?: string;
  participants?: { name: string; avatar: string; role: string; status: 'Accepted' | 'Pending' | 'Declined' }[];
  location?: string;
  description?: string;
}

export interface MeetingParticipant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  type: 'Employee' | 'Client' | 'Team' | 'External';
  isRequired: boolean;
  invitationStatus: 'Accepted' | 'Pending' | 'Declined';
  availability?: Record<string, 'Available' | 'Busy'>; // e.g. { '10:00': 'Busy', '11:00': 'Available' }
}

export interface MeetingAgendaItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface MeetingActionItem {
  id: string;
  task: string;
  assignedTo: string;
  assignedAvatar?: string;
  dueDate: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
}

export interface MeetingTranscriptEntry {
  id: string;
  time: string;
  speaker: string;
  avatar: string;
  text: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  type: 'Internal' | 'Client Meeting' | 'Project Review' | 'Sprint Planning' | 'Design Review' | 'Interview' | 'Training' | 'Other';
  date: string; // e.g. "2026-09-25"
  startTime: string; // e.g. "11:00 AM"
  endTime: string;   // e.g. "12:00 PM"
  timezone: string;  // e.g. "IST (UTC+05:30)"
  duration: string;  // e.g. "60 minutes"
  status: 'Upcoming' | 'Live' | 'Completed' | 'Cancelled';
  organizer: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
  project?: {
    id: string;
    name: string;
    client: string;
    progress: number;
    milestone: string;
    openTasks: number;
    pendingRequirements: number;
  };
  client?: {
    name: string;
    company: string;
    avatar: string;
  };
  participants: MeetingParticipant[];
  recurrence?: {
    repeat: 'Does not repeat' | 'Daily' | 'Weekly' | 'Monthly' | 'Custom';
    repeatOn?: string;
    endsOn?: string;
  };
  agenda: MeetingAgendaItem[];
  settings: {
    recording: boolean;
    transcript: boolean;
    aiNotes: boolean;
    waitingRoom: boolean;
    participantChat: boolean;
    screenSharing: boolean;
    reactions: boolean;
    allowEarlyJoin: boolean;
  };
  reminders: string[]; // e.g. ["15 minutes before", "1 hour before"]
  attachments: { name: string; size: string; type: string }[];
  whiteboard?: {
    id: string;
    title: string;
    previewThumbnail?: string;
    participantCount: number;
  };
  meetUrl: string;
  notes?: {
    summary: string;
    decisions: string[];
    actionItems: MeetingActionItem[];
    requirements: string[];
  };
  transcript?: MeetingTranscriptEntry[];
  activity: { time: string; action: string; user: string }[];
}

// ----------------------------------------------------
// MOCK PARTICIPANTS POOL
// ----------------------------------------------------

export const AVAILABLE_PARTICIPANTS: MeetingParticipant[] = [
  {
    id: 'p-1',
    name: 'Mayur Patel',
    email: 'm.patel@technova.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Director / Admin',
    type: 'Employee',
    isRequired: true,
    invitationStatus: 'Accepted',
    availability: {
      '09:00 AM': 'Available',
      '10:00 AM': 'Available',
      '11:00 AM': 'Available',
      '12:00 PM': 'Busy',
      '02:00 PM': 'Available',
      '03:00 PM': 'Available',
      '04:00 PM': 'Available'
    }
  },
  {
    id: 'p-2',
    name: 'Rahul Sharma',
    email: 'r.sharma@technova.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Senior Full Stack Developer',
    type: 'Employee',
    isRequired: true,
    invitationStatus: 'Accepted',
    availability: {
      '09:00 AM': 'Available',
      '10:00 AM': 'Busy',
      '11:00 AM': 'Available',
      '12:00 PM': 'Busy',
      '02:00 PM': 'Busy',
      '03:00 PM': 'Available',
      '04:00 PM': 'Available'
    }
  },
  {
    id: 'p-3',
    name: 'Priya Shah',
    email: 'p.shah@technova.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Lead UI/UX Designer',
    type: 'Employee',
    isRequired: true,
    invitationStatus: 'Accepted',
    availability: {
      '09:00 AM': 'Busy',
      '10:00 AM': 'Available',
      '11:00 AM': 'Available',
      '12:00 PM': 'Available',
      '02:00 PM': 'Busy',
      '03:00 PM': 'Busy',
      '04:00 PM': 'Available'
    }
  },
  {
    id: 'p-4',
    name: 'Amit Joshi',
    email: 'a.joshi@technova.io',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    role: 'Backend Developer',
    type: 'Employee',
    isRequired: false,
    invitationStatus: 'Pending',
    availability: {
      '09:00 AM': 'Available',
      '10:00 AM': 'Available',
      '11:00 AM': 'Available',
      '12:00 PM': 'Busy',
      '02:00 PM': 'Available',
      '03:00 PM': 'Available',
      '04:00 PM': 'Available'
    }
  },
  {
    id: 'p-5',
    name: 'Neha Mehta',
    email: 'n.mehta@technova.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'QA Engineer',
    type: 'Employee',
    isRequired: false,
    invitationStatus: 'Declined',
    availability: {
      '09:00 AM': 'Busy',
      '10:00 AM': 'Busy',
      '11:00 AM': 'Busy',
      '12:00 PM': 'Busy',
      '02:00 PM': 'Busy',
      '03:00 PM': 'Busy',
      '04:00 PM': 'Busy'
    }
  },
  {
    id: 'p-6',
    name: 'Marcus Sterling',
    email: 'm.sterling@abc-pvt.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'VP of Product (ABC Pvt Ltd)',
    type: 'Client',
    isRequired: true,
    invitationStatus: 'Accepted',
    availability: {
      '09:00 AM': 'Busy',
      '10:00 AM': 'Busy',
      '11:00 AM': 'Available',
      '12:00 PM': 'Available',
      '02:00 PM': 'Busy',
      '03:00 PM': 'Busy',
      '04:00 PM': 'Available'
    }
  },
  {
    id: 'p-7',
    name: 'Elena Rostova',
    email: 'e.rostova@xyztech.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'Technical Director (XYZ Technologies)',
    type: 'Client',
    isRequired: true,
    invitationStatus: 'Accepted',
    availability: {
      '09:00 AM': 'Available',
      '10:00 AM': 'Available',
      '11:00 AM': 'Available',
      '12:00 PM': 'Available',
      '02:00 PM': 'Available',
      '03:00 PM': 'Available',
      '04:00 PM': 'Available'
    }
  }
];

// ----------------------------------------------------
// INITIAL MEETINGS LIST
// ----------------------------------------------------

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'mtg-101',
    title: 'ABC Website Discussion',
    description: 'Review updated homepage hero wireframes, client feedback on checkout flow, and staging deploy sign-off.',
    type: 'Client Meeting',
    date: '2026-09-25',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    timezone: 'IST (UTC+05:30)',
    duration: '60 minutes',
    status: 'Live',
    organizer: {
      id: 'p-1',
      name: 'Mayur Patel',
      email: 'm.patel@technova.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Director / Admin'
    },
    project: {
      id: 'prj-1',
      name: 'ABC Corporate Website',
      client: 'ABC Pvt Ltd',
      progress: 67,
      milestone: 'Alpha Milestone 1',
      openTasks: 5,
      pendingRequirements: 2
    },
    client: {
      name: 'Marcus Sterling',
      company: 'ABC Pvt Ltd',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    participants: [
      AVAILABLE_PARTICIPANTS[0], // Mayur
      AVAILABLE_PARTICIPANTS[1], // Rahul
      AVAILABLE_PARTICIPANTS[2], // Priya
      AVAILABLE_PARTICIPANTS[5]  // Marcus
    ],
    agenda: [
      { id: 'ag-1', title: 'Homepage Hero Redesign & Responsive Layout Status', completed: true },
      { id: 'ag-2', title: 'Mobile Bottom Navigation & Cart Sheet Specs', completed: false },
      { id: 'ag-3', title: 'Razorpay / Stripe Payment Webhook Validation', completed: false },
      { id: 'ag-4', title: 'Alpha Staging Server Deployment Signoff', completed: false }
    ],
    settings: {
      recording: true,
      transcript: true,
      aiNotes: true,
      waitingRoom: false,
      participantChat: true,
      screenSharing: true,
      reactions: true,
      allowEarlyJoin: true
    },
    reminders: ['15 minutes before', '1 hour before'],
    attachments: [
      { name: 'ABC_Homepage_v2_Wireframes.fig', size: '12.4 MB', type: 'Figma Design' },
      { name: 'Staging_Deployment_Checklist.pdf', size: '1.8 MB', type: 'PDF Document' },
      { name: 'Stripe_Integration_Specs.docx', size: '640 KB', type: 'Word Document' }
    ],
    whiteboard: {
      id: 'wb-101',
      title: 'ABC Website Architecture & Checkout Flow Board',
      previewThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
      participantCount: 4
    },
    meetUrl: 'http://localhost:3000/communication/meetings/mtg-101/room',
    notes: {
      summary: 'Client Marcus Sterling reviewed the new mobile bottom-sheet navigation and approved proceeding with Stripe webhook verification.',
      decisions: [
        'Mobile navigation menu will use simplified bottom sheet icons instead of a full screen drawer.',
        'Staging deploy scheduled for 30 Sep 2026 05:00 PM IST.'
      ],
      actionItems: [
        { id: 'act-1', task: 'Update responsive mobile header breakpoints in TailwindCSS', assignedTo: 'Rahul Sharma', dueDate: '30 Sep 2026', priority: 'Critical', status: 'In Progress' },
        { id: 'act-2', task: 'Finalize Figma icon set export for bottom bar', assignedTo: 'Priya Shah', dueDate: 'Tomorrow, 02:00 PM', priority: 'High', status: 'In Progress' }
      ],
      requirements: [
        'REQ-102: Stripe Webhook verification endpoint with HMAC signatures',
        'REQ-105: Mobile Cart persistent local state before checkout'
      ]
    },
    transcript: [
      { id: 'tr-1', time: '11:02 AM', speaker: 'Marcus Sterling', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', text: 'Good morning everyone. We reviewed the staging mockups for the homepage hero yesterday and they look much cleaner.' },
      { id: 'tr-2', time: '11:03 AM', speaker: 'Mayur Patel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', text: 'Thanks Marcus. Rahul and Priya have been refining the mobile bottom sheet to keep checkout friction low.' },
      { id: 'tr-3', time: '11:05 AM', speaker: 'Priya Shah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', text: 'I shared the updated Figma spec on slide 4. The action buttons now adhere to 48px tap targets.' },
      { id: 'tr-4', time: '11:07 AM', speaker: 'Rahul Sharma', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', text: 'I have already ported the component structure to React. Once we sign off today I will wire up the payment webhook.' }
    ],
    activity: [
      { time: '2 days ago', action: 'Scheduled meeting for 25 Sep 11:00 AM', user: 'Mayur Patel' },
      { time: '1 day ago', action: 'Attached ABC_Homepage_v2_Wireframes.fig', user: 'Priya Shah' },
      { time: '15 mins ago', action: 'Meeting room launched & live session active', user: 'System' }
    ]
  },
  {
    id: 'mtg-102',
    title: 'Internal Sprint Review',
    description: 'Weekly engineering sprint review, PR blockers, unit test coverage, and backend database schema migrations.',
    type: 'Sprint Planning',
    date: '2026-09-25',
    startTime: '12:30 PM',
    endTime: '01:15 PM',
    timezone: 'IST (UTC+05:30)',
    duration: '45 minutes',
    status: 'Upcoming',
    organizer: {
      id: 'p-2',
      name: 'Rahul Sharma',
      email: 'r.sharma@technova.io',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'Senior Full Stack Developer'
    },
    project: {
      id: 'prj-core',
      name: 'TechNova Engineering Core',
      client: 'TechNova Solutions',
      progress: 88,
      milestone: 'Sprint 24',
      openTasks: 12,
      pendingRequirements: 1
    },
    participants: [
      AVAILABLE_PARTICIPANTS[1], // Rahul
      AVAILABLE_PARTICIPANTS[2], // Priya
      AVAILABLE_PARTICIPANTS[3], // Amit
      AVAILABLE_PARTICIPANTS[0]  // Mayur
    ],
    agenda: [
      { id: 'ag-201', title: 'Sprint 24 velocity & burndown check', completed: false },
      { id: 'ag-202', title: 'PostgreSQL read-replica latency review', completed: false },
      { id: 'ag-203', title: 'Priya Shah UI workload reallocation', completed: false }
    ],
    settings: {
      recording: true,
      transcript: true,
      aiNotes: true,
      waitingRoom: false,
      participantChat: true,
      screenSharing: true,
      reactions: true,
      allowEarlyJoin: true
    },
    reminders: ['10 minutes before'],
    attachments: [
      { name: 'Sprint_24_Velocity_Report.pdf', size: '2.1 MB', type: 'PDF Report' }
    ],
    meetUrl: 'http://localhost:3000/communication/meetings/mtg-102/room',
    activity: [
      { time: 'Yesterday', action: 'Created recurring sprint meeting', user: 'Rahul Sharma' }
    ]
  },
  {
    id: 'mtg-103',
    title: 'XYZ Mobile App Review',
    description: 'Demonstration of native iOS & Android payment gateway integration and biometric FaceID auth.',
    type: 'Client Meeting',
    date: '2026-09-25',
    startTime: '04:00 PM',
    endTime: '05:00 PM',
    timezone: 'IST (UTC+05:30)',
    duration: '60 minutes',
    status: 'Upcoming',
    organizer: {
      id: 'p-1',
      name: 'Mayur Patel',
      email: 'm.patel@technova.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Director / Admin'
    },
    project: {
      id: 'prj-2',
      name: 'XYZ Mobile App',
      client: 'XYZ Technologies',
      progress: 82,
      milestone: 'Beta Milestone 3',
      openTasks: 8,
      pendingRequirements: 1
    },
    client: {
      name: 'Elena Rostova',
      company: 'XYZ Technologies',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    participants: [
      AVAILABLE_PARTICIPANTS[0], // Mayur
      AVAILABLE_PARTICIPANTS[2], // Priya
      AVAILABLE_PARTICIPANTS[6]  // Elena
    ],
    agenda: [
      { id: 'ag-301', title: 'React Native FaceID authentication demo', completed: false },
      { id: 'ag-302', title: 'In-app purchase flow test run', completed: false },
      { id: 'ag-303', title: 'TestFlight and Play Store internal test track rollout', completed: false }
    ],
    settings: {
      recording: true,
      transcript: true,
      aiNotes: true,
      waitingRoom: true,
      participantChat: true,
      screenSharing: true,
      reactions: true,
      allowEarlyJoin: false
    },
    reminders: ['15 minutes before'],
    attachments: [
      { name: 'XYZ_App_Beta_Build_Notes.pdf', size: '3.4 MB', type: 'PDF Document' }
    ],
    meetUrl: 'http://localhost:3000/communication/meetings/mtg-103/room',
    activity: [
      { time: '3 days ago', action: 'Meeting scheduled with client Elena Rostova', user: 'Mayur Patel' }
    ]
  },
  {
    id: 'mtg-104',
    title: 'Weekly Design Review',
    description: 'Review Figma interactive prototypes for Bright Retail ERP inventory tracking module.',
    type: 'Design Review',
    date: '2026-09-28',
    startTime: '03:00 PM',
    endTime: '04:00 PM',
    timezone: 'IST (UTC+05:30)',
    duration: '60 minutes',
    status: 'Upcoming',
    organizer: {
      id: 'p-3',
      name: 'Priya Shah',
      email: 'p.shah@technova.io',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'Lead UI/UX Designer'
    },
    project: {
      id: 'prj-3',
      name: 'Bright Retail ERP',
      client: 'Bright Retail',
      progress: 42,
      milestone: 'Design Phase 2',
      openTasks: 14,
      pendingRequirements: 3
    },
    participants: [
      AVAILABLE_PARTICIPANTS[2], // Priya
      AVAILABLE_PARTICIPANTS[1], // Rahul
      AVAILABLE_PARTICIPANTS[0]  // Mayur
    ],
    agenda: [
      { id: 'ag-401', title: 'Inventory management table & bulk actions UI', completed: false },
      { id: 'ag-402', title: 'Barcode scanner mobile camera integration specs', completed: false }
    ],
    settings: {
      recording: false,
      transcript: true,
      aiNotes: true,
      waitingRoom: false,
      participantChat: true,
      screenSharing: true,
      reactions: true,
      allowEarlyJoin: true
    },
    reminders: ['30 minutes before'],
    attachments: [
      { name: 'Bright_Retail_Inventory_Figma.fig', size: '18.1 MB', type: 'Figma File' }
    ],
    meetUrl: 'http://localhost:3000/communication/meetings/mtg-104/room',
    activity: [
      { time: '2 days ago', action: 'Scheduled design critique', user: 'Priya Shah' }
    ]
  },
  {
    id: 'mtg-100',
    title: 'Architecture & Database Schema Review',
    description: 'PostgreSQL partitioning and high-concurrency connection pool tuning for Bright Retail ERP.',
    type: 'Project Review',
    date: '2026-09-22',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    timezone: 'IST (UTC+05:30)',
    duration: '60 minutes',
    status: 'Completed',
    organizer: {
      id: 'p-1',
      name: 'Mayur Patel',
      email: 'm.patel@technova.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Director / Admin'
    },
    project: {
      id: 'prj-3',
      name: 'Bright Retail ERP',
      client: 'Bright Retail',
      progress: 42,
      milestone: 'Architecture Signoff',
      openTasks: 14,
      pendingRequirements: 3
    },
    participants: [
      AVAILABLE_PARTICIPANTS[0],
      AVAILABLE_PARTICIPANTS[1],
      AVAILABLE_PARTICIPANTS[3]
    ],
    agenda: [
      { id: 'ag-1001', title: 'Connection pooler configuration with PgBouncer', completed: true },
      { id: 'ag-1002', title: 'Partitioning inventory ledger table by month', completed: true }
    ],
    settings: {
      recording: true,
      transcript: true,
      aiNotes: true,
      waitingRoom: false,
      participantChat: true,
      screenSharing: true,
      reactions: true,
      allowEarlyJoin: true
    },
    reminders: ['15 minutes before'],
    attachments: [
      { name: 'Database_Partitioning_Spec_v1.pdf', size: '2.4 MB', type: 'PDF Document' }
    ],
    whiteboard: {
      id: 'wb-100',
      title: 'Database Schema & PgBouncer Topology',
      previewThumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=80',
      participantCount: 3
    },
    meetUrl: 'http://localhost:3000/communication/meetings/mtg-100/room',
    notes: {
      summary: 'Agreed to adopt PgBouncer in transaction pooling mode. Table partitioning by fiscal month approved to support 100K daily retail transactions.',
      decisions: [
        'PgBouncer deployed to staging cluster.',
        'PostgreSQL 16 selected for native table partitioning enhancements.'
      ],
      actionItems: [
        { id: 'act-101', task: 'Deploy PgBouncer config to staging environment', assignedTo: 'Amit Joshi', dueDate: '24 Sep 2026', priority: 'High', status: 'Completed' }
      ],
      requirements: [
        'REQ-114: Database response latency must stay below 25ms under 500 concurrent connections'
      ]
    },
    transcript: [
      { id: 'tr-1001', time: '02:05 PM', speaker: 'Mayur Patel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', text: 'Amit, can you walk us through the benchmark results of the connection pooling setup?' },
      { id: 'tr-1002', time: '02:08 PM', speaker: 'Amit Joshi', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', text: 'Yes, with PgBouncer transaction pooling, memory usage dropped by 64% and connection latency remained flat at 18ms.' }
    ],
    activity: [
      { time: '3 days ago', action: 'Meeting completed & AI intelligence notes generated', user: 'System' }
    ]
  }
];

// ----------------------------------------------------
// INITIAL CALENDAR EVENTS
// ----------------------------------------------------

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'ABC Website Discussion',
    type: 'Meeting',
    category: 'Meetings',
    date: '2026-09-25',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    project: 'ABC Corporate Website',
    client: 'ABC Pvt Ltd',
    status: 'Live',
    color: 'sky',
    meetingId: 'mtg-101',
    participants: [
      { name: 'Mayur Patel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Admin', status: 'Accepted' },
      { name: 'Rahul Sharma', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Dev', status: 'Accepted' },
      { name: 'Marcus Sterling', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', role: 'Client', status: 'Accepted' }
    ]
  },
  {
    id: 'evt-2',
    title: 'Internal Sprint Review',
    type: 'Meeting',
    category: 'Meetings',
    date: '2026-09-25',
    startTime: '12:30 PM',
    endTime: '01:15 PM',
    project: 'TechNova Engineering Core',
    status: 'Scheduled',
    color: 'indigo',
    meetingId: 'mtg-102'
  },
  {
    id: 'evt-3',
    title: 'XYZ Mobile App Review',
    type: 'Meeting',
    category: 'Meetings',
    date: '2026-09-25',
    startTime: '04:00 PM',
    endTime: '05:00 PM',
    project: 'XYZ Mobile App',
    client: 'XYZ Technologies',
    status: 'Scheduled',
    color: 'purple',
    meetingId: 'mtg-103'
  },
  {
    id: 'evt-4',
    title: 'Homepage Redesign Delivery Due',
    type: 'Task Deadline',
    category: 'Deadlines',
    date: '2026-09-25',
    startTime: '05:00 PM',
    endTime: '05:30 PM',
    project: 'ABC Corporate Website',
    status: 'Scheduled',
    color: 'rose'
  },
  {
    id: 'evt-5',
    title: 'Payment Gateway Integration Spec Due',
    type: 'Task Deadline',
    category: 'Deadlines',
    date: '2026-09-26',
    startTime: '06:00 PM',
    endTime: '06:30 PM',
    project: 'XYZ Mobile App',
    status: 'Scheduled',
    color: 'amber'
  },
  {
    id: 'evt-6',
    title: 'Client Requirements Approval Signoff',
    type: 'Client Approval',
    category: 'Milestones',
    date: '2026-09-28',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    project: 'Bright Retail ERP',
    client: 'Bright Retail',
    status: 'Scheduled',
    color: 'teal'
  },
  {
    id: 'evt-7',
    title: 'Weekly Design Review',
    type: 'Meeting',
    category: 'Meetings',
    date: '2026-09-28',
    startTime: '03:00 PM',
    endTime: '04:00 PM',
    project: 'Bright Retail ERP',
    status: 'Scheduled',
    color: 'indigo',
    meetingId: 'mtg-104'
  },
  {
    id: 'evt-8',
    title: 'Priya Shah Sick Leave',
    type: 'Leave',
    category: 'Leave',
    date: '2026-09-29',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    status: 'Scheduled',
    color: 'rose'
  },
  {
    id: 'evt-9',
    title: 'Alpha Milestone 1 Delivery & Staging',
    type: 'Project Milestone',
    category: 'Milestones',
    date: '2026-09-30',
    startTime: '05:00 PM',
    endTime: '06:00 PM',
    project: 'ABC Corporate Website',
    status: 'Scheduled',
    color: 'emerald'
  },
  {
    id: 'evt-10',
    title: 'Gandhi Jayanti Public Holiday',
    type: 'Holiday',
    category: 'Holidays',
    date: '2026-10-02',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    status: 'Scheduled',
    color: 'teal'
  },
  {
    id: 'evt-11',
    title: 'Milestone 2 Payment Due (₹1,20,000)',
    type: 'Payment Due',
    category: 'Payments',
    date: '2026-10-05',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    project: 'Bright Retail ERP',
    status: 'Scheduled',
    color: 'purple'
  }
];
