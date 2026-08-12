import { ApiError } from './errors';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      // Mocked offline/local API fetch placeholder
      return { data: [] as unknown as T, status: 200 };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown network error';
      throw new ApiError(message, 500);
    }
  },

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      return { data: body as T, status: 201 };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown network error';
      throw new ApiError(message, 500);
    }
  },
};
