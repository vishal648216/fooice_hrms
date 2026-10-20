export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface ExtendedInvoiceItem {
  id: string;
  invoiceNumber: string;
  poNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientLogo: string;
  projectName: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  subtotal: number;
  taxRate: number; // percentage, e.g. 10%
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'DRAFT';
  paymentMethod?: 'WIRE_TRANSFER' | 'STRIPE_ACH' | 'CREDIT_CARD' | 'CORPORATE_CHECK';
  notes: string;
  lineItems: InvoiceLineItem[];
}

export interface PaymentTransactionItem {
  id: string;
  transactionId: string;
  invoiceNumber: string;
  clientName: string;
  clientLogo: string;
  date: string;
  amount: number;
  paymentMethod: 'WIRE_TRANSFER' | 'STRIPE_ACH' | 'CREDIT_CARD' | 'DIRECT_DEPOSIT';
  referenceCode: string;
  status: 'CLEARED' | 'PROCESSING' | 'FAILED';
  clearedByBank: string;
}

export interface ExpenseItem {
  id: string;
  expenseNumber: string;
  category: 'CLOUD_INFRASTRUCTURE' | 'SOFTWARE_LICENSES' | 'HARDWARE_EQUIPMENT' | 'OFFICE_FACILITIES' | 'TRAVEL_EVENTS';
  vendor: string;
  vendorLogo?: string;
  description: string;
  amount: number;
  date: string;
  submittedBy: {
    name: string;
    avatar: string;
    role: string;
  };
  department: string;
  receiptUrl?: string;
  status: 'APPROVED' | 'PENDING_REVIEW' | 'REJECTED';
  approvedBy?: string;
  approvedDate?: string;
}

export interface BudgetAllocationItem {
  id: string;
  name: string;
  department: string;
  fiscalPeriod: string;
  allocatedBudget: number;
  spentToDate: number;
  committedPending: number;
  category: string;
  health: 'ON_TRACK' | 'WARNING' | 'OVER_BUDGET';
  manager: string;
}

export const MOCK_EXTENDED_INVOICES: ExtendedInvoiceItem[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-089',
    poNumber: 'PO-NOV-2026-44',
    clientId: 'cli-1',
    clientName: 'Nova Capital Partners',
    clientEmail: 'billing@novacapital.com',
    clientAddress: '555 California St, Suite 4200, San Francisco, CA 94104',
    clientLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    issueDate: '2026-09-01',
    dueDate: '2026-09-30',
    subtotal: 45000,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 45000,
    status: 'PENDING',
    paymentMethod: 'WIRE_TRANSFER',
    notes: 'Net 30 terms. Please remit payment via ACH Wire to Apex Technologies Corporate Silicon Valley Bank account.',
    lineItems: [
      { id: 'li-1', description: 'Sprint 13: Core Payment Rails & Stripe Wire Integration (160 hrs @ $150/hr)', quantity: 160, unitPrice: 150, amount: 24000 },
      { id: 'li-2', description: 'Sprint 14: WebAuthn FIDO2 Biometric Authentication Engine (100 hrs @ $150/hr)', quantity: 100, unitPrice: 150, amount: 15000 },
      { id: 'li-3', description: 'HIPAA & SOC2 Penetration Testing & Automated Test Suites', quantity: 1, unitPrice: 6000, amount: 6000 },
    ]
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-087',
    poNumber: 'PO-VAN-2026-12',
    clientId: 'cli-3',
    clientName: 'Vanguard Global Freight Logistics',
    clientEmail: 'ap@vanguardfreight.com',
    clientAddress: '100 S Wacker Dr, 18th Floor, Chicago, IL 60606',
    clientLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    projectName: 'Synapse AI Autonomous Freight Logistics Portal',
    issueDate: '2026-08-01',
    dueDate: '2026-08-31',
    paidDate: '2026-08-28',
    subtotal: 62000,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 62000,
    status: 'PAID',
    paymentMethod: 'WIRE_TRANSFER',
    notes: 'Payment received via Fedwire transfer. Receipt stamped and filed in audit log.',
    lineItems: [
      { id: 'li-4', description: 'Milestone 4: Fleet Telemetry & Kafka Stream Engine Rollout', quantity: 1, unitPrice: 50000, amount: 50000 },
      { id: 'li-5', description: 'Change Request CR-SY-2026-07: Cold-chain BLE Sensor Telemetry', quantity: 1, unitPrice: 12000, amount: 12000 },
    ]
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-082',
    poNumber: 'PO-AET-2026-90',
    clientId: 'cli-2',
    clientName: 'Aether Healthcare Systems',
    clientEmail: 'finance@aetherhealth.org',
    clientAddress: '75 Francis St, Boston, MA 02115',
    clientLogo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    projectName: 'AetherHealth Clinical Telemedicine Platform',
    issueDate: '2026-07-15',
    dueDate: '2026-08-15',
    paidDate: '2026-08-10',
    subtotal: 75000,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 75000,
    status: 'PAID',
    paymentMethod: 'STRIPE_ACH',
    notes: 'Paid via Stripe Treasury ACH instant settlement.',
    lineItems: [
      { id: 'li-6', description: 'Phase 1 Delivery: HIPAA Compliant WebRTC Consultation Engine', quantity: 1, unitPrice: 55000, amount: 55000 },
      { id: 'li-7', description: 'EHR Epic FHIR Integration Connector & Test Automation', quantity: 1, unitPrice: 20000, amount: 20000 },
    ]
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2026-092',
    poNumber: 'PO-ZEN-2026-03',
    clientId: 'cli-4',
    clientName: 'Zenith Financial Group',
    clientEmail: 'accounts@zenithfg.com',
    clientAddress: '200 Park Ave, New York, NY 10166',
    clientLogo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    projectName: 'Zenith Security Zero-Trust IAM Gateway',
    issueDate: '2026-09-10',
    dueDate: '2026-10-10',
    subtotal: 28000,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 28000,
    status: 'PENDING',
    paymentMethod: 'WIRE_TRANSFER',
    notes: 'Milestone 1 Discovery, Architecture Blueprint & SAML 2.0 Identity Bridge.',
    lineItems: [
      { id: 'li-8', description: 'SAML 2.0 / OIDC Identity Provider Token Exchange Bridge', quantity: 140, unitPrice: 150, amount: 21000 },
      { id: 'li-9', description: 'Zero-Trust Policy Engine Architecture Specification', quantity: 1, unitPrice: 7000, amount: 7000 },
    ]
  },
  {
    id: 'inv-5',
    invoiceNumber: 'INV-2026-095',
    poNumber: 'PO-NOV-2026-51',
    clientId: 'cli-1',
    clientName: 'Nova Capital Partners',
    clientEmail: 'billing@novacapital.com',
    clientAddress: '555 California St, Suite 4200, San Francisco, CA 94104',
    clientLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    projectName: 'NovaPay Enterprise Mobile Neobank v2.0',
    issueDate: '2026-09-25',
    dueDate: '2026-10-25',
    subtotal: 14500,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 14500,
    status: 'DRAFT',
    notes: 'Draft invoice for Scope Change Request CR-NP-2026-04 (Apple Pay Tokenization).',
    lineItems: [
      { id: 'li-10', description: 'Apple Pay & Google Pay Express Checkout Tokenization Module', quantity: 1, unitPrice: 14500, amount: 14500 }
    ]
  }
];

export const MOCK_PAYMENTS: PaymentTransactionItem[] = [
  {
    id: 'pay-1',
    transactionId: 'TXN-FEDWIRE-90821',
    invoiceNumber: 'INV-2026-087',
    clientName: 'Vanguard Global Freight Logistics',
    clientLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    date: '2026-08-28 11:34 AM',
    amount: 62000,
    paymentMethod: 'WIRE_TRANSFER',
    referenceCode: 'FW-89201948201',
    status: 'CLEARED',
    clearedByBank: 'Silicon Valley Bank (SVB) Corporate Routing',
  },
  {
    id: 'pay-2',
    transactionId: 'TXN-STRIPE-ACH-44120',
    invoiceNumber: 'INV-2026-082',
    clientName: 'Aether Healthcare Systems',
    clientLogo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    date: '2026-08-10 09:12 AM',
    amount: 75000,
    paymentMethod: 'STRIPE_ACH',
    referenceCode: 'py_3M09XkLkd8912Jk',
    status: 'CLEARED',
    clearedByBank: 'JPMorgan Chase Treasury',
  },
  {
    id: 'pay-3',
    transactionId: 'TXN-WIRE-77192',
    invoiceNumber: 'INV-2026-064',
    clientName: 'Nova Capital Partners',
    clientLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    date: '2026-08-15 15:45 PM',
    amount: 75000,
    paymentMethod: 'WIRE_TRANSFER',
    referenceCode: 'FW-40918239011',
    status: 'CLEARED',
    clearedByBank: 'Silicon Valley Bank (SVB) Corporate Routing',
  }
];

export const MOCK_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    expenseNumber: 'EXP-2026-104',
    category: 'CLOUD_INFRASTRUCTURE',
    vendor: 'Amazon Web Services (AWS)',
    description: 'Monthly Production Cluster EKS, Aurora Multi-AZ DB & CloudFront CDN usage for client projects.',
    amount: 8420.50,
    date: '2026-09-20',
    department: 'DevOps & Infrastructure',
    submittedBy: {
      name: 'Sarah Montgomery',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'VP of Product Engineering',
    },
    status: 'APPROVED',
    approvedBy: 'Alexander Vance (CEO)',
    approvedDate: '2026-09-21',
  },
  {
    id: 'exp-2',
    expenseNumber: 'EXP-2026-108',
    category: 'SOFTWARE_LICENSES',
    vendor: 'OpenAI Enterprise API',
    description: 'Meeting transcription Whisper models and AI company assistant tokens for Q3.',
    amount: 3250.00,
    date: '2026-09-24',
    department: 'AI & Data Engineering',
    submittedBy: {
      name: 'Arjun Nambiar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Lead Full-Stack Engineer',
    },
    status: 'APPROVED',
    approvedBy: 'Alexander Vance (CEO)',
    approvedDate: '2026-09-25',
  },
  {
    id: 'exp-3',
    expenseNumber: 'EXP-2026-112',
    category: 'SOFTWARE_LICENSES',
    vendor: 'Figma Organization & GitHub Enterprise',
    description: 'Quarterly seats renewal for 35 engineering and UI/UX product design licenses.',
    amount: 4600.00,
    date: '2026-09-26',
    department: 'Product Design',
    submittedBy: {
      name: 'Sarah Montgomery',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'VP of Product Engineering',
    },
    status: 'PENDING_REVIEW',
  },
  {
    id: 'exp-4',
    expenseNumber: 'EXP-2026-115',
    category: 'HARDWARE_EQUIPMENT',
    vendor: 'Apple Corporate Store',
    description: '2x MacBook Pro M3 Max 64GB for new senior backend and mobile engineers.',
    amount: 7198.00,
    date: '2026-09-28',
    department: 'Operations & IT Assets',
    submittedBy: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Head of Operations',
    },
    status: 'APPROVED',
    approvedBy: 'Alexander Vance (CEO)',
    approvedDate: '2026-09-28',
  }
];

export const MOCK_BUDGETS: BudgetAllocationItem[] = [
  {
    id: 'bud-1',
    name: 'Cloud Infrastructure & Hosting',
    department: 'DevOps & Platform Engineering',
    fiscalPeriod: 'Q3 2026 (Jul-Sep)',
    allocatedBudget: 35000,
    spentToDate: 26420,
    committedPending: 4000,
    category: 'AWS, Vercel, Datadog, Cloudflare',
    health: 'ON_TRACK',
    manager: 'Sarah Montgomery',
  },
  {
    id: 'bud-2',
    name: 'AI Research & API Tokens',
    department: 'AI & Data Science',
    fiscalPeriod: 'Q3 2026 (Jul-Sep)',
    allocatedBudget: 18000,
    spentToDate: 14200,
    committedPending: 2500,
    category: 'OpenAI, Anthropic, HuggingFace, Pinecone',
    health: 'ON_TRACK',
    manager: 'Arjun Nambiar',
  },
  {
    id: 'bud-3',
    name: 'SaaS Software & Developer Tooling',
    department: 'Core Engineering & Design',
    fiscalPeriod: 'Q3 2026 (Jul-Sep)',
    allocatedBudget: 24000,
    spentToDate: 22800,
    committedPending: 1500,
    category: 'GitHub, Figma, JetBrains, Sentry, Jira',
    health: 'WARNING',
    manager: 'Sarah Montgomery',
  },
  {
    id: 'bud-4',
    name: 'IT Hardware & Workstations',
    department: 'IT Operations & Facilities',
    fiscalPeriod: 'Q3 2026 (Jul-Sep)',
    allocatedBudget: 30000,
    spentToDate: 21500,
    committedPending: 7198,
    category: 'Apple Hardware, Monitors, Ergonomic Desks',
    health: 'ON_TRACK',
    manager: 'Alexander Vance',
  }
];
