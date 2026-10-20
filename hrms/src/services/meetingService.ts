import { api, ApiResponse } from '@/lib/api-client';

export const meetingService = {
  async getMeetings(): Promise<ApiResponse<any>> {
    return api.get('/meetings');
  },

  async createMeeting(data: any): Promise<ApiResponse<any>> {
    return api.post('/meetings', data);
  },

  async updateMeetingStatus(id: number | string, status: string): Promise<ApiResponse<any>> {
    return api.patch(`/meetings/${id}/status`, { status });
  },

  async saveAiNotes(id: number | string, ai_notes: string): Promise<ApiResponse<any>> {
    return api.put(`/meetings/${id}/ai-notes`, { ai_notes });
  },

  async deleteMeeting(id: number | string): Promise<ApiResponse<any>> {
    return api.delete(`/meetings/${id}`);
  },
};
