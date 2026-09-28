import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies } from 'next/headers';

import { appConfig } from '@/config/app-config';

import { getServerAuthToken } from './server-auth-cookie';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('@/config/app-config', () => ({
  appConfig: {
    token: 'agenus_session_auth_token',
  },
}));

describe('getServerAuthToken Server Core Extraction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should resolve headers asynchronously and extract the exact session token value', async () => {
    // Arrange
    const dummyTokenValue = 'server-side-resolved-jwt';
    const mockGet = vi.fn().mockReturnValue({ value: dummyTokenValue });
    vi.mocked(cookies).mockResolvedValue({
      get: mockGet,
    } as unknown as ReadonlyRequestCookies);

    // Act
    const result = await getServerAuthToken();

    // Assert
    expect(cookies).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith(appConfig.token);
    expect(result).toBe(dummyTokenValue);
  });

  it('should return undefined gracefully using optional chaining when session key is missing', async () => {
    // Arrange
    const mockGet = vi.fn().mockReturnValue(undefined);
    vi.mocked(cookies).mockResolvedValue({
      get: mockGet,
    } as unknown as ReadonlyRequestCookies);

    // Act
    const result = await getServerAuthToken();

    // Assert
    expect(cookies).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith(appConfig.token);
    expect(result).toBeUndefined();
  });
});
