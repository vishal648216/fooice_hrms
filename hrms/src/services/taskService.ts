import { api, ApiResponse } from '@/lib/api-client';

export const taskService = {
  async getTasks(params?: Record<string, any>): Promise<ApiResponse<any>> {
    return api.get('/tasks', params);
  },

  async getTask(id: number | string): Promise<ApiResponse<any>> {
    return api.get(`/tasks/${id}`);
  },

  async createTask(data: any): Promise<ApiResponse<any>> {
    return api.post('/tasks', data);
  },

  async updateTask(id: number | string, data: any): Promise<ApiResponse<any>> {
    return api.put(`/tasks/${id}`, data);
  },

  async updateTaskStatus(id: number | string, status: string, order_index?: number): Promise<ApiResponse<any>> {
    return api.patch(`/tasks/${id}/status`, { status, order_index });
  },

  async deleteTask(id: number | string): Promise<ApiResponse<any>> {
    return api.delete(`/tasks/${id}`);
  },

  async addComment(taskId: number | string, content: string, mentions?: number[]): Promise<ApiResponse<any>> {
    return api.post(`/tasks/${taskId}/comments`, { content, mentions });
  },

  async logTime(taskId: number | string, data: { logged_hours: number; description?: string; logged_date: string }): Promise<ApiResponse<any>> {
    return api.post(`/tasks/${taskId}/time-logs`, data);
  },
};
