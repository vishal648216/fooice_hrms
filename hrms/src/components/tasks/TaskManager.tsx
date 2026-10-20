'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  X, 
  FileText, 
  User as UserIcon, 
  Calendar,
  Send,
  RotateCcw,
  Check,
  Filter
} from 'lucide-react';

export default function TaskManager() {
  const { currentRole, currentUser, users, tasks, createTask, submitWork, reviewTask } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<Task | null>(null);
  const [selectedTaskForSubmit, setSelectedTaskForSubmit] = useState<Task | null>(null);

  // Form states for creating task
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssignee, setNewAssignee] = useState(users.find(u => u.role === 'USER')?.id || '');
  const [newDeadline, setNewDeadline] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('MEDIUM');

  // Review states
  const [reviewNotes, setReviewNotes] = useState('');
  
  // Submit work state
  const [submissionNotes, setSubmissionNotes] = useState('');

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'MY_TASKS') return t.assignedToUserId === currentUser.id;
    if (activeFilter === 'TODO') return t.status === 'TODO';
    if (activeFilter === 'IN_PROGRESS') return t.status === 'IN_PROGRESS';
    if (activeFilter === 'SUBMITTED_FOR_REVIEW') return t.status === 'SUBMITTED_FOR_REVIEW';
    if (activeFilter === 'APPROVED') return t.status === 'APPROVED';
    if (activeFilter === 'NEED_EDITS') return t.status === 'NEED_EDITS';
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAssignee) return;

    createTask({
      title: newTitle,
      description: newDescription,
      assignedToUserId: newAssignee,
      assignedToName: '',
      deadline: newDeadline || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      priority: newPriority,
      status: 'TODO',
    });

    setNewTitle('');
    setNewDescription('');
    setShowCreateModal(false);
  };

  const handleReviewSubmit = (approved: boolean) => {
    if (!selectedTaskForReview) return;
    reviewTask(selectedTaskForReview.id, approved, reviewNotes || (approved ? 'Work approved by manager.' : 'Need revisions before final approval.'));
    setSelectedTaskForReview(null);
    setReviewNotes('');
  };

  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForSubmit) return;
    submitWork(selectedTaskForSubmit.id, submissionNotes || 'Deliverables submitted for review.');
    setSelectedTaskForSubmit(null);
    setSubmissionNotes('');
  };

  const statusBadges: Record<TaskStatus, { bg: string; label: string; icon: React.ReactNode }> = {
    TODO: { bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', label: 'To Do', icon: <Clock className="w-3.5 h-3.5" /> },
    IN_PROGRESS: { bg: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', label: 'In Progress', icon: <Clock className="w-3.5 h-3.5" /> },
    SUBMITTED_FOR_REVIEW: { bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', label: 'Pending Review', icon: <AlertCircle className="w-3.5 h-3.5" /> },
    APPROVED: { bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', label: 'Approved & Done', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    NEED_EDITS: { bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300', label: 'Needs Edits', icon: <RotateCcw className="w-3.5 h-3.5" /> },
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Title and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Work & Task Management</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {tasks.length} Total
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete lifecycle: Create &rarr; Set Deadline &rarr; Submit Work &rarr; Review &rarr; Approve / Need Edits
          </p>
        </div>

        {(currentRole === 'ADMIN' || currentRole === 'MANAGER') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'ALL', label: 'All Tasks' },
          { id: 'MY_TASKS', label: 'Assigned to Me' },
          { id: 'SUBMITTED_FOR_REVIEW', label: 'Awaiting Review' },
          { id: 'IN_PROGRESS', label: 'In Progress' },
          { id: 'NEED_EDITS', label: 'Need Edits' },
          { id: 'APPROVED', label: 'Approved' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTasks.map((task) => {
          const badge = statusBadges[task.status] || statusBadges.TODO;
          const isAssignedToMe = task.assignedToUserId === currentUser.id;
          const canReview = (currentRole === 'MANAGER' || currentRole === 'ADMIN') && task.status === 'SUBMITTED_FOR_REVIEW';
          const canSubmit = isAssignedToMe && (task.status === 'IN_PROGRESS' || task.status === 'TODO' || task.status === 'NEED_EDITS');

          return (
            <div
              key={task.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Status and Priority */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${badge.bg}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${
                    task.priority === 'URGENT' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                    task.priority === 'HIGH' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Submission or Review Notes alerts */}
                {task.submissionNotes && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Submitted Notes: </span>
                    <span className="text-slate-600 dark:text-slate-400">{task.submissionNotes}</span>
                  </div>
                )}

                {task.reviewNotes && (
                  <div className={`p-2.5 rounded-xl border text-xs ${
                    task.status === 'APPROVED' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
                  }`}>
                    <span className="font-bold">Manager Feedback: </span>
                    <span>{task.reviewNotes}</span>
                  </div>
                )}
              </div>

              {/* Footer: Assignee, Deadline & Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.assignedToName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.deadline}</span>
                  </div>
                </div>

                {/* Action Buttons based on Role & State */}
                {canSubmit && (
                  <button
                    onClick={() => setSelectedTaskForSubmit(task)}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Work for Approval</span>
                  </button>
                )}

                {canReview && (
                  <button
                    onClick={() => setSelectedTaskForReview(task)}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Review Work (Approve / Edits)</span>
                  </button>
                )}

                {task.status === 'APPROVED' && (
                  <div className="py-1.5 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Verified & Approved</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal 1: Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create New Task</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Role-Based Access Control"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail instructions, acceptance criteria, deliverables..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assign To User *
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deadline Date
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                >
                  Assign & Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Submit Work Modal (User Action) */}
      {selectedTaskForSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Submit Work for Review</h2>
                <p className="text-xs text-slate-500">{selectedTaskForSubmit.title}</p>
              </div>
              <button onClick={() => setSelectedTaskForSubmit(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Submission Notes / Links
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain what was completed, attach branch/PR links or documentation notes..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForSubmit(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Manager</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Review Work Modal (Manager Action - Approve vs Need Edits) */}
      {selectedTaskForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Review Work Submission</h2>
                <p className="text-xs text-slate-500">{selectedTaskForReview.title}</p>
              </div>
              <button onClick={() => setSelectedTaskForReview(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 block mb-1">User's Submission Notes:</span>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                {selectedTaskForReview.submissionNotes || 'No notes provided by user.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Review Feedback / Revision Instructions
              </label>
              <textarea
                rows={3}
                placeholder="Give feedback or detail why changes are needed..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTaskForReview(null)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                {/* Need Edits Decision (Excalidraw Diagram Module 6) */}
                <button
                  type="button"
                  onClick={() => handleReviewSubmit(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Need Edits (Reject)</span>
                </button>

                {/* Approved Decision */}
                <button
                  type="button"
                  onClick={() => handleReviewSubmit(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Work</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
