'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Hash, Lock, Megaphone, MessageSquare, Search, Plus, Settings,
  ChevronDown, ChevronRight, Smile, Paperclip, Send, Image as ImageIcon,
  FileText, Video, Mic, MoreHorizontal, Phone, Video as VideoIcon,
  Info, Pin, Bell, BellOff, UserPlus, Trash2, Edit3, Reply,
  Check, CheckCheck, Download, X, AtSign, Star, Archive, Copy,
  ChevronUp, Users, Shield, Globe, Volume2, VolumeX, Bookmark,
  ExternalLink, Link2, Film, Headphones, ZoomIn
} from 'lucide-react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import {
  CHAT_USERS, MOCK_CHANNELS, MOCK_DMS, MOCK_CHANNEL_MESSAGES, MOCK_DM_MESSAGES,
  ChatUser, ChatChannel, DirectMessage, ChatMessage, MessageReaction, MessageAttachment
} from '@/lib/chat-data';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function getStatusColor(status: ChatUser['status']) {
  switch (status) {
    case 'online': return 'bg-emerald-500';
    case 'away': return 'bg-amber-400';
    case 'busy': return 'bg-red-500';
    default: return 'bg-slate-500';
  }
}

function getStatusText(user: ChatUser) {
  if (user.status === 'online') return 'Active now';
  if (user.status === 'away') return `Away · ${user.lastSeen || 'recently'}`;
  if (user.status === 'busy') return 'Do not disturb';
  return `Offline · ${user.lastSeen || 'a while ago'}`;
}

// ─────────────────────────────────────────────────────────────
// EMOJI PICKER (simple)
// ─────────────────────────────────────────────────────────────
const REACTION_EMOJIS: MessageReaction['emoji'][] = ['👍', '❤️', '😂', '😮', '😢', '🔥', '✅', '🎉'];

interface EmojiPickerProps { onSelect: (e: MessageReaction['emoji']) => void; onClose: () => void; }
function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  return (
    <div className="absolute bottom-full mb-1 left-0 z-50 bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 flex gap-1.5 shadow-2xl">
      {REACTION_EMOJIS.map(e => (
        <button key={e} onClick={() => { onSelect(e); onClose(); }}
          className="text-xl hover:scale-125 transition-transform active:scale-110 p-0.5 rounded-lg hover:bg-slate-700">
          {e}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ATTACHMENT PREVIEW
// ─────────────────────────────────────────────────────────────
function AttachmentCard({ att }: { att: MessageAttachment }) {
  if (att.type === 'image' && att.thumbnailUrl) {
    return (
      <div className="relative group mt-2 rounded-xl overflow-hidden max-w-xs cursor-pointer">
        <img src={att.thumbnailUrl} alt={att.name} className="w-full max-h-56 object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (att.type === 'link') {
    return (
      <a href={att.url} className="flex items-center gap-2.5 mt-2 px-3 py-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/20 transition-all max-w-xs">
        <Link2 className="w-4 h-4 text-indigo-400 shrink-0" />
        <span className="text-xs text-indigo-300 font-medium truncate">{att.name}</span>
        <ExternalLink className="w-3 h-3 text-indigo-400 shrink-0 ml-auto" />
      </a>
    );
  }
  const icons: Record<string, React.ReactNode> = {
    document: <FileText className="w-5 h-5 text-blue-400" />,
    video: <Film className="w-5 h-5 text-purple-400" />,
    audio: <Headphones className="w-5 h-5 text-emerald-400" />,
  };
  return (
    <div className="flex items-center gap-3 mt-2 px-3 py-2.5 bg-slate-700/60 border border-slate-600/50 rounded-xl max-w-xs group hover:bg-slate-700 transition-all cursor-pointer">
      <div className="w-9 h-9 rounded-lg bg-slate-600 flex items-center justify-center shrink-0">
        {icons[att.type] || <FileText className="w-5 h-5 text-slate-400" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-200 truncate">{att.name}</p>
        {att.size && <p className="text-[11px] text-slate-400">{att.size}</p>}
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-slate-600">
        <Download className="w-3.5 h-3.5 text-slate-400" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────────────────────
interface MessageBubbleProps {
  msg: ChatMessage;
  prevMsg?: ChatMessage;
  isMe: boolean;
  onReact: (msgId: string, emoji: MessageReaction['emoji']) => void;
  onReply: (msg: ChatMessage) => void;
  onPin: (msgId: string) => void;
}
function MessageBubble({ msg, prevMsg, isMe, onReact, onReply, onPin }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const sender = CHAT_USERS[msg.senderId] || CHAT_USERS['usr-1'];
  const prevSender = prevMsg?.senderId;
  const isSameGroup = prevSender === msg.senderId;
  const isSystem = msg.isSystemMessage;

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="text-[11px] text-slate-500 bg-slate-800/80 px-3 py-1 rounded-full">{msg.text}</span>
      </div>
    );
  }

  return (
    <div className={`group flex gap-3 px-4 ${isSameGroup ? 'mt-0.5' : 'mt-4'} ${isMe ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {!isMe && (
        <div className="shrink-0 mt-1">
          {!isSameGroup ? (
            <div className="relative">
              <img src={sender.avatar} alt={sender.name} className="w-8 h-8 rounded-full object-cover" />
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${getStatusColor(sender.status)}`} />
            </div>
          ) : (
            <div className="w-8 h-8 flex items-center justify-end">
              <span className="text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pr-0.5">
                {msg.timeLabel}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={`relative max-w-[72%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Name + time (first in group) */}
        {!isSameGroup && !isMe && (
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs font-bold text-slate-200">{sender.name}</span>
            <span className="text-[10px] text-slate-500">{msg.timeLabel}</span>
            {msg.isPinned && <Pin className="w-2.5 h-2.5 text-amber-400" />}
          </div>
        )}

        {/* Reply preview */}
        {msg.replyTo && (
          <div className={`mb-1 px-3 py-1.5 rounded-xl border-l-2 border-indigo-500 bg-slate-700/50 max-w-full ${isMe ? 'self-end' : 'self-start'}`}>
            <p className="text-[10px] text-indigo-400 font-semibold">{msg.replyTo.senderName}</p>
            <p className="text-[11px] text-slate-400 truncate">{msg.replyTo.text}</p>
          </div>
        )}

        {/* Bubble */}
        <div
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => { setShowActions(false); if (!showEmojiPicker) setShowEmojiPicker(false); }}
          className="relative"
        >
          {/* Action toolbar */}
          {showActions && (
            <div className={`absolute ${isMe ? 'right-full mr-2' : 'left-full ml-2'} top-0 z-40 flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl px-1.5 py-1`}>
              <div className="relative">
                <button onClick={() => setShowEmojiPicker(p => !p)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-yellow-400 transition-all" title="React">
                  <Smile className="w-3.5 h-3.5" />
                </button>
                {showEmojiPicker && (
                  <EmojiPicker onSelect={(e) => onReact(msg.id, e)} onClose={() => setShowEmojiPicker(false)} />
                )}
              </div>
              <button onClick={() => onReply(msg)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-indigo-400 transition-all" title="Reply">
                <Reply className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onPin(msg.id)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-all" title="Pin">
                <Pin className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all" title="Copy">
                <Copy className="w-3.5 h-3.5" />
              </button>
              {isMe && (
                <button className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-all" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Message text bubble */}
          {msg.text && (
            <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap break-words
              ${isMe
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700/50'
              }`}>
              {msg.text}
              {isSameGroup && (
                <span className="ml-2 text-[10px] opacity-50">{msg.timeLabel}</span>
              )}
            </div>
          )}

          {/* Attachments */}
          {msg.attachments.map(att => <AttachmentCard key={att.id} att={att} />)}

          {/* Status ticks (me only) */}
          {isMe && (
            <div className="flex justify-end mt-0.5">
              {msg.status === 'read'
                ? <CheckCheck className="w-3 h-3 text-indigo-400" />
                : msg.status === 'delivered'
                  ? <CheckCheck className="w-3 h-3 text-slate-500" />
                  : <Check className="w-3 h-3 text-slate-500" />
              }
            </div>
          )}
        </div>

        {/* Reactions */}
        {msg.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {msg.reactions.map((r, i) => (
              <button
                key={i}
                onClick={() => onReact(msg.id, r.emoji)}
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-all
                  ${r.reacted
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
              >
                <span>{r.emoji}</span>
                <span className="font-semibold text-[11px]">{r.count}</span>
              </button>
            ))}
            <button
              onClick={() => setShowEmojiPicker(p => !p)}
              className="text-xs px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800 text-slate-500 hover:border-slate-500 hover:text-slate-300 transition-all"
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DATE DIVIDER
// ─────────────────────────────────────────────────────────────
function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 my-4">
      <div className="flex-1 h-px bg-slate-700/50" />
      <span className="text-[11px] font-semibold text-slate-500 bg-slate-900 px-2">{label}</span>
      <div className="flex-1 h-px bg-slate-700/50" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHANNEL SIDEBAR ITEM
// ─────────────────────────────────────────────────────────────
interface ChannelItemProps {
  channel: ChatChannel;
  isActive: boolean;
  onClick: () => void;
}
function ChannelItem({ channel, isActive, onClick }: ChannelItemProps) {
  const icons = {
    public: <Hash className="w-3.5 h-3.5" />,
    private: <Lock className="w-3.5 h-3.5" />,
    announcement: <Megaphone className="w-3.5 h-3.5" />,
  };
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-left transition-all group
        ${isActive ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}`}
    >
      <span className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}>
        {icons[channel.type]}
      </span>
      <span className={`text-[13px] font-medium flex-1 truncate ${channel.unreadCount > 0 ? 'font-bold text-slate-100' : ''}`}>
        {channel.name}
      </span>
      {channel.isMuted && <VolumeX className="w-3 h-3 text-slate-600" />}
      {channel.unreadCount > 0 && (
        <span className="min-w-[18px] h-[18px] bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {channel.unreadCount}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// DM SIDEBAR ITEM
// ─────────────────────────────────────────────────────────────
interface DMItemProps {
  dm: DirectMessage;
  isActive: boolean;
  onClick: () => void;
}
function DMItem({ dm, isActive, onClick }: DMItemProps) {
  const user = CHAT_USERS[dm.participantId];
  if (!user) return null;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-left transition-all group
        ${isActive ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}`}
    >
      <div className="relative shrink-0">
        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
        <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-900 ${getStatusColor(user.status)}`} />
      </div>
      <span className={`text-[13px] font-medium flex-1 truncate ${dm.unreadCount > 0 ? 'font-bold text-slate-100' : ''}`}>
        {user.name.split(' ')[0]}
      </span>
      {dm.isMuted && <VolumeX className="w-3 h-3 text-slate-600" />}
      {dm.unreadCount > 0 && (
        <span className="min-w-[18px] h-[18px] bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {dm.unreadCount}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// CHAT INPUT
// ─────────────────────────────────────────────────────────────
interface ChatInputProps {
  onSend: (text: string) => void;
  replyTo: ChatMessage | null;
  onCancelReply: () => void;
  disabled?: boolean;
  disabledReason?: string;
  channelName: string;
}
function ChatInput({ onSend, replyTo, onCancelReply, disabled, disabledReason, channelName }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  if (disabled) {
    return (
      <div className="flex items-center justify-center gap-2 h-14 text-slate-500 text-sm">
        <Lock className="w-4 h-4" />
        <span>{disabledReason || 'You cannot send messages here'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {replyTo && (
        <div className="flex items-center gap-3 mx-4 px-3 py-2 bg-slate-800 rounded-xl border-l-2 border-indigo-500">
          <Reply className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-indigo-400 font-bold">
              Replying to {CHAT_USERS[replyTo.senderId]?.name}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{replyTo.text}</p>
          </div>
          <button onClick={onCancelReply} className="p-1 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-slate-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="mx-4 mb-4">
        <div className="flex items-end gap-2 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2 focus-within:border-indigo-500/60 transition-all">
          {/* Left actions */}
          <div className="flex items-center gap-1 pb-1.5 shrink-0">
            <button className="p-1.5 rounded-xl hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-all" title="Attach file">
              <Paperclip className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-xl hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-all" title="Image">
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            rows={1}
            placeholder={`Message #${channelName}`}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 resize-none outline-none py-1.5 min-h-[36px] max-h-[120px] leading-relaxed"
          />

          {/* Right actions */}
          <div className="flex items-center gap-1 pb-1.5 shrink-0">
            <button className="p-1.5 rounded-xl hover:bg-slate-700 text-slate-500 hover:text-yellow-400 transition-all" title="Emoji">
              <Smile className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-xl hover:bg-slate-700 text-slate-500 hover:text-slate-300 transition-all" title="Mention">
              <AtSign className="w-4 h-4" />
            </button>
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className={`p-2 rounded-xl transition-all ${text.trim()
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 scale-100'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed scale-95'}`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 mt-1 ml-1">
          <kbd className="font-mono">Enter</kbd> to send · <kbd className="font-mono">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHANNEL HEADER
// ─────────────────────────────────────────────────────────────
interface ChannelHeaderProps {
  channel: ChatChannel | null;
  dmUser: ChatUser | null;
  onToggleInfo: () => void;
  showInfo: boolean;
}
function ChannelHeader({ channel, dmUser, onToggleInfo, showInfo }: ChannelHeaderProps) {
  if (!channel && !dmUser) return null;

  const name = channel ? `#${channel.name}` : dmUser?.name || '';
  const subtitle = channel ? channel.topic || channel.description : (dmUser ? getStatusText(dmUser) : '');
  const memberCount = channel ? channel.members.length : null;

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {dmUser ? (
          <div className="relative shrink-0">
            <img src={dmUser.avatar} alt={dmUser.name} className="w-9 h-9 rounded-full object-cover" />
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${getStatusColor(dmUser.status)}`} />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 flex items-center justify-center">
            {channel?.type === 'announcement' ? <Megaphone className="w-4 h-4 text-indigo-400" /> :
              channel?.type === 'private' ? <Lock className="w-4 h-4 text-indigo-400" /> :
                <Hash className="w-4 h-4 text-indigo-400" />}
          </div>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-100">{name}</h2>
            {memberCount && (
              <span className="text-[11px] text-slate-500">
                <Users className="w-2.5 h-2.5 inline mr-0.5" />{memberCount}
              </span>
            )}
            {channel?.isMuted && <VolumeX className="w-3 h-3 text-slate-500" />}
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-500 truncate max-w-[420px]">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {dmUser && (
          <>
            <button className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-all" title="Voice Call">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-all" title="Video Call">
              <VideoIcon className="w-4 h-4" />
            </button>
          </>
        )}
        <button className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-all" title="Search in Chat">
          <Search className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-all" title="Pinned Messages">
          <Pin className="w-4 h-4" />
        </button>
        <button
          onClick={onToggleInfo}
          className={`p-2 rounded-xl transition-all ${showInfo ? 'bg-indigo-600/20 text-indigo-400' : 'hover:bg-slate-800 text-slate-500 hover:text-slate-300'}`}
          title="Channel Info"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHANNEL INFO PANEL
// ─────────────────────────────────────────────────────────────
// CHANNEL INFO PANEL
// ─────────────────────────────────────────────────────────────
interface InfoPanelProps {
  channel: ChatChannel | null;
  dmUser: ChatUser | null;
  onClose: () => void;
  isBoss: boolean;
  onToggleMember?: (channelId: string, userId: string) => void;
}
function InfoPanel({ channel, dmUser, onClose, isBoss, onToggleMember }: InfoPanelProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'files' | 'pinned'>('members');
  const tabs = ['members', 'files', 'pinned'] as const;

  // Get members
  const memberIds = channel?.members || (dmUser ? ['usr-1', dmUser.id] : []);
  const members = memberIds.map(id => CHAT_USERS[id]).filter(Boolean);
  const allUsersList = Object.values(CHAT_USERS).filter(u => u.id !== 'me');

  // Pinned messages
  const msgMap = channel
    ? MOCK_CHANNEL_MESSAGES[channel.id] || []
    : dmUser ? MOCK_DM_MESSAGES[`dm-${dmUser.id}`] || [] : [];
  const pinned = msgMap.filter(m => m.isPinned);

  return (
    <div className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <span className="text-sm font-bold text-slate-200">
          {dmUser ? `${dmUser.name.split(' ')[0]}'s Profile` : 'Channel Info'}
        </span>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* DM user profile */}
      {dmUser && (
        <div className="p-4 border-b border-slate-800">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img src={dmUser.avatar} alt={dmUser.name} className="w-16 h-16 rounded-2xl object-cover" />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${getStatusColor(dmUser.status)}`} />
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-100 text-sm">{dmUser.name}</p>
              <p className="text-xs text-slate-400">{dmUser.role}</p>
              <p className="text-xs text-slate-500 mt-0.5">{getStatusText(dmUser)}</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-xs font-semibold rounded-xl transition-all">
                <Phone className="w-3 h-3" /> Call
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all">
                <VideoIcon className="w-3 h-3" /> Video
              </button>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Department</span><span className="text-slate-200 font-medium">{dmUser.department}</span>
            </div>
            <div className="flex justify-between">
              <span>Role</span><span className="text-slate-200 font-medium">{dmUser.role}</span>
            </div>
          </div>
        </div>
      )}

      {/* Channel info */}
      {channel && (
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">About Channel</p>
            <p className="text-xs text-slate-400 leading-relaxed">{channel.description}</p>
          </div>
          {channel.topic && (
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Topic</p>
              <p className="text-xs text-slate-400 leading-relaxed">{channel.topic}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            {channel.type === 'private' && <span className="flex items-center gap-1 text-amber-400"><Lock className="w-3 h-3" /> Private Group</span>}
            {channel.type === 'announcement' && <span className="flex items-center gap-1 text-indigo-400"><Megaphone className="w-3 h-3" /> Official Broadcast</span>}
            {channel.type === 'public' && <span className="flex items-center gap-1 text-emerald-400"><Globe className="w-3 h-3" /> Public Group</span>}
            <span className="text-slate-500">• {channel.members.length} Members</span>
          </div>

          {/* Membership Governance Pill */}
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] leading-relaxed">
            {isBoss ? (
              <div className="text-indigo-300">
                <span className="font-bold">🛡️ Boss Governance Mode:</span> You can add or remove Developers, HR, Managers, or Clients from this channel below.
              </div>
            ) : (
              <div className="text-slate-400">
                <span className="font-semibold text-slate-300">🔒 Group Membership:</span> Added by Boss (Vikramaditya Singhania). You only see channels you belong to.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      {channel && (
        <div className="flex border-b border-slate-800">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-[11px] font-bold capitalize transition-all ${activeTab === tab ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}>
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {(!channel || activeTab === 'members') && (
          <div className="space-y-3">
            {/* Active Members List */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                Active Group Members ({members.length})
              </p>
              {members.map(u => u && (
                <div key={u.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 group transition-all">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-900 ${getStatusColor(u.status)}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-slate-200 truncate">{u.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{u.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {channel?.adminIds.includes(u.id) ? (
                      <span title="Channel Admin" className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">Admin</span>
                    ) : isBoss && channel && (
                      <button
                        onClick={() => onToggleMember?.(channel.id, u.id)}
                        className="text-[10px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 px-1.5 py-0.5 rounded transition"
                        title="Remove member from this group"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Boss: Add Available Team Members to this Group */}
            {isBoss && channel && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider px-1">
                  Add Team to #{channel.name}
                </p>
                {allUsersList.filter(u => !channel.members.includes(u.id)).map(u => (
                  <div key={u.id} className="flex items-center justify-between p-2 rounded-xl border border-dashed border-slate-700/80 hover:bg-slate-800/60 transition">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-300 truncate">{u.name}</p>
                        <p className="text-[9px] text-slate-500 truncate">{u.role.split('(')[0]}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleMember?.(channel.id, u.id)}
                      className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold shrink-0 transition shadow-2xs"
                    >
                      + Add
                    </button>
                  </div>
                ))}
                {allUsersList.filter(u => !channel.members.includes(u.id)).length === 0 && (
                  <p className="text-[11px] text-slate-500 text-center py-2">All team members are already in this group.</p>
                )}
              </div>
            )}
          </div>
        )}

        {channel && activeTab === 'files' && (
          <div className="space-y-2">
            {Object.values(MOCK_CHANNEL_MESSAGES).flat()
              .filter(m => m.attachments.length > 0)
              .flatMap(m => m.attachments)
              .slice(0, 8)
              .map(att => (
                <div key={att.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800 group transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    {att.type === 'image' ? <ImageIcon className="w-4 h-4 text-blue-400" /> :
                      att.type === 'video' ? <Film className="w-4 h-4 text-purple-400" /> :
                        <FileText className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-slate-300 truncate">{att.name}</p>
                    {att.size && <p className="text-[10px] text-slate-500">{att.size}</p>}
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-700 text-slate-400 transition-all">
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              ))}
          </div>
        )}

        {channel && activeTab === 'pinned' && (
          <div className="space-y-2">
            {pinned.length === 0 ? (
              <p className="text-xs text-slate-500 text-center mt-4">No pinned messages</p>
            ) : pinned.map(m => {
              const sender = CHAT_USERS[m.senderId];
              return (
                <div key={m.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={sender?.avatar} alt={sender?.name} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[11px] font-bold text-slate-300">{sender?.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{m.text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN CHAT VIEW
// ─────────────────────────────────────────────────────────────
export function ChatView() {
  const { currentRole, currentUser } = useOfficeOS();
  const isBoss = currentRole === 'SUPER_ADMIN';

  // Chat state
  const [activeChannelId, setActiveChannelId] = useState<string>('ch-announcements');
  const [activeDmId, setActiveDmId] = useState<string | null>(null);
  const [channels, setChannels] = useState(MOCK_CHANNELS);
  const [dms] = useState(MOCK_DMS);
  const [channelMessages, setChannelMessages] = useState<Record<string, ChatMessage[]>>(MOCK_CHANNEL_MESSAGES);
  const [dmMessages, setDmMessages] = useState<Record<string, ChatMessage[]>>(MOCK_DM_MESSAGES);

  // UI state
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [channelSectionOpen, setChannelSectionOpen] = useState(true);
  const [dmSectionOpen, setDmSectionOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Role-based Channel Visibility (Boss sees all; others ONLY see groups they were added to)
  const visibleChannels = channels.filter(c => {
    if (isBoss) return true; // Boss is super admin and manages all groups
    return c.members.includes(currentUser.id);
  });

  // Ensure activeChannelId is always valid for the active role
  useEffect(() => {
    if (visibleChannels.length > 0 && !visibleChannels.some(c => c.id === activeChannelId) && !activeDmId) {
      setActiveChannelId(visibleChannels[0].id);
    }
  }, [currentRole, currentUser.id, visibleChannels, activeChannelId, activeDmId]);

  // 2. Role-based Direct Message (DM) Isolation:
  // Boss (usr-1): can DM anyone (Manager, Dev, HR, Client)
  // Manager (usr-2): DMs with Boss (usr-1), Dev (usr-3), HR (usr-5), Client (usr-4)
  // Developer (usr-3): DMs with Team Lead (usr-2), Boss (usr-1)
  // HR (usr-5): DMs with Boss (usr-1), Team Lead (usr-2)
  // Client (usr-4): DMs with Boss (usr-1), Team Lead (usr-2)
  const allowedDmParticipants: Record<string, string[]> = {
    'SUPER_ADMIN': ['usr-2', 'usr-3', 'usr-5', 'usr-4'],
    'MANAGER': ['usr-1', 'usr-3', 'usr-5', 'usr-4'],
    'EMPLOYEE': ['usr-2', 'usr-1'],
    'HR': ['usr-1', 'usr-2'],
    'CLIENT': ['usr-1', 'usr-2']
  };

  const visibleDms = dms.filter(d => {
    const allowed = allowedDmParticipants[currentRole] || ['usr-1', 'usr-2'];
    return allowed.includes(d.participantId);
  });

  // Derived
  const activeChannel = channels.find(c => c.id === activeChannelId) ?? visibleChannels[0] ?? null;
  const activeDM = dms.find(d => d.id === activeDmId) ?? null;
  const activeDMUser = activeDM ? CHAT_USERS[activeDM.participantId] : null;

  // Messages
  const messages: ChatMessage[] = activeDmId
    ? (dmMessages[activeDmId] || [])
    : (channelMessages[activeChannel?.id || activeChannelId] || []);

  // Grouped by date
  const groupedMessages = messages.reduce<{ date: string; msgs: ChatMessage[] }[]>((acc, msg) => {
    const last = acc[acc.length - 1];
    if (!last || last.date !== msg.dateGroup) {
      acc.push({ date: msg.dateGroup, msgs: [msg] });
    } else {
      last.msgs.push(msg);
    }
    return acc;
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeChannelId, activeDmId]);

  // Clear unread on channel switch
  useEffect(() => {
    setChannels(prev => prev.map(c => c.id === activeChannelId ? { ...c, unreadCount: 0 } : c));
  }, [activeChannelId]);

  // Handle Boss member toggle in channels
  const handleToggleMember = (channelId: string, userId: string) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id !== channelId) return ch;
      const isMember = ch.members.includes(userId);
      const newMembers = isMember ? ch.members.filter(m => m !== userId) : [...ch.members, userId];
      return { ...ch, members: newMembers };
    }));
  };

  // Handle send
  const handleSend = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
      timeLabel: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      dateGroup: 'Today',
      status: 'sent',
      reactions: [],
      attachments: [],
      replyTo: replyTo ? {
        id: replyTo.id,
        senderName: CHAT_USERS[replyTo.senderId]?.name || 'Teammate',
        text: replyTo.text,
      } : undefined,
    };

    if (activeDmId) {
      setDmMessages(prev => ({ ...prev, [activeDmId]: [...(prev[activeDmId] || []), newMsg] }));
    } else if (activeChannel) {
      setChannelMessages(prev => ({ ...prev, [activeChannel.id]: [...(prev[activeChannel.id] || []), newMsg] }));
    }
    setReplyTo(null);
  };

  // Handle react
  const handleReact = useCallback((msgId: string, emoji: MessageReaction['emoji']) => {
    const updateMessages = (msgs: ChatMessage[]) =>
      msgs.map(m => {
        if (m.id !== msgId) return m;
        const existing = m.reactions.find(r => r.emoji === emoji);
        if (existing) {
          return {
            ...m, reactions: m.reactions.map(r =>
              r.emoji === emoji
                ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
                : r
            ).filter(r => r.count > 0)
          };
        }
        return { ...m, reactions: [...m.reactions, { emoji, count: 1, users: [currentUser.id], reacted: true }] };
      });

    if (activeDmId) {
      setDmMessages(prev => ({ ...prev, [activeDmId]: updateMessages(prev[activeDmId] || []) }));
    } else if (activeChannel) {
      setChannelMessages(prev => ({ ...prev, [activeChannel.id]: updateMessages(prev[activeChannel.id] || []) }));
    }
  }, [activeChannel, activeDmId, currentUser.id]);

  // Handle pin
  const handlePin = useCallback((msgId: string) => {
    if (!activeChannel) return;
    setChannelMessages(prev => ({
      ...prev,
      [activeChannel.id]: (prev[activeChannel.id] || []).map(m =>
        m.id === msgId ? { ...m, isPinned: !m.isPinned } : m
      )
    }));
  }, [activeChannel]);

  // Switch channel
  const switchChannel = (id: string) => {
    setActiveChannelId(id);
    setActiveDmId(null);
    setReplyTo(null);
  };

  // Switch DM
  const switchDM = (id: string) => {
    setActiveDmId(id);
    setReplyTo(null);
  };

  // Filtered channels
  const filteredChannels = visibleChannels.filter(c =>
    c.name.toLowerCase().includes(sidebarSearch.toLowerCase())
  );
  const filteredDMs = visibleDms.filter(d => {
    const u = CHAT_USERS[d.participantId];
    return u?.name.toLowerCase().includes(sidebarSearch.toLowerCase());
  });

  const canSend = isBoss || !activeChannel?.onlyAdminCanPost;

  const allUnread = visibleChannels.reduce((a, c) => a + c.unreadCount, 0) +
    visibleDms.reduce((a, d) => a + d.unreadCount, 0);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-950 overflow-hidden">

      {/* ── LEFT SIDEBAR ── */}
      <div className="w-64 flex flex-col border-r border-slate-800 bg-slate-900 shrink-0">
        {/* Workspace header */}
        <div className="px-4 py-3 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-slate-100">Team Chat</span>
              {allUnread > 0 && (
                <span className="min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">{allUnread}</span>
              )}
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">
              {currentRole.replace('_', ' ')}
            </span>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              value={sidebarSearch}
              onChange={e => setSidebarSearch(e.target.value)}
              placeholder="Search my channels..."
              className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Scrollable nav */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1 px-2">

          {/* Channels section */}
          <div>
            <div className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <button
                onClick={() => setChannelSectionOpen(p => !p)}
                className="flex items-center gap-1.5 hover:text-slate-300 transition-colors"
              >
                {channelSectionOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span>My Groups ({filteredChannels.length})</span>
              </button>
              {isBoss && (
                <span className="text-[9px] text-indigo-400 font-semibold lowercase">all groups</span>
              )}
            </div>

            {channelSectionOpen && (
              <div className="space-y-0.5 mt-1">
                {filteredChannels.length === 0 ? (
                  <p className="text-[11px] text-slate-500 px-3 py-2">No groups assigned to you yet.</p>
                ) : (
                  filteredChannels.map(ch => (
                    <ChannelItem
                      key={ch.id}
                      channel={ch}
                      isActive={!activeDmId && activeChannel?.id === ch.id}
                      onClick={() => switchChannel(ch.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          <div className="my-2 border-t border-slate-800" />

          {/* DMs section */}
          <div>
            <button
              onClick={() => setDmSectionOpen(p => !p)}
              className="w-full flex items-center gap-2 px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors group"
            >
              {dmSectionOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <span>Direct Messages ({filteredDMs.length})</span>
            </button>

            {dmSectionOpen && (
              <div className="space-y-0.5 mt-1">
                {filteredDMs.length === 0 ? (
                  <p className="text-[11px] text-slate-500 px-3 py-2">No direct messages.</p>
                ) : (
                  filteredDMs.map(dm => (
                    <DMItem
                      key={dm.id}
                      dm={dm}
                      isActive={activeDmId === dm.id}
                      onClick={() => switchDM(dm.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Active User Persona */}
        <div className="px-3 py-2.5 border-t border-slate-800 flex items-center gap-2.5 bg-slate-900/60">
          <div className="relative">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-slate-200 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-indigo-400 truncate">{currentUser.title.split('(')[0]}</p>
          </div>
        </div>
      </div>

      {/* ── MAIN CHAT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <ChannelHeader
          channel={activeChannel}
          dmUser={activeDMUser}
          onToggleInfo={() => setShowInfo(p => !p)}
          showInfo={showInfo}
        />

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto bg-slate-950">
          {/* Welcome banner */}
          {groupedMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mb-4">
                {activeChannel ? <Hash className="w-8 h-8 text-indigo-400" /> : <MessageSquare className="w-8 h-8 text-indigo-400" />}
              </div>
              <h3 className="text-lg font-bold text-slate-200 mb-2">
                {activeChannel ? `Welcome to #${activeChannel.name}!` : `Start a conversation with ${activeDMUser?.name}`}
              </h3>
              <p className="text-sm text-slate-500 max-w-sm">
                {activeChannel?.description || 'Send a message to start chatting.'}
              </p>
            </div>
          )}

          {/* Messages by date group */}
          {groupedMessages.map(group => (
            <div key={group.date}>
              <DateDivider label={group.date} />
              {group.msgs.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  prevMsg={i > 0 ? group.msgs[i - 1] : undefined}
                  isMe={msg.senderId === currentUser.id || (isBoss && (msg.senderId === 'usr-1' || msg.senderId === 'me'))}
                  onReact={handleReact}
                  onReply={setReplyTo}
                  onPin={handlePin}
                />
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input */}
        <div className="bg-slate-950 border-t border-slate-800/50 pt-3">
          <ChatInput
            onSend={handleSend}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
            disabled={!canSend}
            disabledReason={activeChannel?.onlyAdminCanPost ? 'Only admins can post in this broadcast channel' : undefined}
            channelName={activeChannel?.name || activeDMUser?.name?.split(' ')[0] || 'chat'}
          />
        </div>
      </div>

      {/* ── INFO PANEL ── */}
      {showInfo && (
        <InfoPanel
          channel={activeChannel}
          dmUser={activeDMUser}
          onClose={() => setShowInfo(false)}
          isBoss={isBoss}
          onToggleMember={handleToggleMember}
        />
      )}
    </div>
  );
}

export default ChatView;
