import { api, ApiResponse } from '@/lib/api-client';

export const platformService = {
  async getTenantStats(): Promise<ApiResponse<any>> {
    return api.get('/platform/tenants/stats');
  },

  async getTenants(): Promise<ApiResponse<any>> {
    return api.get('/platform/tenants');
  },

  async createTenant(data: any): Promise<ApiResponse<any>> {
    return api.post('/platform/tenants', data);
  },

  async updateTenantStatus(id: number | string, status: string): Promise<ApiResponse<any>> {
    return api.patch(`/platform/tenants/${id}/status`, { status });
  },

  async updateTenantPlan(id: number | string, plan: string): Promise<ApiResponse<any>> {
    return api.patch(`/platform/tenants/${id}/plan`, { plan });
  },

  async updateTenantModules(id: number | string, modules: Record<string, boolean>): Promise<ApiResponse<any>> {
    return api.put(`/platform/tenants/${id}/modules`, { modules });
  },

  async impersonateTenant(id: number | string): Promise<ApiResponse<any>> {
    return api.post(`/platform/tenants/${id}/impersonate`);
  },
};
