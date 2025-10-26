import type { IUser } from './IUser.js';

/**
 * Login credentials
 */
export interface ILoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface IRegisterData {
  fullName?: string;
  email: string;
  password: string;
}

/**
 * Access token data
 */
export interface IAccessToken {
  type: 'bearer';
  token: string;
  expiresAt?: string;
}

/**
 * Authentication response (login/register)
 */
export interface IAuthResponse {
  user: IUser;
  token: IAccessToken;
}
