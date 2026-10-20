import { api, ApiResponse } from '@/lib/api-client';

export const projectService = {
  async getProjects(params?: Record<string, any>): Promise<ApiResponse<any>> {
    return api.get('/projects', params);
  },

  async getProject(id: number | string): Promise<ApiResponse<any>> {
    return api.get(`/projects/${id}`);
  },

  async createProject(data: any): Promise<ApiResponse<any>> {
    return api.post('/projects', data);
  },

  async updateProject(id: number | string, data: any): Promise<ApiResponse<any>> {
    return api.put(`/projects/${id}`, data);
  },

  async deleteProject(id: number | string): Promise<ApiResponse<any>> {
    return api.delete(`/projects/${id}`);
  },

  async addMilestone(projectId: number | string, data: any): Promise<ApiResponse<any>> {
    return api.post(`/projects/${projectId}/milestones`, data);
  },

  async getRequirements(projectId: number | string): Promise<ApiResponse<any>> {
    return api.get(`/projects/${projectId}/requirements`);
  },
};
