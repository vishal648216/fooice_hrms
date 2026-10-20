'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { 
  X, 
  CheckSquare, 
  FolderGit2, 
  Building2, 
  Video, 
  FileCheck, 
  GitPullRequest, 
  CreditCard, 
  Receipt, 
  Users, 
  PenTool, 
  LifeBuoy,
  ArrowRight,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScheduleMeetingModal } from '@/components/calendar/ScheduleMeetingModal';
import { Meeting } from '@/lib/calendar-meetings-data';

interface QuickOption {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  targetPath: string;
}

export const QuickCreateModal: React.FC = () => {
  const { isQuickCreateOpen, setQuickCreateOpen, setActivePath, addToast } = useOfficeOS();
  const [selectedOption, setSelectedOption] = useState<QuickOption | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  if (!isQuickCreateOpen && !isMeetingModalOpen) return null;

  if (!isQuickCreateOpen && isMeetingModalOpen) {
    return (
      <ScheduleMeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        onScheduled={(newMtg: Meeting) => {
          setActivePath(`/communication/meetings/${newMtg.id}`);
        }}
      />
    );
  }

  const quickOptions: QuickOption[] = [
    {
      id: 'task',
      title: 'New Task',
      description: 'Create an actionable task item with assignee & due date',
      category: 'Work',
      icon: <CheckSquare className="w-5 h-5 text-indigo-600" />,
      targetPath: '/my-work/tasks',
    },
    {
      id: 'project',
      title: 'New Project',
      description: 'Initialize a client project workspace and milestone timeline',
      category: 'Projects',
      icon: <FolderGit2 className="w-5 h-5 text-blue-600" />,
      targetPath: '/projects',
    },
    {
      id: 'client',
      title: 'New Client',
      description: 'Onboard a new enterprise customer or account partner',
      category: 'Clients',
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
      targetPath: '/clients',
    },
    {
      id: 'meeting',
      title: 'New Meeting',
      description: 'Schedule a Google Meet / WebRTC sync with AI notes',
      category: 'Communication',
      icon: <Video className="w-5 h-5 text-rose-600" />,
      targetPath: '/communication/meetings',
    },
    {
      id: 'requirement',
      title: 'New Requirement',
      description: 'Document an engineering deliverable or spec requirement',
      category: 'Projects',
      icon: <FileCheck className="w-5 h-5 text-teal-600" />,
      targetPath: '/projects/requirements',
    },
    {
      id: 'change-request',
      title: 'New Change Request',
      description: 'Submit an architectural or scope change for client review',
      category: 'Projects',
      icon: <GitPullRequest className="w-5 h-5 text-amber-600" />,
      targetPath: '/projects/change-requests',
    },
    {
      id: 'payment',
      title: 'New Payment',
      description: 'Record an incoming client wire or outgoing expense disbursement',
      category: 'Finance',
      icon: <CreditCard className="w-5 h-5 text-purple-600" />,
      targetPath: '/finance/payments',
    },
    {
      id: 'invoice',
      title: 'New Invoice',
      description: 'Generate an itemized enterprise invoice PDF for client billing',
      category: 'Finance',
      icon: <Receipt className="w-5 h-5 text-indigo-600" />,
      targetPath: '/finance/invoices',
    },
    {
      id: 'group',
      title: 'New Group',
      description: 'Create a cross-functional department channel or sprint squad',
      category: 'Communication',
      icon: <Users className="w-5 h-5 text-sky-600" />,
      targetPath: '/communication/groups',
    },
    {
      id: 'whiteboard',
      title: 'New Whiteboard',
      description: 'Open a collaborative Excalidraw vector diagram canvas',
      category: 'Communication',
      icon: <PenTool className="w-5 h-5 text-pink-600" />,
      targetPath: '/communication/whiteboards',
    },
    {
      id: 'support-ticket',
      title: 'New Support Ticket',
      description: 'Log an internal issue or client SLA priority ticket',
      category: 'Support',
      icon: <LifeBuoy className="w-5 h-5 text-orange-600" />,
      targetPath: '/clients/support-tickets',
    },
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) return;

    addToast({
      title: `${selectedOption.title} Created`,
      description: `"${titleInput || 'Untitled Item'}" successfully initialized in ${selectedOption.category}.`,
      type: 'success',
    });

    setActivePath(selectedOption.targetPath);
    setQuickCreateOpen(false);
    setSelectedOption(null);
    setTitleInput('');
    setDescInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {selectedOption ? `Create ${selectedOption.title}` : 'Quick Create'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedOption ? 'Fill in item details or navigate directly to full form' : 'Choose an enterprise entity to create'}
            </p>
          </div>
          <button
            onClick={() => {
              if (selectedOption) setSelectedOption(null);
              else setQuickCreateOpen(false);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {!selectedOption ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    if (opt.id === 'meeting') {
                      setQuickCreateOpen(false);
                      setIsMeetingModalOpen(true);
                    } else {
                      setSelectedOption(opt);
                    }
                  }}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-all flex items-start gap-3.5 group"
                >
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-900 group-hover:scale-105 transition shadow-2xs shrink-0 mt-0.5">
                    {opt.icon}
                  </div>
                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {opt.title}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        {opt.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {opt.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                {selectedOption.icon}
                <span>Creating {selectedOption.title} under {selectedOption.category}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Title / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder={`e.g. ${selectedOption.title} item description...`}
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Summary / Scope Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Add initial criteria, timeline or requirements..."
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOption(null)}
                >
                  Back to List
                </Button>

                <Button type="submit" variant="primary" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
                  Save & Open
                </Button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
