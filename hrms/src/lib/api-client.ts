/**
 * OfficeOS Centralized API Client
 * Connects Next.js Frontend with Laravel Multi-Tenant Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  summary?: any;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('officeos_auth_token') || localStorage.getItem('platform_admin_token');
  }

  public setToken(token: string, isPlatformAdmin: boolean = false): void {
    if (typeof window === 'undefined') return;
    if (isPlatformAdmin) {
      localStorage.setItem('platform_admin_token', token);
    } else {
      localStorage.setItem('officeos_auth_token', token);
    }
  }

  public clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('officeos_auth_token');
    localStorage.removeItem('platform_admin_token');
    localStorage.removeItem('officeos_user');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Request failed with status ${response.status}`,
          errors: data.errors,
          data: undefined,
        };
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Unable to connect to the backend server. Running in offline/standalone mode.',
        data: undefined,
      };
    }
  }

  public get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
      ).toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  public post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { method: 'GET' });
      const json = await res.json();
      return json.status === 'ok';
    } catch {
      return false;
    }
  }
}

export const api = new ApiClient(API_BASE_URL);
