import type {
  IAuthResponse,
  ILoginCredentials,
  IRegisterData,
  IUser,
  IApiResponse,
} from "@pro-league/shared";
import { apiClient } from "./client";

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Register a new user
   */
  async register(data: IRegisterData): Promise<IApiResponse<IAuthResponse>> {
    const response = await apiClient.post<IAuthResponse>(
      "/api/auth/register",
      data,
    );

    // Store token if registration successful
    if (response.success) {
      localStorage.setItem("auth_token", response.data.token.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  },

  /**
   * Login a user
   */
  async login(
    credentials: ILoginCredentials,
  ): Promise<IApiResponse<IAuthResponse>> {
    const response = await apiClient.post<IAuthResponse>(
      "/api/auth/login",
      credentials,
    );

    // Store token if login successful
    if (response.success) {
      localStorage.setItem("auth_token", response.data.token.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<IApiResponse<null>> {
    const response = await apiClient.post<null>("/api/auth/logout");

    // Clear token regardless of response
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    return response;
  },

  /**
   * Get current user
   */
  async getMe(): Promise<IApiResponse<IUser>> {
    return apiClient.get<IUser>("/api/auth/me");
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem("auth_token");
  },

  /**
   * Get stored user
   */
  getUser(): IUser | null {
    if (typeof window === "undefined") {
      return null;
    }
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
