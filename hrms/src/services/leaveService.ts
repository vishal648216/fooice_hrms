import { api, ApiResponse } from '@/lib/api-client';

export const leaveService = {
  async getLeaveTypes(): Promise<ApiResponse<any>> {
    return api.get('/leaves/types');
  },

  async getMyBalance(): Promise<ApiResponse<any>> {
    return api.get('/leaves/balance');
  },

  async getLeaveRequests(): Promise<ApiResponse<any>> {
    return api.get('/leaves/requests');
  },

  async applyLeave(data: {
    leave_type_id: number;
    start_date: string;
    end_date: string;
    reason: string;
  }): Promise<ApiResponse<any>> {
    return api.post('/leaves/apply', data);
  },

  async updateLeaveStatus(id: number | string, status: 'APPROVED' | 'REJECTED', rejection_reason?: string): Promise<ApiResponse<any>> {
    return api.patch(`/leaves/requests/${id}/status`, { status, rejection_reason });
  },

  async cancelLeave(id: number | string): Promise<ApiResponse<any>> {
    return api.delete(`/leaves/requests/${id}`);
  },
};
