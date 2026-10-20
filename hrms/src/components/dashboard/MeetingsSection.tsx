'use client';

import React, { useState } from 'react';
import { 
  Video, 
  Clock, 
  ExternalLink, 
  Calendar, 
  Users, 
  Sparkles, 
  Plus, 
  CheckCircle2,
  ChevronRight,
  FileText
} from 'lucide-react';
import { TODAYS_MEETINGS_LIST, TodayMeeting } from '@/lib/boss-dashboard-data';

interface MeetingsSectionProps {
  onScheduleMeeting?: () => void;
  onJoinMeeting?: (meeting: TodayMeeting) => void;
  onViewNotes?: (meeting: TodayMeeting) => void;
}

export const MeetingsSection: React.FC<MeetingsSectionProps> = ({
  onScheduleMeeting,
  onJoinMeeting,
  onViewNotes,
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming'>('all');
  const [joinedId, setJoinedId] = useState<string | null>(null);

  const meetings = filter === 'upcoming' 
    ? TODAYS_MEETINGS_LIST.filter(m => m.status === 'Upcoming')
    : TODAYS_MEETINGS_LIST;

  const handleJoin = (meeting: TodayMeeting) => {
    setJoinedId(meeting.id);
    if (onJoinMeeting) {
      onJoinMeeting(meeting);
    } else {
      window.open(meeting.meetUrl, '_blank');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Today&apos;s Meetings &amp; Syncs</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {TODAYS_MEETINGS_LIST.length} Scheduled
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Client syncs, engineering sprint standups, and AI-transcribed conferences
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700/60 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({TODAYS_MEETINGS_LIST.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filter === 'upcoming'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Upcoming ({TODAYS_MEETINGS_LIST.filter(m => m.status === 'Upcoming').length})
            </button>
          </div>

          <button
            onClick={onScheduleMeeting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {meetings.map((meeting) => {
          const isImminent = Boolean(meeting.countdown);
          return (
            <div
              key={meeting.id}
              className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 ${
                isImminent
                  ? 'bg-gradient-to-b from-sky-950/40 to-slate-900 border-sky-500/40 shadow-lg shadow-sky-950/20'
                  : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isImminent && (
                <div className="absolute -top-2.5 right-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  {meeting.countdown}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>{meeting.time}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      meeting.status === 'In Progress'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : meeting.status === 'Completed'
                        ? 'bg-slate-700/50 text-slate-400'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {meeting.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                  {meeting.title}
                </h4>

                <p className="text-xs text-slate-400 flex items-center gap-1 mb-3 line-clamp-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  {meeting.project}
                </p>

                {/* Participants */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mb-4">
                  <div className="flex items-center -space-x-1.5">
                    {meeting.participants.map((p, idx) => (
                      <div
                        key={idx}
                        title={p.name}
                        className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] font-semibold text-slate-200"
                      >
                        {p.initials}
                      </div>
                    ))}
                    <span className="text-[11px] text-slate-400 pl-2">
                      {meeting.participants.length} attendees
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Notes</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleJoin(meeting)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    isImminent
                      ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{joinedId === meeting.id ? 'Launching...' : 'Join Google Meet'}</span>
                </button>

                <button
                  onClick={() => onViewNotes && onViewNotes(meeting)}
                  title="View Agenda &amp; AI Action Items"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
