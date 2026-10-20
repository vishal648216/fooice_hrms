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
  Search, 
  Filter, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  FileText, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  Layers, 
  Bot, 
  SlidersHorizontal,
  ChevronDown,
  X,
  ExternalLink,
  Bell
} from 'lucide-react';
import { 
  Meeting, 
  INITIAL_MEETINGS 
} from '@/lib/calendar-meetings-data';
import { ScheduleMeetingModal } from './ScheduleMeetingModal';

type MeetingTab = 'Upcoming' | 'Today' | 'Past' | 'Cancelled';

export const MeetingsListView: React.FC = () => {
  const { setActivePath, addToast } = useOfficeOS();

  // State
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [activeTab, setActiveTab] = useState<MeetingTab>('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'nearest' | 'project' | 'client' | 'organizer'>('nearest');
  const [filterProject, setFilterProject] = useState('all');

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [rescheduleMeeting, setRescheduleMeeting] = useState<Meeting | null>(null);
  const [newDate, setNewDate] = useState('2026-09-26');
  const [newTime, setNewTime] = useState('02:00 PM');
  const [newDuration, setNewDuration] = useState('45 minutes');
  const [rescheduleReason, setRescheduleReason] = useState('');

  const [cancelMeeting, setCancelMeeting] = useState<Meeting | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Simulated Reminder Banner State
  const [showReminderBanner, setShowReminderBanner] = useState(true);

  // Filtered & Sorted meetings
  const filteredMeetings = useMemo(() => {
    return meetings
      .filter(m => {
        // Tab filter
        if (activeTab === 'Upcoming') {
          return m.status === 'Upcoming' || m.status === 'Live';
        }
        if (activeTab === 'Today') {
          return m.date === '2026-09-25';
        }
        if (activeTab === 'Past') {
          return m.status === 'Completed';
        }
        if (activeTab === 'Cancelled') {
          return m.status === 'Cancelled';
        }
        return true;
      })
      .filter(m => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = m.title.toLowerCase().includes(q);
          const matchProject = m.project?.name.toLowerCase().includes(q);
          const matchClient = m.client?.company.toLowerCase().includes(q);
          const matchOrg = m.organizer.name.toLowerCase().includes(q);
          return matchTitle || matchProject || matchClient || matchOrg;
        }
        return true;
      })
      .filter(m => {
        if (filterProject !== 'all' && m.project?.name !== filterProject) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nearest') {
          // Live first, then date/time
          if (a.status === 'Live') return -1;
          if (b.status === 'Live') return 1;
          return a.date.localeCompare(b.date);
        }
        if (sortBy === 'project') {
          return (a.project?.name || '').localeCompare(b.project?.name || '');
        }
        if (sortBy === 'client') {
          return (a.client?.company || '').localeCompare(b.client?.company || '');
        }
        if (sortBy === 'organizer') {
          return a.organizer.name.localeCompare(b.organizer.name);
        }
        return 0;
      });
  }, [meetings, activeTab, searchQuery, filterProject, sortBy]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      Upcoming: meetings.filter(m => m.status === 'Upcoming' || m.status === 'Live').length,
      Today: meetings.filter(m => m.date === '2026-09-25').length,
      Past: meetings.filter(m => m.status === 'Completed').length,
      Cancelled: meetings.filter(m => m.status === 'Cancelled').length
    };
  }, [meetings]);

  // Handle Reschedule
  const handleConfirmReschedule = () => {
    if (!rescheduleMeeting) return;
    setMeetings(prev => prev.map(m => {
      if (m.id === rescheduleMeeting.id) {
        return {
          ...m,
          date: newDate,
          startTime: newTime,
          duration: newDuration,
          status: 'Upcoming'
        };
      }
      return m;
    }));
    addToast({
      title: 'Meeting Rescheduled Successfully',
      description: `"${rescheduleMeeting.title}" has been moved to ${newDate} at ${newTime}. Participants notified via calendar sync.`,
      type: 'success'
    });
    setRescheduleMeeting(null);
    setRescheduleReason('');
  };

  // Handle Cancel
  const handleConfirmCancel = () => {
    if (!cancelMeeting) return;
    setMeetings(prev => prev.map(m => {
      if (m.id === cancelMeeting.id) {
        return {
          ...m,
          status: 'Cancelled'
        };
      }
      return m;
    }));
    addToast({
      title: 'Meeting Cancelled',
      description: `"${cancelMeeting.title}" was cancelled. Cancellation notices sent to all participants.`,
      type: 'warning'
    });
    setCancelMeeting(null);
    setCancelReason('');
  };

  // Copy meeting link
  const handleCopyLink = (meetUrl: string, title: string) => {
    navigator.clipboard.writeText(meetUrl);
    addToast({
      title: 'Link Copied',
      description: `URL for "${title}" copied to clipboard.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Page Header */}
      <PageHeader
        title="Meetings"
        subtitle="Schedule, manage and review company meetings with integrated AI notes, live transcriptions, and project connections."
        breadcrumbs={[
          { label: 'Communication', href: '/communication' },
          { label: 'Meetings', href: '/communication/meetings' }
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivePath('/my-work/calendar')}
              leftIcon={<CalendarIcon className="w-3.5 h-3.5" />}
            >
              Calendar View
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsScheduleModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Schedule Meeting
            </Button>
          </div>
        }
      />

      {/* Simulated Meeting Reminder Alert (Item 8 requirement) */}
      {showReminderBanner && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/90 via-slate-900/90 to-purple-950/90 text-white border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 animate-bounce">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Live Notification • Meeting Starting in 15 Minutes
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                ABC Website Discussion — Client Review & Signoff
              </h4>
              <p className="text-xs text-slate-300">
                11:00 AM – 12:00 PM IST • Marcus Sterling (Client), Mayur Patel, Rahul Sharma
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActivePath('/communication/meetings/mtg-101/room')}
              className="bg-indigo-600 hover:bg-indigo-500 shadow-md font-bold"
              leftIcon={<Video className="w-4 h-4" />}
            >
              Join Meeting Room
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivePath('/communication/meetings/mtg-101')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              View Details
            </Button>
            <button
              onClick={() => setShowReminderBanner(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tabs & Controls Bar */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['Upcoming', 'Today', 'Past', 'Cancelled'] as MeetingTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    activeTab === tab
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {tabCounts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Sort & Search Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search meetings, clients, projects..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none font-medium"
              >
                <option value="nearest">Nearest First</option>
                <option value="project">Project</option>
                <option value="client">Client</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MEETINGS LIST / CARDS */}
      {/* ============================================================ */}
      {filteredMeetings.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
            <Video className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-slate-900 dark:text-white">
            {activeTab === 'Upcoming'
              ? 'No upcoming meetings scheduled'
              : activeTab === 'Past'
              ? 'No completed meetings yet'
              : 'No meetings found matching your filter'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Schedule a client meeting, internal standup, or project review in less than 60 seconds with full AI transcription notes.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsScheduleModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Schedule Meeting
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMeetings.map(mtg => {
            const isLive = mtg.status === 'Live';
            const isPast = mtg.status === 'Completed';
            const isCancelled = mtg.status === 'Cancelled';

            // Calculate accepted / pending invitations
            const acceptedCount = mtg.participants.filter(p => p.invitationStatus === 'Accepted').length;
            const pendingCount = mtg.participants.filter(p => p.invitationStatus === 'Pending').length;

            return (
              <Card
                key={mtg.id}
                hoverable
                className={`p-5 flex flex-col justify-between space-y-4 transition ${
                  isLive
                    ? 'ring-2 ring-rose-500/80 bg-rose-50/10 dark:bg-rose-950/10 border-rose-300 dark:border-rose-900'
                    : ''
                }`}
              >
                {/* Top Card Bar */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      {mtg.startTime} – {mtg.endTime}
                    </span>

                    {isLive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] animate-pulse shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        LIVE NOW
                      </span>
                    ) : (
                      <Badge
                        variant={
                          isPast
                            ? 'success'
                            : isCancelled
                            ? 'danger'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {mtg.status}
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h4
                    onClick={() => setActivePath(`/communication/meetings/${mtg.id}`)}
                    className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition"
                  >
                    {mtg.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {mtg.description}
                  </p>
                </div>

                {/* Connected Project & Client Context */}
                <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1.5 text-xs">
                  {mtg.project && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Project:</span>
                      <button
                        onClick={() => setActivePath('/projects')}
                        className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-[180px]"
                      >
                        {mtg.project.name}
                      </button>
                    </div>
                  )}

                  {mtg.client && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Client:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {mtg.client.company}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-700/40 text-[11px]">
                    <span className="text-slate-500">Date & Duration:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                      {mtg.date} ({mtg.duration})
                    </span>
                  </div>
                </div>

                {/* Participants & Invitation Summary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Participants:</span>
                    <span className="text-[11px] text-slate-400">
                      {acceptedCount} accepted • {pendingCount} pending
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center -space-x-2 overflow-hidden">
                      {mtg.participants.slice(0, 4).map(p => (
                        <img
                          key={p.id}
                          src={p.avatar}
                          alt={p.name}
                          title={`${p.name} (${p.role}) - ${p.invitationStatus}`}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                        />
                      ))}
                      {mtg.participants.length > 4 && (
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-slate-900">
                          +{mtg.participants.length - 4}
                        </div>
                      )}
                    </div>

                    {/* AI & Features Badges */}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono">
                      {mtg.settings.recording && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900 font-bold" title="Recording ON">
                          REC
                        </span>
                      )}
                      {mtg.settings.aiNotes && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-200 dark:border-purple-900 font-bold" title="AI Notes ON">
                          AI
                        </span>
                      )}
                      {mtg.whiteboard && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-200 dark:border-blue-900 font-bold" title="Whiteboard Connected">
                          BOARD
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {isLive ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold animate-pulse shadow-md"
                      onClick={() => setActivePath(`/communication/meetings/${mtg.id}/room`)}
                      leftIcon={<Video className="w-4 h-4" />}
                    >
                      Join Meeting Now
                    </Button>
                  ) : isPast ? (
                    <div className="w-full flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => setActivePath(`/communication/meetings/${mtg.id}`)}
                        leftIcon={<FileText className="w-3.5 h-3.5" />}
                      >
                        View Notes & Transcript
                      </Button>
                      <button
                        onClick={() => addToast({ title: 'Download Transcript', description: 'Transcript saved to PDF.', type: 'success' })}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
                        title="Download Notes"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ) : isCancelled ? (
                    <div className="w-full flex items-center justify-between text-xs text-rose-500 font-bold">
                      <span>Cancelled Meeting</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRescheduleMeeting(mtg);
                          setNewDate('2026-09-27');
                        }}
                      >
                        Re-schedule
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setActivePath(`/communication/meetings/${mtg.id}`)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setActivePath(`/communication/meetings/${mtg.id}/room`)}
                        leftIcon={<Video className="w-3.5 h-3.5" />}
                      >
                        Join
                      </Button>

                      {/* Dropdown triggers for Reschedule and Cancel */}
                      <button
                        onClick={() => setRescheduleMeeting(mtg)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:border-indigo-400 transition"
                        title="Reschedule"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setCancelMeeting(mtg)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:border-rose-400 transition"
                        title="Cancel Meeting"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* RESCHEDULE MEETING MODAL (Item 5 requirement) */}
      {/* ============================================================ */}
      {rescheduleMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Reschedule Meeting
                  </h3>
                  <p className="text-xs text-slate-500">
                    {rescheduleMeeting.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRescheduleMeeting(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 font-medium">Current Schedule:</span>
                <div className="font-mono font-bold text-slate-900 dark:text-white">
                  {rescheduleMeeting.date} • {rescheduleMeeting.startTime} – {rescheduleMeeting.endTime} ({rescheduleMeeting.timezone})
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    New Start Time
                  </label>
                  <select
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Duration
                </label>
                <select
                  value={newDuration}
                  onChange={e => setNewDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="30 minutes">30 minutes</option>
                  <option value="45 minutes">45 minutes</option>
                  <option value="60 minutes">60 minutes</option>
                  <option value="90 minutes">90 minutes</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Reason for Rescheduling (Optional)
                </label>
                <textarea
                  rows={2}
                  value={rescheduleReason}
                  onChange={e => setRescheduleReason(e.target.value)}
                  placeholder="e.g. Client requested 2-hour delay to finalize milestone deliverables."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="md"
                onClick={() => setRescheduleMeeting(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirmReschedule}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Reschedule Meeting
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CANCEL MEETING MODAL (Item 6 requirement) */}
      {/* ============================================================ */}
      {cancelMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Cancel Meeting?
                  </h3>
                  <p className="text-xs text-slate-500">
                    This action will notify all invited participants.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCancelMeeting(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-1">
                <div className="font-bold text-rose-800 dark:text-rose-300">
                  {cancelMeeting.title}
                </div>
                <div className="font-mono text-slate-600 dark:text-slate-400">
                  {cancelMeeting.date} at {cancelMeeting.startTime} • {cancelMeeting.participants.length} Participants
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Cancellation Reason (Optional)
                </label>
                <textarea
                  rows={2}
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="e.g. Scope was merged into tomorrow's architecture review."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCancelMeeting(null)}
              >
                Keep Meeting
              </Button>
              <Button
                variant="primary"
                size="md"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                onClick={handleConfirmCancel}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Cancel Meeting
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onScheduled={(newMtg: Meeting) => {
          setMeetings(prev => [newMtg, ...prev]);
        }}
      />
    </div>
  );
};
