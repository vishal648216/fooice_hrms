// ============================================================
// OFFICEOS CHAT — MOCK DATA & TYPES
// ============================================================

export type MessageStatus = 'sent' | 'delivered' | 'read';
export type AttachmentType = 'image' | 'document' | 'video' | 'audio' | 'link';
export type ReactionEmoji = '👍' | '❤️' | '😂' | '😮' | '😢' | '🔥' | '✅' | '🎉' | '🚀' | '🤝';

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: string;
  isTyping?: boolean;
}

export interface MessageReaction {
  emoji: ReactionEmoji;
  count: number;
  users: string[];
  reacted: boolean; // did current user react
}

export interface MessageAttachment {
  id: string;
  type: AttachmentType;
  name: string;
  size: string;
  url: string;
  thumbnailUrl?: string;
  duration?: string; // for video/audio
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  timeLabel: string;
  dateGroup: string;
  status: MessageStatus;
  reactions: MessageReaction[];
  attachments: MessageAttachment[];
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  isEdited?: boolean;
  isPinned?: boolean;
  isSystemMessage?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'announcement';
  members: string[];
  adminIds: string[];
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  lastMessage?: Partial<ChatMessage>;
  createdAt: string;
  topic?: string;
  onlyAdminCanPost?: boolean;
}

export interface DirectMessage {
  id: string;
  participantId: string;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  lastMessage?: Partial<ChatMessage>;
  isOnline: boolean;
}

// ============================================================
// USERS
// ============================================================
export const CHAT_USERS: Record<string, ChatUser> = {
  'usr-1': {
    id: 'usr-1',
    name: 'Vikramaditya Singhania',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'CEO & Founder (Boss / Super Admin)',
    department: 'Executive Leadership',
    status: 'online',
  },
  'usr-2': {
    id: 'usr-2',
    name: 'Sarah Montgomery',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'Delivery Manager & Team Leader',
    department: 'Product Engineering',
    status: 'online',
  },
  'usr-3': {
    id: 'usr-3',
    name: 'Arjun Nambiar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Lead Full-Stack Developer',
    department: 'Core Platform Engineering',
    status: 'online',
  },
  'usr-5': {
    id: 'usr-5',
    name: 'Kavita Rao',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'Head of People Operations & HR',
    department: 'Human Resources',
    status: 'online',
  },
  'usr-4': {
    id: 'usr-4',
    name: 'Marcus Sterling',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'VP of Digital Strategy (Client Partner)',
    department: 'Nova Capital Partners',
    status: 'online',
  },
  'me': {
    id: 'usr-1',
    name: 'Vikramaditya Singhania',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'CEO & Founder',
    department: 'Executive Leadership',
    status: 'online',
  }
};

// ============================================================
// CHANNELS (Role & Membership Filtered)
// ============================================================
export const MOCK_CHANNELS: ChatChannel[] = [
  {
    id: 'ch-announcements',
    name: 'company-announcements',
    description: 'Official company-wide announcements (Internal Staff)',
    type: 'announcement',
    members: ['usr-1', 'usr-2', 'usr-3', 'usr-5'], // BOSS, MANAGER, DEVELOPER, HR
    adminIds: ['usr-1'],
    unreadCount: 1,
    isMuted: false,
    isPinned: true,
    topic: 'Official broadcasts posted by Vikramaditya Singhania.',
    onlyAdminCanPost: true,
    createdAt: '2026-01-10',
    lastMessage: {
      senderId: 'usr-1',
      text: '🎉 OfficeOS Enterprise v3.0 release is now live across all environments.',
      timeLabel: '09:00 AM',
    },
  },
  {
    id: 'ch-engineering',
    name: 'core-engineering',
    description: 'Engineering team discussion, PR reviews, architecture decisions',
    type: 'private',
    members: ['usr-1', 'usr-2', 'usr-3'], // BOSS, TEAM LEADER, DEVELOPER (HR & CLIENT BLOCKED)
    adminIds: ['usr-1', 'usr-2'],
    unreadCount: 3,
    isMuted: false,
    isPinned: true,
    topic: 'Active sprint discussion & PR reviews.',
    onlyAdminCanPost: false,
    createdAt: '2026-01-10',
    lastMessage: {
      senderId: 'usr-3',
      text: 'WebAuthn biometric passkey PR is ready for testing on staging.',
      timeLabel: '10:45 AM',
    },
  },
  {
    id: 'ch-client-novapay',
    name: 'client-novapay-portal',
    description: 'Dedicated client communication channel for Nova Capital project',
    type: 'private',
    members: ['usr-1', 'usr-2', 'usr-4'], // BOSS, TEAM LEADER, CLIENT (DEV & HR BLOCKED UNLESS ADDED BY BOSS)
    adminIds: ['usr-1', 'usr-2'],
    unreadCount: 2,
    isMuted: false,
    isPinned: true,
    topic: 'Nova Capital delivery milestones & sprint sign-offs.',
    onlyAdminCanPost: false,
    createdAt: '2026-02-15',
    lastMessage: {
      senderId: 'usr-4',
      text: 'Reviewing the Sprint 14 milestone deliverables now. Looking solid!',
      timeLabel: '11:15 AM',
    },
  },
  {
    id: 'ch-hr',
    name: 'hr-leadership',
    description: 'HR policies, appraisals, sensitive employee requests',
    type: 'private',
    members: ['usr-1', 'usr-5', 'usr-2'], // BOSS, HR, TEAM LEADER (DEVELOPER & CLIENT BLOCKED)
    adminIds: ['usr-1', 'usr-5'],
    unreadCount: 1,
    isMuted: false,
    isPinned: false,
    onlyAdminCanPost: false,
    createdAt: '2026-01-12',
    lastMessage: {
      senderId: 'usr-5',
      text: 'Monthly attendance reports and leave quotas have been processed.',
      timeLabel: 'Yesterday',
    },
  },
  {
    id: 'ch-devops',
    name: 'devops-infra',
    description: 'CI/CD pipelines, Kubernetes deployments & server telemetry',
    type: 'private',
    members: ['usr-1', 'usr-2', 'usr-3'], // BOSS, TEAM LEADER, DEVELOPER
    adminIds: ['usr-1', 'usr-2'],
    unreadCount: 0,
    isMuted: true,
    isPinned: false,
    topic: 'Production health monitoring & alerts.',
    onlyAdminCanPost: false,
    createdAt: '2026-02-01',
    lastMessage: {
      senderId: 'usr-2',
      text: 'Cluster upgrade completed with zero downtime.',
      timeLabel: '2d ago',
    },
  },
];

// ============================================================
// DIRECT MESSAGES
// ============================================================
export const MOCK_DMS: DirectMessage[] = [
  {
    id: 'dm-usr-2',
    participantId: 'usr-2',
    unreadCount: 1,
    isMuted: false,
    isPinned: true,
    isOnline: true,
    lastMessage: {
      senderId: 'usr-2',
      text: 'Sprint 14 code reviews are 100% complete and deployed.',
      timeLabel: '10:55 AM',
    },
  },
  {
    id: 'dm-usr-3',
    participantId: 'usr-3',
    unreadCount: 0,
    isMuted: false,
    isPinned: false,
    isOnline: true,
    lastMessage: {
      senderId: 'usr-3',
      text: 'Biometric passkey PR is ready for staging review.',
      timeLabel: '09:40 AM',
    },
  },
  {
    id: 'dm-usr-5',
    participantId: 'usr-5',
    unreadCount: 1,
    isMuted: false,
    isPinned: false,
    isOnline: true,
    lastMessage: {
      senderId: 'usr-5',
      text: 'Pending leave requests and attendance logs are ready for review.',
      timeLabel: 'Yesterday',
    },
  },
  {
    id: 'dm-usr-4',
    participantId: 'usr-4',
    unreadCount: 0,
    isMuted: false,
    isPinned: true,
    isOnline: true,
    lastMessage: {
      senderId: 'usr-4',
      text: 'NovaPay architecture deliverables look great. Thanks for the quick update!',
      timeLabel: '11:20 AM',
    },
  },
];

// ============================================================
// MESSAGES PER CHANNEL
// ============================================================
export const MOCK_CHANNEL_MESSAGES: Record<string, ChatMessage[]> = {
  'ch-announcements': [
    {
      id: 'msg-g1',
      senderId: 'usr-1',
      text: 'Good morning team! 👋 OfficeOS Enterprise v3.0 release is now live across all staging and production environments.',
      timestamp: '2026-09-29T07:00:00',
      timeLabel: '7:00 AM',
      dateGroup: 'Today',
      status: 'read',
      reactions: [
        { emoji: '🎉', count: 4, users: ['usr-2', 'usr-3', 'usr-5'], reacted: true },
        { emoji: '🔥', count: 2, users: ['usr-3'], reacted: false },
      ],
      attachments: [],
      isPinned: true,
    },
    {
      id: 'msg-g2',
      senderId: 'usr-2',
      text: 'Amazing milestone! Delivery timelines are completely on track.',
      timestamp: '2026-09-29T07:15:00',
      timeLabel: '7:15 AM',
      dateGroup: 'Today',
      status: 'read',
      reactions: [{ emoji: '👍', count: 3, users: ['usr-1', 'usr-3', 'usr-5'], reacted: true }],
      attachments: [],
    },
  ],
  'ch-engineering': [
    {
      id: 'msg-e1',
      senderId: 'usr-2',
      text: '🟢 Sprint 14 Architecture Review: WebAuthn biometric passkey implementation is ready on branch feature/fido2-auth.',
      timestamp: '2026-09-29T08:15:00',
      timeLabel: '8:15 AM',
      dateGroup: 'Today',
      status: 'read',
      reactions: [{ emoji: '✅', count: 2, users: ['usr-1', 'usr-3'], reacted: true }],
      attachments: [],
    },
    {
      id: 'msg-e2',
      senderId: 'usr-3',
      text: 'All unit tests and end-to-end flows pass at 99.4% coverage. Ready for production merge.',
      timestamp: '2026-09-29T08:45:00',
      timeLabel: '8:45 AM',
      dateGroup: 'Today',
      status: 'read',
      reactions: [{ emoji: '🔥', count: 2, users: ['usr-1', 'usr-2'], reacted: true }],
      attachments: [],
    },
  ],
  'ch-client-novapay': [
    {
      id: 'msg-c1',
      senderId: 'usr-1',
      text: 'Welcome Marcus! This is the dedicated high-priority channel for Nova Capital delivery milestones and sign-offs.',
      timestamp: '2026-09-29T09:00:00',
      timeLabel: '9:00 AM',
      dateGroup: 'Today',
      status: 'read',
      reactions: [{ emoji: '👍', count: 2, users: ['usr-4', 'usr-2'], reacted: true }],
      attachments: [],
    },
    {
      id: 'msg-c2',
      senderId: 'usr-4',
      text: 'Thank you Vikramaditya! Reviewing the Sprint 14 milestone deliverables now. Looking solid!',
      timestamp: '2026-09-29T09:20:00',
      timeLabel: '9:20 AM',
      dateGroup: 'Today',
      status: 'read',
      reactions: [{ emoji: '✅', count: 1, users: ['usr-1'], reacted: true }],
      attachments: [],
    },
  ],
  'ch-hr': [
    {
      id: 'msg-h1',
      senderId: 'usr-5',
      text: 'Monthly attendance reports and biometric telemetry logs have been synchronized into the HR dashboard.',
      timestamp: '2026-09-29T09:30:00',
      timeLabel: '9:30 AM',
      dateGroup: 'Today',
      status: 'read',
      reactions: [{ emoji: '👍', count: 1, users: ['usr-1'], reacted: true }],
      attachments: [],
    },
  ],
  'ch-devops': [
    {
      id: 'msg-d1',
      senderId: 'usr-2',
      text: 'Kubernetes cluster v1.31 upgrade executed with zero downtime. Production healthy.',
      timestamp: '2026-09-29T06:30:00',
      timeLabel: '6:30 AM',
      dateGroup: 'Today',
      status: 'read',
      reactions: [{ emoji: '🚀', count: 2, users: ['usr-1', 'usr-3'], reacted: true }],
      attachments: [],
    },
  ],
};

export const MOCK_DM_MESSAGES: Record<string, ChatMessage[]> = {
  'dm-usr-2': [
    {
      id: 'dm-m1',
      senderId: 'usr-2',
      text: 'Vikram, Sprint 14 delivery milestones have been approved by Marcus. We are preparing the production release.',
      timestamp: '2026-09-29T10:00:00',
      timeLabel: '10:00 AM',
      dateGroup: 'Today',
      status: 'read',
      reactions: [{ emoji: '👍', count: 1, users: ['usr-1'], reacted: true }],
      attachments: [],
    },
  ],
  'dm-usr-3': [
    {
      id: 'dm-a1',
      senderId: 'usr-3',
      text: 'Biometric passkey PR is ready for staging review. I logged my hours under NP-202.',
      timestamp: '2026-09-29T09:40:00',
      timeLabel: '09:40 AM',
      dateGroup: 'Today',
      status: 'read',
      reactions: [{ emoji: '✅', count: 1, users: ['usr-1'], reacted: true }],
      attachments: [],
    },
  ],
  'dm-usr-5': [
    {
      id: 'dm-h1',
      senderId: 'usr-5',
      text: 'Pending leave requests and attendance logs are ready for review. Rohan Mehta requested 5 days vacation.',
      timestamp: '2026-09-28T16:00:00',
      timeLabel: '4:00 PM',
      dateGroup: 'Yesterday',
      status: 'read',
      reactions: [],
      attachments: [],
    },
  ],
  'dm-usr-4': [
    {
      id: 'dm-c1',
      senderId: 'usr-4',
      text: 'NovaPay architecture deliverables look great. Thanks for the quick update!',
      timestamp: '2026-09-29T11:20:00',
      timeLabel: '11:20 AM',
      dateGroup: 'Today',
      status: 'read',
      reactions: [{ emoji: '🤝', count: 1, users: ['usr-1'], reacted: true }],
      attachments: [],
    },
  ],
};
