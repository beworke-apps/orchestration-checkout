import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDateFilter } from '../../filters/use-date-filter';
import { usePaginationFilter } from '../../filters/use-pagination-filter';
import { useSearchFilter } from '../../filters/use-search-filter';
import { useReportsFilters } from './use-reports-filters';

vi.mock('../../filters/use-date-filter', () => ({
  useDateFilter: vi.fn(),
}));

vi.mock('../../filters/use-pagination-filter', () => ({
  usePaginationFilter: vi.fn(),
}));

vi.mock('../../filters/use-search-filter', () => ({
  useSearchFilter: vi.fn(),
}));

describe('useReportsFilters Hook', () => {
  const DATE_START = '2026-06-01';
  const DATE_END = '2026-06-07';
  const SEARCH_TERM = 'sales-report';

  const mockPaginationState = {
    page: 1,
    limit: 10,
    pageKey: 'page',
    limitKey: 'pageSize',
    setPage: vi.fn(),
    setLimit: vi.fn(),
    nextPage: vi.fn(),
    previousPage: vi.fn(),
    resetPagination: vi.fn(),
  };

  const mockDateState = {
    start: DATE_START,
    end: DATE_END,
    period: '7d',
    startKey: 'startDate',
    endKey: 'endDate',
    periodKey: 'period',
    setDateRange: vi.fn(),
    setPeriod: vi.fn(),
    clearDateRange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should compose active filters and map filled search values into a single query record', () => {
    // Arrange
    const mockSearchState = {
      search: SEARCH_TERM,
      inputValue: SEARCH_TERM,
      isEmpty: false,
      onInputChange: vi.fn(),
      flushSearch: vi.fn(),
      clearSearch: vi.fn(),
      setSearch: vi.fn(),
      commitSearch: vi.fn(),
    };

    vi.mocked(usePaginationFilter).mockReturnValue(mockPaginationState);
    vi.mocked(useSearchFilter).mockReturnValue(mockSearchState);
    vi.mocked(useDateFilter).mockReturnValue(mockDateState);

    // Act
    const { result } = renderHook(() => useReportsFilters());

    // Assert
    expect(usePaginationFilter).toHaveBeenCalled();
    expect(useSearchFilter).toHaveBeenCalledWith({ key: 'q' });
    expect(useDateFilter).toHaveBeenCalled();

    expect(result.current.pagination).toBe(mockPaginationState);
    expect(result.current.search).toBe(mockSearchState);
    expect(result.current.date).toBe(mockDateState);
    expect(result.current.queryParams).toEqual({
      page: 1,
      pageSize: 10,
      search: SEARCH_TERM,
      startDate: DATE_START,
      endDate: DATE_END,
    });
  });

  it('should convert an empty string search property into undefined to drop it from the record keys', () => {
    // Arrange
    const mockSearchStateEmpty = {
      search: '',
      inputValue: '',
      isEmpty: true,
      onInputChange: vi.fn(),
      flushSearch: vi.fn(),
      clearSearch: vi.fn(),
      setSearch: vi.fn(),
      commitSearch: vi.fn(),
    };

    vi.mocked(usePaginationFilter).mockReturnValue(mockPaginationState);
    vi.mocked(useSearchFilter).mockReturnValue(mockSearchStateEmpty);
    vi.mocked(useDateFilter).mockReturnValue(mockDateState);

    // Act
    const { result } = renderHook(() => useReportsFilters());

    // Assert
    expect(result.current.queryParams).toEqual({
      page: 1,
      pageSize: 10,
      startDate: DATE_START,
      endDate: DATE_END,
    });
    expect(result.current.queryParams.search).toBeUndefined();
  });
});
