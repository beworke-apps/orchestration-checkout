import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

import { env } from '@/env';
import { getAuthCookie } from '@/lib/auth/client-auth-cookie';

import type { ApiExtraOptions } from './types';

const REQUEST_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 0;

function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Prepared for future auth token resolution (cookies, session storage, etc.). */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return getAuthCookie() ?? null;
  // Future: read from secure session storage or auth slice
}

function resolveBaseUrl(): string {
  const apiUrl = env.NEXT_PUBLIC_API_URL;

  if (apiUrl) {
    return apiUrl;
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }

  const appUrl = env.NEXT_PUBLIC_APP_URL;

  if (appUrl) {
    return `${appUrl}/api`;
  }

  return '/api';
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: resolveBaseUrl(),
  timeout: REQUEST_TIMEOUT_MS,
  prepareHeaders: (headers, { extraOptions }) => {
    const options = extraOptions as ApiExtraOptions | undefined;
    const requestId = generateRequestId();

    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    headers.set('X-Request-Id', requestId);

    if (!options?.skipAuth) {
      const token = getAuthToken();

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    if (options?.workspaceId) {
      headers.set('X-Workspace-Id', options.workspaceId);
    }

    if (typeof window !== 'undefined') {
      headers.set('Accept-Language', navigator.language);
      headers.set('X-Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    }

    return headers;
  },
});

const baseQueryWithRetry = retry(rawBaseQuery, { maxRetries: MAX_RETRIES });

/**
 * Wraps base query with retry and prepares for token refresh orchestration.
 * Refresh flow will be implemented in a future auth phase.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  ApiExtraOptions
> = async (args, api, extraOptions) => {
  const result = await baseQueryWithRetry(
    args,
    api,
    extraOptions as Parameters<typeof baseQueryWithRetry>[2],
  );

  if (result.error?.status === 401) {
    // Future: attempt refresh token, update session, retry original request
    // const refreshResult = await baseQueryWithRetry('/auth/refresh', api, extraOptions);
    // if (refreshResult.data) return baseQueryWithRetry(args, api, extraOptions);
    // Future: dispatch logout / redirect to sign-in
  }

  return result;
};

export { generateRequestId, getAuthToken, resolveBaseUrl };
