import { ApiResponse } from '../server/types';
import {
  ExecuteSqlInput,
  ExplainSqlInput,
  FormatSqlInput,
  ValidateSqlInput,
  OptimizeSqlInput,
} from '../server/schemas/sql.schema';
import { SubmitChallengeInput } from '../server/schemas/challenge.schema';

export const authTokens = {
  getAccessToken: (): string | null => {
    return localStorage.getItem('mobilesql_access_token') || sessionStorage.getItem('mobilesql_access_token');
  },
  getRefreshToken: (): string | null => {
    return localStorage.getItem('mobilesql_refresh_token') || sessionStorage.getItem('mobilesql_refresh_token');
  },
  isRemembered: (): boolean => {
    return localStorage.getItem('mobilesql_remember_me') === 'true';
  },
  setTokens: (accessToken: string, refreshToken: string, rememberMe = true) => {
    if (rememberMe) {
      localStorage.setItem('mobilesql_access_token', accessToken);
      localStorage.setItem('mobilesql_refresh_token', refreshToken);
      localStorage.setItem('mobilesql_remember_me', 'true');
      sessionStorage.removeItem('mobilesql_access_token');
      sessionStorage.removeItem('mobilesql_refresh_token');
    } else {
      sessionStorage.setItem('mobilesql_access_token', accessToken);
      sessionStorage.setItem('mobilesql_refresh_token', refreshToken);
      sessionStorage.setItem('mobilesql_remember_me', 'false');
      localStorage.removeItem('mobilesql_access_token');
      localStorage.removeItem('mobilesql_refresh_token');
      localStorage.removeItem('mobilesql_remember_me');
    }
  },
  clear: () => {
    localStorage.removeItem('mobilesql_access_token');
    localStorage.removeItem('mobilesql_refresh_token');
    localStorage.removeItem('mobilesql_remember_me');
    sessionStorage.removeItem('mobilesql_access_token');
    sessionStorage.removeItem('mobilesql_refresh_token');
    sessionStorage.removeItem('mobilesql_remember_me');
  },
};

class ApiClient {
  private baseUrl = '/api/v1';

  private getAuthHeaders(): HeadersInit {
    const token = authTokens.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined) searchParams.append(key, String(val));
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const res = await fetch(url, {
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
      body: body !== undefined ? JSON.stringify(body) : undefined,
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
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data: ApiResponse<T> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'API Request failed');
    }

    return data.data as T;
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
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

  // --- SQL Execution Engine ---
  readonly sql = {
    execute: (input: ExecuteSqlInput) => this.post<any>('/sql/execute', input),
    explain: (input: ExplainSqlInput) => this.post<any>('/sql/explain', input),
    format: (input: FormatSqlInput) => this.post<{ formattedSql: string }>('/sql/format', input),
    validate: (input: ValidateSqlInput) => this.post<any>('/sql/validate', input),
    optimize: (input: OptimizeSqlInput) => this.post<any>('/sql/optimize', input),
  };

  // --- Challenges Engine ---
  readonly challenges = {
    list: (difficulty?: string) => this.get<any[]>('/challenges', { difficulty }),
    getDaily: () => this.get<any>('/challenges/daily'),
    getBySlug: (slug: string) => this.get<any>(`/challenges/${slug}`),
    submitAttempt: (slug: string, input: SubmitChallengeInput) =>
      this.post<any>(`/challenges/${slug}/submit`, input),
    getLeaderboard: (limit: number = 20) =>
      this.get<any[]>('/challenges/leaderboard', { limit }),
  };

  // --- Academy Engine ---
  readonly academy = {
    getTracks: () => this.get<any[]>('/academy/tracks'),
    getTrackBySlug: (slug: string) => this.get<any>(`/academy/tracks/${slug}`),
    getLesson: (slug: string) => this.get<any>(`/academy/lessons/${slug}`),
    completeLesson: (slug: string, query?: string) =>
      this.post<any>(`/academy/lessons/${slug}/complete`, { query }),
    submitQuiz: (slug: string, selectedOptionIndex: number) =>
      this.post<any>(`/academy/lessons/${slug}/quiz`, { selectedOptionIndex }),
    getCertificates: () => this.get<any[]>('/academy/certificates'),
  };

  // --- SQL Playground & Storage ---
  readonly playground = {
    getSavedQueries: () => this.get<any[]>('/playground/saved-queries'),
    saveQuery: (data: { title: string; query: string; dialect: string; tags?: string[] }) =>
      this.post<any>('/playground/saved-queries', data),
    deleteSavedQuery: (id: string) => this.delete<any>(`/playground/saved-queries/${id}`),
    getHistory: (limit: number = 50) => this.get<any[]>('/playground/history', { limit }),
    getTemplates: () => this.get<any[]>('/playground/templates'),
    getDatabases: () => this.get<any[]>('/playground/databases'),
  };

  // --- Analytics Studio ---
  readonly analytics = {
    getDashboards: () => this.get<any[]>('/analytics/dashboards'),
    getDashboard: (id: string) => this.get<any>(`/analytics/dashboards/${id}`),
    createDashboard: (data: { name: string; description?: string }) =>
      this.post<any>('/analytics/dashboards', data),
    saveWidget: (dashboardId: string, widgetData: any) =>
      this.post<any>(`/analytics/dashboards/${dashboardId}/widgets`, widgetData),
    deleteWidget: (dashboardId: string, widgetId: string) =>
      this.delete<any>(`/analytics/dashboards/${dashboardId}/widgets/${widgetId}`),
  };

  // --- Dataset Builder ---
  readonly datasets = {
    list: (category?: string) => this.get<any[]>('/datasets', { category }),
    getById: (id: string) => this.get<any>(`/datasets/${id}`),
    create: (data: any) => this.post<any>('/datasets', data),
    delete: (id: string) => this.delete<any>(`/datasets/${id}`),
  };

  // --- Portfolio & Career ---
  readonly portfolio = {
    getPortfolio: (username?: string) => this.get<any>('/portfolio', { username }),
    updateProfile: (data: any) => this.put<any>('/portfolio/profile', data),
    getProjects: () => this.get<any[]>('/portfolio/projects'),
    createProject: (data: any) => this.post<any>('/portfolio/projects', data),
  };

  // --- Auth & Profile ---
  readonly auth = {
    login: (credentials: { email: string; password: string }) =>
      this.post<{ user: any; tokens: { accessToken: string; refreshToken: string } }>('/auth/login', credentials),
    register: (userData: { name: string; username: string; email: string; password: string; role?: string }) =>
      this.post<{ user: any; tokens: { accessToken: string; refreshToken: string }; verificationToken?: string }>('/auth/register', userData),
    guest: (data?: { displayName?: string }) =>
      this.post<{ user: any; tokens: { accessToken: string; refreshToken: string } }>('/auth/guest', data),
    oauth: (data: { provider: 'google' | 'github' | 'microsoft'; providerUserId: string; email: string; name: string; avatarUrl?: string }) =>
      this.post<{ user: any; tokens: { accessToken: string; refreshToken: string } }>('/auth/oauth', data),
    getMe: () => this.get<any>('/auth/me'),
    refresh: (refreshToken: string) =>
      this.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }),
    logout: (refreshToken?: string) =>
      this.post<any>('/auth/logout', { refreshToken }),
    forgotPassword: (email: string) =>
      this.post<{ resetToken?: string }>('/auth/forgot-password', { email }),
    resetPassword: (data: { token: string; newPassword: string }) =>
      this.post<any>('/auth/reset-password', data),
    verifyEmail: (token: string) =>
      this.post<any>('/auth/verify-email', { token }),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      this.patch<any>('/auth/change-password', data),
    changeEmail: (data: { currentPassword: string; newEmail: string }) =>
      this.patch<any>('/auth/change-email', data),
  };
}

export const apiClient = new ApiClient();
