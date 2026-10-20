'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, PhoneOff,
  Hand, MessageSquare, Users, MoreVertical, Grid, Maximize2,
  SmilePlus, Subtitles, Shield, Disc, StopCircle, Settings,
  ChevronUp, Pin, Volume2, VolumeX, ArrowLeft, Copy, Check,
  Sparkles, Bot, FileText, Camera, Headphones, Wifi, WifiOff,
  LayoutGrid, User, PanelRight, X, Send, Clock, Circle,
  AlertCircle, ChevronRight, Minimize2, Signal
} from 'lucide-react';
import { useOfficeOS } from '@/context/OfficeOSContext';

// ─────────────────────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────────────────────
interface RoomParticipant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isMicOn: boolean;
  isCamOn: boolean;
  isHandRaised: boolean;
  isPinned: boolean;
  isSpeaking: boolean;
  isHost: boolean;
  networkQuality: 'good' | 'fair' | 'poor';
  bgColor: string;
}

interface ChatMsg {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface Caption {
  speakerId: string;
  speakerName: string;
  text: string;
}

const ROOM_PARTICIPANTS: RoomParticipant[] = [
  {
    id: 'me',
    name: 'Mayur Patel (You)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Host · Director',
    isMicOn: true, isCamOn: true, isHandRaised: false, isPinned: false,
    isSpeaking: false, isHost: true, networkQuality: 'good', bgColor: 'from-indigo-900 to-indigo-800',
  },
  {
    id: 'p1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'HR Manager',
    isMicOn: false, isCamOn: true, isHandRaised: false, isPinned: false,
    isSpeaking: false, isHost: false, networkQuality: 'good', bgColor: 'from-rose-900 to-rose-800',
  },
  {
    id: 'p2',
    name: 'Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'Lead Developer',
    isMicOn: true, isCamOn: false, isHandRaised: true, isPinned: false,
    isSpeaking: true, isHost: false, networkQuality: 'good', bgColor: 'from-emerald-900 to-emerald-800',
  },
  {
    id: 'p3',
    name: 'Sneha Iyer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    role: 'UI/UX Designer',
    isMicOn: false, isCamOn: true, isHandRaised: false, isPinned: false,
    isSpeaking: false, isHost: false, networkQuality: 'fair', bgColor: 'from-violet-900 to-violet-800',
  },
  {
    id: 'p4',
    name: 'Ravi Kumar',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Project Manager',
    isMicOn: true, isCamOn: true, isHandRaised: false, isPinned: false,
    isSpeaking: false, isHost: false, networkQuality: 'good', bgColor: 'from-amber-900 to-amber-800',
  },
  {
    id: 'p5',
    name: 'Anita Desai',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'Backend Dev',
    isMicOn: false, isCamOn: false, isHandRaised: false, isPinned: false,
    isSpeaking: false, isHost: false, networkQuality: 'poor', bgColor: 'from-teal-900 to-teal-800',
  },
];

const INITIAL_CHAT: ChatMsg[] = [
  { id: 'c1', senderId: 'p2', senderName: 'Arjun Mehta', text: 'Can we start with the DB migration update?', time: '11:02 AM', isMe: false },
  { id: 'c2', senderId: 'me', senderName: 'You', text: 'Yes, Anita please go ahead when ready 👍', time: '11:02 AM', isMe: true },
  { id: 'c3', senderId: 'p1', senderName: 'Priya Sharma', text: 'I have the Q3 appraisal timelines to share after the tech update', time: '11:03 AM', isMe: false },
  { id: 'c4', senderId: 'p4', senderName: 'Ravi Kumar', text: 'Sprint board is updated. All tickets estimated ✅', time: '11:05 AM', isMe: false },
];

const REACTION_LIST = ['👍','❤️','🎉','😂','😮','🔥','👏','💯'];

const CAPTIONS_FEED: Caption[] = [
  { speakerId: 'p2', speakerName: 'Arjun Mehta', text: 'The auth module refactor is about 80% complete...' },
  { speakerId: 'p5', speakerName: 'Anita Desai', text: 'Database migration will be done by end of day.' },
  { speakerId: 'me', speakerName: 'Mayur Patel', text: 'Great progress everyone! Let\'s sync again tomorrow.' },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function formatDuration(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function NetworkIcon({ quality }: { quality: RoomParticipant['networkQuality'] }) {
  return quality === 'poor'
    ? <Signal className="w-3 h-3 text-red-400" />
    : quality === 'fair'
      ? <Signal className="w-3 h-3 text-amber-400" />
      : <Signal className="w-3 h-3 text-emerald-400" />;
}

// ─────────────────────────────────────────────────────────────
// PARTICIPANT TILE
// ─────────────────────────────────────────────────────────────
interface TileProps {
  participant: RoomParticipant;
  isLarge?: boolean;
  onPin: (id: string) => void;
}
function ParticipantTile({ participant: p, isLarge, onPin }: TileProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${p.bgColor} flex items-center justify-center group
        ${isLarge ? 'min-h-[320px]' : 'aspect-video min-h-[120px]'}
        ${p.isSpeaking ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''}
        ${p.isPinned ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950' : ''}
      `}
    >
      {/* Video feed or avatar */}
      {p.isCamOn ? (
        <img
          src={p.avatar}
          alt={p.name}
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
            <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
          </div>
          {isLarge && <span className="text-white/60 text-xs">Camera off</span>}
        </div>
      )}

      {/* Gradient overlay bottom */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Name bar */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {!p.isMicOn && (
            <span className="p-1 bg-red-500/90 rounded-full">
              <MicOff className="w-2.5 h-2.5 text-white" />
            </span>
          )}
          <span className="text-white text-[11px] font-semibold drop-shadow-sm truncate max-w-[100px]">
            {p.id === 'me' ? 'You' : p.name.split(' ')[0]}
          </span>
          {p.isHost && (
            <span className="text-[9px] font-bold bg-indigo-500/80 text-white px-1.5 py-0.5 rounded-full">HOST</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {p.isHandRaised && (
            <span className="text-sm animate-bounce">✋</span>
          )}
          <NetworkIcon quality={p.networkQuality} />
        </div>
      </div>

      {/* Pin button (hover) */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={() => onPin(p.id)}
          className="p-1.5 bg-black/60 backdrop-blur-sm rounded-xl hover:bg-black/80 text-white transition-all"
          title={p.isPinned ? 'Unpin' : 'Pin'}
        >
          <Pin className="w-3 h-3" />
        </button>
        <button
          onClick={() => setShowMenu(v => !v)}
          className="p-1.5 bg-black/60 backdrop-blur-sm rounded-xl hover:bg-black/80 text-white transition-all"
        >
          <MoreVertical className="w-3 h-3" />
        </button>
      </div>

      {/* Context menu */}
      {showMenu && (
        <div className="absolute top-10 right-2 z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden text-xs">
          {['Mute', 'Remove', 'Make Host', 'Spotlight'].map(opt => (
            <button
              key={opt}
              onClick={() => setShowMenu(false)}
              className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700 transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Speaking pulse */}
      {p.isSpeaking && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400 animate-pulse" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONTROL BUTTON
// ─────────────────────────────────────────────────────────────
interface CtrlBtnProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  badge?: number;
  pulse?: boolean;
}
function CtrlBtn({ icon, label, onClick, active, danger, badge, pulse }: CtrlBtnProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all group
        ${danger
          ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
          : active
            ? 'bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
        }
      `}
    >
      {pulse && (
        <span className="absolute -top-1 -right-1 w-3 h-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
      )}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
          {badge}
        </span>
      )}
      <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
      <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap absolute -bottom-5">
        {label}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// FLOATING REACTION
// ─────────────────────────────────────────────────────────────
interface FloatingReaction { id: number; emoji: string; x: number; }
function FloatingReactionEl({ r }: { r: FloatingReaction }) {
  return (
    <div
      className="fixed pointer-events-none z-50 animate-bounce text-3xl"
      style={{ left: r.x, bottom: 120, animation: 'floatUp 2s ease-out forwards' }}
    >
      {r.emoji}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRE-JOIN LOBBY
// ─────────────────────────────────────────────────────────────
interface PreJoinProps {
  onJoin: () => void;
  onBack: () => void;
  meetingTitle: string;
}
function PreJoinLobby({ onJoin, onBack, meetingTitle }: PreJoinProps) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 p-4">
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          End-to-end encrypted
        </div>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Camera preview */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700">
            {camOn ? (
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-600">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" alt="You" className="w-full h-full object-cover" />
                </div>
                <span className="text-slate-400 text-sm">Camera is off</span>
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 text-white text-xs font-bold">Mayur Patel (You)</div>
          </div>

          {/* Camera/Mic toggles */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setMicOn(p => !p)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setCamOn(p => !p)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${camOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
            >
              {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Join panel */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-slate-400 text-sm mb-1">You're about to join</p>
            <h1 className="text-2xl font-extrabold text-white leading-tight">{meetingTitle}</h1>
            <p className="text-slate-500 text-sm mt-1">5 others are already in the meeting</p>
          </div>

          {/* Attendees waiting */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {ROOM_PARTICIPANTS.filter(p => p.id !== 'me').slice(0, 4).map(p => (
                <img key={p.id} src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full border-2 border-slate-950 object-cover" />
              ))}
            </div>
            <span className="text-slate-400 text-sm">Priya, Arjun, Sneha and 2 others</span>
          </div>

          {/* Device check */}
          <div className="space-y-2 p-4 bg-slate-800/60 rounded-2xl border border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Device Check</p>
            {[
              { label: 'Microphone', ok: micOn, icon: <Mic className="w-3.5 h-3.5" /> },
              { label: 'Camera', ok: camOn, icon: <Camera className="w-3.5 h-3.5" /> },
              { label: 'Speaker', ok: true, icon: <Headphones className="w-3.5 h-3.5" /> },
              { label: 'Connection', ok: true, icon: <Wifi className="w-3.5 h-3.5" /> },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-400">{item.icon}{item.label}</span>
                <span className={`font-semibold ${item.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.ok ? '✓ Ready' : '✗ Off'}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={onJoin}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base rounded-2xl transition-all shadow-xl shadow-indigo-600/30 active:scale-95"
          >
            Join Meeting
          </button>
          <button
            onClick={onJoin}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-2xl transition-all"
          >
            Present Only (No Camera)
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN VIDEO MEETING ROOM
// ─────────────────────────────────────────────────────────────
interface VideoMeetingRoomProps {
  meetingId?: string;
  meetingTitle?: string;
}

export function VideoMeetingRoom({ meetingId = 'mtg-101', meetingTitle = 'Sprint 12 Planning & Q3 Review' }: VideoMeetingRoomProps) {
  const { setActivePath, addToast } = useOfficeOS();

  // Phase state
  const [phase, setPhase] = useState<'lobby' | 'room'>('lobby');

  // Room controls
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'spotlight'>('grid');

  // Panels
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Participants
  const [participants, setParticipants] = useState<RoomParticipant[]>(ROOM_PARTICIPANTS);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState('');
  const [unreadChat, setUnreadChat] = useState(INITIAL_CHAT.length);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Timer
  const [elapsed, setElapsed] = useState(1247); // start at ~20 min for demo
  useEffect(() => {
    if (phase !== 'room') return;
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Floating reactions
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const reactionCounter = useRef(0);

  // Captions
  const [currentCaption, setCurrentCaption] = useState<Caption | null>(null);
  const captionIdx = useRef(0);
  useEffect(() => {
    if (!captionsOn || phase !== 'room') return;
    const t = setInterval(() => {
      setCurrentCaption(CAPTIONS_FEED[captionIdx.current % CAPTIONS_FEED.length]);
      captionIdx.current++;
    }, 4000);
    return () => clearInterval(t);
  }, [captionsOn, phase]);

  // Simulate speaking activity
  useEffect(() => {
    if (phase !== 'room') return;
    const t = setInterval(() => {
      setParticipants(prev => prev.map(p => ({
        ...p,
        isSpeaking: p.id !== 'me' && Math.random() < 0.15,
      })));
    }, 2500);
    return () => clearInterval(t);
  }, [phase]);

  // Auto-clear floating reactions
  useEffect(() => {
    if (floatingReactions.length === 0) return;
    const t = setTimeout(() => {
      setFloatingReactions(prev => prev.slice(1));
    }, 2200);
    return () => clearTimeout(t);
  }, [floatingReactions]);

  // Read chat
  useEffect(() => {
    if (showChat) setUnreadChat(0);
  }, [showChat, chatMessages]);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      id: `cm-${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      isMe: true,
    }]);
    setChatInput('');
  };

  const handleReact = (emoji: string) => {
    reactionCounter.current++;
    setFloatingReactions(prev => [...prev, {
      id: reactionCounter.current,
      emoji,
      x: 80 + Math.random() * (window.innerWidth - 200),
    }]);
    setShowReactions(false);
    addToast({ title: 'Reaction sent', description: `${emoji} sent to everyone`, type: 'success' });
  };

  const handlePin = (id: string) => {
    setPinnedId(prev => prev === id ? null : id);
    setParticipants(prev => prev.map(p => ({ ...p, isPinned: p.id === id && pinnedId !== id })));
    setLayout('spotlight');
  };

  const handleLeave = () => {
    addToast({ title: 'Left meeting', description: 'You have left the meeting.', type: 'info' });
    setActivePath(`/communication/meetings/${meetingId}`);
  };

  const handleEndForAll = () => {
    addToast({ title: 'Meeting ended', description: 'You ended the meeting for all participants.', type: 'warning' });
    setActivePath('/communication/meetings');
  };

  const toggleHand = () => {
    setHandRaised(p => !p);
    addToast({
      title: handRaised ? 'Hand lowered' : 'Hand raised ✋',
      description: handRaised ? 'Your hand is lowered.' : 'Everyone can see your raised hand.',
      type: 'info',
    });
    setParticipants(prev => prev.map(p => p.id === 'me' ? { ...p, isHandRaised: !handRaised } : p));
  };

  const toggleScreenShare = () => {
    setScreenSharing(p => !p);
    addToast({
      title: screenSharing ? 'Screen share stopped' : 'Screen sharing started',
      description: screenSharing ? 'You stopped sharing.' : 'Your screen is now visible to everyone.',
      type: 'info',
    });
  };

  const toggleRecording = () => {
    setIsRecording(p => !p);
    addToast({
      title: isRecording ? 'Recording stopped' : 'Recording started',
      description: isRecording ? 'The recording has been saved.' : 'This meeting is now being recorded.',
      type: isRecording ? 'warning' : 'success',
    });
  };

  // Grid layout
  const pinnedParticipant = participants.find(p => p.id === pinnedId) || null;
  const otherParticipants = pinnedId ? participants.filter(p => p.id !== pinnedId) : participants;

  const sideOpen = showChat || showParticipants;

  // ── PRE-JOIN LOBBY ──
  if (phase === 'lobby') {
    return (
      <PreJoinLobby
        meetingTitle={meetingTitle}
        onJoin={() => setPhase('room')}
        onBack={() => setActivePath(`/communication/meetings/${meetingId}`)}
      />
    );
  }

  // ── MAIN ROOM ──
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col z-40 overflow-hidden">
      {/* Floating Reactions */}
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-200px) scale(1.5); }
        }
      `}</style>
      {floatingReactions.map(r => <FloatingReactionEl key={r.id} r={r} />)}

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 shrink-0 z-30">
        {/* Left: title + time */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setActivePath(`/communication/meetings/${meetingId}`)}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white truncate max-w-[260px]">{meetingTitle}</h1>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(elapsed)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {participants.length} participants
              </span>
            </div>
          </div>
        </div>

        {/* Center: recording + captions indicators */}
        <div className="flex items-center gap-3">
          {isRecording && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 border border-red-500/40 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-[11px] font-bold">REC</span>
            </div>
          )}
          {captionsOn && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 border border-indigo-500/40 rounded-full">
              <Subtitles className="w-3 h-3 text-indigo-400" />
              <span className="text-indigo-400 text-[11px] font-bold">CC ON</span>
            </div>
          )}
          {screenSharing && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 border border-emerald-500/40 rounded-full">
              <Monitor className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 text-[11px] font-bold">SHARING</span>
            </div>
          )}
        </div>

        {/* Right: layout + security */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLayout(l => l === 'grid' ? 'spotlight' : 'grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-xl transition-all
              ${layout === 'grid' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            {layout === 'grid' ? <LayoutGrid className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            {layout === 'grid' ? 'Grid' : 'Spotlight'}
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/10 border border-emerald-500/20 rounded-xl">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400 text-[11px] font-semibold">E2E Encrypted</span>
          </div>
        </div>
      </div>

      {/* ── BODY (Video + Side Panel) ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── VIDEO AREA ── */}
        <div className="flex-1 flex flex-col overflow-hidden p-3 gap-3">

          {/* Screen share banner */}
          {screenSharing && (
            <div className="flex-1 rounded-2xl bg-slate-800 border-2 border-emerald-500/40 flex flex-col items-center justify-center gap-3 min-h-[200px]">
              <Monitor className="w-12 h-12 text-emerald-400 opacity-60" />
              <p className="text-slate-300 font-semibold text-sm">You are sharing your screen</p>
              <p className="text-slate-500 text-xs">Everyone can see your screen content</p>
              <button
                onClick={toggleScreenShare}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all"
              >
                Stop Sharing
              </button>
            </div>
          )}

          {/* Grid / Spotlight layout */}
          {!screenSharing && (
            <>
              {layout === 'spotlight' && pinnedParticipant ? (
                <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                  {/* Main spotlight */}
                  <div className="flex-1">
                    <ParticipantTile participant={pinnedParticipant} isLarge onPin={handlePin} />
                  </div>
                  {/* Strip of others */}
                  <div className="flex gap-3 h-28 overflow-x-auto shrink-0">
                    {otherParticipants.map(p => (
                      <div key={p.id} className="w-44 shrink-0">
                        <ParticipantTile participant={p} onPin={handlePin} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Grid layout */
                <div className={`flex-1 grid gap-3 overflow-auto
                  ${participants.length <= 2 ? 'grid-cols-2' :
                    participants.length <= 4 ? 'grid-cols-2' :
                    participants.length <= 6 ? 'grid-cols-3' : 'grid-cols-3'}`}
                >
                  {participants.map(p => (
                    <ParticipantTile key={p.id} participant={p} onPin={handlePin} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Captions overlay */}
          {captionsOn && currentCaption && (
            <div className="shrink-0 flex justify-center">
              <div className="px-6 py-3 bg-black/80 backdrop-blur-sm rounded-2xl text-center max-w-2xl">
                <span className="text-xs font-bold text-indigo-400 mr-2">{currentCaption.speakerName}:</span>
                <span className="text-white text-sm leading-relaxed">{currentCaption.text}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── SIDE PANEL ── */}
        {sideOpen && (
          <div className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col shrink-0">
            {/* Panel tabs */}
            <div className="flex border-b border-slate-800">
              {[
                { key: 'participants', label: `People (${participants.length})`, show: showParticipants },
                { key: 'chat', label: `Chat${unreadChat > 0 ? ` (${unreadChat})` : ''}`, show: showChat },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => {
                    if (tab.key === 'chat') { setShowChat(true); setShowParticipants(false); }
                    else { setShowParticipants(true); setShowChat(false); }
                  }}
                  className={`flex-1 py-3 text-xs font-bold transition-all ${tab.show
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={() => { setShowChat(false); setShowParticipants(false); }}
                className="px-3 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Participants panel */}
            {showParticipants && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {/* Raised hands first */}
                {participants.filter(p => p.isHandRaised).length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2 mb-1.5">
                      ✋ Raised Hands
                    </p>
                    {participants.filter(p => p.isHandRaised).map(p => (
                      <ParticipantRow key={p.id} p={p} />
                    ))}
                  </div>
                )}
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1.5">
                  In Meeting ({participants.length})
                </p>
                {participants.filter(p => !p.isHandRaised).map(p => (
                  <ParticipantRow key={p.id} p={p} />
                ))}
              </div>
            )}

            {/* Chat panel */}
            {showChat && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                      <div className={`max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                        {!msg.isMe && (
                          <span className="text-[10px] font-bold text-indigo-400">{msg.senderName}</span>
                        )}
                        <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed
                          ${msg.isMe
                            ? 'bg-indigo-600 text-white rounded-br-sm'
                            : 'bg-slate-800 text-slate-200 rounded-bl-sm'}`}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-slate-600">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 border-t border-slate-800 flex gap-2">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                    placeholder="Send a message..."
                    className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500 transition-all placeholder-slate-500"
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={!chatInput.trim()}
                    className={`p-2 rounded-xl transition-all ${chatInput.trim() ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-700 text-slate-500'}`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── BOTTOM CONTROL BAR ── */}
      <div className="shrink-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 px-6 py-3 flex items-center justify-between z-30">
        {/* Left: meeting code */}
        <div className="flex items-center gap-3 w-48">
          <div>
            <p className="text-[10px] text-slate-500">Meeting Code</p>
            <p className="text-xs font-mono font-bold text-slate-300">off-os-{meetingId}</p>
          </div>
          <button
            onClick={() => addToast({ title: 'Copied!', description: 'Meeting link copied to clipboard.', type: 'success' })}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: main controls */}
        <div className="flex items-center gap-2">
          <CtrlBtn
            icon={micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-red-400" />}
            label={micOn ? 'Mute' : 'Unmute'}
            onClick={() => setMicOn(p => !p)}
            active={!micOn}
          />
          <CtrlBtn
            icon={camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5 text-red-400" />}
            label={camOn ? 'Stop Video' : 'Start Video'}
            onClick={() => setCamOn(p => !p)}
            active={!camOn}
          />
          <CtrlBtn
            icon={screenSharing ? <MonitorOff className="w-5 h-5 text-emerald-400" /> : <Monitor className="w-5 h-5" />}
            label={screenSharing ? 'Stop Share' : 'Share Screen'}
            onClick={toggleScreenShare}
            active={screenSharing}
          />
          <CtrlBtn
            icon={<Hand className={`w-5 h-5 ${handRaised ? 'text-amber-400' : ''}`} />}
            label={handRaised ? 'Lower Hand' : 'Raise Hand'}
            onClick={toggleHand}
            active={handRaised}
          />

          {/* Reactions popup */}
          <div className="relative">
            <CtrlBtn
              icon={<SmilePlus className="w-5 h-5" />}
              label="React"
              onClick={() => setShowReactions(p => !p)}
              active={showReactions}
            />
            {showReactions && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 flex gap-2 shadow-2xl">
                {REACTION_LIST.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleReact(emoji)}
                    className="text-2xl hover:scale-125 transition-transform p-0.5 rounded-lg hover:bg-slate-700"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <CtrlBtn
            icon={<Subtitles className={`w-5 h-5 ${captionsOn ? 'text-indigo-400' : ''}`} />}
            label={captionsOn ? 'Hide Captions' : 'Captions'}
            onClick={() => setCaptionsOn(p => !p)}
            active={captionsOn}
          />

          {/* More options */}
          <div className="relative">
            <CtrlBtn
              icon={<MoreVertical className="w-5 h-5" />}
              label="More"
              onClick={() => setShowMore(p => !p)}
              active={showMore}
            />
            {showMore && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden min-w-[180px] z-50">
                {[
                  { label: isRecording ? 'Stop Recording' : 'Start Recording', icon: isRecording ? <StopCircle className="w-4 h-4 text-red-400" /> : <Disc className="w-4 h-4" />, action: () => { toggleRecording(); setShowMore(false); } },
                  { label: 'AI Notes', icon: <Bot className="w-4 h-4 text-indigo-400" />, action: () => { addToast({ title: 'AI Notes', description: 'AI is taking notes for this meeting.', type: 'info' }); setShowMore(false); } },
                  { label: 'Settings', icon: <Settings className="w-4 h-4" />, action: () => setShowMore(false) },
                  { label: 'Full Screen', icon: <Maximize2 className="w-4 h-4" />, action: () => setShowMore(false) },
                  { label: 'Breakout Rooms', icon: <LayoutGrid className="w-4 h-4" />, action: () => setShowMore(false) },
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={opt.action}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs text-slate-300 hover:bg-slate-700 transition-all border-b border-slate-700/50 last:border-0"
                  >
                    {opt.icon}{opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: participants + chat + leave */}
        <div className="flex items-center gap-2 w-48 justify-end">
          <CtrlBtn
            icon={<Users className="w-5 h-5" />}
            label="Participants"
            onClick={() => { setShowParticipants(p => !p); setShowChat(false); }}
            active={showParticipants}
            badge={participants.filter(p => p.isHandRaised).length || undefined}
          />
          <CtrlBtn
            icon={<MessageSquare className="w-5 h-5" />}
            label="Chat"
            onClick={() => { setShowChat(p => !p); setShowParticipants(false); }}
            active={showChat}
            badge={!showChat ? unreadChat : undefined}
          />

          {/* Leave / End dropdown */}
          <div className="relative">
            <button
              onClick={handleLeave}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-red-600/30"
            >
              <PhoneOff className="w-4 h-4" />
              Leave
            </button>
          </div>
          <button
            onClick={handleEndForAll}
            className="px-3 py-2.5 bg-red-900/60 hover:bg-red-800 text-red-400 text-xs font-bold rounded-2xl transition-all border border-red-700/50"
          >
            End All
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PARTICIPANT ROW (side panel)
// ─────────────────────────────────────────────────────────────
function ParticipantRow({ p }: { p: RoomParticipant }) {
  return (
    <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800 group transition-all">
      <div className="relative">
        <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
        {p.isSpeaking && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-[12px] font-semibold text-slate-200 truncate">
            {p.id === 'me' ? `${p.name.split('(')[0].trim()} (You)` : p.name}
          </span>
          {p.isHost && <span className="text-[9px] font-bold bg-indigo-600/30 text-indigo-400 px-1 rounded">Host</span>}
          {p.isHandRaised && <span className="text-xs">✋</span>}
        </div>
        <span className="text-[10px] text-slate-500 truncate">{p.role}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {p.isMicOn ? <Mic className="w-3 h-3 text-slate-400" /> : <MicOff className="w-3 h-3 text-red-400" />}
        {p.isCamOn ? <Video className="w-3 h-3 text-slate-400" /> : <VideoOff className="w-3 h-3 text-red-400" />}
        <NetworkIcon quality={p.networkQuality} />
      </div>
    </div>
  );
}

export default VideoMeetingRoom;
