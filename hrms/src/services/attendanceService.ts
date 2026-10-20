import { api, ApiResponse } from '@/lib/api-client';

export const attendanceService = {
  async clockIn(location?: { lat?: number; lng?: number; address?: string }, notes?: string): Promise<ApiResponse<any>> {
    return api.post('/attendance/clock-in', { location, notes });
  },

  async clockOut(): Promise<ApiResponse<any>> {
    return api.post('/attendance/clock-out');
  },

  async getTodayAttendance(): Promise<ApiResponse<any>> {
    return api.get('/attendance/today');
  },

  async getMyHistory(month?: number, year?: number): Promise<ApiResponse<any>> {
    return api.get('/attendance/my-history', { month, year });
  },

  async getTeamSummary(date?: string): Promise<ApiResponse<any>> {
    return api.get('/attendance/summary', { date });
  },

  async getMonthlyReport(month: number, year: number): Promise<ApiResponse<any>> {
    return api.get('/attendance/report', { month, year });
  },
};
