import { ApiError } from './errors';

export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  status: number;
}

const DEFAULT_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private baseUrl: string = DEFAULT_API_URL;
  private token: string | null = null;
  private farmId: string | null = null;

  setAuthToken(token: string | null) {
    this.token = token;
  }

  setFarmId(farmId: string | null) {
    this.farmId = farmId;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (this.farmId) {
      headers['X-Farm-Id'] = this.farmId;
    }

    return headers;
  }

  async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(headers),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new ApiError(json.error?.message || json.message || 'Request failed', res.status, json.error);
      }

      return {
        data: json.data !== undefined ? json.data : json,
        message: json.message,
        status: res.status,
      };
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(err.message || 'Network error', 500);
    }
  }

  async post<T>(endpoint: string, body?: unknown, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(headers),
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new ApiError(json.error?.message || json.message || 'Request failed', res.status, json.error);
      }

      return {
        data: json.data !== undefined ? json.data : json,
        message: json.message,
        status: res.status,
      };
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(err.message || 'Network error', 500);
    }
  }

  async put<T>(endpoint: string, body?: unknown, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(headers),
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new ApiError(json.error?.message || json.message || 'Request failed', res.status, json.error);
      }

      return {
        data: json.data !== undefined ? json.data : json,
        message: json.message,
        status: res.status,
      };
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(err.message || 'Network error', 500);
    }
  }

  async delete<T>(endpoint: string, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(headers),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new ApiError(json.error?.message || json.message || 'Request failed', res.status, json.error);
      }

      return {
        data: json.data !== undefined ? json.data : json,
        message: json.message,
        status: res.status,
      };
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(err.message || 'Network error', 500);
    }
  }
}

export const apiClient = new ApiClient();
