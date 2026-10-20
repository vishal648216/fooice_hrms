import { api, ApiResponse } from '@/lib/api-client';

export const employeeService = {
  async getEmployees(params?: Record<string, any>): Promise<ApiResponse<any>> {
    return api.get('/employees', params);
  },

  async createEmployee(data: any): Promise<ApiResponse<any>> {
    return api.post('/employees', data);
  },

  async getEmployee(id: number | string): Promise<ApiResponse<any>> {
    return api.get(`/employees/${id}`);
  },

  async updateEmployee(id: number | string, data: any): Promise<ApiResponse<any>> {
    return api.put(`/employees/${id}`, data);
  },

  async deleteEmployee(id: number | string): Promise<ApiResponse<any>> {
    return api.delete(`/employees/${id}`);
  },

  // Departments & Designations
  async getDepartments(): Promise<ApiResponse<any>> {
    return api.get('/departments');
  },

  async createDepartment(data: any): Promise<ApiResponse<any>> {
    return api.post('/departments', data);
  },

  async getShifts(): Promise<ApiResponse<any>> {
    return api.get('/shifts');
  },

  async getHolidays(year?: number): Promise<ApiResponse<any>> {
    return api.get('/holidays', { year });
  },
};
