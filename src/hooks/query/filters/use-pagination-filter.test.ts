import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { useQueryTransaction } from '../core/use-query-transaction';
import { usePaginationFilter } from './use-pagination-filter';

const mockUpdateQuery = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('../core/use-query-transaction', () => ({
  useQueryTransaction: vi.fn(),
}));

describe('usePaginationFilter Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryTransaction).mockReturnValue({
      updateQuery: mockUpdateQuery,
      setQuery: vi.fn(),
      removeQuery: vi.fn(),
      resetQuery: vi.fn(),
    });
  });

  it('should parse current pagination values from URL search parameters using system defaults', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      'page=3&pageSize=25',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() => usePaginationFilter());

    // Assert
    expect(result.current.page).toBe(3);
    expect(result.current.limit).toBe(25);
    expect(result.current.pageKey).toBe('page');
    expect(result.current.limitKey).toBe('pageSize');
  });

  it('should utilize fallback configuration defaults when query values are empty or missing', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() =>
      usePaginationFilter({ page: 2, limit: 50, pageKey: 'p', limitKey: 'l' }),
    );

    // Assert
    expect(result.current.page).toBe(2);
    expect(result.current.limit).toBe(50);
    expect(result.current.pageKey).toBe('p');
    expect(result.current.limitKey).toBe('l');
  });

  it('should utilize fallback configuration defaults when query values are invalid', () => {
    // Arrange
    const mockParams = new URLSearchParams('p=invalid&l=-5') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() =>
      usePaginationFilter({ page: 2, limit: 50, pageKey: 'p', limitKey: 'l' }),
    );

    // Assert
    expect(result.current.page).toBe(2);
    expect(result.current.limit).toBe(50);
  });

  it('should trigger updateQuery with targeted index parameter when setPage is executed', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => usePaginationFilter());

    // Act
    act(() => {
      result.current.setPage(5);
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith({ page: 5 }, { scroll: false });
  });

  it('should reset page index back to 1 by default when setLimit is executed', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => usePaginationFilter());

    // Act
    act(() => {
      result.current.setLimit(100);
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith({ pageSize: 100, page: 1 }, { scroll: false });
  });

  it('should omit page property override inside setLimit if resetPageOnLimitChange is disabled', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => usePaginationFilter({ resetPageOnLimitChange: false }));

    // Act
    act(() => {
      result.current.setLimit(50);
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith({ pageSize: 50 }, { scroll: false });
  });

  it('should increment current page value by one when nextPage is executed', () => {
    // Arrange
    const mockParams = new URLSearchParams('page=2') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => usePaginationFilter());

    // Act
    act(() => {
      result.current.nextPage();
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith({ page: 3 }, { scroll: false });
  });

  it('should decrement page value when previousPage is executed and enforce positive boundary', () => {
    // Arrange
    const mockParams = new URLSearchParams('page=3') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => usePaginationFilter());

    // Act
    act(() => {
      result.current.previousPage();
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith({ page: 2 }, { scroll: false });
  });

  it('should clamp index value at 1 inside previousPage when operation exceeds bounds', () => {
    // Arrange
    const mockParams = new URLSearchParams('page=1') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => usePaginationFilter());

    // Act
    act(() => {
      result.current.previousPage();
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith({ page: 1 }, { scroll: false });
  });

  it('should restore original parameters upon resetPagination execution', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      'page=4&pageSize=50',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => usePaginationFilter({ page: 1, limit: 10 }));

    // Act
    act(() => {
      result.current.resetPagination();
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith({ page: 1, pageSize: 10 }, { scroll: false });
  });
});
