/**
 * Update profile data (name)
 */
export interface IUpdateProfile {
  fullName?: string;
}

/**
 * Change password data
 */
export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}
