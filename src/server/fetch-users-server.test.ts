// src/store/services/users/fetch-users-server.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { env } from '@/env';
import { getServerAuthToken } from '@/lib/auth/server-auth-cookie';

import { fetchUsersServer } from './fetch-users-server';

vi.mock('@/env', () => ({
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.agenus.com.br',
  },
}));

vi.mock('@/lib/auth/server-auth-cookie', () => ({
  getServerAuthToken: vi.fn(),
}));

describe('fetchUsersServer Network Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    const mutableEnv = env as { NEXT_PUBLIC_API_URL?: string };
    mutableEnv.NEXT_PUBLIC_API_URL = 'https://api.agenus.com.br';
  });

  it('should construct a query string url with optional bounds and forward tokens securely', async () => {
    // Arrange
    vi.mocked(getServerAuthToken).mockResolvedValue('mock-token-abc');
    const mockResponseData = { data: [], total: 0, totalPages: 0 };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponseData,
    });
    vi.stubGlobal('fetch', mockFetch);

    // Act
    const result = await fetchUsersServer({
      page: 2,
      pageSize: 25,
      filter: 'John',
      status: 'active',
    });

    // Assert
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.agenus.com.br/users?page=2&pageSize=25&filter=John&status=active',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer mock-token-abc',
        },
        cache: 'no-store',
      },
    );
    expect(result).toEqual(mockResponseData);
  });

  it('should ignore params dictionary bindings if search and filter attributes are missing', async () => {
    // Arrange
    vi.mocked(getServerAuthToken).mockResolvedValue(undefined);

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });
    vi.stubGlobal('fetch', mockFetch);

    // Act
    await fetchUsersServer({});

    // Assert
    expect(mockFetch).toHaveBeenCalledWith('https://api.agenus.com.br/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
  });

  it('should intercept error signals crashing when api url configuration parameters are missing', async () => {
    // Arrange
    const mutableEnv = env as Record<string, string | undefined>;
    delete mutableEnv.NEXT_PUBLIC_API_URL;

    // Act & Assert
    await expect(fetchUsersServer({})).rejects.toThrow('NEXT_PUBLIC_API_URL is not configured');
  });

  it('should throw clear exceptions when HTTP response status codes are not OK', async () => {
    // Arrange
    vi.mocked(getServerAuthToken).mockResolvedValue(undefined);

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    vi.stubGlobal('fetch', mockFetch);

    // Act & Assert
    await expect(fetchUsersServer({})).rejects.toThrow('Failed to fetch users (500)');
  });
});
