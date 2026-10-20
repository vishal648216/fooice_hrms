'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Role, 
  User, 
  Group, 
  Task, 
  Message, 
  Meeting, 
  Announcement, 
  ActivityLog, 
  TaskStatus 
} from '@/types';
import { 
  INITIAL_USERS, 
  INITIAL_GROUPS, 
  INITIAL_TASKS, 
  INITIAL_MESSAGES, 
  INITIAL_MEETINGS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_ACTIVITY_LOGS 
} from '@/lib/mock-data';

interface AppContextType {
  currentRole: Role;
  currentUser: User;
  users: User[];
  groups: Group[];
  tasks: Task[];
  messages: Message[];
  meetings: Meeting[];
  announcements: Announcement[];
  activityLogs: ActivityLog[];
  dbStatus: 'CONNECTED' | 'RETRYING';
  setCurrentRole: (role: Role) => void;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'assignedByName' | 'assignedByUserId'>) => void;
  submitWork: (taskId: string, submissionNotes: string) => void;
  reviewTask: (taskId: string, approved: boolean, reviewNotes: string) => void;
  toggleGroupPermission: (groupId: string) => void;
  sendMessage: (groupId: string, content: string, file?: { name: string; size: string; type: 'image' | 'document' | 'video' }) => boolean;
  createMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'createdByName'>) => void;
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'authorName' | 'authorRole'>) => void;
  toggleUserBlock: (userId: string) => void;
  deleteUser: (userId: string) => void;
  retryDbConnection: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRoleState] = useState<Role>('ADMIN');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [dbStatus, setDbStatus] = useState<'CONNECTED' | 'RETRYING'>('CONNECTED');

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('app_role') as Role;
      if (savedRole) setCurrentRoleState(savedRole);
    } catch {}
  }, []);

  const setCurrentRole = (role: Role) => {
    setCurrentRoleState(role);
    try {
      localStorage.setItem('app_role', role);
    } catch {}
  };

  // Find active user object according to current role
  const currentUser = users.find(u => u.role === currentRole) || users[0];

  const logActivity = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action,
      performedBy: currentUser.name,
      role: currentRole,
      details,
      timestamp: 'Just now',
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'assignedByName' | 'assignedByUserId'>) => {
    const assignedUser = users.find(u => u.id === taskData.assignedToUserId);
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      assignedByName: `${currentUser.name} (${currentRole === 'ADMIN' ? 'Admin' : 'Manager'})`,
      assignedByUserId: currentUser.id,
      assignedToName: assignedUser ? assignedUser.name : 'Unassigned',
      status: 'TODO',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [newTask, ...prev]);
    logActivity('Task Created', `Created task "${newTask.title}" assigned to ${newTask.assignedToName}`);
  };

  const submitWork = (taskId: string, submissionNotes: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'SUBMITTED_FOR_REVIEW' as TaskStatus,
          submissionNotes,
          submittedAt: new Date().toISOString().split('T')[0],
        };
      }
      return t;
    }));
    logActivity('Work Submitted', `Submitted work on task for Manager review`);
  };

  const reviewTask = (taskId: string, approved: boolean, reviewNotes: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: (approved ? 'APPROVED' : 'NEED_EDITS') as TaskStatus,
          reviewNotes,
          approvedAt: approved ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return t;
    }));
    logActivity(
      approved ? 'Task Approved' : 'Task Requested Edits',
      `${approved ? 'Approved' : 'Sent back for edits'}: ${reviewNotes}`
    );
  };

  const toggleGroupPermission = (groupId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const updatedSetting = !g.onlyAdminCanSend;
        logActivity(
          'Group Permission Changed',
          `Changed "${g.name}" chat rule to: ${updatedSetting ? 'Only Admin Can Send' : 'Everyone Can Send'}`
        );
        return { ...g, onlyAdminCanSend: updatedSetting };
      }
      return g;
    }));
  };

  const sendMessage = (groupId: string, content: string, file?: { name: string; size: string; type: 'image' | 'document' | 'video' }): boolean => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return false;

    // Check permissions according to Excalidraw rule
    if (group.onlyAdminCanSend && currentRole !== 'ADMIN') {
      return false; // Permission blocked!
    }

    // Check if user is blocked
    if (currentUser.status === 'BLOCKED') {
      return false;
    }

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      groupId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      content,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    return true;
  };

  const createMeeting = (meetingData: Omit<Meeting, 'id' | 'createdAt' | 'createdByName'>) => {
    const group = groups.find(g => g.id === meetingData.groupId);
    const newMeeting: Meeting = {
      ...meetingData,
      id: `meet-${Date.now()}`,
      groupName: group ? group.name : 'All Teams',
      createdByName: `${currentUser.name} (${currentRole})`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMeetings(prev => [newMeeting, ...prev]);
    logActivity('Meeting Scheduled', `Created Google Meet call "${newMeeting.title}" for ${newMeeting.groupName}`);
  };

  const createAnnouncement = (annData: Omit<Announcement, 'id' | 'createdAt' | 'authorName' | 'authorRole'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentRole,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    logActivity('Announcement Broadcast', `Published announcement: "${newAnn.title}"`);
  };

  const toggleUserBlock = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
        logActivity(
          nextStatus === 'BLOCKED' ? 'User Blocked' : 'User Unblocked',
          `${nextStatus === 'BLOCKED' ? 'Blocked' : 'Unblocked'} user ${u.name}`
        );
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const deleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (target) {
      logActivity('User Deleted', `Removed user ${target.name} from the system`);
    }
  };

  const retryDbConnection = () => {
    setDbStatus('RETRYING');
    setTimeout(() => {
      setDbStatus('CONNECTED');
    }, 1200);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUser,
        users,
        groups,
        tasks,
        messages,
        meetings,
        announcements,
        activityLogs,
        dbStatus,
        setCurrentRole,
        createTask,
        submitWork,
        reviewTask,
        toggleGroupPermission,
        sendMessage,
        createMeeting,
        createAnnouncement,
        toggleUserBlock,
        deleteUser,
        retryDbConnection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
