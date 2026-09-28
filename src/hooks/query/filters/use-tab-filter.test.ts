import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { useQueryTransaction } from '../core/use-query-transaction';
import { useTabFilter } from './use-tab-filter';

const mockUpdateQuery = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('../core/use-query-transaction', () => ({
  useQueryTransaction: vi.fn(),
}));

describe('useTabFilter Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryTransaction).mockReturnValue({
      updateQuery: mockUpdateQuery,
      setQuery: vi.fn(),
      removeQuery: vi.fn(),
      resetQuery: vi.fn(),
    });
  });

  it('should parse tab value from URL search parameters using system defaults', () => {
    // Arrange
    const mockParams = new URLSearchParams('tab=overview') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() => useTabFilter());

    // Assert
    expect(result.current.tab).toBe('overview');
  });

  it('should utilize defaultTab parameter when targeted query parameter is missing from URL', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() => useTabFilter({ key: 'view', defaultTab: 'grid' }));

    // Assert
    expect(result.current.tab).toBe('grid');
  });

  it('should trigger updateQuery with correct values and default resetPageOnChange to false inside setTab', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useTabFilter({ key: 'view' }));

    // Act
    act(() => {
      result.current.setTab('list');
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { view: 'list' },
      { resetPage: false, scroll: false },
    );
  });

  it('should assign null to target parameter key inside setTab when value is omitted', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useTabFilter({ key: 'view', resetPageOnChange: true }));

    // Act
    act(() => {
      result.current.setTab(undefined);
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { view: null },
      { resetPage: true, scroll: false },
    );
  });

  it('should pass null to updateQuery dictionary upon clearTab execution', () => {
    // Arrange
    const mockParams = new URLSearchParams('tab=overview') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useTabFilter());

    // Act
    act(() => {
      result.current.clearTab();
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { tab: null },
      { resetPage: false, scroll: false },
    );
  });
});
