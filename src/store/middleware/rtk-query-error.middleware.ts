import type { Middleware } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { toast } from '@heroui/react';

import type { ApiErrorCode, ApiErrorResponse, StructuredApiLog } from '@/store/services/types';

type RejectedMeta = {
  arg?: {
    endpointName?: string;
    originalArgs?: unknown;
  };
  requestId?: string;
  requestStatus?: string;
};

function resolveErrorCode(status: FetchBaseQueryError['status']): ApiErrorCode {
  if (status === 401) return 'AUTH_UNAUTHORIZED';
  if (status === 403) return 'AUTH_FORBIDDEN';
  if (status === 422) return 'VALIDATION_ERROR';
  if (status === 500) return 'SERVER_ERROR';
  if (status === 'FETCH_ERROR' || status === 'TIMEOUT_ERROR') return 'NETWORK_ERROR';

  return 'UNKNOWN_ERROR';
}

function extractErrorMessage(error: FetchBaseQueryError): string {
  if (typeof error.status === 'string') {
    if (error.status === 'FETCH_ERROR') return 'Network request failed';
    if (error.status === 'TIMEOUT_ERROR') return 'Request timed out';
    if (error.status === 'PARSING_ERROR') return 'Failed to parse response';
    return error.error?.toString() ?? 'Unknown fetch error';
  }

  const data = error.data;

  if (typeof data === 'object' && data !== null && 'message' in data) {
    return String((data as ApiErrorResponse).message);
  }

  if (typeof data === 'string') {
    return data;
  }

  return `Request failed with status ${error.status}`;
}

function logStructuredError(log: StructuredApiLog): void {
  console.error(log);
}

function handleStatusSideEffects(status: FetchBaseQueryError['status'], code: ApiErrorCode): void {
  if (status === 401) {
    // Future: trigger refresh token flow or global logout
    return;
  }

  if (status === 403) {
    // Future: permission denied modal / redirect
    return;
  }

  if (status === 422) {
    // Future: form-level validation feedback
    return;
  }

  if (status === 500 || code === 'SERVER_ERROR') {
    // Future: global error boundary / incident reporting
    return;
  }

  if (status === 'FETCH_ERROR' || status === 'TIMEOUT_ERROR') {
    // Future: offline banner / retry UI
  }
}

/**
 * Global RTK Query error middleware.
 * Currently logs structured errors; prepared for toast, Sentry, and telemetry.
 */
export const rtkQueryErrorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload as FetchBaseQueryError;
    const meta = action.meta as RejectedMeta | undefined;
    const endpoint = meta?.arg?.endpointName;
    const requestId = meta?.requestId;
    const code = resolveErrorCode(error.status);
    const message = extractErrorMessage(error);

    const log: StructuredApiLog = {
      endpoint,
      status: error.status,
      message,
      timestamp: new Date().toISOString(),
      requestId,
      code,
    };

    logStructuredError(log);
    handleStatusSideEffects(error.status, code);
    toast.danger(message);

    // Future: dispatch pushFeedback({ type: 'error', message })
    // Future: Sentry.captureException / analytics.track('api_error', log)
  }

  return next(action);
};
