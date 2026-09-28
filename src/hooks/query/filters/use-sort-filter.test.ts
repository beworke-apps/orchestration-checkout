import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { useQueryTransaction } from '../core/use-query-transaction';
import { useSortFilter } from './use-sort-filter';

const mockUpdateQuery = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('../core/use-query-transaction', () => ({
  useQueryTransaction: vi.fn(),
}));

describe('useSortFilter Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryTransaction).mockReturnValue({
      updateQuery: mockUpdateQuery,
      setQuery: vi.fn(),
      removeQuery: vi.fn(),
      resetQuery: vi.fn(),
    });
  });

  it('should parse sort key configurations from URL state using system defaults', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      'sort=name&order=asc',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() => useSortFilter());

    // Assert
    expect(result.current.field).toBe('name');
    expect(result.current.direction).toBe('asc');
    expect(result.current.fieldKey).toBe('sort');
    expect(result.current.directionKey).toBe('order');
  });

  it('should fall back to option parameters when targeted URL query parameters are absent', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() =>
      useSortFilter({ field: 'createdAt', direction: 'desc', fieldKey: 's', directionKey: 'd' }),
    );

    // Assert
    expect(result.current.field).toBe('createdAt');
    expect(result.current.direction).toBe('desc');
    expect(result.current.fieldKey).toBe('s');
    expect(result.current.directionKey).toBe('d');
  });

  it('should dispatch transactional updates correctly inside setSort function', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useSortFilter({ resetPageOnChange: false }));

    // Act
    act(() => {
      result.current.setSort('email', 'desc');
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { sort: 'email', order: 'desc' },
      { resetPage: false, scroll: false },
    );
  });

  it('should pass null values to transaction context inside setSort when parameters are omitted', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useSortFilter());

    // Act
    act(() => {
      result.current.setSort(undefined, undefined);
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { sort: null, order: null },
      { resetPage: true, scroll: false },
    );
  });

  it('should parse ascending table descriptor structures cleanly inside setSortFromDescriptor', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useSortFilter());

    // Act
    act(() => {
      result.current.setSortFromDescriptor({ column: 'role', direction: 'ascending' });
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { sort: 'role', order: 'asc' },
      { resetPage: true, scroll: false },
    );
  });

  it('should parse descending table descriptor structures cleanly inside setSortFromDescriptor', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useSortFilter());

    // Act
    act(() => {
      result.current.setSortFromDescriptor({ column: 'status', direction: 'descending' });
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { sort: 'status', order: 'desc' },
      { resetPage: true, scroll: false },
    );
  });

  it('should nullify sort properties on clearSort execution', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      'sort=name&order=asc',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useSortFilter());

    // Act
    act(() => {
      result.current.clearSort();
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { sort: null, order: null },
      { resetPage: true, scroll: false },
    );
  });
});
