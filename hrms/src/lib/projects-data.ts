import { ProjectItem, TaskItem, UserProfile } from '@/types/officeos';
import { MOCK_USERS } from './officeos-data';

export interface MilestoneDeliverable {
  id: string;
  title: string;
  completed: boolean;
  assigneeName: string;
}

export interface MilestoneItem {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'AT_RISK' | 'UPCOMING';
  progressPercent: number;
  deliverables: MilestoneDeliverable[];
  clientSignoff: {
    status: 'APPROVED' | 'PENDING' | 'CHANGES_REQUESTED';
    signedBy?: string;
    signedAt?: string;
    feedback?: string;
  };
}

export interface RequirementItem {
  id: string;
  code: string;
  projectId: string;
  projectName: string;
  title: string;
  category: 'FUNCTIONAL' | 'SECURITY' | 'INTEGRATION' | 'UI_UX' | 'COMPLIANCE';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  acceptanceCriteria: string[];
  signoffStatus: 'APPROVED' | 'UNDER_REVIEW' | 'CHANGE_REQUESTED' | 'DRAFT';
  signoffBy?: string;
  signoffDate?: string;
  version: string;
}

export interface ChangeRequestItem {
  id: string;
  crNumber: string;
  projectId: string;
  projectName: string;
  title: string;
  requestedBy: string;
  requestDate: string;
  scopeImpact: string;
  costDelta: number; // in USD
  timelineDeltaDays: number;
  status: 'PENDING_APPROVAL' | 'APPROVED_BY_CLIENT' | 'REJECTED' | 'IMPLEMENTED';
  rationale: string;
  approvedBy?: string;
  approvedDate?: string;
}

export interface TimesheetEntry {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  projectId: string;
  projectName: string;
  taskId: string;
  taskTitle: string;
  date: string;
  hours: number;
  billable: boolean;
  hourlyRate: number;
  notes: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface GanttItem {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  type: 'PHASE' | 'SPRINT' | 'TASK' | 'MILESTONE';
  startDate: string;
  endDate: string;
  progressPercent: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED' | 'AT_RISK';
  dependencies?: string[];
  assignee?: string;
  color?: string;
}

// Initial Mock Projects Data with Extended Properties
export const EXTENDED_PROJECTS: (ProjectItem & {
  category: string;
  health: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  techStack: string[];
  clientContact: string;
  clientEmail: string;
  sprintsCount: number;
  activeSprint: string;
})[] = [
  {
    id: 'proj-1',
    name: 'NovaPay Enterprise Mobile Neobank v2.0',
    code: 'NP-202',
    clientName: 'Nova Capital Partners',
    clientId: 'cli-1',
    manager: MOCK_USERS.manager,
    team: [MOCK_USERS.employee, MOCK_USERS.manager, MOCK_USERS.super_admin],
    status: 'ACTIVE',
    progressPercent: 78,
    budget: 185000,
    spent: 142000,
    startDate: '2026-05-10',
    targetEndDate: '2026-11-30',
    tasksSummary: { total: 42, done: 31, inReview: 5 },
    repoUrl: 'github.com/apextech/novapay-core',
    category: 'Fintech & Mobile Banking',
    health: 'HEALTHY',
    priority: 'URGENT',
    techStack: ['Next.js 15', 'React Native', 'Node.js', 'PostgreSQL', 'Stripe API'],
    clientContact: 'Marcus Sterling (VP Digital Strategy)',
    clientEmail: 'marcus@novacapital.com',
    sprintsCount: 16,
    activeSprint: 'Sprint 14: Biometrics & Payments',
  },
  {
    id: 'proj-2',
    name: 'AetherHealth Clinical Telemedicine Platform',
    code: 'AH-104',
    clientName: 'Aether Healthcare Systems',
    clientId: 'cli-2',
    manager: MOCK_USERS.manager,
    team: [MOCK_USERS.employee, MOCK_USERS.manager],
    status: 'ACTIVE',
    progressPercent: 62,
    budget: 240000,
    spent: 156000,
    startDate: '2026-06-01',
    targetEndDate: '2027-01-15',
    tasksSummary: { total: 68, done: 38, inReview: 8 },
    repoUrl: 'github.com/apextech/aether-telehealth',
    category: 'Healthcare & HIPAA Telemedicine',
    health: 'WARNING',
    priority: 'HIGH',
    techStack: ['React', 'WebRTC', 'FastAPI', 'HIPAA AWS Cloud', 'FHIR Protocol'],
    clientContact: 'Dr. Evelyn Vance (Chief Medical Officer)',
    clientEmail: 'e.vance@aetherhealth.org',
    sprintsCount: 20,
    activeSprint: 'Sprint 9: WebRTC Multi-party Video',
  },
  {
    id: 'proj-3',
    name: 'Synapse AI Autonomous Freight Logistics Portal',
    code: 'SY-301',
    clientName: 'Vanguard Global Freight',
    clientId: 'cli-3',
    manager: MOCK_USERS.super_admin,
    team: [MOCK_USERS.employee, MOCK_USERS.manager],
    status: 'IN_REVIEW',
    progressPercent: 94,
    budget: 310000,
    spent: 298000,
    startDate: '2026-02-15',
    targetEndDate: '2026-10-15',
    tasksSummary: { total: 85, done: 80, inReview: 5 },
    repoUrl: 'gitlab.com/apextech/synapse-logistics',
    category: 'AI Logistics & Fleet Telemetry',
    health: 'HEALTHY',
    priority: 'HIGH',
    techStack: ['Vue 3', 'Python PyTorch', 'Kafka', 'ClickHouse', 'Google Maps API'],
    clientContact: 'Jonathan Hayes (VP Supply Chain)',
    clientEmail: 'j.hayes@vanguardfreight.com',
    sprintsCount: 24,
    activeSprint: 'Sprint 24: Final UAT & Load Testing',
  },
  {
    id: 'proj-4',
    name: 'CloudNative Microservices Multi-Region Migration',
    code: 'CN-401',
    clientName: 'Apex Internal Infrastructure Core',
    clientId: 'cli-internal',
    manager: MOCK_USERS.manager,
    team: [MOCK_USERS.employee],
    status: 'PLANNING',
    progressPercent: 25,
    budget: 95000,
    spent: 22000,
    startDate: '2026-09-01',
    targetEndDate: '2027-03-30',
    tasksSummary: { total: 24, done: 6, inReview: 2 },
    category: 'DevOps & Cloud Architecture',
    health: 'HEALTHY',
    priority: 'MEDIUM',
    techStack: ['Kubernetes', 'Terraform', 'AWS EKS', 'ArgoCD', 'Prometheus'],
    clientContact: 'Sarah Montgomery (Internal VP Ops)',
    clientEmail: 'sarah.m@apextech.internal',
    sprintsCount: 12,
    activeSprint: 'Sprint 2: VPC Peering & EKS Clusters',
  },
  {
    id: 'proj-5',
    name: 'Zenith Security Zero-Trust IAM & SSO Gateway',
    code: 'ZS-505',
    clientName: 'Zenith Financial Group',
    clientId: 'cli-4',
    manager: MOCK_USERS.manager,
    team: [MOCK_USERS.employee, MOCK_USERS.super_admin],
    status: 'ACTIVE',
    progressPercent: 48,
    budget: 160000,
    spent: 78000,
    startDate: '2026-07-15',
    targetEndDate: '2026-12-20',
    tasksSummary: { total: 50, done: 24, inReview: 4 },
    category: 'Cybersecurity & IAM',
    health: 'HEALTHY',
    priority: 'URGENT',
    techStack: ['OIDC', 'SAML 2.0', 'Go Lang', 'Redis Enterprise', 'Keycloak'],
    clientContact: 'Derrick Vance (CISO)',
    clientEmail: 'derrick@zenithfg.com',
    sprintsCount: 10,
    activeSprint: 'Sprint 5: Okta & Azure AD Federation',
  }
];

// Rich Mock Task List covering all 6 Kanban columns
export const EXTENDED_TASKS: (TaskItem & {
  subtasks: { id: string; title: string; completed: boolean }[];
  sprint: string;
})[] = [
  {
    id: 'tsk-101',
    title: 'Implement Multi-Factor Biometric Authentication (WebAuthn)',
    code: 'NP-202-84',
    description: 'Integrate FIDO2 credentials and biometric passkeys for client dashboard login with touch/face ID hardware fallbacks.',
    projectId: 'proj-1',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    assignee: MOCK_USERS.employee,
    reporter: MOCK_USERS.manager,
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    dueDate: '2026-09-30',
    estimatedHours: 16,
    loggedHours: 11.5,
    labels: ['Security', 'Frontend', 'WebAuthn'],
    commentsCount: 6,
    attachmentsCount: 2,
    sprint: 'Sprint 14',
    subtasks: [
      { id: 'st-1', title: 'Register WebAuthn navigator credential API', completed: true },
      { id: 'st-2', title: 'Create backend challenge signature verification', completed: true },
      { id: 'st-3', title: 'Write fallback SMS OTP flow for unsupported devices', completed: false },
      { id: 'st-4', title: 'Automated Cypress E2E auth test cases', completed: false }
    ]
  },
  {
    id: 'tsk-102',
    title: 'Refactor Meeting AI Notes Transcription Service Pipeline',
    code: 'AH-104-32',
    description: 'Ensure automated speaker separation, diarization, and action item JSON extraction trigger on WebRTC call completion.',
    projectId: 'proj-2',
    projectName: 'AetherHealth Clinical Telemedicine Platform',
    assignee: MOCK_USERS.employee,
    reporter: MOCK_USERS.manager,
    priority: 'HIGH',
    status: 'IN_REVIEW',
    dueDate: '2026-09-28',
    estimatedHours: 24,
    loggedHours: 22,
    labels: ['AI Pipeline', 'WebRTC', 'HIPAA'],
    commentsCount: 12,
    attachmentsCount: 3,
    sprint: 'Sprint 9',
    subtasks: [
      { id: 'st-5', title: 'Audio chunk streaming to Whisper API', completed: true },
      { id: 'st-6', title: 'Diarization clustering for multi-party audio', completed: true },
      { id: 'st-7', title: 'HIPAA sanitization of patient PHI data', completed: true },
      { id: 'st-8', title: 'Action items webhook callback trigger', completed: true }
    ]
  },
  {
    id: 'tsk-103',
    title: 'Design Dark Mode Design Tokens & Glassmorphism Theme System',
    code: 'NP-202-61',
    description: 'Harmonize Tailwind HSL color tokens, dark mode elevation scales, and accessibility contrast standards (WCAG AAA).',
    projectId: 'proj-1',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    assignee: MOCK_USERS.manager,
    reporter: MOCK_USERS.super_admin,
    priority: 'MEDIUM',
    status: 'DONE',
    dueDate: '2026-09-22',
    estimatedHours: 12,
    loggedHours: 12,
    labels: ['Design System', 'UI/UX', 'Tailwind'],
    commentsCount: 4,
    attachmentsCount: 5,
    sprint: 'Sprint 13',
    subtasks: [
      { id: 'st-9', title: 'Figma token export to CSS variables', completed: true },
      { id: 'st-10', title: 'WCAG AAA contrast ratio audit', completed: true },
      { id: 'st-11', title: 'Card glassmorphism gradient utilities', completed: true }
    ]
  },
  {
    id: 'tsk-104',
    title: 'PostgreSQL Connection Pooling & Read Replica Optimization',
    code: 'SY-301-19',
    description: 'Configure PgBouncer with transaction-level pooling and route telemetry time-series queries to AWS Aurora read replicas.',
    projectId: 'proj-3',
    projectName: 'Synapse AI Autonomous Freight Logistics Portal',
    assignee: MOCK_USERS.employee,
    reporter: MOCK_USERS.manager,
    priority: 'HIGH',
    status: 'CLIENT_APPROVAL',
    dueDate: '2026-10-02',
    estimatedHours: 20,
    loggedHours: 18.5,
    labels: ['Database', 'PostgreSQL', 'Performance'],
    commentsCount: 8,
    attachmentsCount: 1,
    sprint: 'Sprint 24',
    subtasks: [
      { id: 'st-12', title: 'Install and benchmark PgBouncer pool sizes', completed: true },
      { id: 'st-13', title: 'Prisma multi-datasource read-replica routing', completed: true },
      { id: 'st-14', title: 'Stress test 10,000 concurrent GPS vehicle pings', completed: true }
    ]
  },
  {
    id: 'tsk-105',
    title: 'AWS EKS Multi-Zone Cluster & Terraform Infrastructure as Code',
    code: 'CN-401-08',
    description: 'Provision us-east-1 and eu-west-1 EKS clusters with Calico CNI, cert-manager, and Istio Service Mesh.',
    projectId: 'proj-4',
    projectName: 'CloudNative Microservices Multi-Region Migration',
    assignee: MOCK_USERS.employee,
    reporter: MOCK_USERS.manager,
    priority: 'HIGH',
    status: 'TODO',
    dueDate: '2026-10-10',
    estimatedHours: 32,
    loggedHours: 4,
    labels: ['Terraform', 'DevOps', 'Kubernetes'],
    commentsCount: 3,
    attachmentsCount: 0,
    sprint: 'Sprint 2',
    subtasks: [
      { id: 'st-15', title: 'Terraform VPC modular configuration', completed: true },
      { id: 'st-16', title: 'EKS node group autoscaling with Karpenter', completed: false },
      { id: 'st-17', title: 'Cross-region route53 latency-based routing', completed: false }
    ]
  },
  {
    id: 'tsk-106',
    title: 'SAML 2.0 Identity Provider Bridge & Token Exchange',
    code: 'ZS-505-12',
    description: 'Implement enterprise SSO assertion parsing with SHA-256 certificate validation and claims mapping.',
    projectId: 'proj-5',
    projectName: 'Zenith Security Zero-Trust IAM & SSO Gateway',
    assignee: MOCK_USERS.employee,
    reporter: MOCK_USERS.manager,
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    dueDate: '2026-10-05',
    estimatedHours: 28,
    loggedHours: 14,
    labels: ['IAM', 'Security', 'SAML', 'SSO'],
    commentsCount: 5,
    attachmentsCount: 2,
    sprint: 'Sprint 5',
    subtasks: [
      { id: 'st-18', title: 'SAML metadata XML parser', completed: true },
      { id: 'st-19', title: 'Sign-in & Logout assertion validation', completed: true },
      { id: 'st-20', title: 'Role claim mapping to OfficeOS RBAC', completed: false }
    ]
  },
  {
    id: 'tsk-107',
    title: 'Automated Invoice PDF Generation & Digital Signature Stamp',
    code: 'NP-202-92',
    description: 'Serverless PDF rendering worker using Puppeteer and X.509 cryptographic timestamp signature.',
    projectId: 'proj-1',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    assignee: MOCK_USERS.manager,
    reporter: MOCK_USERS.super_admin,
    priority: 'MEDIUM',
    status: 'BACKLOG',
    dueDate: '2026-10-18',
    estimatedHours: 18,
    loggedHours: 0,
    labels: ['Finance', 'PDF', 'Worker'],
    commentsCount: 1,
    attachmentsCount: 0,
    sprint: 'Sprint 15',
    subtasks: [
      { id: 'st-21', title: 'HTML invoice template with QR code', completed: false },
      { id: 'st-22', title: 'AWS Lambda Puppeteer rendering function', completed: false }
    ]
  },
  {
    id: 'tsk-108',
    title: 'Cross-Device WebRTC Video Call Screen-Share & Annotations',
    code: 'AH-104-45',
    description: 'Allow clinical doctors to stream patient diagnostic scans with live cursor annotations during telemedicine sessions.',
    projectId: 'proj-2',
    projectName: 'AetherHealth Clinical Telemedicine Platform',
    assignee: MOCK_USERS.employee,
    reporter: MOCK_USERS.manager,
    priority: 'HIGH',
    status: 'TODO',
    dueDate: '2026-10-08',
    estimatedHours: 20,
    loggedHours: 2,
    labels: ['WebRTC', 'Canvas', 'Telehealth'],
    commentsCount: 7,
    attachmentsCount: 1,
    sprint: 'Sprint 9',
    subtasks: [
      { id: 'st-23', title: 'getDisplayMedia screen capture integration', completed: true },
      { id: 'st-24', title: 'WebSocket annotation broadcast layer', completed: false },
      { id: 'st-25', title: 'HIPAA recording consent modal', completed: false }
    ]
  },
  {
    id: 'tsk-109',
    title: 'GPS Fleet Telemetry Real-time WebSockets Stream Engine',
    code: 'SY-301-44',
    description: 'Process 5,000 events/sec from logistics trucks with geofencing alert triggers and ETA recalculation.',
    projectId: 'proj-3',
    projectName: 'Synapse AI Autonomous Freight Logistics Portal',
    assignee: MOCK_USERS.employee,
    reporter: MOCK_USERS.super_admin,
    priority: 'URGENT',
    status: 'DONE',
    dueDate: '2026-09-15',
    estimatedHours: 35,
    loggedHours: 34,
    labels: ['WebSockets', 'Kafka', 'Maps'],
    commentsCount: 15,
    attachmentsCount: 4,
    sprint: 'Sprint 23',
    subtasks: [
      { id: 'st-26', title: 'Kafka consumer cluster setup', completed: true },
      { id: 'st-27', title: 'Geolib polygon containment calculations', completed: true },
      { id: 'st-28', title: 'Mapbox GL JS animated truck markers', completed: true }
    ]
  }
];

// Milestones Data with Deliverables and Client Sign-off
export const MOCK_MILESTONES: MilestoneItem[] = [
  {
    id: 'ms-1',
    projectId: 'proj-1',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    title: 'Milestone 3: Core Payment Rails & WebAuthn Security',
    description: 'Full end-to-end integration of Stripe Treasury, FIDO2 biometric authentication, and ACH wire transfers.',
    dueDate: '2026-10-15',
    status: 'IN_PROGRESS',
    progressPercent: 82,
    deliverables: [
      { id: 'del-1', title: 'FIDO2 WebAuthn Passkey Login', completed: true, assigneeName: 'Arjun Nambiar' },
      { id: 'del-2', title: 'Stripe ACH & Real-time Wire API', completed: true, assigneeName: 'Arjun Nambiar' },
      { id: 'del-3', title: 'Fraud Detection Risk Scoring Engine', completed: true, assigneeName: 'Sarah Montgomery' },
      { id: 'del-4', title: 'Client UAT Penetration Testing Sign-off', completed: false, assigneeName: 'Marcus Sterling' }
    ],
    clientSignoff: {
      status: 'PENDING',
      feedback: 'Scheduled for review call on Friday after staging deployment.'
    }
  },
  {
    id: 'ms-2',
    projectId: 'proj-1',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    title: 'Milestone 2: Design System & Mobile App Shell v1.0',
    description: 'Component library, dark mode tokens, onboarding KYC flow, and dashboard layout.',
    dueDate: '2026-08-15',
    status: 'COMPLETED',
    progressPercent: 100,
    deliverables: [
      { id: 'del-5', title: 'Figma to React Component Library', completed: true, assigneeName: 'Sarah Montgomery' },
      { id: 'del-6', title: 'KYC Document Upload Flow', completed: true, assigneeName: 'Arjun Nambiar' },
      { id: 'del-7', title: 'Responsive Shell Navigation', completed: true, assigneeName: 'Sarah Montgomery' }
    ],
    clientSignoff: {
      status: 'APPROVED',
      signedBy: 'Marcus Sterling (VP Digital Strategy)',
      signedAt: '2026-08-16',
      feedback: 'Approved without reservations. Design is clean and lightning fast.'
    }
  },
  {
    id: 'ms-3',
    projectId: 'proj-2',
    projectName: 'AetherHealth Clinical Telemedicine Platform',
    title: 'Milestone 2: HIPAA Compliant WebRTC Video Engine',
    description: 'Multi-party encrypted video consultation, clinical notes capture, and prescription dispatch.',
    dueDate: '2026-10-30',
    status: 'IN_PROGRESS',
    progressPercent: 65,
    deliverables: [
      { id: 'del-8', title: 'P2P Encrypted Video Consultation', completed: true, assigneeName: 'Arjun Nambiar' },
      { id: 'del-9', title: 'Automated AI Clinical Summary Notes', completed: true, assigneeName: 'Arjun Nambiar' },
      { id: 'del-10', title: 'EHR / Epic FHIR System Connector', completed: false, assigneeName: 'Sarah Montgomery' },
      { id: 'del-11', title: 'HIPAA BAA Legal Verification', completed: false, assigneeName: 'Dr. Evelyn Vance' }
    ],
    clientSignoff: {
      status: 'PENDING',
      feedback: 'Pending validation of FHIR interface with hospital test patient database.'
    }
  },
  {
    id: 'ms-4',
    projectId: 'proj-3',
    projectName: 'Synapse AI Autonomous Freight Logistics Portal',
    title: 'Milestone 4: Fleet Telemetry & Production Launch',
    description: 'Full rollout across 400 commercial freight vehicles with real-time ETA route optimization.',
    dueDate: '2026-10-15',
    status: 'IN_PROGRESS',
    progressPercent: 94,
    deliverables: [
      { id: 'del-12', title: 'Kafka GPS Stream Ingestion Engine', completed: true, assigneeName: 'Arjun Nambiar' },
      { id: 'del-13', title: 'Driver Mobile Companion App', completed: true, assigneeName: 'Sarah Montgomery' },
      { id: 'del-14', title: 'Emergency Geofence Deviation Alerts', completed: true, assigneeName: 'Arjun Nambiar' },
      { id: 'del-15', title: 'Production Load Test (100k events/min)', completed: true, assigneeName: 'Alexander Vance' }
    ],
    clientSignoff: {
      status: 'APPROVED',
      signedBy: 'Jonathan Hayes (VP Supply Chain)',
      signedAt: '2026-09-24',
      feedback: 'Final sign-off granted. Ready for live fleet activation.'
    }
  }
];

// Requirements & SOW Matrix
export const MOCK_REQUIREMENTS: RequirementItem[] = [
  {
    id: 'req-1',
    code: 'REQ-NP-01',
    projectId: 'proj-1',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    title: 'FIDO2 / WebAuthn Biometric Authentication',
    category: 'SECURITY',
    priority: 'CRITICAL',
    description: 'System must allow biometric passkey enrollment and passwordless login across iOS, Android, and Desktop Chrome.',
    acceptanceCriteria: [
      'Passkey registration supported on WebAuthn Level 2 browsers',
      'User can register up to 5 hardware/biometric security keys',
      'Fallback SMS or Email OTP trigger on unrecognized device',
      'Zero plaintext credentials stored on server database'
    ],
    signoffStatus: 'APPROVED',
    signoffBy: 'Marcus Sterling (Client)',
    signoffDate: '2026-06-12',
    version: 'v1.4'
  },
  {
    id: 'req-2',
    code: 'REQ-NP-02',
    projectId: 'proj-1',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    title: 'Stripe ACH & Wire Transfer Settlement Rails',
    category: 'INTEGRATION',
    priority: 'CRITICAL',
    description: 'Integration with automated clearing house (ACH) network with sub-second balance checks and instant debit card issuance.',
    acceptanceCriteria: [
      'ACH credit and debit initiated with webhook status listeners',
      'Idempotency keys enforced on all money transfer API calls',
      'Auto-hold on suspicious transactions exceeding $10,000 threshold',
      'Reconciliation reports generated daily at midnight UTC'
    ],
    signoffStatus: 'APPROVED',
    signoffBy: 'Marcus Sterling (Client)',
    signoffDate: '2026-06-20',
    version: 'v1.2'
  },
  {
    id: 'req-3',
    code: 'REQ-AH-01',
    projectId: 'proj-2',
    projectName: 'AetherHealth Clinical Telemedicine Platform',
    title: 'HIPAA Video Streaming & Ephemeral Buffer Protocol',
    category: 'COMPLIANCE',
    priority: 'CRITICAL',
    description: 'All audio and video streams must use DTLS-SRTP 256-bit encryption with zero unencrypted intermediate hops.',
    acceptanceCriteria: [
      'End-to-end media encryption enabled on all sessions',
      'Server-side recording buffers purged immediately upon S3 upload',
      'Audit log recorded for every doctor-patient join event',
      'Signed Business Associate Agreement (BAA) compliance checklist'
    ],
    signoffStatus: 'APPROVED',
    signoffBy: 'Dr. Evelyn Vance (CMO)',
    signoffDate: '2026-07-04',
    version: 'v2.0'
  },
  {
    id: 'req-4',
    code: 'REQ-NP-03',
    projectId: 'proj-1',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    title: 'Multi-Currency Crypto Wallet Bridge & On-Ramp',
    category: 'FUNCTIONAL',
    priority: 'HIGH',
    description: 'Enable instant conversion between USD treasury accounts and USDC stablecoin with automated ledger debiting.',
    acceptanceCriteria: [
      'Real-time exchange rate locking with 30-second quote timer',
      'Zero slippage guarantee on USDC conversions under $50,000',
      'Full compliance with FinCEN Travel Rule data exchange'
    ],
    signoffStatus: 'CHANGE_REQUESTED',
    signoffBy: 'Marcus Sterling (Client)',
    signoffDate: '2026-09-18',
    version: 'v1.0-draft'
  }
];

// Change Request (CR) Management
export const MOCK_CHANGE_REQUESTS: ChangeRequestItem[] = [
  {
    id: 'cr-101',
    crNumber: 'CR-NP-2026-04',
    projectId: 'proj-1',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    title: 'Add Apple Pay & Google Pay Express Checkout Tokenization',
    requestedBy: 'Marcus Sterling (Client VP)',
    requestDate: '2026-09-15',
    scopeImpact: 'Frontend checkout component revamp, Apple Developer Merchant ID certificate setup, and Stripe Payment Request Button API integration.',
    costDelta: 14500,
    timelineDeltaDays: 12,
    status: 'APPROVED_BY_CLIENT',
    rationale: 'Client user research indicated a 35% conversion boost by enabling 1-tap mobile wallet checkouts.',
    approvedBy: 'Alexander Vance (CEO) & Marcus Sterling',
    approvedDate: '2026-09-19'
  },
  {
    id: 'cr-102',
    crNumber: 'CR-AH-2026-02',
    projectId: 'proj-2',
    projectName: 'AetherHealth Clinical Telemedicine Platform',
    title: 'Live Medical Spanish & Portuguese Audio Translation',
    requestedBy: 'Dr. Evelyn Vance (Client CMO)',
    requestDate: '2026-09-21',
    scopeImpact: 'Integrate real-time sub-second audio transcription model and subtitle translation overlay for non-English speaking patients.',
    costDelta: 22000,
    timelineDeltaDays: 18,
    status: 'PENDING_APPROVAL',
    rationale: 'Hospital network requires multilingual accessibility to serve expanding demographic in metropolitan clinics.'
  },
  {
    id: 'cr-103',
    crNumber: 'CR-SY-2026-07',
    projectId: 'proj-3',
    projectName: 'Synapse AI Autonomous Freight Logistics Portal',
    title: 'Cold-Chain Temperature Sensor BLE Telemetry Alerts',
    requestedBy: 'Jonathan Hayes (Client VP)',
    requestDate: '2026-09-10',
    scopeImpact: 'Bluetooth Low Energy IoT sensor receiver integration in driver mobile app to broadcast refrigerated cargo temperatures every 60s.',
    costDelta: 18000,
    timelineDeltaDays: 10,
    status: 'IMPLEMENTED',
    rationale: 'Pharmaceutical client contracts require continuous -20C temperature audit trail during cross-country transport.',
    approvedBy: 'Jonathan Hayes & Alexander Vance',
    approvedDate: '2026-09-12'
  }
];

// Gantt Timeline Data
export const MOCK_GANTT_ITEMS: GanttItem[] = [
  // NovaPay
  {
    id: 'g-1',
    projectId: 'proj-1',
    projectName: 'NovaPay v2.0',
    name: 'Phase 1: Architecture & UX Design System',
    type: 'PHASE',
    startDate: '2026-05-10',
    endDate: '2026-06-30',
    progressPercent: 100,
    status: 'COMPLETED',
    color: '#6366f1'
  },
  {
    id: 'g-2',
    projectId: 'proj-1',
    projectName: 'NovaPay v2.0',
    name: 'Sprint 12: KYC & Compliance Onboarding',
    type: 'SPRINT',
    startDate: '2026-07-01',
    endDate: '2026-08-15',
    progressPercent: 100,
    status: 'COMPLETED',
    dependencies: ['g-1'],
    color: '#8b5cf6'
  },
  {
    id: 'g-3',
    projectId: 'proj-1',
    projectName: 'NovaPay v2.0',
    name: 'Sprint 13: Core Payment Rails & Stripe Wire',
    type: 'SPRINT',
    startDate: '2026-08-16',
    endDate: '2026-09-15',
    progressPercent: 100,
    status: 'COMPLETED',
    dependencies: ['g-2'],
    color: '#ec4899'
  },
  {
    id: 'g-4',
    projectId: 'proj-1',
    projectName: 'NovaPay v2.0',
    name: 'Sprint 14: WebAuthn Biometrics & Apple Pay',
    type: 'SPRINT',
    startDate: '2026-09-16',
    endDate: '2026-10-15',
    progressPercent: 78,
    status: 'IN_PROGRESS',
    dependencies: ['g-3'],
    assignee: 'Arjun Nambiar',
    color: '#3b82f6'
  },
  {
    id: 'g-5',
    projectId: 'proj-1',
    projectName: 'NovaPay v2.0',
    name: 'Milestone 3: Security & UAT Sign-off',
    type: 'MILESTONE',
    startDate: '2026-10-15',
    endDate: '2026-10-15',
    progressPercent: 82,
    status: 'IN_PROGRESS',
    color: '#f59e0b'
  },
  {
    id: 'g-6',
    projectId: 'proj-1',
    projectName: 'NovaPay v2.0',
    name: 'Sprint 15: Production Hardening & App Store Launch',
    type: 'SPRINT',
    startDate: '2026-10-16',
    endDate: '2026-11-30',
    progressPercent: 0,
    status: 'NOT_STARTED',
    dependencies: ['g-4', 'g-5'],
    color: '#10b981'
  },

  // AetherHealth
  {
    id: 'g-7',
    projectId: 'proj-2',
    projectName: 'AetherHealth Telemedicine',
    name: 'Phase 1: HIPAA Compliance & Architecture',
    type: 'PHASE',
    startDate: '2026-06-01',
    endDate: '2026-07-15',
    progressPercent: 100,
    status: 'COMPLETED',
    color: '#06b6d4'
  },
  {
    id: 'g-8',
    projectId: 'proj-2',
    projectName: 'AetherHealth Telemedicine',
    name: 'Sprint 8: EHR / FHIR Patient Database Connector',
    type: 'SPRINT',
    startDate: '2026-07-16',
    endDate: '2026-08-31',
    progressPercent: 100,
    status: 'COMPLETED',
    dependencies: ['g-7'],
    color: '#0ea5e9'
  },
  {
    id: 'g-9',
    projectId: 'proj-2',
    projectName: 'AetherHealth Telemedicine',
    name: 'Sprint 9: WebRTC Multi-party Video & AI Notes',
    type: 'SPRINT',
    startDate: '2026-09-01',
    endDate: '2026-10-15',
    progressPercent: 62,
    status: 'IN_PROGRESS',
    dependencies: ['g-8'],
    assignee: 'Sarah Montgomery',
    color: '#f97316'
  },
  {
    id: 'g-10',
    projectId: 'proj-2',
    projectName: 'AetherHealth Telemedicine',
    name: 'Sprint 10: Multilingual AI Audio Translation',
    type: 'SPRINT',
    startDate: '2026-10-16',
    endDate: '2026-11-30',
    progressPercent: 0,
    status: 'NOT_STARTED',
    dependencies: ['g-9'],
    color: '#84cc16'
  }
];

// Timesheet Logs
export const MOCK_TIMESHEET_ENTRIES: TimesheetEntry[] = [
  {
    id: 'ts-1',
    userId: 'usr-3',
    userName: 'Arjun Nambiar',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userRole: 'Lead Full-Stack Engineer',
    projectId: 'proj-1',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    taskId: 'tsk-101',
    taskTitle: 'Implement Multi-Factor Biometric Authentication (WebAuthn)',
    date: '2026-09-28',
    hours: 6.5,
    billable: true,
    hourlyRate: 110,
    notes: 'Configured navigator.credentials FIDO2 challenge-response verification with backend crypto tokens.',
    status: 'APPROVED'
  },
  {
    id: 'ts-2',
    userId: 'usr-3',
    userName: 'Arjun Nambiar',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userRole: 'Lead Full-Stack Engineer',
    projectId: 'proj-1',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    taskId: 'tsk-101',
    taskTitle: 'Implement Multi-Factor Biometric Authentication (WebAuthn)',
    date: '2026-09-29',
    hours: 5.0,
    billable: true,
    hourlyRate: 110,
    notes: 'Cypress automated test suite for Safari and Chrome biometric fallbacks.',
    status: 'PENDING'
  },
  {
    id: 'ts-3',
    userId: 'usr-2',
    userName: 'Sarah Montgomery',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    userRole: 'VP of Product Engineering',
    projectId: 'proj-1',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    taskId: 'tsk-103',
    taskTitle: 'Design Dark Mode Design Tokens & Glassmorphism Theme System',
    date: '2026-09-28',
    hours: 4.0,
    billable: true,
    hourlyRate: 140,
    notes: 'WCAG AAA contrast verification and Figma design system token sync.',
    status: 'APPROVED'
  },
  {
    id: 'ts-4',
    userId: 'usr-3',
    userName: 'Arjun Nambiar',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userRole: 'Lead Full-Stack Engineer',
    projectId: 'proj-2',
    projectName: 'AetherHealth Clinical Telemedicine Platform',
    taskId: 'tsk-102',
    taskTitle: 'Refactor Meeting AI Notes Transcription Service Pipeline',
    date: '2026-09-27',
    hours: 7.5,
    billable: true,
    hourlyRate: 110,
    notes: 'Audio stream chunking and Whisper diarization clustering optimization.',
    status: 'APPROVED'
  },
  {
    id: 'ts-5',
    userId: 'usr-2',
    userName: 'Sarah Montgomery',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    userRole: 'VP of Product Engineering',
    projectId: 'proj-4',
    projectName: 'CloudNative Microservices Multi-Region Migration',
    taskId: 'tsk-105',
    taskTitle: 'AWS EKS Multi-Zone Cluster & Terraform Infrastructure as Code',
    date: '2026-09-26',
    hours: 4.5,
    billable: false,
    hourlyRate: 140,
    notes: 'Internal infrastructure Terraform state locks and VPC routing table configuration.',
    status: 'APPROVED'
  }
];
