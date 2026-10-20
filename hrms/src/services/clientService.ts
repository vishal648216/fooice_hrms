import { api, ApiResponse } from '@/lib/api-client';

export const clientService = {
  async getClients(params?: Record<string, any>): Promise<ApiResponse<any>> {
    return api.get('/clients', params);
  },

  async createClient(data: any): Promise<ApiResponse<any>> {
    return api.post('/clients', data);
  },

  async getClient(id: number | string): Promise<ApiResponse<any>> {
    return api.get(`/clients/${id}`);
  },

  async updateClient(id: number | string, data: any): Promise<ApiResponse<any>> {
    return api.put(`/clients/${id}`, data);
  },

  async deleteClient(id: number | string): Promise<ApiResponse<any>> {
    return api.delete(`/clients/${id}`);
  },
};
