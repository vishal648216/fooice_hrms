'use client';

import React, { useState } from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Settings, 
  Users, 
  ArrowLeft, 
  Monitor, 
  Sparkles, 
  ShieldCheck, 
  Info, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { INITIAL_MEETINGS } from '@/lib/calendar-meetings-data';

interface MeetingRoomPlaceholderViewProps {
  meetingId?: string;
}

export const MeetingRoomPlaceholderView: React.FC<MeetingRoomPlaceholderViewProps> = ({ 
  meetingId = 'mtg-101' 
}) => {
  const { setActivePath, addToast } = useOfficeOS();

  const meeting = INITIAL_MEETINGS.find(m => m.id === meetingId) || INITIAL_MEETINGS[0];

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePath(`/communication/meetings/${meeting.id}`)}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Meeting Details
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> End-to-End Encrypted
          </Badge>
        </div>
      </div>

      {/* Main Pre-Join Waiting Lobby Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Video Preview Simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-6">
            
            {/* Top Status */}
            <div className="flex items-center justify-between text-xs text-white z-10">
              <span className="font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                OfficeOS Video Engine
              </span>
              <span className="font-mono text-slate-400">1080p HD Ready</span>
            </div>

            {/* Center: Camera State */}
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
              {isCameraOn ? (
                <div className="space-y-2">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto ring-4 ring-white/10 shadow-lg">
                    MP
                  </div>
                  <div className="text-white font-bold text-sm">Mayur Patel (You)</div>
                  <p className="text-xs text-slate-400">Camera preview active</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-20 h-20 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                    <VideoOff className="w-8 h-8" />
                  </div>
                  <p className="text-xs text-slate-400">Camera is turned off</p>
                </div>
              )}
            </div>

            {/* Bottom Floating Control Pills */}
            <div className="flex items-center justify-center gap-3 z-10">
              <button
                onClick={() => {
                  setIsCameraOn(!isCameraOn);
                  addToast({
                    title: isCameraOn ? 'Camera Disabled' : 'Camera Enabled',
                    description: isCameraOn ? 'Video feed paused.' : 'Webcam active.',
                    type: 'info'
                  });
                }}
                className={`p-3.5 rounded-full transition shadow-lg ${
                  isCameraOn
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
                title={isCameraOn ? 'Turn camera off' : 'Turn camera on'}
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => {
                  setIsMicOn(!isMicOn);
                  addToast({
                    title: isMicOn ? 'Microphone Muted' : 'Microphone Unmuted',
                    description: isMicOn ? 'Audio muted.' : 'Microphone ready.',
                    type: 'info'
                  });
                }}
                className={`p-3.5 rounded-full transition shadow-lg ${
                  isMicOn
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
                title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => addToast({ title: 'Device Settings', description: 'Headphones & audio stream verified.', type: 'info' })}
                className="p-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition shadow-lg"
                title="Audio/Video Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>Input: Default HD Web Camera</span>
            <span>Microphone: Built-in Array (Noise Suppression On)</span>
          </div>
        </div>

        {/* Right: Meeting Join Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <Badge variant="primary" size="md">
              Waiting Lobby
            </Badge>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {meeting.title}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {meeting.description}
            </p>
          </div>

          {/* Meeting Details Pill */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Scheduled Time:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {meeting.startTime} – {meeting.endTime} ({meeting.timezone})
              </span>
            </div>
            {meeting.project && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Project Context:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {meeting.project.name}
                </span>
              </div>
            )}
            {meeting.client && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Client Partner:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {meeting.client.company}
                </span>
              </div>
            )}
          </div>

          {/* Attendees already in room */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Already in lobby / call:</span>
              <span className="text-emerald-600 font-bold">2 Connected</span>
            </div>
            <div className="flex items-center gap-2">
              {meeting.participants.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center gap-1.5 p-1.5 pr-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <img src={p.avatar} alt={p.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{p.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Join Actions */}
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-lg font-bold"
              onClick={() => {
                addToast({
                  title: 'Entering Live Room',
                  description: `Connected to ${meeting.title} session. Next Module will introduce full Google Meet-style WebRTC grid!`,
                  type: 'success'
                });
              }}
              leftIcon={<Video className="w-5 h-5" />}
            >
              Join Live Meeting
            </Button>

            <Button
              variant="outline"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                addToast({
                  title: 'Screen Share Ready',
                  description: 'Display screen sharing will activate upon room join.',
                  type: 'info'
                });
              }}
              leftIcon={<Monitor className="w-4 h-4" />}
            >
              Present Screen Only
            </Button>
          </div>

          {/* Architecture Readiness Notice */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Architecture Ready:</span> This lobby route (<code>/communication/meetings/:id/room</code>) is prepared for the upcoming <strong>WebRTC Video Meeting Room module</strong> (Google Meet interface with live grid, grid layouts, reactions, audio bars, and AI live captioning).
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
