export type ToolType = 
  | 'select' 
  | 'pan' 
  | 'rectangle' 
  | 'rounded-rect' 
  | 'ellipse' 
  | 'diamond' 
  | 'arrow' 
  | 'line' 
  | 'pen' 
  | 'text' 
  | 'sticky' 
  | 'eraser';

export interface CanvasPoint {
  x: number;
  y: number;
}

export interface WhiteboardElement {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  opacity: number;
  text?: string;
  fontSize?: number;
  textColor?: string;
  points?: CanvasPoint[]; // For freehand pen or complex lines
  arrowHead?: 'end' | 'both' | 'none';
  stickyColor?: string;
  author?: string;
  updatedAt?: string;
}

export interface WhiteboardCollaborator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  cursor: CanvasPoint;
  activeTool: ToolType;
  isOnline: boolean;
}

export interface WhiteboardDocument {
  id: string;
  title: string;
  category: 'ARCHITECTURE' | 'FLOWCHART' | 'WIREFRAME' | 'BRAINSTORM';
  lastEditedBy: string;
  lastEditedTime: string;
  collaboratorsCount: number;
  elements: WhiteboardElement[];
  thumbnailColor: string;
}

export const PRESET_COLORS = [
  { name: 'Indigo', value: '#6366f1', fill: '#6366f120' },
  { name: 'Cyan', value: '#06b6d4', fill: '#06b6d420' },
  { name: 'Emerald', value: '#10b981', fill: '#10b98120' },
  { name: 'Amber', value: '#f59e0b', fill: '#f59e0b20' },
  { name: 'Rose', value: '#f43f5e', fill: '#f43f5e20' },
  { name: 'Purple', value: '#a855f7', fill: '#a855f720' },
  { name: 'Slate Light', value: '#94a3b8', fill: '#33415540' },
  { name: 'White', value: '#ffffff', fill: '#ffffff15' },
  { name: 'Dark Slate', value: '#1e293b', fill: '#0f172a' },
];

export const STICKY_COLORS = [
  { name: 'Yellow', bg: '#fef08a', text: '#713f12', border: '#facc15' },
  { name: 'Green', bg: '#bbf7d0', text: '#14532d', border: '#86efac' },
  { name: 'Blue', bg: '#bfdbfe', text: '#1e3a8a', border: '#93c5fd' },
  { name: 'Pink', bg: '#fbcfe8', text: '#831843', border: '#f472b6' },
  { name: 'Purple', bg: '#e9d5ff', text: '#581c87', border: '#d8b4fe' },
];

export const MOCK_COLLABORATORS: WhiteboardCollaborator[] = [
  {
    id: 'collab-1',
    name: 'Sarah Montgomery',
    role: 'Lead Architect',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    color: '#06b6d4',
    cursor: { x: 480, y: 220 },
    activeTool: 'rectangle',
    isOnline: true,
  },
  {
    id: 'collab-2',
    name: 'Arjun Nambiar',
    role: 'Senior Backend Dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    color: '#10b981',
    cursor: { x: 780, y: 380 },
    activeTool: 'arrow',
    isOnline: true,
  },
  {
    id: 'collab-3',
    name: 'Marcus Sterling',
    role: 'Client Reviewer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    color: '#f59e0b',
    cursor: { x: 280, y: 440 },
    activeTool: 'sticky',
    isOnline: true,
  },
];

// Prebuilt Enterprise Architecture Elements
export const TEMPLATE_MICROSERVICES: WhiteboardElement[] = [
  {
    id: 'el-1',
    type: 'rounded-rect',
    x: 80,
    y: 180,
    width: 170,
    height: 90,
    strokeColor: '#6366f1',
    fillColor: '#6366f120',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 1,
    text: 'Client Layer\nWeb & Mobile Apps\n(Next.js / React Native)',
    fontSize: 12,
    textColor: '#ffffff',
  },
  {
    id: 'el-2',
    type: 'diamond',
    x: 320,
    y: 165,
    width: 140,
    height: 120,
    strokeColor: '#06b6d4',
    fillColor: '#06b6d425',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 1,
    text: 'Kong API Gateway\n& Rate Limiter\n(TLS 1.3 / mTLS)',
    fontSize: 11,
    textColor: '#ffffff',
  },
  {
    id: 'el-3',
    type: 'arrow',
    x: 250,
    y: 225,
    width: 70,
    height: 0,
    strokeColor: '#94a3b8',
    fillColor: 'transparent',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 1,
    points: [{ x: 250, y: 225 }, { x: 320, y: 225 }],
    arrowHead: 'end',
  },
  {
    id: 'el-4',
    type: 'rectangle',
    x: 540,
    y: 90,
    width: 180,
    height: 80,
    strokeColor: '#10b981',
    fillColor: '#10b98120',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 1,
    text: 'Auth & RBAC Service\n(Go / OAuth2 / WebAuthn)',
    fontSize: 12,
    textColor: '#ffffff',
  },
  {
    id: 'el-5',
    type: 'rectangle',
    x: 540,
    y: 200,
    width: 180,
    height: 80,
    strokeColor: '#f59e0b',
    fillColor: '#f59e0b20',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 1,
    text: 'Payment Engine\n(Stripe / Razorpay / Webhooks)',
    fontSize: 12,
    textColor: '#ffffff',
  },
  {
    id: 'el-6',
    type: 'rectangle',
    x: 540,
    y: 310,
    width: 180,
    height: 80,
    strokeColor: '#a855f7',
    fillColor: '#a855f720',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 1,
    text: 'Collaboration & Chat\n(WebSocket / WebRTC Engine)',
    fontSize: 12,
    textColor: '#ffffff',
  },
  {
    id: 'el-7',
    type: 'arrow',
    x: 460,
    y: 200,
    width: 80,
    height: -70,
    strokeColor: '#94a3b8',
    fillColor: 'transparent',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 1,
    points: [{ x: 460, y: 200 }, { x: 540, y: 130 }],
    arrowHead: 'end',
  },
  {
    id: 'el-8',
    type: 'arrow',
    x: 460,
    y: 225,
    width: 80,
    height: 15,
    strokeColor: '#94a3b8',
    fillColor: 'transparent',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 1,
    points: [{ x: 460, y: 225 }, { x: 540, y: 240 }],
    arrowHead: 'end',
  },
  {
    id: 'el-9',
    type: 'arrow',
    x: 460,
    y: 250,
    width: 80,
    height: 100,
    strokeColor: '#94a3b8',
    fillColor: 'transparent',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 1,
    points: [{ x: 460, y: 250 }, { x: 540, y: 350 }],
    arrowHead: 'end',
  },
  {
    id: 'el-10',
    type: 'ellipse',
    x: 800,
    y: 150,
    width: 160,
    height: 90,
    strokeColor: '#38bdf8',
    fillColor: '#38bdf820',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 1,
    text: 'PostgreSQL 16 Cluster\n(High Availability Primary)',
    fontSize: 12,
    textColor: '#ffffff',
  },
  {
    id: 'el-11',
    type: 'ellipse',
    x: 800,
    y: 280,
    width: 160,
    height: 90,
    strokeColor: '#f43f5e',
    fillColor: '#f43f5e20',
    strokeWidth: 2,
    strokeStyle: 'solid',
    opacity: 1,
    text: 'Redis Sentinel Cluster\n(Caching & Pub/Sub)',
    fontSize: 12,
    textColor: '#ffffff',
  },
  {
    id: 'el-12',
    type: 'arrow',
    x: 720,
    y: 220,
    width: 80,
    height: -25,
    strokeColor: '#94a3b8',
    fillColor: 'transparent',
    strokeWidth: 2,
    strokeStyle: 'dashed',
    opacity: 1,
    points: [{ x: 720, y: 220 }, { x: 800, y: 195 }],
    arrowHead: 'end',
  },
  {
    id: 'el-13',
    type: 'arrow',
    x: 720,
    y: 330,
    width: 80,
    height: -5,
    strokeColor: '#94a3b8',
    fillColor: 'transparent',
    strokeWidth: 2,
    strokeStyle: 'dashed',
    opacity: 1,
    points: [{ x: 720, y: 330 }, { x: 800, y: 325 }],
    arrowHead: 'end',
  },
  {
    id: 'el-14',
    type: 'sticky',
    x: 80,
    y: 330,
    width: 180,
    height: 120,
    strokeColor: '#facc15',
    fillColor: '#fef08a',
    strokeWidth: 1,
    strokeStyle: 'solid',
    opacity: 1,
    stickyColor: '#fef08a',
    text: '📌 Architecture Note:\nAll microservice endpoints require signed JWT with tenant workspace claims. Zero-trust internal network.',
    fontSize: 11,
    textColor: '#713f12',
    author: 'Sarah Montgomery',
  },
  {
    id: 'el-15',
    type: 'sticky',
    x: 780,
    y: 410,
    width: 190,
    height: 110,
    strokeColor: '#86efac',
    fillColor: '#bbf7d0',
    strokeWidth: 1,
    strokeStyle: 'solid',
    opacity: 1,
    stickyColor: '#bbf7d0',
    text: '🚀 Database Replication:\nCross-region replica configured in ap-south-1 with <50ms sync latency.',
    fontSize: 11,
    textColor: '#14532d',
    author: 'Arjun Nambiar',
  }
];

export const MOCK_WHITEBOARDS: WhiteboardDocument[] = [
  {
    id: 'wb-1',
    title: 'Enterprise High-Scale Microservices Architecture',
    category: 'ARCHITECTURE',
    lastEditedBy: 'Sarah Montgomery',
    lastEditedTime: '10 minutes ago',
    collaboratorsCount: 3,
    thumbnailColor: 'from-indigo-900 to-slate-900',
    elements: TEMPLATE_MICROSERVICES,
  },
  {
    id: 'wb-2',
    title: 'NovaPay Multi-Currency Checkout Flowchart',
    category: 'FLOWCHART',
    lastEditedBy: 'Arjun Nambiar',
    lastEditedTime: '1 hour ago',
    collaboratorsCount: 2,
    thumbnailColor: 'from-emerald-900 to-slate-900',
    elements: [
      {
        id: 'flow-1',
        type: 'rounded-rect',
        x: 100,
        y: 120,
        width: 150,
        height: 60,
        strokeColor: '#10b981',
        fillColor: '#10b98120',
        strokeWidth: 2,
        strokeStyle: 'solid',
        opacity: 1,
        text: 'User Initiates Checkout',
        fontSize: 12,
        textColor: '#ffffff',
      },
      {
        id: 'flow-2',
        type: 'diamond',
        x: 320,
        y: 100,
        width: 120,
        height: 100,
        strokeColor: '#f59e0b',
        fillColor: '#f59e0b20',
        strokeWidth: 2,
        strokeStyle: 'solid',
        opacity: 1,
        text: 'Valid Currency\n& Geo IP?',
        fontSize: 11,
        textColor: '#ffffff',
      },
      {
        id: 'flow-3',
        type: 'arrow',
        x: 250,
        y: 150,
        width: 70,
        height: 0,
        strokeColor: '#94a3b8',
        fillColor: 'transparent',
        strokeWidth: 2,
        strokeStyle: 'solid',
        opacity: 1,
        points: [{ x: 250, y: 150 }, { x: 320, y: 150 }],
        arrowHead: 'end',
      },
      {
        id: 'flow-4',
        type: 'rounded-rect',
        x: 520,
        y: 120,
        width: 160,
        height: 60,
        strokeColor: '#06b6d4',
        fillColor: '#06b6d420',
        strokeWidth: 2,
        strokeStyle: 'solid',
        opacity: 1,
        text: 'Dynamic FX Conversion',
        fontSize: 12,
        textColor: '#ffffff',
      },
      {
        id: 'flow-5',
        type: 'arrow',
        x: 440,
        y: 150,
        width: 80,
        height: 0,
        strokeColor: '#94a3b8',
        fillColor: 'transparent',
        strokeWidth: 2,
        strokeStyle: 'solid',
        opacity: 1,
        points: [{ x: 440, y: 150 }, { x: 520, y: 150 }],
        arrowHead: 'end',
      }
    ],
  },
  {
    id: 'wb-3',
    title: 'Q4 CloudScale Database Relational Schema',
    category: 'ARCHITECTURE',
    lastEditedBy: 'Vikramaditya Singhania',
    lastEditedTime: 'Yesterday',
    collaboratorsCount: 4,
    thumbnailColor: 'from-purple-900 to-slate-900',
    elements: [],
  },
  {
    id: 'wb-4',
    title: 'Client Portal UX Wireframe & Navigation Journey',
    category: 'WIREFRAME',
    lastEditedBy: 'Marcus Sterling',
    lastEditedTime: '2 days ago',
    collaboratorsCount: 2,
    thumbnailColor: 'from-amber-900 to-slate-900',
    elements: [],
  }
];
