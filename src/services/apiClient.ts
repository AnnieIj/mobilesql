import { ApiResponse } from '../server/types';

class ApiClient {
  private baseUrl = '/api/v1';

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('mobilesql_access_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data: ApiResponse<T> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'API Request failed');
    }

    return data.data as T;
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(body),
    });

    const data: ApiResponse<T> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'API Request failed');
    }

    return data.data as T;
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(body),
    });

    const data: ApiResponse<T> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'API Request failed');
    }

    return data.data as T;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    const data: ApiResponse<T> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'API Request failed');
    }

    return data.data as T;
  }
}

export const apiClient = new ApiClient();
