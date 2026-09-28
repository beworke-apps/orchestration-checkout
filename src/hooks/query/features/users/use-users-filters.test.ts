import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { useQueryState } from '../../core/use-query-state';
import { useQueryTransaction } from '../../core/use-query-transaction';
import { usePaginationFilter } from '../../filters/use-pagination-filter';
import { useSearchFilter } from '../../filters/use-search-filter';
import { useSortFilter } from '../../filters/use-sort-filter';
import { useUsersFilters } from './use-users-filters';

const mockUpdateQuery = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('../../core/use-query-state', () => ({
  useQueryState: vi.fn(),
}));

vi.mock('../../core/use-query-transaction', () => ({
  useQueryTransaction: vi.fn(),
}));

vi.mock('../../filters/use-pagination-filter', () => ({
  usePaginationFilter: vi.fn(),
}));

vi.mock('../../filters/use-search-filter', () => ({
  useSearchFilter: vi.fn(),
}));

vi.mock('../../filters/use-sort-filter', () => ({
  useSortFilter: vi.fn(),
}));

describe('useUsersFilters Hook', () => {
  const mockPagination = { page: 1, limit: 10 };
  const mockSearch = { search: 'gustavo' };
  const mockSort = { field: 'name', direction: 'asc' };
  const mockUrlState = {
    page: 1,
    pageSize: 10,
    search: 'gustavo',
    sort: 'name',
    order: 'asc',
    status: 'active',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryTransaction).mockReturnValue({
      updateQuery: mockUpdateQuery,
      setQuery: vi.fn(),
      removeQuery: vi.fn(),
      resetQuery: vi.fn(),
    });

    vi.mocked(useQueryState).mockReturnValue(mockUrlState);

    vi.mocked(usePaginationFilter).mockReturnValue(
      mockPagination as unknown as ReturnType<typeof usePaginationFilter>,
    );

    vi.mocked(useSearchFilter).mockReturnValue(
      mockSearch as unknown as ReturnType<typeof useSearchFilter>,
    );

    vi.mocked(useSortFilter).mockReturnValue(
      mockSort as unknown as ReturnType<typeof useSortFilter>,
    );
  });

  it('should compile sub-filters and build stable cache queries based on active states', () => {
    // Arrange
    const mockParams = new URLSearchParams('status=active') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() => useUsersFilters());

    // Assert
    expect(usePaginationFilter).toHaveBeenCalledWith({ pageKey: 'page', limitKey: 'pageSize' });
    expect(useSearchFilter).toHaveBeenCalledWith({ key: 'search', resetPageOnChange: true });
    expect(useSortFilter).toHaveBeenCalledWith({
      fieldKey: 'sort',
      directionKey: 'order',
      resetPageOnChange: true,
    });

    expect(result.current.status).toBe('active');
    expect(result.current.queryParams).toEqual({
      page: 1,
      pageSize: 10,
      filter: 'gustavo',
      status: 'active',
    });
    expect(result.current.queryCacheKey).toBe(
      '{"filter":"gustavo","page":1,"pageSize":10,"status":"active"}',
    );
  });

  it('should forward text values to updateQuery dictionary inside setStatus call', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useUsersFilters());

    // Act
    act(() => {
      result.current.setStatus('suspended');
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { status: 'suspended' },
      { resetPage: true, scroll: false },
    );
  });

  it('should map query status key to null inside setStatus when parameter value is omitted', () => {
    // Arrange
    const mockParams = new URLSearchParams('status=active') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useUsersFilters());

    // Act
    act(() => {
      result.current.setStatus(undefined);
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { status: null },
      { resetPage: true, scroll: false },
    );
  });
});
