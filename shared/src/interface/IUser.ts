/**
 * User Interface
 * Represents a user in the system
 */
export interface IUser {
  id: number;
  fullName: string | null;
  email: string;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * User without sensitive data (for public profiles)
 */
export interface IPublicUser {
  id: number;
  fullName: string | null;
}
