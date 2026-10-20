export type Role = 'ADMIN' | 'MANAGER' | 'USER';

export type TaskStatus = 
  | 'TODO'
  | 'IN_PROGRESS'
  | 'SUBMITTED_FOR_REVIEW'
  | 'APPROVED'
  | 'NEED_EDITS';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  status: 'ACTIVE' | 'BLOCKED';
  groupId?: string;
  groupName?: string;
  joinedDate: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  onlyAdminCanSend: boolean;
  memberCount: number;
  members: string[]; // User IDs
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedToUserId: string;
  assignedToName: string;
  assignedByUserId: string;
  assignedByName: string;
  deadline: string;
  status: TaskStatus;
  priority: TaskPriority;
  submissionNotes?: string;
  reviewNotes?: string;
  submittedAt?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  senderAvatar: string;
  content: string;
  fileName?: string;
  fileSize?: string;
  fileType?: 'image' | 'document' | 'video';
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  meetLink: string;
  groupId: string;
  groupName: string;
  createdByName: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: Role;
  targetGroup: string;
  priority: 'NORMAL' | 'IMPORTANT';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  performedBy: string;
  role: Role;
  details: string;
  timestamp: string;
}
