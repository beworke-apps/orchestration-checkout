import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadonlyURLSearchParams } from 'next/navigation';

import { useQueryActions } from './use-query-actions';
import { useQueryTransaction } from './use-query-transaction';

const mockMergeQuery = vi.fn();
const mockSetQuery = vi.fn();
const mockRemoveQuery = vi.fn();
const mockResetQuery = vi.fn();

vi.mock('./use-query-actions', () => ({
  useQueryActions: vi.fn(),
}));

describe('useQueryTransaction Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryActions).mockReturnValue({
      pathname: '/dashboard',
      searchParams: new URLSearchParams() as unknown as ReadonlyURLSearchParams,
      paramsSnapshot: new URLSearchParams(),
      buildUrl: vi.fn(),
      setQuery: mockSetQuery,
      removeQuery: mockRemoveQuery,
      mergeQuery: mockMergeQuery,
      resetQuery: mockResetQuery,
    });
  });

  it('should call mergeQuery with exact patch when no configuration options are supplied', () => {
    // Arrange
    const { result } = renderHook(() => useQueryTransaction());

    // Act
    act(() => {
      result.current.updateQuery({ search: 'gustavo' });
    });

    // Assert
    expect(mockMergeQuery).toHaveBeenCalledWith({ search: 'gustavo' }, {});
  });

  it('should reset page parameter back to default 1 when resetPage option is enabled', () => {
    // Arrange
    const { result } = renderHook(() => useQueryTransaction());

    // Act
    act(() => {
      result.current.updateQuery({ search: 'gustavo' }, { resetPage: true });
    });

    // Assert
    expect(mockMergeQuery).toHaveBeenCalledWith({ search: 'gustavo', page: 1 }, {});
  });

  it('should accept a custom pageKey via defaults config parameters', () => {
    // Arrange
    const { result } = renderHook(() => useQueryTransaction({ pageKey: 'p' }));

    // Act
    act(() => {
      result.current.updateQuery({ search: 'gustavo' }, { resetPage: true });
    });

    // Assert
    expect(mockMergeQuery).toHaveBeenCalledWith({ search: 'gustavo', p: 1 }, {});
  });

  it('should prioritize inline option pageKey and resetPageValue over default values', () => {
    // Arrange
    const { result } = renderHook(() => useQueryTransaction({ pageKey: 'p' }));

    // Act
    act(() => {
      result.current.updateQuery(
        { search: 'gustavo' },
        { resetPage: true, pageKey: 'customPage', resetPageValue: 0 },
      );
    });

    // Assert
    expect(mockMergeQuery).toHaveBeenCalledWith({ search: 'gustavo', customPage: 0 }, {});
  });

  it('should forward navigation options like mode and scroll into the underlying mergeQuery method', () => {
    // Arrange
    const { result } = renderHook(() => useQueryTransaction());

    // Act
    act(() => {
      result.current.updateQuery({ status: 'active' }, { mode: 'replace', scroll: true });
    });

    // Assert
    expect(mockMergeQuery).toHaveBeenCalledWith(
      { status: 'active' },
      { mode: 'replace', scroll: true },
    );
  });

  it('should proxy return functions from core action hook untouched', () => {
    // Arrange
    const { result } = renderHook(() => useQueryTransaction());

    // Act
    result.current.setQuery({ test: 'true' });
    result.current.removeQuery('search');
    result.current.resetQuery();

    // Assert
    expect(mockSetQuery).toHaveBeenCalledWith({ test: 'true' });
    expect(mockRemoveQuery).toHaveBeenCalledWith('search');
    expect(mockResetQuery).toHaveBeenCalled();
  });
});
