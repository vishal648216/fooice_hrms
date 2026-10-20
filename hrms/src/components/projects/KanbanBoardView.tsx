'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { EXTENDED_TASKS, EXTENDED_PROJECTS } from '@/lib/projects-data';
import { MOCK_USERS } from '@/lib/officeos-data';
import { TaskStatus, Priority } from '@/types/officeos';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Kanban, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  MessageSquare, 
  Paperclip, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  User as UserIcon,
  Sparkles,
  Tag,
  CheckSquare,
  ArrowRight,
  Eye,
  X
} from 'lucide-react';

interface ColumnDef {
  id: TaskStatus;
  title: string;
  badgeColor: string;
  borderColor: string;
}

const COLUMNS: ColumnDef[] = [
  { id: 'BACKLOG', title: 'Backlog', badgeColor: 'bg-slate-500/10 text-slate-500 dark:text-slate-400', borderColor: 'border-t-slate-400' },
  { id: 'TODO', title: 'To Do', badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', borderColor: 'border-t-blue-500' },
  { id: 'IN_PROGRESS', title: 'In Progress', badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', borderColor: 'border-t-indigo-500' },
  { id: 'IN_REVIEW', title: 'In Code Review', badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', borderColor: 'border-t-purple-500' },
  { id: 'CLIENT_APPROVAL', title: 'Client Sign-off', badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', borderColor: 'border-t-amber-500' },
  { id: 'DONE', title: 'Completed', badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', borderColor: 'border-t-emerald-500' }
];

export const KanbanBoardView: React.FC = () => {
  const { addToast } = useOfficeOS();
  const [tasks, setTasks] = useState(EXTENDED_TASKS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<typeof EXTENDED_TASKS[0] | null>(null);

  // New Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newProjectId, setNewProjectId] = useState(EXTENDED_PROJECTS[0].id);
  const [newPriority, setNewPriority] = useState<Priority>('HIGH');
  const [newStatus, setNewStatus] = useState<TaskStatus>('TODO');
  const [newDueDate, setNewDueDate] = useState('2026-10-15');
  const [newEstHours, setNewEstHours] = useState(16);
  const [newLabels, setNewLabels] = useState('Frontend, Security');

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesProj = selectedProjectId === 'ALL' || t.projectId === selectedProjectId;
    const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
    const matchesAssignee = selectedAssignee === 'ALL' || t.assignee.id === selectedAssignee;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.labels.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesProj && matchesPriority && matchesAssignee && matchesSearch;
  });

  // Move task status
  const moveTaskStatus = (taskId: string, targetStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: targetStatus };
      }
      return t;
    }));

    if (selectedTaskDetail && selectedTaskDetail.id === taskId) {
      setSelectedTaskDetail(prev => prev ? { ...prev, status: targetStatus } : null);
    }

    addToast({
      title: 'Task Status Updated',
      description: `Task moved to ${targetStatus.replace('_', ' ')}`,
      type: 'info'
    });
  };

  // Toggle subtask in detail drawer
  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    }));

    if (selectedTaskDetail && selectedTaskDetail.id === taskId) {
      setSelectedTaskDetail(prev => {
        if (!prev) return null;
        return {
          ...prev,
          subtasks: prev.subtasks.map(st => 
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          )
        };
      });
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const proj = EXTENDED_PROJECTS.find(p => p.id === newProjectId) || EXTENDED_PROJECTS[0];
    const newTask = {
      id: `tsk-${Date.now()}`,
      title: newTitle,
      code: `${proj.code}-${Math.floor(10 + Math.random() * 90)}`,
      description: newDescription || 'Standard development deliverable.',
      projectId: proj.id,
      projectName: proj.name,
      assignee: MOCK_USERS.employee,
      reporter: MOCK_USERS.manager,
      priority: newPriority,
      status: newStatus,
      dueDate: newDueDate,
      estimatedHours: Number(newEstHours),
      loggedHours: 0,
      labels: newLabels.split(',').map(s => s.trim()),
      commentsCount: 0,
      attachmentsCount: 0,
      sprint: 'Sprint 14',
      subtasks: [
        { id: `st-${Date.now()}-1`, title: 'Implement feature component architecture', completed: false },
        { id: `st-${Date.now()}-2`, title: 'Pass unit and integration test verification', completed: false }
      ]
    };

    setTasks(prev => [newTask, ...prev]);
    setShowCreateTaskModal(false);
    setNewTitle('');
    setNewDescription('');
    addToast({
      title: 'Task Created',
      description: `Task ${newTask.code} placed into ${newStatus.replace('_', ' ')}`,
      type: 'success'
    });
  };

  const priorityBadges = {
    URGENT: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300',
    HIGH: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
    MEDIUM: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
    LOW: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
  };

  return (
    <div className="space-y-5">
      {/* Board Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Project Filter */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Projects (Portfolio)</option>
            {EXTENDED_PROJECTS.map(p => (
              <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent 🔥</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Assignees</option>
            <option value="usr-3">Arjun Nambiar (Dev Lead)</option>
            <option value="usr-2">Sarah Montgomery (VP Eng)</option>
            <option value="usr-1">Alexander Vance (Exec)</option>
          </select>
        </div>

        {/* Search & Create Task Action */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 lg:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, codes, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateTaskModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Kanban Multi-Column Scrollable Canvas */}
      <div className="flex gap-4 overflow-x-auto pb-6 items-start">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`w-72 xl:w-80 shrink-0 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 border-t-4 ${col.borderColor} p-3 space-y-3`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {col.title}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setNewStatus(col.id);
                    setShowCreateTaskModal(true);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                  title={`Add task to ${col.title}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks List in Column */}
              <div className="space-y-3 min-h-[400px]">
                {colTasks.length === 0 ? (
                  <div className="py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-4 text-slate-400">
                    <span className="text-xs">No tasks in {col.title}</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                    const subtaskPercent = task.subtasks.length > 0 
                      ? Math.round((completedSubtasks / task.subtasks.length) * 100) 
                      : 0;

                    return (
                      <Card
                        key={task.id}
                        hoverable
                        className="p-4 space-y-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 shadow-sm cursor-pointer group"
                        onClick={() => setSelectedTaskDetail(task)}
                      >
                        {/* Task Code & Priority */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {task.code}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityBadges[task.priority]}`}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {task.title}
                        </h4>

                        {/* Labels */}
                        <div className="flex flex-wrap gap-1">
                          {task.labels.map((l, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                              #{l}
                            </span>
                          ))}
                        </div>

                        {/* Subtasks Progress Bar */}
                        {task.subtasks.length > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>Subtasks ({completedSubtasks}/{task.subtasks.length})</span>
                              <span className="font-mono">{subtaskPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full transition-all"
                                style={{ width: `${subtaskPercent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Footer: Assignee, Due Date & Move Controls */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={task.assignee.avatar}
                              alt={task.assignee.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                              {task.assignee.name.split(' ')[0]}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono text-slate-400">
                              {task.dueDate.split('-').slice(1).join('/')}
                            </span>

                            {/* Quick Status Shift Controls */}
                            <div className="flex items-center ml-1" onClick={(e) => e.stopPropagation()}>
                              {col.id !== 'BACKLOG' && (
                                <button
                                  onClick={() => {
                                    const colIdx = COLUMNS.findIndex(c => c.id === col.id);
                                    if (colIdx > 0) moveTaskStatus(task.id, COLUMNS[colIdx - 1].id);
                                  }}
                                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
                                  title="Move to previous column"
                                >
                                  <ChevronLeft className="w-3 h-3" />
                                </button>
                              )}
                              {col.id !== 'DONE' && (
                                <button
                                  onClick={() => {
                                    const colIdx = COLUMNS.findIndex(c => c.id === col.id);
                                    if (colIdx < COLUMNS.length - 1) moveTaskStatus(task.id, COLUMNS[colIdx + 1].id);
                                  }}
                                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                                  title="Advance to next column"
                                >
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Drawer */}
      {selectedTaskDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  {selectedTaskDetail.code}
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded border ${priorityBadges[selectedTaskDetail.priority]}`}>
                  {selectedTaskDetail.priority} Priority
                </span>
              </div>
              <button
                onClick={() => setSelectedTaskDetail(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Task Title and Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedTaskDetail.title}
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                {selectedTaskDetail.description}
              </div>
            </div>

            {/* Pipeline Status Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Pipeline State</label>
              <div className="grid grid-cols-3 gap-2">
                {COLUMNS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => moveTaskStatus(selectedTaskDetail.id, c.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedTaskDetail.status === c.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtask Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Acceptance Subtask Checklist
                </h3>
                <span className="text-xs font-mono font-bold text-indigo-600">
                  {selectedTaskDetail.subtasks.filter(s => s.completed).length} of {selectedTaskDetail.subtasks.length} Completed
                </span>
              </div>

              <div className="space-y-2">
                {selectedTaskDetail.subtasks.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => toggleSubtask(selectedTaskDetail.id, st.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      st.completed
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-slate-500 line-through'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${st.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                      {st.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-medium">{st.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time & Assignment Metadata */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400">Assignee:</span>
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <img src={selectedTaskDetail.assignee.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  <span>{selectedTaskDetail.assignee.name}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400">Due Date:</span>
                <div className="font-bold text-slate-900 dark:text-white font-mono">
                  {selectedTaskDetail.dueDate}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400">Time Logged:</span>
                <div className="font-bold text-slate-900 dark:text-white font-mono">
                  {selectedTaskDetail.loggedHours}h / {selectedTaskDetail.estimatedHours}h Est.
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400">Sprint:</span>
                <div className="font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedTaskDetail.sprint}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  addToast({ title: 'Logged 1.5h', description: 'Timesheet entry registered.', type: 'success' });
                }}
              >
                + Log 1.5h Work
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedTaskDetail(null)}
              >
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Create Sprint Task</h3>
              </div>
              <button
                onClick={() => setShowCreateTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement WebRTC Screen Sharing & Diagnostics"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Target Project</label>
                  <select
                    value={newProjectId}
                    onChange={(e) => setNewProjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {EXTENDED_PROJECTS.map(p => (
                      <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="URGENT">Urgent 🔥</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Initial Column</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {COLUMNS.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Est. Hours</label>
                  <input
                    type="number"
                    min="1"
                    value={newEstHours}
                    onChange={(e) => setNewEstHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Description & Technical Scope</label>
                <textarea
                  rows={3}
                  placeholder="Outline key architectural specs and verification steps..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Labels (comma separated)</label>
                <input
                  type="text"
                  placeholder="Frontend, Security, WebRTC"
                  value={newLabels}
                  onChange={(e) => setNewLabels(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowCreateTaskModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Add Task to Board
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
