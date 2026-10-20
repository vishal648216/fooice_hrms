import { api, ApiResponse } from '@/lib/api-client';

export const financeService = {
  // Payroll
  async getPayroll(month?: number, year?: number): Promise<ApiResponse<any>> {
    return api.get('/payroll', { month, year });
  },

  async generatePayroll(month: number, year: number): Promise<ApiResponse<any>> {
    return api.post('/payroll/generate', { month, year });
  },

  async updatePayrollStatus(id: number | string, status: string, payment_mode?: string): Promise<ApiResponse<any>> {
    return api.patch(`/payroll/${id}/status`, { status, payment_mode });
  },

  // Invoices
  async getInvoices(params?: Record<string, any>): Promise<ApiResponse<any>> {
    return api.get('/invoices', params);
  },

  async createInvoice(data: any): Promise<ApiResponse<any>> {
    return api.post('/invoices', data);
  },

  async updateInvoiceStatus(id: number | string, status: string, payment_mode?: string): Promise<ApiResponse<any>> {
    return api.patch(`/invoices/${id}/status`, { status, payment_mode });
  },

  // Expenses
  async getExpenses(params?: Record<string, any>): Promise<ApiResponse<any>> {
    return api.get('/expenses', params);
  },

  async createExpense(data: any): Promise<ApiResponse<any>> {
    return api.post('/expenses', data);
  },

  async updateExpenseStatus(id: number | string, status: string): Promise<ApiResponse<any>> {
    return api.patch(`/expenses/${id}/status`, { status });
  },

  // Budgets
  async getBudgets(): Promise<ApiResponse<any>> {
    return api.get('/budgets');
  },
};
