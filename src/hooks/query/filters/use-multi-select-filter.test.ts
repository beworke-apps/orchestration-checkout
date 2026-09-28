import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { useQueryTransaction } from '../core/use-query-transaction';
import { useMultiSelectFilter } from './use-multi-select-filter';

const mockUpdateQuery = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('../core/use-query-transaction', () => ({
  useQueryTransaction: vi.fn(),
}));

describe('useMultiSelectFilter Hook', () => {
  const MOCK_TAGS_PARAM = 'tags=next,react';

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryTransaction).mockReturnValue({
      updateQuery: mockUpdateQuery,
      setQuery: vi.fn(),
      removeQuery: vi.fn(),
      resetQuery: vi.fn(),
    });
  });

  it('should parse existing array values from search parameters correctly', () => {
    // Arrange
    const mockParams = new URLSearchParams(MOCK_TAGS_PARAM) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() => useMultiSelectFilter({ key: 'tags' }));

    // Assert
    expect(result.current.values).toEqual(['next', 'react']);
    expect(result.current.hasValue('next')).toBe(true);
    expect(result.current.hasValue('vue')).toBe(false);
  });

  it('should use custom separator option when specified', () => {
    // Arrange
    const mockParams = new URLSearchParams('tags=next;react') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() => useMultiSelectFilter({ key: 'tags', separator: ';' }));

    // Assert
    expect(result.current.values).toEqual(['next', 'react']);
  });

  it('should format state correctly and default resetPage to true on setValues call', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useMultiSelectFilter({ key: 'tags' }));

    // Act
    act(() => {
      result.current.setValues(['next', 'vue']);
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { tags: 'next,vue' },
      { resetPage: true, scroll: false },
    );
  });

  it('should set key value to null on setValues call when next values array is empty', () => {
    // Arrange
    const mockParams = new URLSearchParams('tags=next') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useMultiSelectFilter({ key: 'tags' }));

    // Act
    act(() => {
      result.current.setValues([]);
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { tags: null },
      { resetPage: true, scroll: false },
    );
  });

  it('should append a non-existent value when toggleValue is triggered', () => {
    // Arrange
    const mockParams = new URLSearchParams('tags=next') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() =>
      useMultiSelectFilter({ key: 'tags', resetPageOnChange: false }),
    );

    // Act
    act(() => {
      result.current.toggleValue('vue');
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { tags: 'next,vue' },
      { resetPage: false, scroll: false },
    );
  });

  it('should remove an existing value when toggleValue is triggered', () => {
    // Arrange
    const mockParams = new URLSearchParams(MOCK_TAGS_PARAM) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useMultiSelectFilter({ key: 'tags' }));

    // Act
    act(() => {
      result.current.toggleValue('next');
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { tags: 'react' },
      { resetPage: true, scroll: false },
    );
  });

  it('should pass null to parameter map when clearValues is executed', () => {
    // Arrange
    const mockParams = new URLSearchParams(MOCK_TAGS_PARAM) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useMultiSelectFilter({ key: 'tags' }));

    // Act
    act(() => {
      result.current.clearValues();
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { tags: null },
      { resetPage: true, scroll: false },
    );
  });
});
