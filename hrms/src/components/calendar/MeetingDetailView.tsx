'use client';

import React, { useState, useMemo } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { 
  Video, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  FileText, 
  PenTool, 
  Sparkles, 
  MessageSquare, 
  CheckSquare, 
  Activity as ActivityIcon, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Plus, 
  Share2, 
  Search, 
  Edit3, 
  RotateCcw, 
  XCircle, 
  FileCode, 
  ChevronRight,
  Shield,
  Layers,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  Meeting, 
  MeetingParticipant, 
  MeetingAgendaItem, 
  MeetingActionItem, 
  INITIAL_MEETINGS 
} from '@/lib/calendar-meetings-data';
import { ScheduleMeetingModal } from './ScheduleMeetingModal';

interface MeetingDetailViewProps {
  meetingId?: string;
  onBack?: () => void;
}

type DetailTab = 
  | 'Overview' 
  | 'Participants' 
  | 'Agenda' 
  | 'Files' 
  | 'Whiteboard' 
  | 'Notes' 
  | 'Transcript' 
  | 'Action Items' 
  | 'Activity';

export const MeetingDetailView: React.FC<MeetingDetailViewProps> = ({ 
  meetingId = 'mtg-101', 
  onBack 
}) => {
  const { setActivePath, addToast } = useOfficeOS();

  // Find meeting or default to first meeting
  const initialMeeting = useMemo(() => {
    return INITIAL_MEETINGS.find(m => m.id === meetingId) || INITIAL_MEETINGS[0];
  }, [meetingId]);

  const [meeting, setMeeting] = useState<Meeting>(initialMeeting);
  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');
  const [isCopied, setIsCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Agenda interactive completion state
  const [agendaList, setAgendaList] = useState<MeetingAgendaItem[]>(meeting.agenda);
  const [newAgendaInput, setNewAgendaInput] = useState('');

  // Transcript search query
  const [transcriptSearch, setTranscriptSearch] = useState('');

  // Notes subtab
  const [notesSubTab, setNotesSubTab] = useState<'summary' | 'decisions' | 'actionItems' | 'requirements'>('summary');

  // Toggle Agenda Item Check
  const handleToggleAgenda = (id: string) => {
    setAgendaList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    }));
  };

  // Add Agenda Item
  const handleAddAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgendaInput.trim()) return;
    const newItem: MeetingAgendaItem = {
      id: `agenda-${Date.now()}`,
      title: newAgendaInput.trim(),
      completed: false
    };
    setAgendaList(prev => [...prev, newItem]);
    setNewAgendaInput('');
    addToast({
      title: 'Agenda Item Added',
      description: `"${newItem.title}" added to the agenda list.`,
      type: 'success'
    });
  };

  // Copy Meeting Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(meeting.meetUrl);
    setIsCopied(true);
    addToast({
      title: 'Meeting Link Copied',
      description: meeting.meetUrl,
      type: 'success'
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Filtered transcript entries
  const filteredTranscript = useMemo(() => {
    if (!meeting.transcript) return [];
    if (!transcriptSearch.trim()) return meeting.transcript;
    const q = transcriptSearch.toLowerCase();
    return meeting.transcript.filter(t => 
      t.speaker.toLowerCase().includes(q) || t.text.toLowerCase().includes(q)
    );
  }, [meeting.transcript, transcriptSearch]);

  // Invitation statistics
  const acceptedParticipants = meeting.participants.filter(p => p.invitationStatus === 'Accepted');
  const pendingParticipants = meeting.participants.filter(p => p.invitationStatus === 'Pending');
  const declinedParticipants = meeting.participants.filter(p => p.invitationStatus === 'Declined');

  const tabs: DetailTab[] = [
    'Overview',
    'Participants',
    'Agenda',
    'Files',
    'Whiteboard',
    'Notes',
    'Transcript',
    'Action Items',
    'Activity'
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header with Navigation and Quick Actions */}
      <PageHeader
        title={meeting.title}
        subtitle={`${meeting.type} • ${meeting.date} at ${meeting.startTime} (${meeting.duration})`}
        breadcrumbs={[
          { label: 'Communication', href: '/communication' },
          { label: 'Meetings', href: '/communication/meetings' },
          { label: meeting.title, href: `/communication/meetings/${meeting.id}` }
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {isCopied ? 'Copied' : 'Copy Link'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Edit
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActivePath(`/communication/meetings/${meeting.id}/room`)}
              className={meeting.status === 'Live' ? 'bg-rose-600 hover:bg-rose-700 animate-pulse font-bold' : ''}
              leftIcon={<Video className="w-3.5 h-3.5" />}
            >
              {meeting.status === 'Live' ? 'Join Live Room' : 'Enter Meeting'}
            </Button>
          </div>
        }
      />

      {/* Meeting Meta Banner */}
      <Card className="p-4 bg-gradient-to-r from-slate-50 via-indigo-50/20 to-purple-50/20 dark:from-slate-900 dark:via-indigo-950/20 dark:to-purple-950/20 border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {meeting.status === 'Live' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white font-bold text-xs animate-pulse shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                LIVE CALL ACTIVE
              </span>
            ) : (
              <Badge
                variant={meeting.status === 'Completed' ? 'success' : 'primary'}
                size="md"
              >
                {meeting.status}
              </Badge>
            )}

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />

            {meeting.project && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Project:</span>
                <button
                  onClick={() => setActivePath('/projects')}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  {meeting.project.name}
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {meeting.client && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Client:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {meeting.client.company}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <span>Organizer: <strong className="text-slate-900 dark:text-white">{meeting.organizer.name}</strong></span>
            <span>Timezone: <strong>{meeting.timezone}</strong></span>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation (9 tabs required by specification) */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'Overview' && <Layers className="w-3.5 h-3.5" />}
              {tab === 'Participants' && <Users className="w-3.5 h-3.5" />}
              {tab === 'Agenda' && <CheckSquare className="w-3.5 h-3.5" />}
              {tab === 'Files' && <FileText className="w-3.5 h-3.5" />}
              {tab === 'Whiteboard' && <PenTool className="w-3.5 h-3.5" />}
              {tab === 'Notes' && <Sparkles className="w-3.5 h-3.5" />}
              {tab === 'Transcript' && <MessageSquare className="w-3.5 h-3.5" />}
              {tab === 'Action Items' && <CheckSquare className="w-3.5 h-3.5" />}
              {tab === 'Activity' && <ActivityIcon className="w-3.5 h-3.5" />}
              <span>{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: OVERVIEW */}
      {/* ============================================================ */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description & Context */}
            <Card className="p-6 space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                Meeting Purpose & Overview
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {meeting.description}
              </p>

              {/* Connected Project Context Box */}
              {meeting.project && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                      Connected Project: {meeting.project.name}
                    </span>
                    <Badge variant="primary" size="sm">
                      {meeting.project.milestone}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Project Progress</span>
                      <span className="font-mono font-bold">{meeting.project.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${meeting.project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <span>Open Tasks: <strong>{meeting.project.openTasks}</strong></span>
                    <span>Pending Requirements: <strong>{meeting.project.pendingRequirements}</strong></span>
                    <button
                      onClick={() => setActivePath('/projects')}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Open Project Workspace &rarr;
                    </button>
                  </div>
                </div>
              )}
            </Card>

            {/* Quick Agenda Preview */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                  Agenda Items Preview ({agendaList.filter(a => a.completed).length} / {agendaList.length})
                </h4>
                <button
                  onClick={() => setActiveTab('Agenda')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Manage Agenda &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {agendaList.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleAgenda(item.id)}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3 cursor-pointer hover:border-indigo-400 transition"
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition ${
                        item.completed
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {item.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        item.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {idx + 1}. {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Settings, Links & Organizer */}
          <div className="space-y-6">
            {/* Join Link Card */}
            <Card className="p-5 space-y-4 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white border-indigo-800">
              <div className="flex items-center gap-2 text-indigo-400">
                <Video className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">Direct Video Meeting URL</h4>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 font-mono text-xs text-indigo-300 truncate">
                {meeting.meetUrl}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold"
                  onClick={() => setActivePath(`/communication/meetings/${meeting.id}/room`)}
                >
                  Join Meeting Room
                </Button>
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white transition"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </Card>

            {/* Organizer Card */}
            <Card className="p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meeting Organizer</h4>
              <div className="flex items-center gap-3">
                <img
                  src={meeting.organizer.avatar}
                  alt={meeting.organizer.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500"
                />
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                    {meeting.organizer.name}
                  </h5>
                  <p className="text-xs text-slate-500">{meeting.organizer.role}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-mono">{meeting.organizer.email}</p>
            </Card>

            {/* Meeting Settings Badges */}
            <Card className="p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Features & Preferences</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>Recording:</span>
                  <strong className={meeting.settings.recording ? 'text-rose-500' : 'text-slate-400'}>
                    {meeting.settings.recording ? 'ON' : 'OFF'}
                  </strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>Transcript:</span>
                  <strong className={meeting.settings.transcript ? 'text-purple-500' : 'text-slate-400'}>
                    {meeting.settings.transcript ? 'ON' : 'OFF'}
                  </strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>AI Notes:</span>
                  <strong className={meeting.settings.aiNotes ? 'text-indigo-500' : 'text-slate-400'}>
                    {meeting.settings.aiNotes ? 'ON' : 'OFF'}
                  </strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>Waiting Room:</span>
                  <strong className={meeting.settings.waitingRoom ? 'text-emerald-500' : 'text-slate-400'}>
                    {meeting.settings.waitingRoom ? 'ON' : 'OFF'}
                  </strong>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: PARTICIPANTS */}
      {/* ============================================================ */}
      {activeTab === 'Participants' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-indigo-600" />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Participant Invitations ({meeting.participants.length} Total)
                </h4>
                <p className="text-xs text-slate-500">
                  {acceptedParticipants.length} Accepted • {pendingParticipants.length} Pending • {declinedParticipants.length} Declined
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Invite More Participants
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {meeting.participants.map(p => (
              <Card key={p.id} className="p-5 flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                        {p.name}
                      </h5>
                      <Badge
                        variant={
                          p.invitationStatus === 'Accepted'
                            ? 'success'
                            : p.invitationStatus === 'Declined'
                            ? 'danger'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {p.invitationStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">{p.role}</p>
                    <p className="text-[11px] font-mono text-slate-400">{p.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500">
                    Role in meeting:{' '}
                    <strong className={p.isRequired ? 'text-indigo-600' : 'text-slate-600'}>
                      {p.isRequired ? 'Required' : 'Optional'}
                    </strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => addToast({ title: 'Direct Message', description: `Opened chat with ${p.name}.`, type: 'info' })}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                    >
                      Message
                    </button>
                    <button
                      onClick={() => addToast({ title: 'Profile View', description: `Opened ${p.name} employee file.`, type: 'info' })}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: AGENDA */}
      {/* ============================================================ */}
      {activeTab === 'Agenda' && (
        <Card className="p-6 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Meeting Agenda & Topic Discussion
              </h4>
              <p className="text-xs text-slate-500">
                Check off topics as they are discussed during the live meeting.
              </p>
            </div>
            <Badge variant="primary" size="md">
              {agendaList.filter(a => a.completed).length} / {agendaList.length} Completed
            </Badge>
          </div>

          <form onSubmit={handleAddAgenda} className="flex gap-2">
            <input
              type="text"
              placeholder="Add another agenda item or topic..."
              value={newAgendaInput}
              onChange={e => setNewAgendaInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button type="submit" variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Item
            </Button>
          </form>

          <div className="space-y-3">
            {agendaList.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-4 group hover:border-indigo-400 transition"
              >
                <div
                  onClick={() => handleToggleAgenda(item.id)}
                  className="flex items-center gap-3.5 cursor-pointer flex-1"
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                      item.completed
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'border-2 border-slate-300 dark:border-slate-600 group-hover:border-indigo-500'
                    }`}
                  >
                    {item.completed && <Check className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5
                      className={`text-sm font-bold ${
                        item.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {idx + 1}. {item.title}
                    </h5>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  {item.completed ? 'Discussed ✓' : 'Pending Discussion'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ============================================================ */}
      {/* TAB 4: FILES */}
      {/* ============================================================ */}
      {activeTab === 'Files' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Meeting Files & Attachments
              </h4>
              <p className="text-xs text-slate-500">
                Documents, design mockups, and client requirements connected to this session.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addToast({ title: 'Project Files', description: 'Fetched project assets directory.', type: 'info' })}
              >
                Select from Project Files
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => addToast({ title: 'Mock Upload', description: 'File added to meeting attachments.', type: 'success' })}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Upload File
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meeting.attachments.map((file, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-4 hover:border-indigo-400 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {file.name}
                    </h5>
                    <p className="text-xs text-slate-400 font-mono">{file.size} • {file.type}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <button
                    onClick={() => addToast({ title: 'File Preview', description: `Viewing ${file.name}.`, type: 'info' })}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => addToast({ title: 'Download Started', description: `Downloading ${file.name}.`, type: 'success' })}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ============================================================ */}
      {/* TAB 5: WHITEBOARD */}
      {/* ============================================================ */}
      {activeTab === 'Whiteboard' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {meeting.whiteboard?.title || 'Connected Meeting Whiteboard'}
                </h4>
                <p className="text-xs text-slate-500">
                  Interactive real-time Excalidraw canvas synchronized with meeting attendees.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addToast({ title: 'Whiteboard Link', description: 'Canvas invite link copied.', type: 'info' })}
                leftIcon={<Share2 className="w-3.5 h-3.5" />}
              >
                Share
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActivePath('/communication/whiteboards')}
                leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Open Full Whiteboard
              </Button>
            </div>
          </div>

          {/* Whiteboard Preview Thumbnail / Canvas */}
          <div className="w-full h-80 rounded-2xl bg-slate-900 text-white p-6 flex flex-col justify-between border border-slate-800 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Canvas Active • 3 Active Editors</span>
              <Badge variant="primary" size="sm">Excalidraw Engine</Badge>
            </div>

            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 max-w-md space-y-2">
                <div className="text-xs font-mono font-bold text-indigo-400">
                  [ABC Website Discussion Canvas]
                </div>
                <p className="text-xs text-slate-300">
                  Homepage Wireframe &rarr; Hero CTA Section &rarr; Client Approval Flow
                </p>
              </div>
              <p className="text-xs text-slate-500">
                Click below to launch the interactive vector whiteboard session.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-3 text-slate-400">
              <span>Last edited: 10 minutes ago by Rahul Sharma</span>
              <button
                onClick={() => setActivePath('/communication/whiteboards')}
                className="text-indigo-400 font-bold hover:underline"
              >
                Launch Whiteboard &rarr;
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* ============================================================ */}
      {/* TAB 6: NOTES (Mock AI Intelligence Notes) */}
      {/* ============================================================ */}
      {activeTab === 'Notes' && (
        <Card className="p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  AI Meeting Intelligence & Synthesis Notes
                </h4>
                <p className="text-xs text-slate-500">
                  Automatically generated summary, decisions, action items, and technical requirements.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => addToast({ title: 'Export Notes', description: 'Meeting summary downloaded as PDF.', type: 'success' })}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download Notes PDF
            </Button>
          </div>

          {/* Subtabs: Summary | Decisions | Action Items | Requirements */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            {[
              { id: 'summary', label: 'Executive Summary' },
              { id: 'decisions', label: 'Decisions Made' },
              { id: 'actionItems', label: 'Extracted Action Items' },
              { id: 'requirements', label: 'Technical Requirements' },
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setNotesSubTab(st.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  notesSubTab === st.id
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Subtab Content */}
          <div className="space-y-4">
            {notesSubTab === 'summary' && (
              <div className="p-5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-3">
                <h5 className="font-bold text-sm text-purple-950 dark:text-purple-200">
                  AI Executive Summary
                </h5>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {meeting.notes?.summary || 'Client expressed satisfaction with the overall wireframe direction and approved the desktop layout. Primary request is to simplify the mobile hamburger navigation and prioritize the primary conversion CTA.'}
                </p>
              </div>
            )}

            {notesSubTab === 'decisions' && (
              <div className="space-y-3">
                {(meeting.notes?.decisions || [
                  'Mobile menu will be simplified to 3 primary navigation links.',
                  'Client will provide updated high-resolution brand photography before Monday.',
                  'Beta staging release scheduled for 30 September 2026.'
                ]).map((d, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      {d}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {notesSubTab === 'actionItems' && (
              <div className="space-y-3">
                {(meeting.notes?.actionItems || []).map((ai, i) => (
                  <div
                    key={ai.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h6 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {ai.task}
                      </h6>
                      <p className="text-xs text-slate-500">
                        Assigned to: <strong>{ai.assignedTo}</strong> • Due: {ai.dueDate}
                      </p>
                    </div>
                    <Badge variant={ai.priority === 'Critical' ? 'danger' : 'warning'} size="sm">
                      {ai.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {notesSubTab === 'requirements' && (
              <div className="space-y-3">
                {(meeting.notes?.requirements || [
                  'New responsive mobile hamburger drawer with 60fps gesture physics.',
                  'WCAG AA color contrast compliance for call-to-action buttons.',
                  'Google Tag Manager event hooks on hero submission form.'
                ]).map((req, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3"
                  >
                    <FileCode className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      {req}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ============================================================ */}
      {/* TAB 7: TRANSCRIPT */}
      {/* ============================================================ */}
      {activeTab === 'Transcript' && (
        <Card className="p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Live Meeting Audio Transcription
              </h4>
              <p className="text-xs text-slate-500">
                Speaker diarized timestamps recorded during the session.
              </p>
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search transcript phrases..."
                value={transcriptSearch}
                onChange={e => setTranscriptSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredTranscript.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching transcript entries found.
              </div>
            ) : (
              filteredTranscript.map(entry => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={entry.avatar}
                        alt={entry.speaker}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500"
                      />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {entry.speaker}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {entry.time}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
                    {entry.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* ============================================================ */}
      {/* TAB 8: ACTION ITEMS */}
      {/* ============================================================ */}
      {activeTab === 'Action Items' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Extracted Action Items & Assigned Tasks
              </h4>
              <p className="text-xs text-slate-500">
                Actionable tasks linked to the sprint backlog and Kanban workspace.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActivePath('/my-work/tasks')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Create Task in Kanban
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Task Deliverable</th>
                  <th className="p-3">Assigned To</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(meeting.notes?.actionItems || []).map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {item.task}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {item.assignedAvatar && (
                          <img
                            src={item.assignedAvatar}
                            alt={item.assignedTo}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        )}
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {item.assignedTo}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-500">{item.dueDate}</td>
                    <td className="p-3">
                      <Badge variant={item.priority === 'Critical' ? 'danger' : 'warning'} size="sm">
                        {item.priority}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={item.status === 'Completed' ? 'success' : 'neutral'} size="sm">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActivePath('/my-work/tasks')}
                      >
                        View in Board
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ============================================================ */}
      {/* TAB 9: ACTIVITY */}
      {/* ============================================================ */}
      {activeTab === 'Activity' && (
        <Card className="p-6 space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              Meeting Lifecycle Activity
            </h4>
            <p className="text-xs text-slate-500">
              Audit log of scheduling, invitations, file uploads, and session milestones.
            </p>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {meeting.activity.map((act, i) => (
              <div key={i} className="relative flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center -ml-6 ring-4 ring-white dark:ring-slate-900 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {act.action}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Initiated by {act.user}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reusable Schedule/Edit Modal */}
      <ScheduleMeetingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialDate={meeting.date}
        initialTime={meeting.startTime}
        onScheduled={(updated: Meeting) => {
          setMeeting(updated);
          addToast({
            title: 'Meeting Updated',
            description: `Changes saved for "${updated.title}".`,
            type: 'success'
          });
        }}
      />
    </div>
  );
};
