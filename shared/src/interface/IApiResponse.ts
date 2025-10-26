/**
 * Translation message with key and parameters
 */
export interface ITranslationMessage {
  key: string;
  params?: Record<string, string | number>;
}

/**
 * API Error response
 */
export interface IApiError {
  success: false;
  message: ITranslationMessage;
  errors?: IValidationError[];
}

/**
 * Validation error for a specific field
 */
export interface IValidationError {
  field: string;
  rule: string;
  message: ITranslationMessage;
}

/**
 * API Success response
 */
export interface IApiSuccess<T = unknown> {
  success: true;
  message?: ITranslationMessage;
  data: T;
}

/**
 * Generic API response (success or error)
 */
export type IApiResponse<T = unknown> = IApiSuccess<T> | IApiError;
