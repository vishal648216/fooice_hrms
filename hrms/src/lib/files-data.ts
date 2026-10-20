export type FileExtensionType = 'pdf' | 'figma' | 'code' | 'image' | 'archive' | 'doc' | 'video';

export interface StorageFolderItem {
  id: string;
  name: string;
  category: 'PROJECTS' | 'LEGAL' | 'ENGINEERING' | 'DESIGN' | 'FINANCE';
  fileCount: number;
  totalSize: string;
  lastUpdated: string;
  color: string;
}

export interface DriveFileItem {
  id: string;
  folderId: string;
  name: string;
  extension: FileExtensionType;
  sizeBytes: number;
  sizeFormatted: string;
  updatedAt: string;
  version: string;
  projectName?: string;
  uploadedBy: {
    name: string;
    avatar: string;
    role: string;
  };
  isStarred?: boolean;
  accessLevel: 'PUBLIC' | 'CONFIDENTIAL' | 'ADMIN_ONLY';
}

export interface CorporateDocumentItem {
  id: string;
  docNumber: string;
  title: string;
  category: 'LEGAL_MSA' | 'SECURITY_SOC2' | 'ARCHITECTURE_RFC' | 'SOW_CONTRACT' | 'HR_POLICY';
  summary: string;
  content: string;
  version: string;
  status: 'PUBLISHED' | 'IN_REVIEW' | 'DRAFT';
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  lastReviewed: string;
  pagesCount: number;
  tags: string[];
}

export interface WikiArticleItem {
  id: string;
  slug: string;
  title: string;
  category: 'ENGINEERING_PRACTICES' | 'SECURITY_IAM' | 'ARCHITECTURE' | 'ONBOARDING' | 'DEVOPS_RUNBOOKS';
  excerpt: string;
  body: string;
  readTimeMinutes: number;
  viewCount: number;
  lastUpdated: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
}

export const MOCK_STORAGE_FOLDERS: StorageFolderItem[] = [
  {
    id: 'f-projects',
    name: 'Client Project Assets & Builds',
    category: 'PROJECTS',
    fileCount: 148,
    totalSize: '84.2 GB',
    lastUpdated: 'Today at 10:45 AM',
    color: '#6366f1'
  },
  {
    id: 'f-legal',
    name: 'Master Services Agreements & NDAs',
    category: 'LEGAL',
    fileCount: 42,
    totalSize: '1.2 GB',
    lastUpdated: 'Yesterday',
    color: '#8b5cf6'
  },
  {
    id: 'f-engineering',
    name: 'System Architecture RFCs & Schemas',
    category: 'ENGINEERING',
    fileCount: 86,
    totalSize: '14.8 GB',
    lastUpdated: 'Sep 26, 2026',
    color: '#3b82f6'
  },
  {
    id: 'f-design',
    name: 'Figma UI Kits & Brand Assets',
    category: 'DESIGN',
    fileCount: 65,
    totalSize: '32.6 GB',
    lastUpdated: 'Sep 24, 2026',
    color: '#ec4899'
  },
  {
    id: 'f-finance',
    name: 'Tax Invoices & Wire Receipts',
    category: 'FINANCE',
    fileCount: 112,
    totalSize: '3.4 GB',
    lastUpdated: 'Sep 20, 2026',
    color: '#10b981'
  }
];

export const MOCK_DRIVE_FILES: DriveFileItem[] = [
  {
    id: 'file-1',
    folderId: 'f-projects',
    name: 'NovaPay_v2_Architecture_Blueprint_v3.1.pdf',
    extension: 'pdf',
    sizeBytes: 14680064,
    sizeFormatted: '14.0 MB',
    updatedAt: '2026-09-28',
    version: 'v3.1',
    projectName: 'NovaPay Neobank',
    uploadedBy: {
      name: 'Arjun Nambiar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Lead Full-Stack Engineer',
    },
    isStarred: true,
    accessLevel: 'CONFIDENTIAL',
  },
  {
    id: 'file-2',
    folderId: 'f-design',
    name: 'OfficeOS_Design_Tokens_DarkGlassmorphism.fig',
    extension: 'figma',
    sizeBytes: 48234496,
    sizeFormatted: '46.0 MB',
    updatedAt: '2026-09-27',
    version: 'v2.4',
    projectName: 'Design System',
    uploadedBy: {
      name: 'Sarah Montgomery',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'VP of Product Engineering',
    },
    isStarred: true,
    accessLevel: 'PUBLIC',
  },
  {
    id: 'file-3',
    folderId: 'f-legal',
    name: 'NovaCapital_Signed_Master_Services_Agreement_2026.pdf',
    extension: 'pdf',
    sizeBytes: 4194304,
    sizeFormatted: '4.0 MB',
    updatedAt: '2026-09-15',
    version: 'v1.0-final',
    projectName: 'Nova Capital Partners',
    uploadedBy: {
      name: 'Alexander Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'Chief Executive Officer',
    },
    isStarred: true,
    accessLevel: 'CONFIDENTIAL',
  },
  {
    id: 'file-4',
    folderId: 'f-engineering',
    name: 'AetherHealth_HIPAA_WebRTC_Security_Checklist.pdf',
    extension: 'pdf',
    sizeBytes: 8388608,
    sizeFormatted: '8.0 MB',
    updatedAt: '2026-09-22',
    version: 'v2.0',
    projectName: 'AetherHealth Telemedicine',
    uploadedBy: {
      name: 'Arjun Nambiar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Lead Full-Stack Engineer',
    },
    isStarred: false,
    accessLevel: 'CONFIDENTIAL',
  },
  {
    id: 'file-5',
    folderId: 'f-projects',
    name: 'Synapse_Fleet_Telemetry_Kafka_Consumer_Schemas.json',
    extension: 'code',
    sizeBytes: 524288,
    sizeFormatted: '512 KB',
    updatedAt: '2026-09-25',
    version: 'v4.0',
    projectName: 'Synapse AI Freight',
    uploadedBy: {
      name: 'Sarah Montgomery',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'VP of Product Engineering',
    },
    isStarred: false,
    accessLevel: 'PUBLIC',
  },
  {
    id: 'file-6',
    folderId: 'f-projects',
    name: 'Production_Release_Build_Artifacts_v2.0.4.zip',
    extension: 'archive',
    sizeBytes: 157286400,
    sizeFormatted: '150.0 MB',
    updatedAt: '2026-09-29',
    version: 'v2.0.4',
    projectName: 'NovaPay Neobank',
    uploadedBy: {
      name: 'Arjun Nambiar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Lead Full-Stack Engineer',
    },
    isStarred: false,
    accessLevel: 'ADMIN_ONLY',
  }
];

export const MOCK_CORPORATE_DOCS: CorporateDocumentItem[] = [
  {
    id: 'doc-1',
    docNumber: 'DOC-SEC-2026-01',
    title: 'Zero-Trust Architecture & WebAuthn Security Standard',
    category: 'SECURITY_SOC2',
    summary: 'Comprehensive cryptographic specifications for FIDO2 biometric authentication, token exchange, and role-based access control.',
    content: `## 1. Executive Summary\nThis document mandates the cryptographic and architectural requirements for all authentication mechanisms deployed in the OfficeOS platform. Plaintext credentials and legacy symmetric secrets are strictly prohibited.\n\n## 2. WebAuthn & FIDO2 Implementation\nAll client and internal user accounts must support hardware security key enrollment (YubiKey 5 Series) and platform authenticators (Apple Touch ID, Face ID, Windows Hello).\n\n## 3. Ephemeral Session Token Lifecycles\nJWT sessions expire in 15 minutes and require continuous signature refresh over TLS 1.3 encrypted channels.`,
    version: 'v2.2',
    status: 'PUBLISHED',
    author: {
      name: 'Arjun Nambiar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Lead Full-Stack Engineer',
    },
    lastReviewed: '2026-09-20',
    pagesCount: 14,
    tags: ['Security', 'FIDO2', 'WebAuthn', 'SOC2']
  },
  {
    id: 'doc-2',
    docNumber: 'DOC-LEG-2026-04',
    title: 'Master Services Agreement & SLA Guarantee Addendum',
    category: 'LEGAL_MSA',
    summary: 'Standard enterprise contractual terms, uptime commitments (99.98%), intellectual property assignation, and change request procedures.',
    content: `## 1. Services & Statements of Work\nApex Technologies agrees to provide software development, system architecture, and cloud infrastructure operations under specified SOW milestones.\n\n## 2. SLA Commitments\n- Critical P0 Incidents: 15-minute response, 2-hour containment.\n- High P1 Incidents: 4-hour response.\n- Monthly Uptime: 99.98% excluding scheduled maintenance windows.`,
    version: 'v3.0',
    status: 'PUBLISHED',
    author: {
      name: 'Alexander Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'Chief Executive Officer',
    },
    lastReviewed: '2026-08-15',
    pagesCount: 22,
    tags: ['Legal', 'MSA', 'SLA', 'Contracts']
  },
  {
    id: 'doc-3',
    docNumber: 'DOC-ARC-2026-12',
    title: 'RFC-402: Event-Driven Microservices & Kafka Stream Topology',
    category: 'ARCHITECTURE_RFC',
    summary: 'Technical architecture proposal for high-throughput telematics telemetry ingestion and read-replica database routing.',
    content: `## 1. Problem Statement\nHigh-frequency GPS sensor updates (5,000 events/sec) require sub-second parsing with zero database lock contention on PostgreSQL primary instances.\n\n## 2. Proposed Architecture\n- Ingestion: Apache Kafka cluster with partition key hashing on vehicle UUID.\n- Storage: ClickHouse columnar storage for real-time telemetry analytics and geospatial bounds.\n- WebSockets: Node.js cluster broadcasting delta coordinate packets to client browsers.`,
    version: 'v1.4',
    status: 'PUBLISHED',
    author: {
      name: 'Sarah Montgomery',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'VP of Product Engineering',
    },
    lastReviewed: '2026-09-18',
    pagesCount: 9,
    tags: ['Architecture', 'Kafka', 'PostgreSQL', 'RFC']
  }
];

export const MOCK_WIKI_ARTICLES: WikiArticleItem[] = [
  {
    id: 'wiki-1',
    slug: 'nextjs-turbopack-standards',
    title: 'Next.js 15 & Turbopack Frontend Development Standards',
    category: 'ENGINEERING_PRACTICES',
    excerpt: 'Best practices for App Router architecture, Server vs Client components, design tokens, and zero-bundle-bloat utilities.',
    body: `### Core Principles\n1. **Server First**: Default to React Server Components unless stateful interaction or browser APIs (e.g. WebAuthn, WebSockets) are required.\n2. **Design Tokens**: Use predefined HSL CSS variables instead of ad-hoc utility strings.\n3. **Accessibility**: Maintain WCAG AAA contrast ratio standards for dark mode palettes.`,
    readTimeMinutes: 6,
    viewCount: 342,
    lastUpdated: '2026-09-24',
    author: {
      name: 'Sarah Montgomery',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['Next.js', 'React', 'Frontend', 'Standards']
  },
  {
    id: 'wiki-2',
    slug: 'incident-response-runbook',
    title: 'Critical P0 Incident Response Protocol & Escalation Matrix',
    category: 'DEVOPS_RUNBOOKS',
    excerpt: 'Step-by-step runbook for outage triage, on-call paging, status page broadcasting, and post-mortem review.',
    body: `### Escalation Sequence\n1. **Acknowledge PagerDuty Alert**: Within 5 minutes of automated trigger.\n2. **Open War Room Bridge**: Launch Google Meet emergency room and notify CEO & Lead Dev.\n3. **Rollback Staging / Prod**: Execute automated canary rollback via ArgoCD.`,
    readTimeMinutes: 8,
    viewCount: 512,
    lastUpdated: '2026-09-21',
    author: {
      name: 'Arjun Nambiar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['DevOps', 'Incident', 'Runbook', 'SLA']
  },
  {
    id: 'wiki-3',
    slug: 'employee-onboarding-guide',
    title: 'Senior Engineer Onboarding & Local Environment Setup',
    category: 'ONBOARDING',
    excerpt: 'Quickstart guide for YubiKey passkey enrollment, GitHub SSH keys, Docker multi-service stacks, and local seed databases.',
    body: `### Day 1 Checklist\n- [x] Enroll hardware FIDO2 security key in OfficeOS profile\n- [x] Clone core monorepo and run \`npm install\`\n- [x] Initialize PostgreSQL read-replica container with Docker Compose`,
    readTimeMinutes: 4,
    viewCount: 189,
    lastUpdated: '2026-09-10',
    author: {
      name: 'Alexander Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['Onboarding', 'Guide', 'HR', 'Engineering']
  }
];
