export interface TranscriptSegment {
  id: string;
  speaker: string;
  role: string;
  avatar: string;
  timestamp: string;
  text: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CRITICAL';
  keyTopic?: string;
}

export interface ExtractedActionItem {
  id: string;
  taskTitle: string;
  assigneeName: string;
  assigneeAvatar: string;
  projectName: string;
  deadline: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  confidenceScore: number; // e.g. 98%
  status: 'PENDING' | 'ADDED_TO_KANBAN' | 'DISMISSED';
}

export interface KeyMeetingDecision {
  id: string;
  decisionText: string;
  approvedBy: string;
  impactLevel: 'HIGH' | 'MEDIUM';
  timestamp: string;
}

export interface MeetingIntelligenceSession {
  id: string;
  meetingTitle: string;
  project: string;
  client: string;
  date: string;
  duration: string;
  attendeesCount: number;
  overallSentiment: 'VERY_POSITIVE' | 'PRODUCTIVE' | 'CAUTION';
  summaryBullets: string[];
  actionItems: ExtractedActionItem[];
  keyDecisions: KeyMeetingDecision[];
  transcript: TranscriptSegment[];
}

export interface AIAssistantMessage {
  id: string;
  sender: 'USER' | 'AI';
  timestamp: string;
  content: string;
  suggestedActions?: {
    label: string;
    path?: string;
    actionType: string;
  }[];
}

export const SUGGESTED_AI_PROMPTS = [
  '📊 Summarize Q3 financial revenue and net profit margins',
  '🚀 What are the top blockers in the NovaPay project sprint?',
  '👥 Show employee attendance punctuality for today',
  '📄 Draft an executive client status email for Marcus Sterling',
  '⏱️ Which deliverables are due for client review this Friday?',
];

export const MOCK_MEETING_INTELLIGENCE: MeetingIntelligenceSession[] = [
  {
    id: 'meet-int-1',
    meetingTitle: 'NovaPay Sprint 14 Delivery & Architecture Review',
    project: 'NovaPay Global Banking Gateway',
    client: 'Nova Capital Partners',
    date: '30 Sept 2026',
    duration: '42 mins',
    attendeesCount: 5,
    overallSentiment: 'VERY_POSITIVE',
    summaryBullets: [
      'Client confirmed approval of the biometric WebAuthn security protocol for UAT staging deployment.',
      'Performance load tests demonstrated sub-45ms latency across 10,000 concurrent multi-currency transactions.',
      'Agreed to freeze API schemas for payment gateway webhooks by Friday 5 PM.',
      'Next milestone review scheduled for 15th October 2026.'
    ],
    actionItems: [
      {
        id: 'ai-task-1',
        taskTitle: 'Deploy WebAuthn Passkeys build to Client UAT Staging',
        assigneeName: 'Arjun Nambiar',
        assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        projectName: 'NovaPay Global Banking Gateway',
        deadline: 'Today, 5:00 PM',
        priority: 'URGENT',
        confidenceScore: 98,
        status: 'PENDING',
      },
      {
        id: 'ai-task-2',
        taskTitle: 'Finalize Webhook OpenAPI 3.1 Documentation & Signature verification guide',
        assigneeName: 'Sarah Montgomery',
        assigneeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        projectName: 'NovaPay Global Banking Gateway',
        deadline: '02 Oct 2026',
        priority: 'HIGH',
        confidenceScore: 94,
        status: 'PENDING',
      },
      {
        id: 'ai-task-3',
        taskTitle: 'Generate client milestone invoice for Phase 3 deliverable sign-off (₹8.50L)',
        assigneeName: 'Vikramaditya Singhania',
        assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        projectName: 'NovaPay Global Banking Gateway',
        deadline: '05 Oct 2026',
        priority: 'MEDIUM',
        confidenceScore: 91,
        status: 'PENDING',
      }
    ],
    keyDecisions: [
      {
        id: 'dec-1',
        decisionText: 'Approved moving build to Client Staging environment with automated audit trails enabled.',
        approvedBy: 'Marcus Sterling (Client VP)',
        impactLevel: 'HIGH',
        timestamp: '14:20',
      },
      {
        id: 'dec-2',
        decisionText: 'Retain Redis cluster fallback caching strategy for high-load FX rate spikes.',
        approvedBy: 'Sarah Montgomery (Delivery Manager)',
        impactLevel: 'MEDIUM',
        timestamp: '28:45',
      }
    ],
    transcript: [
      {
        id: 'seg-1',
        speaker: 'Sarah Montgomery',
        role: 'Delivery Manager',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        timestamp: '00:05',
        text: 'Good morning everyone! Today we are reviewing the NovaPay Sprint 14 deliverables including biometric authentication and multi-currency ledger performance.',
        sentiment: 'POSITIVE',
        keyTopic: 'Introduction & Agenda',
      },
      {
        id: 'seg-2',
        speaker: 'Arjun Nambiar',
        role: 'Staff Backend Architect',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        timestamp: '04:18',
        text: 'Our team completed the WebAuthn passkey implementation and verified zero regressions across iOS Safari, Android Chrome, and Desktop browsers. Latency tests averaged 38ms.',
        sentiment: 'POSITIVE',
        keyTopic: 'WebAuthn Architecture',
      },
      {
        id: 'seg-3',
        speaker: 'Marcus Sterling',
        role: 'Client Partner VP',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        timestamp: '14:02',
        text: 'This looks exceptional. The latency benchmark matches our strict compliance standard. We are formally approving the deployment to our UAT staging cluster today.',
        sentiment: 'POSITIVE',
        keyTopic: 'Client Sign-off',
      },
      {
        id: 'seg-4',
        speaker: 'Vikramaditya Singhania',
        role: 'Super Admin / CEO',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        timestamp: '22:15',
        text: 'Thank you Marcus. Arjun, please coordinate with Marcus’s DevOps team by 5 PM to verify DNS records and TLS certificates on staging.',
        sentiment: 'POSITIVE',
        keyTopic: 'DevOps Coordination',
      }
    ]
  },
  {
    id: 'meet-int-2',
    meetingTitle: 'HealthPulse Telehealth HIPAA Compliance Sync',
    project: 'HealthPulse Patient Portal',
    client: 'Apex BioHealth Systems',
    date: '29 Sept 2026',
    duration: '35 mins',
    attendeesCount: 4,
    overallSentiment: 'PRODUCTIVE',
    summaryBullets: [
      'Reviewed 256-bit AES encryption standards for patient medical record exports.',
      'Audit log immutability verified against SOC2 trust principles.',
      'Agreed on doctor-patient WebRTC video stream encryption keys lifecycle.'
    ],
    actionItems: [
      {
        id: 'ai-task-4',
        taskTitle: 'Implement 30-day automatic key rotation for Telehealth video tokens',
        assigneeName: 'Priya Sundaram',
        assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        projectName: 'HealthPulse Patient Portal',
        deadline: '08 Oct 2026',
        priority: 'HIGH',
        confidenceScore: 96,
        status: 'PENDING',
      }
    ],
    keyDecisions: [
      {
        id: 'dec-3',
        decisionText: 'Enforce dual-custody approval for all patient health record exports.',
        approvedBy: 'Compliance Lead',
        impactLevel: 'HIGH',
        timestamp: '19:10',
      }
    ],
    transcript: []
  }
];

export const INITIAL_AI_CHAT_MESSAGES: AIAssistantMessage[] = [
  {
    id: 'msg-1',
    sender: 'AI',
    timestamp: '09:00 AM',
    content: 'Good morning! I am **OfficeOS Autonomous Intelligence**. I have indexed your organization’s live databases across **14 active projects**, **148 employees**, **financial ledgers (₹104.70L YTD)**, and recent **meeting transcripts**.\n\nHow can I assist your executive operations today?',
    suggestedActions: [
      { label: '📊 View Q3 Financial Telemetry', path: '/analytics/financial-analytics', actionType: 'NAVIGATE' },
      { label: '🎯 Check NovaPay Sprint Health', path: '/projects/all', actionType: 'NAVIGATE' },
      { label: '🎙️ Review Latest Meeting AI Summary', path: '/ai/meeting-intelligence', actionType: 'NAVIGATE' }
    ]
  }
];
