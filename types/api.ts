/**
 * API response types for better type safety
 */

import { AuraEvent, FlipStatus, FlipConfig } from './aura';

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  error: string;
  message?: string;
}

/**
 * Standard API success response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

/**
 * Aura API responses
 */
export interface AuraEventsResponse {
  events: AuraEvent[];
}

export interface AuraEventResponse {
  event: AuraEvent;
  message?: string;
}

/**
 * Flip API responses
 */
export interface FlipStatusResponse extends FlipStatus {}

export interface FlipResponse {
  success: boolean;
  previousTotal: number;
  newTotal: number;
  message: string;
}

/**
 * Flip config API responses
 */
export interface FlipConfigResponse extends FlipConfig {}

export interface FlipConfigUpdateResponse {
  success: boolean;
  maxFlipsPerDay: number;
  message: string;
}

/**
 * SMS webhook response
 */
export interface SMSWebhookResponse {
  status: 'success' | 'error' | 'parse_error' | 'rate_limited';
  message?: string;
  event?: {
    emoji: string;
    points: number;
    note?: string;
  };
  currentTotal?: number;
  hint?: string;
}

/**
 * Dad Tribunal response (streaming text)
 */
export type DadTribunalResponse = string; // Streaming text response

/**
 * Login response
 */
export interface LoginResponse {
  success: boolean;
  error?: string;
}

/**
 * Logout response
 */
export interface LogoutResponse {
  success: boolean;
}

/**
 * Rate limit headers
 */
export interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
  'Retry-After'?: string;
}

