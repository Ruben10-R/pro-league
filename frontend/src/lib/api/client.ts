import type { IApiResponse } from "@pro-league/shared";

/**
 * API Client Configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

/**
 * API Client for making HTTP requests
 */
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * Get authorization header with token
   */
  private getAuthHeader(): HeadersInit {
    if (typeof window === "undefined") {
      return {};
    }

    const token = localStorage.getItem("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<IApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeader(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      return data as IApiResponse<T>;
    } catch (error) {
      // Network error or JSON parse error
      return {
        success: false,
        message: {
          key: "errors.network",
          params: {},
        },
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<IApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<IApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown): Promise<IApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<IApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
