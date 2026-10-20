'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Send, 
  Paperclip, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  FileText, 
  Image as ImageIcon, 
  Check, 
  Users,
  MessageSquare
} from 'lucide-react';

export default function GroupChat() {
  const { currentRole, currentUser, groups, messages, sendMessage, toggleGroupPermission } = useApp();

  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id || 'g-1');
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: 'image' | 'document' | 'video' } | null>(null);

  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0];
  const groupMessages = messages.filter(m => m.groupId === activeGroupId);

  const isRestrictedForMe = activeGroup?.onlyAdminCanSend && currentRole !== 'ADMIN';
  const isUserBlocked = currentUser.status === 'BLOCKED';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    const success = sendMessage(activeGroupId, inputText, attachedFile || undefined);
    if (success) {
      setInputText('');
      setAttachedFile(null);
    }
  };

  const handleSimulateAttach = (type: 'document' | 'image') => {
    if (type === 'document') {
      setAttachedFile({ name: 'Architecture_Workflow_v2.pdf', size: '1.8 MB', type: 'document' });
    } else {
      setAttachedFile({ name: 'Excalidraw_Wireframe_Export.png', size: '3.2 MB', type: 'image' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Group Chat & Media Hub</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {groups.length} Channels
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Excalidraw Module 5: Group Chat &rarr; Permission Check (Only Admin Can Send vs Everyone) &rarr; Data Storage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[560px]">
        
        {/* Left: Group Channel Selector */}
        <div className="lg:col-span-1 border-r border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
            Team Groups
          </div>

          <div className="space-y-1.5">
            {groups.map((group) => {
              const active = group.id === activeGroupId;
              return (
                <button
                  key={group.id}
                  onClick={() => setActiveGroupId(group.id)}
                  className={`w-full text-left p-3 rounded-xl transition flex items-start justify-between gap-2 ${
                    active 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-xs flex items-center gap-1.5">
                      <span># {group.name}</span>
                      {group.onlyAdminCanSend && (
                        <Lock className={`w-3 h-3 ${active ? 'text-indigo-200' : 'text-amber-500'}`} />
                      )}
                    </div>
                    <div className={`text-[11px] line-clamp-1 ${active ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {group.description}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    active ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {group.memberCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Group Info Box */}
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs mt-6 space-y-2">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>Channel Setting</span>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              {activeGroup.onlyAdminCanSend ? (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  Restricted: Only Admin can send messages here.
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Open: All group members can chat freely.
                </span>
              )}
            </div>

            {/* Admin toggle permission button */}
            {currentRole === 'ADMIN' && (
              <button
                onClick={() => toggleGroupPermission(activeGroup.id)}
                className="w-full mt-2 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                {activeGroup.onlyAdminCanSend ? (
                  <>
                    <Unlock className="w-3 h-3 text-emerald-600" />
                    <span>Switch to Everyone Can Send</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Set Only Admin Can Send</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right: Messages Stream & Input */}
        <div className="lg:col-span-3 flex flex-col justify-between p-4 sm:p-6">
          
          {/* Top Bar for active channel */}
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span># {activeGroup.name}</span>
                {activeGroup.onlyAdminCanSend && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Only Admin Can Send</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{activeGroup.description}</p>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span>{activeGroup.memberCount} members in channel</span>
            </div>
          </div>

          {/* Messages List */}
          <div className="py-4 space-y-4 overflow-y-auto max-h-[380px] min-h-[260px]">
            {groupMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No messages yet in this group. Be the first to start the conversation!
              </div>
            ) : (
              groupMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end' : ''}`}>
                      <div className={`flex items-center gap-2 text-xs ${isMe ? 'justify-end' : ''}`}>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {msg.senderRole}
                        </span>
                        <span className="text-[10px] text-slate-400">{msg.createdAt}</span>
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {msg.content}

                        {/* File Attachment preview */}
                        {msg.fileName && (
                          <div className={`mt-2.5 p-2 rounded-xl flex items-center gap-2 text-xs ${
                            isMe ? 'bg-indigo-700/80 text-white' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                          }`}>
                            {msg.fileType === 'document' ? (
                              <FileText className="w-4 h-4 text-rose-400" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-emerald-400" />
                            )}
                            <div className="flex-1 truncate">
                              <div className="font-bold truncate">{msg.fileName}</div>
                              <div className="text-[10px] opacity-75">{msg.fileSize}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Restriction Notice or Message Input */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {isUserBlocked ? (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>Your account is currently BLOCKED by the administrator. Messaging privileges are suspended.</span>
              </div>
            ) : isRestrictedForMe ? (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  <span>Channel is set to <strong>Only Admin Can Send Messages</strong>. You are currently in read-only mode.</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900">
                  Read Only
                </span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-2">
                
                {/* File Attachment Pill Preview */}
                {attachedFile && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{attachedFile.name} ({attachedFile.size})</span>
                    <button type="button" onClick={() => setAttachedFile(null)} className="ml-1 hover:text-rose-500">
                      &times;
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {/* Media / File attachment simulation buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Attach Document PDF"
                      onClick={() => handleSimulateAttach('document')}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Attach Image / Screenshot"
                      onClick={() => handleSimulateAttach('image')}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder={`Message #${activeGroup.name}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
