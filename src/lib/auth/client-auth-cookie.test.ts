import cookies from 'js-cookie';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { appConfig } from '@/config/app-config';

import { getAuthCookie, removeAuthCookie, setAuthCookie } from './client-auth-cookie';

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('@/config/app-config', () => ({
  appConfig: {
    token: 'agenus_session_auth_token',
  },
}));

describe('clientAuthCookie Integration Lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should pull authorization strings correctly from storage matching configurations keys', () => {
    // Arrange
    const dummyToken = 'jwt-active-session-token';
    vi.mocked(cookies.get).mockImplementation(
      () => dummyToken as string & { [key: string]: string },
    );

    // Act
    const result = getAuthCookie();

    // Assert
    expect(cookies.get).toHaveBeenCalledWith(appConfig.token);
    expect(result).toBe(dummyToken);
  });

  it('should persist structural tokens with explicit options and secure browser constraints', () => {
    // Arrange
    const tokenToCommit = 'jwt-injected-from-signin';

    // Act
    setAuthCookie(tokenToCommit);

    // Assert
    expect(cookies.set).toHaveBeenCalledWith(appConfig.token, tokenToCommit, {
      expires: 7,
      path: '/',
      sameSite: 'lax',
      secure: false,
    });
  });

  it('should enforce complete removal of active sessions keys from root domain scopes', () => {
    // Act
    removeAuthCookie();

    // Assert
    expect(cookies.remove).toHaveBeenCalledWith(appConfig.token, { path: '/' });
  });
});
