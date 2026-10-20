import { api, ApiResponse } from '@/lib/api-client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  title?: string;
  employee_code?: string;
  avatar?: string;
  tenant_id: number;
  tenant?: {
    id: number;
    company_name: string;
    slug: string;
    plan: string;
    status: string;
    modules?: Array<{ module_key: string; is_enabled: boolean }>;
  };
}

export const authService = {
  // Tenant Login
  async login(payload: LoginPayload): Promise<ApiResponse<{ token: string; user: AuthUser }>> {
    const res = await api.post<{ token: string; user: AuthUser }>('/auth/login', payload);
    if (res.success && res.data?.token) {
      api.setToken(res.data.token, false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('officeos_user', JSON.stringify(res.data.user));
      }
    }
    return res;
  },

  // Platform Super Admin Login
  async platformLogin(payload: LoginPayload): Promise<ApiResponse<{ token: string; admin: any }>> {
    const res = await api.post<{ token: string; admin: any }>('/platform/login', payload);
    if (res.success && res.data?.token) {
      api.setToken(res.data.token, true);
    }
    return res;
  },

  // Get current user profile
  async getMe(): Promise<ApiResponse<{ user: AuthUser }>> {
    return api.get<{ user: AuthUser }>('/auth/me');
  },

  // Logout
  async logout(): Promise<ApiResponse<void>> {
    const res = await api.post<void>('/auth/logout');
    api.clearToken();
    return res;
  },

  // Check if user is logged in
  getStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('officeos_user');
    return stored ? JSON.parse(stored) : null;
  }
};
