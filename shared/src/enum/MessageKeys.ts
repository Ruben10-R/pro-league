/**
 * Message Keys Enum
 * Used for i18n translation keys across frontend and backend
 */

/**
 * Error message keys for consistent error handling
 */
export enum ErrorMessageKeys {
  // Auth errors
  AUTH_INVALID_CREDENTIALS = 'auth.errors.invalidCredentials',
  AUTH_EMAIL_TAKEN = 'auth.errors.emailTaken',
  AUTH_REGISTRATION_FAILED = 'auth.errors.registrationFailed',
  AUTH_LOGIN_FAILED = 'auth.errors.loginFailed',
  AUTH_LOGOUT_FAILED = 'auth.errors.logoutFailed',
  AUTH_UNAUTHORIZED = 'auth.errors.unauthorized',
  AUTH_TOKEN_INVALID = 'auth.errors.tokenInvalid',
  AUTH_TOKEN_EXPIRED = 'auth.errors.tokenExpired',

  // Profile errors
  INVALID_CURRENT_PASSWORD = 'profile.errors.invalidCurrentPassword',
  PROFILE_UPDATE_FAILED = 'profile.errors.updateFailed',

  // Validation errors
  VALIDATION_FAILED = 'validation.failed',
  VALIDATION_REQUIRED = 'validation.required',
  VALIDATION_EMAIL_INVALID = 'validation.email',
  VALIDATION_MIN_LENGTH = 'validation.minLength',
  VALIDATION_MAX_LENGTH = 'validation.maxLength',

  // Generic errors
  ERROR_GENERIC = 'errors.generic',
  ERROR_NETWORK = 'errors.network',
  ERROR_NOT_FOUND = 'errors.notFound',
  ERROR_SERVER = 'errors.server',
}

/**
 * Success message keys
 */
export enum SuccessMessageKeys {
  AUTH_REGISTER_SUCCESS = 'auth.register.success',
  AUTH_LOGIN_SUCCESS = 'auth.login.success',
  AUTH_LOGOUT_SUCCESS = 'auth.logout.success',

  PROFILE_RETRIEVED = 'profile.retrieved',
  PROFILE_UPDATED = 'profile.updated',
  PASSWORD_CHANGED = 'profile.passwordChanged',
}
