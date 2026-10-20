'use client';

import React from 'react';
import { useOfficeOS } from '@/context/OfficeOSContext';
import { MeetingsListView } from './MeetingsListView';
import { MeetingDetailView } from './MeetingDetailView';
import { VideoMeetingRoom } from '@/components/meetings/VideoMeetingRoom';
import { INITIAL_MEETINGS } from '@/lib/calendar-meetings-data';

export const MeetingsRouter: React.FC = () => {
  const { activePath } = useOfficeOS();

  // Pattern check for /communication/meetings/:id/room
  const roomMatch = activePath.match(/\/communication\/meetings\/([^/]+)\/room/);
  if (roomMatch) {
    const meetingId = roomMatch[1];
    const meeting = INITIAL_MEETINGS.find(m => m.id === meetingId) || INITIAL_MEETINGS[0];
    return <VideoMeetingRoom meetingId={meetingId} meetingTitle={meeting.title} />;
  }

  // Pattern check for /communication/meetings/:id
  const detailMatch = activePath.match(/\/communication\/meetings\/([^/]+)/);
  if (detailMatch) {
    const candidateId = detailMatch[1];
    if (!['upcoming', 'past', 'today', 'cancelled'].includes(candidateId)) {
      return <MeetingDetailView meetingId={candidateId} />;
    }
  }

  // Default: Meeting List View
  return <MeetingsListView />;
};
