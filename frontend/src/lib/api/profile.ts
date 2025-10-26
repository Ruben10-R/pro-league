import type {
  IApiResponse,
  IUser,
  IUpdateProfile,
  IChangePassword,
} from "@pro-league/shared";
import { apiClient } from "./client";

/**
 * Profile Service
 */
export const profileService = {
  /**
   * Get current user's profile
   */
  async getProfile(): Promise<IApiResponse<IUser>> {
    return apiClient.get<IUser>("/api/profile");
  },

  /**
   * Update profile (name)
   */
  async updateProfile(data: IUpdateProfile): Promise<IApiResponse<IUser>> {
    return apiClient.put<IUser>("/api/profile", data);
  },

  /**
   * Change password
   */
  async changePassword(data: IChangePassword): Promise<IApiResponse<null>> {
    return apiClient.put<null>("/api/profile/password", data);
  },
};
