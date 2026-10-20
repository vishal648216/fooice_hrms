'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { 
  MOCK_MEETING_INTELLIGENCE, 
  MeetingIntelligenceSession, 
  ExtractedActionItem 
} from '@/lib/ai-data';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Sparkles, 
  Bot, 
  Play, 
  Pause, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Plus, 
  Search, 
  ShieldCheck, 
  User, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export const MeetingIntelligenceView: React.FC = () => {
  const { addToast, setActivePath } = useOfficeOS();
  const [sessions, setSessions] = useState<MeetingIntelligenceSession[]>(MOCK_MEETING_INTELLIGENCE);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('meet-int-1');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [filterSpeaker, setFilterSpeaker] = useState('ALL');

  const currentSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

  // Convert AI-extracted action item into an active task in Kanban
  const handleAddToKanban = (actionItem: ExtractedActionItem) => {
    setSessions(prev => prev.map(session => {
      if (session.id === currentSession.id) {
        return {
          ...session,
          actionItems: session.actionItems.map(item => 
            item.id === actionItem.id ? { ...item, status: 'ADDED_TO_KANBAN' } : item
          )
        };
      }
      return session;
    }));

    addToast({
      title: 'Task Created from AI Meeting Note',
      description: `Added "${actionItem.taskTitle}" to ${actionItem.projectName} Kanban board and assigned to ${actionItem.assigneeName}.`,
      type: 'success',
    });
  };

  const handleTriggerSynthesis = () => {
    addToast({
      title: 'AI Synthesis Re-indexed',
      description: 'Transcript audio stream re-processed with deep semantic embeddings.',
      type: 'success',
    });
  };

  const filteredTranscript = currentSession.transcript.filter(seg => {
    const matchesSpeaker = filterSpeaker === 'ALL' || seg.speaker === filterSpeaker;
    const matchesSearch = seg.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
                          seg.speaker.toLowerCase().includes(transcriptSearch.toLowerCase());
    return matchesSpeaker && matchesSearch;
  });

  const uniqueSpeakers = Array.from(new Set(currentSession.transcript.map(s => s.speaker)));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Session Selector & Audio Waveform Player Bar */}
      <Card className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/30 text-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Meeting Title & Meta */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-base font-extrabold tracking-tight">
                {currentSession.meetingTitle}
              </h2>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-3">
              <span>Client: <strong>{currentSession.client}</strong></span>
              <span>•</span>
              <span>Project: <strong>{currentSession.project}</strong></span>
              <span>•</span>
              <span>Date: {currentSession.date} ({currentSession.duration})</span>
            </div>
          </div>

          {/* Session Switcher & Synthesis Button */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-white focus:outline-none"
            >
              {sessions.map(s => (
                <option key={s.id} value={s.id}>{s.meetingTitle}</option>
              ))}
            </select>

            <Button variant="primary" size="sm" onClick={handleTriggerSynthesis}>
              <Sparkles className="w-3.5 h-3.5" /> Re-synthesize
            </Button>
          </div>

        </div>

        {/* Audio Waveform Simulator */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-4">
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 transition shrink-0"
          >
            {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Fake Animated Audio Waveform Bars */}
          <div className="flex-1 flex items-center gap-1 h-8 overflow-hidden">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-300 ${
                  i < 22 ? 'bg-indigo-500' : 'bg-slate-700'
                }`}
                style={{
                  height: isPlayingAudio 
                    ? `${Math.max(20, Math.sin(i * 0.4 + Date.now()) * 80 + 20)}%` 
                    : `${((i % 7) + 2) * 10}%`
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
            <Volume2 className="w-4 h-4 text-slate-500" />
            <span>14:02 / 42:00</span>
          </div>
        </div>
      </Card>

      {/* Executive AI Summary & Key Decisions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Executive AI Bullet Summary */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-500" />
              Executive AI Synthesis & Outcomes
            </h3>
            <Badge variant="success" size="sm">Sentiment: Positive (98%)</Badge>
          </div>

          <div className="space-y-2.5">
            {currentSession.summaryBullets.map((bullet, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{bullet}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Formally Approved Key Decisions */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Formally Approved Decisions Register
            </h3>
            <Badge variant="primary" size="sm">{currentSession.keyDecisions.length} Approved</Badge>
          </div>

          <div className="space-y-3">
            {currentSession.keyDecisions.map((dec) => (
              <div
                key={dec.id}
                className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 space-y-1.5"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span className="leading-snug">✓ {dec.decisionText}</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                    {dec.timestamp}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                  <span>Sign-off: <strong>{dec.approvedBy}</strong></span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase text-[10px]">
                    Impact: {dec.impactLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Auto-Extracted Action Items (with 1-click Kanban Task Export) */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-500" />
              AI-Detected Action Items & Deliverables
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Extracted automatically from speaker verbal commitments with detected assignees and deadlines
            </p>
          </div>
          <Badge variant="warning" size="sm">
            {currentSession.actionItems.filter(a => a.status === 'PENDING').length} Pending Sync
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentSession.actionItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-3 hover:border-indigo-500 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`font-bold px-2 py-0.5 rounded-md ${
                    item.priority === 'URGENT' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                    item.priority === 'HIGH' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                  }`}>
                    {item.priority} Priority
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {item.confidenceScore}% AI Confidence
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {item.taskTitle}
                </h4>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={item.assigneeAvatar}
                      alt={item.assigneeName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.assigneeName}</span>
                  </div>
                  <span className="text-slate-400 font-medium">Due: {item.deadline}</span>
                </div>

                {item.status === 'ADDED_TO_KANBAN' ? (
                  <div className="w-full py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Added to Kanban
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleAddToKanban(item)}
                  >
                    <Plus className="w-3.5 h-3.5" /> Push to Kanban Board
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Speaker Diarization Full Transcript */}
      {currentSession.transcript.length > 0 && (
        <Card className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-500" />
                Speaker Diarization & Verbatim Transcript
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audio timeline transcribed with voice recognition and sentiment tagging
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search transcript..."
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  className="pl-8 pr-3 py-1 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <select
                value={filterSpeaker}
                onChange={(e) => setFilterSpeaker(e.target.value)}
                className="px-2.5 py-1 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Speakers</option>
                {uniqueSpeakers.map(spk => (
                  <option key={spk} value={spk}>{spk}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Transcript Dialogue List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {filteredTranscript.map((seg) => (
              <div
                key={seg.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <img
                  src={seg.avatar}
                  alt={seg.speaker}
                  className="w-8 h-8 rounded-xl object-cover shrink-0 mt-0.5"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{seg.speaker}</span>
                      <span className="text-[10px] text-slate-400">({seg.role})</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                      <span>{seg.timestamp}</span>
                      {seg.keyTopic && (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-sans font-bold">
                          {seg.keyTopic}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {seg.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
};
