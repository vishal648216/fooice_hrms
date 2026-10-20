'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  FolderGit2, 
  Building2, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Check, 
  Upload, 
  PenTool, 
  Repeat, 
  Bell, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Layers,
  Search,
  Globe
} from 'lucide-react';
import { 
  Meeting, 
  MeetingParticipant, 
  MeetingAgendaItem,
  AVAILABLE_PARTICIPANTS 
} from '@/lib/calendar-meetings-data';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingCreated?: (meeting: Meeting) => void;
  onScheduled?: (meeting: Meeting) => void;
  initialDate?: string;
  initialTime?: string;
  initialMeeting?: Meeting | null;
  existingMeetings?: Meeting[];
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  isOpen,
  onClose,
  onMeetingCreated,
  onScheduled,
  initialDate,
  initialTime,
  initialMeeting,
  existingMeetings = []
}) => {
  // Form State
  const [title, setTitle] = useState(initialMeeting?.title || '');
  const [description, setDescription] = useState(initialMeeting?.description || '');
  const [meetingType, setMeetingType] = useState<Meeting['type']>(initialMeeting?.type || 'Client Meeting');
  const [selectedProject, setSelectedProject] = useState(initialMeeting?.project?.name || 'ABC Corporate Website');
  const [selectedClient, setSelectedClient] = useState(initialMeeting?.client?.name || 'ABC Pvt Ltd');
  
  const [date, setDate] = useState(initialMeeting?.date || initialDate || '2026-09-25');
  const [startTime, setStartTime] = useState(initialMeeting?.startTime || initialTime || '11:00 AM');
  const [endTime, setEndTime] = useState(initialMeeting?.endTime || '12:00 PM');
  const [timezone, setTimezone] = useState(initialMeeting?.timezone || 'IST (UTC+05:30)');

  // Participants
  const [participants, setParticipants] = useState<MeetingParticipant[]>(
    initialMeeting?.participants || [AVAILABLE_PARTICIPANTS[0], AVAILABLE_PARTICIPANTS[1], AVAILABLE_PARTICIPANTS[5]]
  );
  const [participantSearch, setParticipantSearch] = useState('');

  // Recurrence
  const [repeat, setRepeat] = useState<NonNullable<Meeting['recurrence']>['repeat']>(
    initialMeeting?.recurrence?.repeat || 'Does not repeat'
  );
  const [repeatEndsOn, setRepeatEndsOn] = useState(initialMeeting?.recurrence?.endsOn || '2026-10-30');

  // Agenda
  const [agendaItems, setAgendaItems] = useState<MeetingAgendaItem[]>(
    initialMeeting?.agenda || [
      { id: '1', title: 'Homepage status & responsive breakpoints', completed: false },
      { id: '2', title: 'Mobile bottom navigation review', completed: false },
      { id: '3', title: 'Payment discussion & staging deploy', completed: false }
    ]
  );
  const [newAgendaInput, setNewAgendaInput] = useState('');

  // Meeting Settings
  const [settings, setSettings] = useState(initialMeeting?.settings || {
    recording: true,
    transcript: true,
    aiNotes: true,
    waitingRoom: false,
    participantChat: true,
    screenSharing: true,
    reactions: true,
    allowEarlyJoin: true
  });

  // Reminders
  const [reminders, setReminders] = useState<string[]>(initialMeeting?.reminders || ['15 minutes before']);

  // Whiteboard
  const [createWhiteboard, setCreateWhiteboard] = useState(Boolean(initialMeeting?.whiteboard));
  const [whiteboardName, setWhiteboardName] = useState(initialMeeting?.whiteboard?.title || `${title || 'Project'} Meeting Board`);

  // Attachments
  const [attachments, setAttachments] = useState(initialMeeting?.attachments || [
    { name: 'Agenda.pdf', size: '1.2 MB', type: 'PDF' },
    { name: 'Design.fig', size: '8.4 MB', type: 'Figma' }
  ]);

  // Conflict state
  const [hasConflict, setHasConflict] = useState(false);
  const [conflictMeetingName, setConflictMeetingName] = useState('');

  // Check for conflicts
  useEffect(() => {
    if (!isOpen) return;
    const conflict = existingMeetings.find(
      m => m.date === date && m.startTime === startTime && m.id !== initialMeeting?.id
    );
    if (conflict) {
      setHasConflict(true);
      setConflictMeetingName(conflict.title);
    } else {
      setHasConflict(false);
      setConflictMeetingName('');
    }
  }, [date, startTime, isOpen, existingMeetings, initialMeeting]);

  useEffect(() => {
    if (title && !initialMeeting?.whiteboard) {
      setWhiteboardName(`${title} Whiteboard`);
    }
  }, [title, initialMeeting]);

  if (!isOpen) return null;

  const handleAddAgenda = () => {
    if (!newAgendaInput.trim()) return;
    setAgendaItems([
      ...agendaItems,
      { id: String(Date.now()), title: newAgendaInput.trim(), completed: false }
    ]);
    setNewAgendaInput('');
  };

  const handleRemoveAgenda = (id: string) => {
    setAgendaItems(agendaItems.filter(item => item.id !== id));
  };

  const handleAddParticipant = (p: MeetingParticipant) => {
    if (!participants.some(x => x.id === p.id)) {
      setParticipants([...participants, p]);
    }
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const toggleRequired = (id: string) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, isRequired: !p.isRequired } : p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMeeting: Meeting = {
      id: initialMeeting?.id || `mtg-${Date.now()}`,
      title: title.trim(),
      description,
      type: meetingType,
      date,
      startTime,
      endTime,
      timezone,
      duration: '60 minutes',
      status: 'Upcoming',
      organizer: {
        id: 'p-1',
        name: 'Mayur Patel',
        email: 'm.patel@technova.io',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'Director / Admin'
      },
      project: {
        id: 'prj-1',
        name: selectedProject,
        client: selectedClient,
        progress: 67,
        milestone: 'Alpha Milestone 1',
        openTasks: 5,
        pendingRequirements: 2
      },
      client: {
        name: selectedClient,
        company: selectedClient,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
      },
      participants,
      recurrence: repeat !== 'Does not repeat' ? {
        repeat,
        repeatOn: 'Every Monday',
        endsOn: repeatEndsOn
      } : undefined,
      agenda: agendaItems,
      settings,
      reminders,
      attachments,
      whiteboard: createWhiteboard ? {
        id: `wb-${Date.now()}`,
        title: whiteboardName,
        participantCount: participants.length
      } : undefined,
      meetUrl: `http://localhost:3000/communication/meetings/${initialMeeting?.id || 'mtg-new'}/room`,
      activity: [
        { time: 'Just now', action: initialMeeting ? 'Meeting updated' : 'Meeting scheduled', user: 'Mayur Patel' }
      ]
    };

    if (onScheduled) onScheduled(newMeeting);
    if (onMeetingCreated) onMeetingCreated(newMeeting);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full my-8 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {initialMeeting ? 'Edit Scheduled Meeting' : 'Schedule Meeting'}
              </h2>
              <p className="text-xs text-slate-400">Google Meet sync, AI meeting notes, whiteboard and participant invites</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Conflict Warning */}
          {hasConflict && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-bold">Schedule Overlap Detected</div>
                <p className="text-slate-300 mt-0.5">
                  This time ({startTime} on {date}) overlaps with existing meeting <strong>&quot;{conflictMeetingName}&quot;</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStartTime('02:00 PM')}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded text-xs shrink-0"
              >
                Auto-Shift Time
              </button>
            </div>
          )}

          {/* 1. BASIC INFORMATION */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Basic Information</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Meeting Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABC Website Discussion"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Meeting Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Client Meeting', 'Internal', 'Project Review', 'Sprint Planning', 'Design Review', 'Interview', 'Training', 'Other'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setMeetingType(t)}
                      className={`p-2 rounded-lg border text-left font-medium transition-all ${
                        meetingType === t
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Description &amp; Objective</label>
                <textarea
                  rows={2}
                  placeholder="Briefly state the goal of this sync call..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Project & Client Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Connected Project</span>
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                  >
                    <option value="ABC Corporate Website">ABC Corporate Website</option>
                    <option value="XYZ Mobile App">XYZ Mobile App</option>
                    <option value="Bright Retail ERP">Bright Retail ERP</option>
                    <option value="TechNova Engineering Core">TechNova Engineering Core</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold mb-1 block flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Client Account</span>
                  </label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                  >
                    <option value="ABC Pvt Ltd">ABC Pvt Ltd</option>
                    <option value="XYZ Technologies">XYZ Technologies</option>
                    <option value="Bright Retail">Bright Retail</option>
                    <option value="TechNova Internal">TechNova Internal</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* PROJECT CONTEXT CARD */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Project Context: <strong className="text-white">{selectedProject}</strong></span>
              <span className="text-indigo-400 font-bold">67% Complete</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '67%' }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>Current Milestone: <strong>Alpha Delivery</strong></span>
              <span>5 Open Tasks • 2 Pending Requirements</span>
            </div>
          </div>

          {/* 2. DATE & TIME */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Date &amp; Schedule</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Start Time</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none font-mono"
                >
                  {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">End Time</label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none font-mono"
                >
                  {['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '01:15 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                >
                  <option value="IST (UTC+05:30)">India Standard Time (IST)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                  <option value="EST (UTC-05:00)">US Eastern Time (EST)</option>
                  <option value="PST (UTC-08:00)">US Pacific Time (PST)</option>
                  <option value="GMT (UTC+00:00)">UK / London (GMT)</option>
                </select>
              </div>
            </div>

            {/* Recurrence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5 text-purple-400" />
                  <span>Repeat Cadence</span>
                </label>
                <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                >
                  <option value="Does not repeat">Does not repeat</option>
                  <option value="Daily">Daily (Every business day)</option>
                  <option value="Weekly">Weekly (Every Monday)</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Custom">Custom interval</option>
                </select>
              </div>

              {repeat !== 'Does not repeat' && (
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Repeats Until</label>
                  <input
                    type="date"
                    value={repeatEndsOn}
                    onChange={(e) => setRepeatEndsOn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 3. PARTICIPANTS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Participants ({participants.length} invited)</span>
              </div>
              <span className="text-[11px] text-slate-400">Click &quot;Required&quot; to toggle attendance urgency</span>
            </div>

            {/* Search and add participant */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff, client, or team to add..."
                value={participantSearch}
                onChange={(e) => setParticipantSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Selected Participants List */}
            <div className="space-y-2">
              {participants.map((p) => {
                const avail = p.availability?.[startTime] || 'Available';
                return (
                  <div key={p.id} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({p.role})</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            avail === 'Available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {startTime}: {avail}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">{p.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleRequired(p.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          p.isRequired
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                            : 'bg-slate-700 text-slate-400 border-slate-600'
                        }`}
                      >
                        {p.isRequired ? 'Required' : 'Optional'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveParticipant(p.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Suggested quick add chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500">Quick add:</span>
              {AVAILABLE_PARTICIPANTS.filter(x => !participants.some(p => p.id === x.id)).slice(0, 3).map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleAddParticipant(p)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium border border-slate-700 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-indigo-400" />
                  <span>{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. AGENDA ITEMS */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Meeting Agenda ({agendaItems.length} items)</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add agenda topic or milestone check item..."
                value={newAgendaInput}
                onChange={(e) => setNewAgendaInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAgenda(); } }}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddAgenda}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700 rounded-xl font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {agendaItems.map((item, idx) => (
                <div key={item.id} className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200">{item.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAgenda(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. MEETING SETTINGS & AI INTELLIGENCE */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Meeting Features &amp; AI Intelligence</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'recording', label: 'Record Meeting', active: settings.recording },
                { key: 'transcript', label: 'AI Transcription', active: settings.transcript },
                { key: 'aiNotes', label: 'AI Action Notes', active: settings.aiNotes },
                { key: 'waitingRoom', label: 'Waiting Room', active: settings.waitingRoom },
                { key: 'screenSharing', label: 'Screen Sharing', active: settings.screenSharing },
                { key: 'participantChat', label: 'Live In-Call Chat', active: settings.participantChat },
                { key: 'reactions', label: 'Reactions / Emojis', active: settings.reactions },
                { key: 'allowEarlyJoin', label: 'Allow Early Join', active: settings.allowEarlyJoin }
              ].map((item) => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    item.active
                      ? 'bg-purple-500/10 border-purple-500/40 text-purple-300 font-semibold'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <span className={`w-2 h-2 rounded-full ${item.active ? 'bg-purple-400' : 'bg-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* 6. WHITEBOARD OPTION */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-white">
              <input
                type="checkbox"
                checked={createWhiteboard}
                onChange={(e) => setCreateWhiteboard(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700"
              />
              <PenTool className="w-3.5 h-3.5 text-indigo-400" />
              <span>Create an Excalidraw-Style Whiteboard for this Meeting</span>
            </label>

            {createWhiteboard && (
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Whiteboard name"
                  value={whiteboardName}
                  onChange={(e) => setWhiteboardName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
            )}
          </div>

          {/* 7. REMINDERS */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Automated Reminders</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {['5 minutes before', '10 minutes before', '15 minutes before', '30 minutes before', '1 hour before', '1 day before'].map((rem) => {
                const isSelected = reminders.includes(rem);
                return (
                  <button
                    type="button"
                    key={rem}
                    onClick={() => {
                      if (isSelected) setReminders(reminders.filter(r => r !== rem));
                      else setReminders([...reminders, rem]);
                    }}
                    className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {rem}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer with Summary & Submit */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            <span>Scheduled for <strong>{date}</strong> at <strong>{startTime} {timezone.split(' ')[0]}</strong></span>
            <span> • <strong>{participants.length}</strong> participants</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{initialMeeting ? 'Update Meeting' : 'Schedule Meeting'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
