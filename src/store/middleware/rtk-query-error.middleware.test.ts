import type { Action, Middleware } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@heroui/react';

import { rtkQueryErrorMiddleware } from './rtk-query-error.middleware';

vi.mock('@reduxjs/toolkit', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    isRejectedWithValue: vi.fn(),
  };
});

vi.mock('@heroui/react', () => ({
  toast: {
    danger: vi.fn(),
  },
}));

interface MockAction extends Action {
  payload?: Record<string, unknown> | string | null | undefined;
  meta?:
    | {
        arg?: {
          endpointName?: string;
        };
        requestId?: string;
      }
    | undefined;
}

describe('rtkQueryErrorMiddleware Engine Pipeline', () => {
  const nextMock = vi.fn((action: unknown) => action);

  const dummyAPI = {
    dispatch: vi.fn(),
    getState: vi.fn(),
  };

  const middlewareInstance = (rtkQueryErrorMiddleware as Middleware)(dummyAPI)(nextMock);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should bypass the error interceptor logic completely when generic non-rejected actions are incoming', () => {
    // Arrange
    const standardAction: MockAction = { type: 'session/setUser', payload: {} };
    vi.mocked(isRejectedWithValue).mockReturnValue(false);

    // Act
    const result = middlewareInstance(standardAction);

    // Assert
    expect(nextMock).toHaveBeenCalledWith(standardAction);
    expect(toast.danger).not.toHaveBeenCalled();
    expect(result).toEqual(standardAction);
  });

  it('should process granular client side network connection drops and toggle specific fallback alert blocks', () => {
    // Arrange
    const networkAction: MockAction = {
      type: 'api/executeQuery/rejected',
      payload: { status: 'FETCH_ERROR' },
      meta: { arg: { endpointName: 'getUsers' }, requestId: 'req_01' },
    };
    vi.mocked(isRejectedWithValue).mockReturnValue(true);

    // Act
    middlewareInstance(networkAction);

    // Assert
    expect(toast.danger).toHaveBeenCalledWith('Network request failed');
    expect(console.error).toHaveBeenCalled();
  });

  it('should intercept structural errors resolving status responses maps and format error payloads dynamically', () => {
    // Arrange
    interface Scenario {
      status: number | string;
      data?: Record<string, unknown> | string | null | undefined;
      error?: string | undefined;
      expectMsg: string;
    }

    const mappingMatrix: Scenario[] = [
      {
        status: 401,
        data: { message: 'Expired session payload' },
        expectMsg: 'Expired session payload',
      },
      { status: 403, data: 'Forbidden action message', expectMsg: 'Forbidden action message' },
      { status: 422, data: {}, expectMsg: 'Request failed with status 422' },
      { status: 500, data: null, expectMsg: 'Request failed with status 500' },
      { status: 'TIMEOUT_ERROR', expectMsg: 'Request timed out' },
      { status: 'PARSING_ERROR', expectMsg: 'Failed to parse response' },
      {
        status: 'CUSTOM_STRING_ERROR',
        error: 'Generic crash block',
        expectMsg: 'Generic crash block',
      },
      { status: 'CUSTOM_STRING_ERROR_BLANK', expectMsg: 'Unknown fetch error' },
      { status: 404, data: undefined, expectMsg: 'Request failed with status 404' },
    ];

    vi.mocked(isRejectedWithValue).mockReturnValue(true);

    mappingMatrix.forEach((scenario) => {
      const targetAction: MockAction = {
        type: 'api/executeQuery/rejected',
        payload: {
          status: scenario.status,
          data: scenario.data,
          error: scenario.error,
        },
      };

      // Act
      middlewareInstance(targetAction);

      // Assert
      expect(toast.danger).toHaveBeenCalledWith(scenario.expectMsg);
    });
  });
});
