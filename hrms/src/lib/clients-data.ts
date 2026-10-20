import { ClientItem } from '@/types/officeos';

export interface ExtendedClientItem extends ClientItem {
  industry: string;
  slaTier: 'ENTERPRISE_24_7' | 'PREMIUM_SLA' | 'STANDARD';
  contractValue: number;
  contractStartDate: string;
  contractRenewalDate: string;
  msaStatus: 'ACTIVE_SIGNED' | 'RENEWAL_PENDING' | 'LEGAL_REVIEW';
  ndaStatus: 'SIGNED' | 'EXPIRED';
  assignedAccountManager: {
    name: string;
    avatar: string;
    email: string;
    role: string;
  };
  keyStakeholders: {
    name: string;
    role: string;
    email: string;
    phone: string;
    isPrimary: boolean;
  }[];
  activeProjectNames: string[];
  healthScore: 'EXCELLENT' | 'GOOD' | 'AT_RISK';
}

export interface ClientApprovalItem {
  id: string;
  clientId: string;
  clientName: string;
  clientLogo: string;
  title: string;
  category: 'DELIVERABLE' | 'SOW_AMENDMENT' | 'DESIGN_SIGN_OFF' | 'INVOICE_PAYMENT' | 'RELEASE_DEPLOYMENT';
  requestedBy: string;
  requestDate: string;
  dueDate: string;
  status: 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  description: string;
  attachmentsCount: number;
  signedBy?: string;
  signedAt?: string;
  comments?: string;
  valueImpact?: number;
}

export interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  clientId: string;
  clientName: string;
  clientLogo: string;
  projectName: string;
  title: string;
  description: string;
  severity: 'CRITICAL_P0' | 'HIGH_P1' | 'MEDIUM_P2' | 'LOW_P3';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'PENDING_CLIENT';
  createdAt: string;
  slaDeadline: string;
  assignedEngineer: {
    name: string;
    avatar: string;
  };
  messagesCount: number;
}

export const EXTENDED_CLIENTS: ExtendedClientItem[] = [
  {
    id: 'cli-1',
    companyName: 'Nova Capital Partners',
    contactPerson: 'Marcus Sterling (VP Digital Strategy)',
    email: 'marcus@novacapital.com',
    phone: '+1 (415) 890-2341',
    industry: 'Fintech & Investment Banking',
    activeProjects: 2,
    activeProjectNames: ['NovaPay Enterprise Mobile Neobank v2.0', 'Nova Yield Treasury Bridge'],
    totalSpent: 185000,
    contractValue: 350000,
    pendingInvoices: 45000,
    status: 'ACTIVE',
    slaTier: 'ENTERPRISE_24_7',
    msaStatus: 'ACTIVE_SIGNED',
    ndaStatus: 'SIGNED',
    contractStartDate: '2026-01-15',
    contractRenewalDate: '2027-01-14',
    healthScore: 'EXCELLENT',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    assignedAccountManager: {
      name: 'Alexander Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      email: 'alexander@apextech.com',
      role: 'Chief Executive Officer',
    },
    keyStakeholders: [
      { name: 'Marcus Sterling', role: 'VP Digital Strategy', email: 'marcus@novacapital.com', phone: '+1 (415) 890-2341', isPrimary: true },
      { name: 'Elena Rostova', role: 'Lead Compliance Officer', email: 'elena.r@novacapital.com', phone: '+1 (415) 890-2349', isPrimary: false },
    ]
  },
  {
    id: 'cli-2',
    companyName: 'Aether Healthcare Systems',
    contactPerson: 'Dr. Evelyn Vance (Chief Medical Officer)',
    email: 'e.vance@aetherhealth.org',
    phone: '+1 (617) 554-9022',
    industry: 'Telemedicine & Clinical Health',
    activeProjects: 1,
    activeProjectNames: ['AetherHealth Clinical Telemedicine Platform'],
    totalSpent: 156000,
    contractValue: 280000,
    pendingInvoices: 0,
    status: 'ACTIVE',
    slaTier: 'ENTERPRISE_24_7',
    msaStatus: 'ACTIVE_SIGNED',
    ndaStatus: 'SIGNED',
    contractStartDate: '2026-03-01',
    contractRenewalDate: '2027-02-28',
    healthScore: 'GOOD',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    assignedAccountManager: {
      name: 'Sarah Montgomery',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      email: 'sarah.m@apextech.com',
      role: 'VP of Product Engineering',
    },
    keyStakeholders: [
      { name: 'Dr. Evelyn Vance', role: 'Chief Medical Officer', email: 'e.vance@aetherhealth.org', phone: '+1 (617) 554-9022', isPrimary: true },
      { name: 'David Cho', role: 'Director of Health IT', email: 'd.cho@aetherhealth.org', phone: '+1 (617) 554-9025', isPrimary: false },
    ]
  },
  {
    id: 'cli-3',
    companyName: 'Vanguard Global Freight Logistics',
    contactPerson: 'Jonathan Hayes (VP Supply Chain)',
    email: 'j.hayes@vanguardfreight.com',
    phone: '+1 (312) 440-7781',
    industry: 'Supply Chain & AI Fleet Telemetry',
    activeProjects: 1,
    activeProjectNames: ['Synapse AI Autonomous Freight Logistics Portal'],
    totalSpent: 298000,
    contractValue: 380000,
    pendingInvoices: 62000,
    status: 'ACTIVE',
    slaTier: 'PREMIUM_SLA',
    msaStatus: 'ACTIVE_SIGNED',
    ndaStatus: 'SIGNED',
    contractStartDate: '2026-02-15',
    contractRenewalDate: '2027-02-14',
    healthScore: 'EXCELLENT',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedAccountManager: {
      name: 'Alexander Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      email: 'alexander@apextech.com',
      role: 'Chief Executive Officer',
    },
    keyStakeholders: [
      { name: 'Jonathan Hayes', role: 'VP Supply Chain', email: 'j.hayes@vanguardfreight.com', phone: '+1 (312) 440-7781', isPrimary: true },
      { name: 'Chloe Dubois', role: 'Head of Fleet Operations', email: 'c.dubois@vanguardfreight.com', phone: '+1 (312) 440-7788', isPrimary: false },
    ]
  },
  {
    id: 'cli-4',
    companyName: 'Zenith Financial Group',
    contactPerson: 'Derrick Vance (CISO)',
    email: 'derrick@zenithfg.com',
    phone: '+1 (212) 991-3004',
    industry: 'Banking & IAM Security',
    activeProjects: 1,
    activeProjectNames: ['Zenith Security Zero-Trust IAM Gateway'],
    totalSpent: 78000,
    contractValue: 160000,
    pendingInvoices: 28000,
    status: 'ACTIVE',
    slaTier: 'PREMIUM_SLA',
    msaStatus: 'ACTIVE_SIGNED',
    ndaStatus: 'SIGNED',
    contractStartDate: '2026-07-01',
    contractRenewalDate: '2027-06-30',
    healthScore: 'GOOD',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    assignedAccountManager: {
      name: 'Sarah Montgomery',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      email: 'sarah.m@apextech.com',
      role: 'VP of Product Engineering',
    },
    keyStakeholders: [
      { name: 'Derrick Vance', role: 'CISO', email: 'derrick@zenithfg.com', phone: '+1 (212) 991-3004', isPrimary: true },
    ]
  }
];

export const MOCK_CLIENT_APPROVALS: ClientApprovalItem[] = [
  {
    id: 'appr-1',
    clientId: 'cli-1',
    clientName: 'Nova Capital Partners',
    clientLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    title: 'Milestone 3 Deliverables & WebAuthn Security Review',
    category: 'DELIVERABLE',
    requestedBy: 'Arjun Nambiar (Lead Dev)',
    requestDate: '2026-09-27',
    dueDate: '2026-10-02',
    status: 'PENDING',
    priority: 'URGENT',
    description: 'Formal staging demonstration build deployed with biometric passkeys and Stripe Treasury ACH settlement rails ready for signoff.',
    attachmentsCount: 3,
    valueImpact: 45000,
  },
  {
    id: 'appr-2',
    clientId: 'cli-1',
    clientName: 'Nova Capital Partners',
    clientLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    title: 'Scope Change Request CR-NP-2026-04 (Apple Pay Tokenization)',
    category: 'SOW_AMENDMENT',
    requestedBy: 'Sarah Montgomery (VP Eng)',
    requestDate: '2026-09-18',
    dueDate: '2026-09-25',
    status: 'APPROVED',
    priority: 'HIGH',
    description: 'Contract budget expansion for native Apple Pay checkout tokenization.',
    attachmentsCount: 1,
    signedBy: 'Marcus Sterling (VP Digital Strategy)',
    signedAt: '2026-09-19',
    comments: 'Approved by executive committee. Add to upcoming sprint backlog.',
    valueImpact: 14500,
  },
  {
    id: 'appr-3',
    clientId: 'cli-2',
    clientName: 'Aether Healthcare Systems',
    clientLogo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'HIPAA Video Streaming & Ephemeral Buffer Compliance Checklist',
    category: 'DESIGN_SIGN_OFF',
    requestedBy: 'Arjun Nambiar (Lead Dev)',
    requestDate: '2026-09-24',
    dueDate: '2026-10-05',
    status: 'PENDING',
    priority: 'HIGH',
    description: 'End-to-end media encryption verification report and Business Associate Agreement legal addendum.',
    attachmentsCount: 4,
    valueImpact: 28000,
  },
  {
    id: 'appr-4',
    clientId: 'cli-3',
    clientName: 'Vanguard Global Freight Logistics',
    clientLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Milestone 4: Fleet Telemetry & Production Launch Acceptance',
    category: 'RELEASE_DEPLOYMENT',
    requestedBy: 'Alexander Vance (Super Admin)',
    requestDate: '2026-09-22',
    dueDate: '2026-09-30',
    status: 'APPROVED',
    priority: 'URGENT',
    description: 'Final production signoff for 400 commercial fleet vehicle telematics deployment.',
    attachmentsCount: 2,
    signedBy: 'Jonathan Hayes (VP Supply Chain)',
    signedAt: '2026-09-24',
    comments: 'Final sign-off granted. Ready for live fleet activation on Oct 1.',
    valueImpact: 62000,
  }
];

export const MOCK_SUPPORT_TICKETS: SupportTicketItem[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-NP-104',
    clientId: 'cli-1',
    clientName: 'Nova Capital Partners',
    clientLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    title: 'Safari iOS 18 WebAuthn Passkey Registration Timeout',
    description: 'Some iOS beta testers reported intermittent timeout during FaceID prompt verification on staging server.',
    severity: 'HIGH_P1',
    status: 'IN_PROGRESS',
    createdAt: '2026-09-28 14:30',
    slaDeadline: '2026-09-29 18:00 (4h remaining)',
    assignedEngineer: {
      name: 'Arjun Nambiar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    messagesCount: 5,
  },
  {
    id: 'tkt-2',
    ticketNumber: 'TKT-AH-082',
    clientId: 'cli-2',
    clientName: 'Aether Healthcare Systems',
    clientLogo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    projectName: 'AetherHealth Clinical Telemedicine Platform',
    title: 'Epic EHR Patient ID Lookup Webhook Rate Limit Warning',
    description: 'Staging sync triggered a 429 Too Many Requests response from test clinical database endpoint.',
    severity: 'MEDIUM_P2',
    status: 'OPEN',
    createdAt: '2026-09-29 09:15',
    slaDeadline: '2026-09-30 12:00',
    assignedEngineer: {
      name: 'Sarah Montgomery',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    messagesCount: 2,
  },
  {
    id: 'tkt-3',
    ticketNumber: 'TKT-SY-059',
    clientId: 'cli-3',
    clientName: 'Vanguard Global Freight Logistics',
    clientLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    projectName: 'Synapse AI Autonomous Freight Logistics Portal',
    title: 'Refrigerated Cargo BLE Temperature Sensor Calibration Alert',
    description: 'Requested threshold calibration adjustment for sub-zero pharmaceutical sensor packets.',
    severity: 'LOW_P3',
    status: 'RESOLVED',
    createdAt: '2026-09-26 11:20',
    slaDeadline: '2026-09-28 17:00',
    assignedEngineer: {
      name: 'Arjun Nambiar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    messagesCount: 7,
  }
];
