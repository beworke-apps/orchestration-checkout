import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { useQueryTransaction } from '../core/use-query-transaction';
import { useFiltersActive } from './get-filters-active';

const mockUpdateQuery = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('../core/use-query-transaction', () => ({
  useQueryTransaction: vi.fn(),
}));

describe('useFiltersActive Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryTransaction).mockReturnValue({
      updateQuery: mockUpdateQuery,
      setQuery: vi.fn(),
      removeQuery: vi.fn(),
      resetQuery: vi.fn(),
    });
  });

  it('should list active filters excluding default preserved layout and tracking keys', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      'status=active,pending&search=gustavo&page=3',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() => useFiltersActive());

    // Assert
    expect(result.current.filters).toEqual([
      { key: 'status', value: 'active' },
      { key: 'status', value: 'pending' },
      { key: 'search', value: 'gustavo' },
    ]);
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('should expand block exclusion list when custom excludeKeys are supplied', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      'status=active&customKey=ignored',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() => useFiltersActive({ excludeKeys: ['customKey'] }));

    // Assert
    expect(result.current.filters).toEqual([{ key: 'status', value: 'active' }]);
  });

  it('should short-circuit and omit dispatch within removeFilter if targeted key does not exist', () => {
    // Arrange
    const mockParams = new URLSearchParams('status=active') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useFiltersActive());

    // Act
    act(() => {
      result.current.removeFilter('non-existent');
    });

    // Assert
    expect(mockUpdateQuery).not.toHaveBeenCalled();
  });

  it('should map query key directly to null when a unique value filter is removed', () => {
    // Arrange
    const mockParams = new URLSearchParams('search=gustavo') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useFiltersActive());

    // Act
    act(() => {
      result.current.removeFilter('search');
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith({ search: null }, { resetPage: true });
  });

  it('should rebuild string list separating items by comma when valueToRemove target is supplied', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      'status=active,pending,review',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useFiltersActive());

    // Act
    act(() => {
      result.current.removeFilter('status', 'pending');
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith({ status: 'active,review' }, { resetPage: true });
  });

  it('should map query key to null inside removeFilter when valueToRemove leaves an empty array state', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      'status=active,active',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useFiltersActive());

    // Act
    act(() => {
      result.current.removeFilter('status', 'active');
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith({ status: null }, { resetPage: true });
  });

  it('should pass single direct null mapping when valueToRemove is supplied but string has no commas', () => {
    // Arrange
    const mockParams = new URLSearchParams('status=active') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useFiltersActive());

    // Act
    act(() => {
      result.current.removeFilter('status', 'active');
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith({ status: null }, { resetPage: true });
  });

  it('should nullify all existing active parameters on clearAllFilters execution ignoring excluded entries', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      'status=active&search=gustavo&page=2',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useFiltersActive());

    // Act
    act(() => {
      result.current.clearAllFilters();
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { status: null, search: null },
      { resetPage: true },
    );
  });
});
