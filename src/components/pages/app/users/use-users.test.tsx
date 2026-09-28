import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useUsersFilters } from '@/hooks/query/features/users';
import { useGetUsersQuery } from '@/store/services';

import useUsers from './use-users';

vi.mock('@/hooks/query/features/users', () => ({
  useUsersFilters: vi.fn(),
}));

vi.mock('@/store/services', () => ({
  useGetUsersQuery: vi.fn(),
}));

describe('useUsers Page Hook Orchestrations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should pass query parameters to the API hook and unify filter states with server responses', () => {
    // Arrange
    const mockFiltersState = {
      urlState: { page: 1, pageSize: 10 },
      queryParams: { page: 1, pageSize: 10, filter: 'gustavo' },
      queryCacheKey: 'mock-key',
      pagination: { page: 1, limit: 10 },
      search: { search: 'gustavo' },
      sort: { field: 'name', direction: 'asc' },
      status: 'active',
      setStatus: vi.fn(),
      updateQuery: vi.fn(),
    };

    const mockApiResponse = {
      data: { data: [{ id: '1', name: 'User 1' }], meta: { total: 1 } },
      isLoading: false,
      isError: false,
      isFetching: false,
    };

    vi.mocked(useUsersFilters).mockReturnValue(
      mockFiltersState as unknown as ReturnType<typeof useUsersFilters>,
    );

    vi.mocked(useGetUsersQuery).mockReturnValue(
      mockApiResponse as unknown as ReturnType<typeof useGetUsersQuery>,
    );

    // Act
    const { result } = renderHook(() => useUsers());

    // Assert
    expect(useUsersFilters).toHaveBeenCalled();
    expect(useGetUsersQuery).toHaveBeenCalledWith(mockFiltersState.queryParams);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toEqual(mockApiResponse.data);
    expect(result.current.status).toBe('active');
  });
});
