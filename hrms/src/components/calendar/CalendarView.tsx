'use client';

import React, { useState, useMemo } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Video, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Building2, 
  CalendarDays, 
  CalendarRange, 
  ListFilter, 
  MoveRight,
  ExternalLink,
  Sparkles,
  ArrowRight,
  X,
  Check
} from 'lucide-react';
import { 
  CalendarEvent, 
  EventCategory, 
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_MEETINGS,
  Meeting
} from '@/lib/calendar-meetings-data';
import { ScheduleMeetingModal } from './ScheduleMeetingModal';

type CalendarViewMode = 'Month' | 'Week' | 'Day' | 'Agenda';

export const CalendarView: React.FC = () => {
  const { setActivePath, addToast } = useOfficeOS();

  // View state
  const [viewMode, setViewMode] = useState<CalendarViewMode>('Month');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-25');
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 = September (0-indexed)
  const [currentYear, setCurrentYear] = useState<number>(2026);

  // Events & Filter state
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Record<EventCategory, boolean>>({
    Meetings: true,
    Tasks: true,
    Projects: true,
    Deadlines: true,
    Leave: true,
    Holidays: true,
    Payments: true,
    Milestones: true
  });
  const [filterType, setFilterType] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [prefilledDate, setPrefilledDate] = useState<string>('2026-09-25');
  const [prefilledTime, setPrefilledTime] = useState<string>('11:00 AM');

  // Drag & drop reschedule simulation modal state
  const [dragRescheduleEvent, setDragRescheduleEvent] = useState<{
    event: CalendarEvent;
    fromTime: string;
    toTime: string;
  } | null>(null);

  // Conflict warning banner state
  const [showConflictWarning, setShowConflictWarning] = useState<boolean>(true);

  // Active category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, [events]);

  // Category visual styles
  const categoryStyles: Record<EventCategory, { bg: string; text: string; dot: string; border: string }> = {
    Meetings: { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-500', border: 'border-sky-200 dark:border-sky-800' },
    Tasks: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', dot: 'bg-indigo-500', border: 'border-indigo-200 dark:border-indigo-800' },
    Projects: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500', border: 'border-blue-200 dark:border-blue-800' },
    Deadlines: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500', border: 'border-rose-200 dark:border-rose-800' },
    Leave: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500', border: 'border-amber-200 dark:border-amber-800' },
    Holidays: { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-300', dot: 'bg-teal-500', border: 'border-teal-200 dark:border-teal-800' },
    Payments: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500', border: 'border-purple-200 dark:border-purple-800' },
    Milestones: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500', border: 'border-emerald-200 dark:border-emerald-800' }
  };

  // Toggle category
  const toggleCategory = (cat: EventCategory) => {
    setSelectedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      // Category filter
      if (!selectedCategories[evt.category]) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(query);
        const matchesProject = evt.project?.toLowerCase().includes(query);
        const matchesClient = evt.client?.toLowerCase().includes(query);
        const matchesType = evt.type.toLowerCase().includes(query);
        if (!matchesTitle && !matchesProject && !matchesClient && !matchesType) {
          return false;
        }
      }

      // Type filter
      if (filterType !== 'all' && evt.type !== filterType) {
        return false;
      }

      // Project filter
      if (filterProject !== 'all' && evt.project !== filterProject) {
        return false;
      }

      return true;
    });
  }, [events, selectedCategories, searchQuery, filterType, filterProject]);

  // Navigate dates
  const handlePrev = () => {
    if (viewMode === 'Month') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(y => y - 1);
      } else {
        setCurrentMonth(m => m - 1);
      }
    } else if (viewMode === 'Week') {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 7);
      setSelectedDate(d.toISOString().split('T')[0]);
    } else {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 1);
      setSelectedDate(d.toISOString().split('T')[0]);
    }
  };

  const handleNext = () => {
    if (viewMode === 'Month') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(y => y + 1);
      } else {
        setCurrentMonth(m => m + 1);
      }
    } else if (viewMode === 'Week') {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 7);
      setSelectedDate(d.toISOString().split('T')[0]);
    } else {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 1);
      setSelectedDate(d.toISOString().split('T')[0]);
    }
  };

  const handleToday = () => {
    setCurrentMonth(8);
    setCurrentYear(2026);
    setSelectedDate('2026-09-25');
  };

  // Month header text
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formattedHeaderDate = useMemo(() => {
    if (viewMode === 'Month') {
      return `${monthNames[currentMonth]} ${currentYear}`;
    }
    if (viewMode === 'Week') {
      return `Week of Sep 20 - Sep 26, 2026`;
    }
    if (viewMode === 'Day') {
      return `Friday, September 25, 2026 (Today)`;
    }
    return `Schedule Agenda — Q3/Q4 2026`;
  }, [viewMode, currentMonth, currentYear, selectedDate]);

  // Month grid calculations for September 2026
  // Sep 1, 2026 was a Tuesday (day index 2)
  const daysInMonth = 30; // September has 30 days
  const startingDayOfWeek = 2; // Tuesday

  const monthGridDays = useMemo(() => {
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean }[] = [];
    
    // Days from August (previous month)
    const prevMonthDays = 31;
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const num = prevMonthDays - i;
      const dateStr = `2026-08-${num.toString().padStart(2, '0')}`;
      days.push({ dateStr, dayNum: num, isCurrentMonth: false, isToday: false });
    }

    // Days in September
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `2026-09-${d.toString().padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: true,
        isToday: dateStr === '2026-09-25'
      });
    }

    // Days from October (next month) to complete 35 cells
    const remaining = 35 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const dateStr = `2026-10-${d.toString().padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: false, isToday: false });
    }

    return days;
  }, [daysInMonth, startingDayOfWeek]);

  // Week days for Week View
  const weekDays = [
    { name: 'Sun', date: '2026-09-20', num: 20, isToday: false },
    { name: 'Mon', date: '2026-09-21', num: 21, isToday: false },
    { name: 'Tue', date: '2026-09-22', num: 22, isToday: false },
    { name: 'Wed', date: '2026-09-23', num: 23, isToday: false },
    { name: 'Thu', date: '2026-09-24', num: 24, isToday: false },
    { name: 'Fri', date: '2026-09-25', num: 25, isToday: true },
    { name: 'Sat', date: '2026-09-26', num: 26, isToday: false },
  ];

  // Hours range: 08:00 AM to 08:00 PM
  const hours = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  // Open Scheduler with specified prefill
  const handleOpenSchedule = (date = '2026-09-25', time = '11:00 AM') => {
    setPrefilledDate(date);
    setPrefilledTime(time);
    setIsScheduleModalOpen(true);
  };

  // Click on an event
  const handleEventClick = (evt: CalendarEvent) => {
    if (evt.meetingId) {
      setActivePath(`/communication/meetings/${evt.meetingId}`);
    } else {
      addToast({
        title: evt.title,
        description: `${evt.type} • ${evt.date} at ${evt.startTime}`,
        type: 'info'
      });
    }
  };

  // Simulate Drag & Drop reschedule confirmation
  const handleSimulateDrag = (evt: CalendarEvent, newTime: string) => {
    setDragRescheduleEvent({
      event: evt,
      fromTime: evt.startTime,
      toTime: newTime
    });
  };

  const handleConfirmReschedule = () => {
    if (!dragRescheduleEvent) return;
    setEvents(prev => prev.map(e => {
      if (e.id === dragRescheduleEvent.event.id) {
        return {
          ...e,
          startTime: dragRescheduleEvent.toTime,
          endTime: dragRescheduleEvent.toTime === '11:00 AM' ? '12:00 PM' : '01:00 PM'
        };
      }
      return e;
    }));
    addToast({
      title: 'Meeting Rescheduled',
      description: `Moved "${dragRescheduleEvent.event.title}" from ${dragRescheduleEvent.fromTime} to ${dragRescheduleEvent.toTime}.`,
      type: 'success'
    });
    setDragRescheduleEvent(null);
  };

  // Handle successful meeting creation
  const handleMeetingScheduled = (newMtg: Meeting) => {
    const newEvent: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: newMtg.title,
      type: 'Meeting',
      category: 'Meetings',
      date: newMtg.date,
      startTime: newMtg.startTime,
      endTime: newMtg.endTime,
      project: newMtg.project?.name,
      client: newMtg.client?.company,
      status: 'Scheduled',
      color: 'sky',
      meetingId: newMtg.id
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Top Header */}
      <PageHeader
        title="Calendar"
        subtitle="Manage meetings, tasks, deadlines, leave and project events across your organization."
        breadcrumbs={[
          { label: 'My Work', href: '/my-work' },
          { label: 'Calendar', href: '/my-work/calendar' }
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
              leftIcon={<Filter className="w-3.5 h-3.5" />}
            >
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenSchedule(selectedDate, '02:00 PM')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Create Event
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenSchedule(selectedDate, '11:00 AM')}
              leftIcon={<Video className="w-3.5 h-3.5" />}
            >
              Schedule Meeting
            </Button>
          </div>
        }
      />

      {/* Conflict Warning Banner (Item 11 requirement) */}
      {showConflictWarning && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-4 text-xs text-amber-900 dark:text-amber-200 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Schedule Overlap Alert:</span> You have an active meeting conflict today:{' '}
              <strong className="underline decoration-amber-400">12:30 PM Internal Sprint Review</strong> overlaps within 15 minutes of your client prep.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                handleSimulateDrag(events.find(e => e.id === 'evt-2') || events[0], '01:30 PM');
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-2xs"
            >
              Auto-Resolve
            </button>
            <button
              onClick={() => setShowConflictWarning(false)}
              className="p-1 text-amber-500 hover:text-amber-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Calendar Layout: Left Sidebar + Right Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================ */}
        {/* CALENDAR SIDEBAR (Item 1 requirement) */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 space-y-5">
          <Card className="p-4 space-y-5">
            
            {/* Quick Add Button */}
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center shadow-sm"
              onClick={() => handleOpenSchedule('2026-09-25', '10:00 AM')}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Quick Add Meeting
            </Button>

            {/* Mini Monthly Calendar */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white px-1">
                <span>September 2026</span>
                <div className="flex items-center gap-1">
                  <button onClick={handlePrev} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={handleNext} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Days header */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              {/* Mini date numbers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {monthGridDays.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedDate(d.dateStr);
                      if (!d.isCurrentMonth && d.dateStr.includes('-10-')) {
                        setCurrentMonth(9);
                      } else if (!d.isCurrentMonth && d.dateStr.includes('-08-')) {
                        setCurrentMonth(7);
                      }
                    }}
                    className={`w-7 h-7 rounded-lg mx-auto flex items-center justify-center text-[11px] font-medium transition ${
                      d.dateStr === selectedDate
                        ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                        : d.isToday
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800'
                        : d.isCurrentMonth
                        ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    {d.dayNum}
                  </button>
                ))}
              </div>
            </div>

            {/* MY CALENDARS Filter Categories */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Calendars</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {Object.values(selectedCategories).filter(Boolean).length} / 8
                </span>
              </div>

              <div className="space-y-1.5">
                {(Object.keys(selectedCategories) as EventCategory[]).map(category => {
                  const isChecked = selectedCategories[category];
                  const style = categoryStyles[category];
                  const count = categoryCounts[category] || 0;

                  return (
                    <label
                      key={category}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(category)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        <span className={`w-2.5 h-2.5 rounded-full ${style.dot} ring-2 ring-transparent group-hover:ring-slate-300`} />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {category}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Meetings Quick List */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Meetings</span>
                <button
                  onClick={() => setActivePath('/communication/meetings')}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2.5">
                {INITIAL_MEETINGS.slice(0, 3).map(mtg => (
                  <div
                    key={mtg.id}
                    onClick={() => setActivePath(`/communication/meetings/${mtg.id}`)}
                    className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {mtg.startTime}
                      </span>
                      {mtg.status === 'Live' ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
                          LIVE
                        </span>
                      ) : (
                        <Badge variant="neutral" size="sm">
                          {mtg.duration}
                        </Badge>
                      )}
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {mtg.title}
                    </h5>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{mtg.project?.name || 'General Sync'}</span>
                      <span className="flex items-center gap-1 text-[10px]">
                        <Users className="w-3 h-3" /> {mtg.participants.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </Card>
        </div>

        {/* ============================================================ */}
        {/* CALENDAR MAIN AREA (Header + Month/Week/Day/Agenda views) */}
        {/* ============================================================ */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* Controls Bar: Date navigation, Search, View Switcher */}
          <Card className="p-3.5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              
              {/* Date Navigators */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleToday}>
                  Today
                </Button>
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <button
                    onClick={handlePrev}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                    title="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                    title="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white pl-1">
                  {formattedHeaderDate}
                </h3>
              </div>

              {/* View Switcher: [ Day ] [ Week ] [ Month ] [ Agenda ] */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                {(['Day', 'Week', 'Month', 'Agenda'] as CalendarViewMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      viewMode === mode
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Search & Filters Drawer Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events, meetings, projects, participants..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Task Deadline">Task Deadline</option>
                  <option value="Project Milestone">Project Milestone</option>
                  <option value="Leave">Leave</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Payment Due">Payment Due</option>
                </select>

                <select
                  value={filterProject}
                  onChange={e => setFilterProject(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="all">All Projects</option>
                  <option value="ABC Corporate Website">ABC Corporate Website</option>
                  <option value="XYZ Mobile App">XYZ Mobile App</option>
                  <option value="Bright Retail ERP">Bright Retail ERP</option>
                </select>
              </div>
            </div>
          </Card>

          {/* ============================================================ */}
          {/* VIEW: MONTH VIEW (Default Desktop View) */}
          {/* ============================================================ */}
          {viewMode === 'Month' && (
            <Card className="p-0 overflow-hidden shadow-sm">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-center text-xs font-bold text-slate-600 dark:text-slate-300 py-2.5">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Month Grid Cells (7 columns x 5 rows = 35 cells) */}
              <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/80 bg-slate-100 dark:bg-slate-800/30">
                {monthGridDays.map((cell, idx) => {
                  const dayEvents = filteredEvents.filter(e => e.date === cell.dateStr);

                  return (
                    <div
                      key={idx}
                      onClick={() => handleOpenSchedule(cell.dateStr, '10:00 AM')}
                      className={`min-h-[120px] p-2 bg-white dark:bg-slate-900 transition flex flex-col justify-between group hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 cursor-pointer ${
                        !cell.isCurrentMonth ? 'bg-slate-50/60 dark:bg-slate-950/40 text-slate-300 dark:text-slate-600' : ''
                      } ${cell.isToday ? 'ring-2 ring-inset ring-indigo-500/80 bg-indigo-50/30 dark:bg-indigo-950/30' : ''}`}
                    >
                      {/* Date Header */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold px-1.5 py-0.5 rounded-lg ${
                            cell.isToday
                              ? 'bg-indigo-600 text-white font-mono shadow-2xs'
                              : cell.isCurrentMonth
                              ? 'text-slate-700 dark:text-slate-300'
                              : 'text-slate-400 dark:text-slate-600'
                          }`}
                        >
                          {cell.dayNum}
                        </span>

                        {cell.isToday && (
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                            Today
                          </span>
                        )}
                      </div>

                      {/* Event Cards inside cell */}
                      <div className="space-y-1 my-1.5 flex-1 overflow-hidden">
                        {dayEvents.slice(0, 3).map(evt => {
                          const style = categoryStyles[evt.category];
                          return (
                            <div
                              key={evt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(evt);
                              }}
                              className={`px-2 py-1 rounded-md text-[11px] font-semibold truncate border ${style.bg} ${style.text} ${style.border} hover:opacity-90 shadow-2xs transition flex items-center justify-between gap-1`}
                              title={`${evt.startTime} - ${evt.title}`}
                            >
                              <span className="truncate">
                                <span className="font-mono opacity-80 mr-1">{evt.startTime.split(' ')[0]}</span>
                                {evt.title}
                              </span>
                              {evt.status === 'Live' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                              )}
                            </div>
                          );
                        })}

                        {dayEvents.length > 3 && (
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-1 pt-0.5">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>

                      {/* Subtle hover slot add indicator */}
                      <div className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-400 flex items-center justify-end transition">
                        <Plus className="w-3 h-3 text-indigo-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* ============================================================ */}
          {/* VIEW: WEEK VIEW (08:00 AM – 08:00 PM Timeline) */}
          {/* ============================================================ */}
          {viewMode === 'Week' && (
            <Card className="p-0 overflow-hidden shadow-sm">
              {/* Day Headers with active date */}
              <div className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-xs font-bold divide-x divide-slate-200 dark:divide-slate-800">
                <div className="p-3 text-center text-slate-400">GMT+5:30</div>
                {weekDays.map(wd => (
                  <div
                    key={wd.date}
                    onClick={() => setSelectedDate(wd.date)}
                    className={`p-2.5 text-center cursor-pointer transition ${
                      wd.isToday
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-wider">{wd.name}</div>
                    <div className={`text-base font-bold font-mono mt-0.5 ${wd.isToday ? 'text-indigo-600' : ''}`}>
                      {wd.num}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hourly Schedule Grid */}
              <div className="max-h-[640px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 relative">
                {hours.map((hour, hIdx) => {
                  return (
                    <div key={hour} className="grid grid-cols-8 divide-x divide-slate-100 dark:divide-slate-800/80 min-h-[68px]">
                      {/* Hour Label */}
                      <div className="p-2 text-right text-[11px] font-mono text-slate-400 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                        {hour}
                      </div>

                      {/* 7 Day Columns for this hour */}
                      {weekDays.map(wd => {
                        const dayEvents = filteredEvents.filter(e => {
                          return e.date === wd.date && e.startTime.startsWith(hour.split(':')[0]);
                        });

                        return (
                          <div
                            key={wd.date}
                            onClick={() => handleOpenSchedule(wd.date, hour)}
                            className="p-1 relative hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 cursor-pointer transition group"
                          >
                            {dayEvents.map(evt => {
                              const style = categoryStyles[evt.category];
                              return (
                                <div
                                  key={evt.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEventClick(evt);
                                  }}
                                  className={`p-2 rounded-xl text-xs border ${style.bg} ${style.text} ${style.border} shadow-2xs space-y-1 hover:shadow-md transition cursor-pointer`}
                                >
                                  <div className="flex items-center justify-between font-mono text-[10px] opacity-80">
                                    <span>{evt.startTime} – {evt.endTime}</span>
                                    {evt.status === 'Live' ? (
                                      <span className="px-1 py-0.5 rounded bg-rose-500 text-white font-bold text-[9px] animate-pulse">
                                        LIVE
                                      </span>
                                    ) : (
                                      <span className="font-bold">{evt.type}</span>
                                    )}
                                  </div>
                                  <h6 className="font-bold text-xs truncate text-slate-900 dark:text-white">
                                    {evt.title}
                                  </h6>
                                  {evt.project && (
                                    <div className="text-[10px] truncate opacity-90">
                                      📁 {evt.project}
                                    </div>
                                  )}
                                  
                                  {/* Drag / Reschedule Action Shortcut */}
                                  <div className="pt-1 flex items-center justify-between border-t border-slate-200/40 dark:border-slate-700/40 text-[10px]">
                                    <span className="text-slate-500">Hold & drag</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSimulateDrag(evt, '02:00 PM');
                                      }}
                                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                                    >
                                      Reschedule &rarr;
                                    </button>
                                  </div>
                                </div>
                              );
                            })}

                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-1 right-1 text-indigo-400">
                              <Plus className="w-3 h-3" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* ============================================================ */}
          {/* VIEW: DAY VIEW (Hourly Timeline for selected date) */}
          {/* ============================================================ */}
          {viewMode === 'Day' && (
            <Card className="p-0 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {formattedHeaderDate}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Showing all scheduled tasks, client meetings, milestones and employee leaves.
                  </p>
                </div>
                <Badge variant="primary" size="md">
                  {filteredEvents.filter(e => e.date === selectedDate).length} Scheduled Events
                </Badge>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
                {hours.map(hour => {
                  const hourEvents = filteredEvents.filter(
                    e => e.date === selectedDate && e.startTime.startsWith(hour.split(':')[0])
                  );

                  return (
                    <div
                      key={hour}
                      onClick={() => handleOpenSchedule(selectedDate, hour)}
                      className="grid grid-cols-12 min-h-[70px] hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition cursor-pointer group"
                    >
                      {/* Hour column */}
                      <div className="col-span-2 p-3 text-right font-mono text-xs font-bold text-slate-400 border-r border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30">
                        {hour}
                      </div>

                      {/* Event or available slot */}
                      <div className="col-span-10 p-3 space-y-2">
                        {hourEvents.length > 0 ? (
                          hourEvents.map(evt => {
                            const style = categoryStyles[evt.category];
                            return (
                              <div
                                key={evt.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventClick(evt);
                                }}
                                className={`p-3 rounded-2xl border ${style.bg} ${style.border} flex flex-wrap items-center justify-between gap-3 shadow-2xs hover:shadow-sm transition`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                                      {evt.startTime} – {evt.endTime}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.text} bg-white dark:bg-slate-800 border ${style.border}`}>
                                      {evt.type}
                                    </span>
                                    {evt.status === 'Live' && (
                                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] animate-pulse">
                                        LIVE NOW
                                      </span>
                                    )}
                                  </div>
                                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                                    {evt.title}
                                  </h5>
                                  {evt.project && (
                                    <div className="text-xs text-slate-500 flex items-center gap-2">
                                      <span>Project: <strong>{evt.project}</strong></span>
                                      {evt.client && <span>• Client: <strong>{evt.client}</strong></span>}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  {evt.meetingId ? (
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActivePath(`/communication/meetings/${evt.meetingId}`);
                                      }}
                                    >
                                      Join / Details &rarr;
                                    </Button>
                                  ) : (
                                    <Button variant="outline" size="sm">
                                      View Item
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="h-full flex items-center justify-between text-xs text-slate-400 group-hover:text-indigo-600 transition">
                            <span>Available slot</span>
                            <span className="opacity-0 group-hover:opacity-100 flex items-center gap-1 font-semibold">
                              <Plus className="w-3.5 h-3.5" /> Schedule here
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* ============================================================ */}
          {/* VIEW: AGENDA VIEW (Clean chronological grouping) */}
          {/* ============================================================ */}
          {viewMode === 'Agenda' && (
            <div className="space-y-6">
              {[
                { title: 'Today (Friday, 25 Sep 2026)', date: '2026-09-25' },
                { title: 'Tomorrow (Saturday, 26 Sep 2026)', date: '2026-09-26' },
                { title: 'This Week & Upcoming', date: '2026-09-28' },
                { title: 'Next Week Deliverables', date: '2026-09-30' }
              ].map(group => {
                const groupEvents = filteredEvents.filter(e => {
                  if (group.date === '2026-09-28') {
                    return e.date >= '2026-09-27' && e.date < '2026-09-30';
                  }
                  if (group.date === '2026-09-30') {
                    return e.date >= '2026-09-30';
                  }
                  return e.date === group.date;
                });

                return (
                  <Card key={group.title} className="p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <CalendarIcon className="w-4 h-4 text-indigo-600" />
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {group.title}
                        </h4>
                      </div>
                      <Badge variant="neutral" size="sm">
                        {groupEvents.length} events
                      </Badge>
                    </div>

                    {groupEvents.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No events scheduled for this window.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {groupEvents.map(evt => {
                          const style = categoryStyles[evt.category];
                          return (
                            <div
                              key={evt.id}
                              onClick={() => handleEventClick(evt)}
                              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 hover:border-indigo-400 transition cursor-pointer"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2.5 rounded-xl ${style.bg} ${style.border} border shrink-0 text-center min-w-[70px]`}>
                                  <div className="text-[11px] font-mono font-bold text-slate-800 dark:text-white">
                                    {evt.startTime.split(' ')[0]}
                                  </div>
                                  <div className="text-[9px] font-bold text-slate-400 uppercase">
                                    {evt.startTime.split(' ')[1]}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${style.text} ${style.bg} border ${style.border}`}>
                                      {evt.type}
                                    </span>
                                    {evt.status === 'Live' && (
                                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] animate-pulse">
                                        LIVE
                                      </span>
                                    )}
                                  </div>
                                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                    {evt.title}
                                  </h5>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                    {evt.project && <span>📁 {evt.project}</span>}
                                    {evt.client && <span>🏢 {evt.client}</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {evt.meetingId && (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActivePath(`/communication/meetings/${evt.meetingId}`);
                                    }}
                                  >
                                    View Meeting &rarr;
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* ============================================================ */}
      {/* SIMULATED DRAG & DROP RESCHEDULE CONFIRMATION MODAL (Item 10) */}
      {/* ============================================================ */}
      {dragRescheduleEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                  <CalendarRange className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Reschedule Meeting?
                </h3>
              </div>
              <button
                onClick={() => setDragRescheduleEvent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                You moved <strong>"{dragRescheduleEvent.event.title}"</strong> to a new time slot on the calendar.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Current Time:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{dragRescheduleEvent.fromTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">New Proposed Time:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{dragRescheduleEvent.toTime}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Participants to notify:</span>
                  <span className="font-bold text-slate-900 dark:text-white">4 Invited</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setDragRescheduleEvent(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirmReschedule}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Confirm Reschedule
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* REUSABLE ENTERPRISE MEETING SCHEDULER MODAL */}
      {/* ============================================================ */}
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        initialDate={prefilledDate}
        initialTime={prefilledTime}
        onScheduled={handleMeetingScheduled}
      />

    </div>
  );
};
