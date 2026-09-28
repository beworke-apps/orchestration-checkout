import type { PayloadAction } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setAuthCookie } from '@/lib/auth/client-auth-cookie';

import { authApi } from '../services';
import type { User } from '../services';
import { sessionReducer, sessionSelectors, setSession } from './session.slice';
import type { SessionState } from './session.slice';

vi.mock('@/lib/auth/client-auth-cookie', () => ({
  setAuthCookie: vi.fn(),
}));

vi.mock('../services', () => ({
  authApi: {
    endpoints: {
      signIn: {
        matchFulfilled: vi.fn(),
      },
    },
  },
}));

describe('sessionSlice Reducer & Selectors', () => {
  const dummyUser = { id: 'usr-123', name: 'Gustavo', email: 'dev@agenus.com' } as unknown as User;
  const initialState: SessionState = { user: null, token: null };
  const MOCK_JWT_TOKEN = 'jwt-token-agenus';
  const MOCK_RTK_TOKEN = 'rtk-injected-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with standard default credentials state', () => {
    // Act
    const result = sessionReducer(undefined, { type: '@@INIT' });

    // Assert
    expect(result).toEqual(initialState);
  });

  it('should mutatively apply credentials and commit authorization cookie inside setSession', () => {
    // Arrange
    const payloadState: SessionState = { user: dummyUser, token: MOCK_JWT_TOKEN };

    // Act
    const nextState = sessionReducer(initialState, setSession(payloadState));

    // Assert
    expect(nextState.user).toBe(dummyUser);
    expect(nextState.token).toBe(MOCK_JWT_TOKEN);
    expect(setAuthCookie).toHaveBeenCalledWith(MOCK_JWT_TOKEN);
  });

  it('should omit cookie deployment inside setSession if token payload is absent', () => {
    // Arrange
    const payloadState: SessionState = { user: null, token: null };

    // Act
    const nextState = sessionReducer(initialState, setSession(payloadState));

    // Assert
    expect(nextState.user).toBeNull();
    expect(nextState.token).toBeNull();
    expect(setAuthCookie).not.toHaveBeenCalled();
  });

  it('should react successfully to matched fulfilled sign-in operations updating state records', () => {
    // Arrange
    const mockSuccessAction = {
      type: 'auth/signIn/fulfilled',
      payload: { user: dummyUser, token: MOCK_RTK_TOKEN },
    };

    vi.mocked(authApi.endpoints.signIn.matchFulfilled).mockReturnValue(
      true as unknown as ReturnType<typeof authApi.endpoints.signIn.matchFulfilled>,
    );

    // Act
    const nextState = sessionReducer(
      initialState,
      mockSuccessAction as unknown as PayloadAction<SessionState>,
    );

    // Assert
    expect(nextState.user).toBe(dummyUser);
    expect(nextState.token).toBe(MOCK_RTK_TOKEN);
    expect(setAuthCookie).toHaveBeenCalledWith(MOCK_RTK_TOKEN);
  });

  it('should bypass cookie setting during sign-in integration if the action payload token is missing', () => {
    // Arrange
    const mockSuccessActionNoToken = {
      type: 'auth/signIn/fulfilled',
      payload: { user: dummyUser, token: null },
    };

    vi.mocked(authApi.endpoints.signIn.matchFulfilled).mockReturnValue(
      true as unknown as ReturnType<typeof authApi.endpoints.signIn.matchFulfilled>,
    );

    // Act
    const nextState = sessionReducer(
      initialState,
      mockSuccessActionNoToken as unknown as PayloadAction<SessionState>,
    );

    // Assert
    expect(nextState.user).toBe(dummyUser);
    expect(nextState.token).toBeNull();
    expect(setAuthCookie).not.toHaveBeenCalled();
  });

  it('should correctly filter and return user details context via selectSession selector', () => {
    // Arrange
    const globalState = {
      session: { user: dummyUser, token: 'active-session-token' },
    };

    // Act
    const selectedUser = sessionSelectors.selectSession(globalState);

    // Assert
    expect(selectedUser).toBe(dummyUser);
  });
});
