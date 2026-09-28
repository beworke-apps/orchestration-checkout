import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { applyPatchToParams, useQueryActions } from './use-query-actions';

const mockPush = vi.fn();
const mockReplace = vi.fn();
const DASHBOARD_PATH = '/dashboard';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('useQueryActions Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    });
    vi.mocked(usePathname).mockReturnValue(DASHBOARD_PATH);

    const mockParams = new URLSearchParams(
      'filter=active&sort=name',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
  });

  it('should push a new query parameter into the URL using setQuery', () => {
    // Arrange
    const { result } = renderHook(() => useQueryActions());

    // Act
    act(() => {
      result.current.setQuery({ page: '2' });
    });

    // Assert
    expect(mockPush).toHaveBeenCalledWith('/dashboard?filter=active&sort=name&page=2', {
      scroll: false,
    });
  });

  it('should use router.replace when explicit mode option is passed', () => {
    // Arrange
    const { result } = renderHook(() => useQueryActions());

    // Act
    act(() => {
      result.current.setQuery({ page: '2' }, { mode: 'replace', scroll: false });
    });

    // Assert
    expect(mockReplace).toHaveBeenCalledWith('/dashboard?filter=active&sort=name&page=2', {
      scroll: false,
    });
  });

  it('should remove a single query parameter from the URL using removeQuery', () => {
    // Arrange
    const { result } = renderHook(() => useQueryActions());

    // Act
    act(() => {
      result.current.removeQuery('sort');
    });

    // Assert
    expect(mockPush).toHaveBeenCalledWith('/dashboard?filter=active', { scroll: false });
  });

  it('should remove multiple query parameters passed as an array', () => {
    // Arrange
    const { result } = renderHook(() => useQueryActions());

    // Act
    act(() => {
      result.current.removeQuery(['filter', 'sort']);
    });

    // Assert
    expect(mockPush).toHaveBeenCalledWith(DASHBOARD_PATH, { scroll: false });
  });

  it('should clean the URL parameter if a key value is null or undefined', () => {
    // Arrange
    const { result } = renderHook(() => useQueryActions());

    // Act
    act(() => {
      result.current.setQuery({ filter: null });
    });

    // Assert
    expect(mockPush).toHaveBeenCalledWith('/dashboard?sort=name', { scroll: false });
  });

  it('should reset all query parameters except the explicit preserved keys', () => {
    // Arrange
    const { result } = renderHook(() => useQueryActions());

    // Act
    act(() => {
      result.current.resetQuery(['sort']);
    });

    // Assert
    expect(mockPush).toHaveBeenCalledWith('/dashboard?sort=name', { scroll: false });
  });

  it('should apply patch and trigger navigation when mergeQuery is executed', () => {
    // Arrange
    const { result } = renderHook(() => useQueryActions());

    // Act
    act(() => {
      result.current.mergeQuery({ status: 'completed' });
    });

    // Assert
    expect(mockPush).toHaveBeenCalledWith('/dashboard?filter=active&sort=name&status=completed', {
      scroll: false,
    });
  });

  it('should skip setting key in resetQuery if the preserved key does not exist in snapshot', () => {
    // Arrange
    const { result } = renderHook(() => useQueryActions());

    // Act
    act(() => {
      result.current.resetQuery(['nonexistent_key']);
    });

    // Assert
    expect(mockPush).toHaveBeenCalledWith(DASHBOARD_PATH, { scroll: false });
  });

  it('should append parameters onto an empty query string safely inside buildUrl', () => {
    // Arrange
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams('') as unknown as ReadonlyURLSearchParams,
    );
    const { result } = renderHook(() => useQueryActions());

    // Act
    act(() => {
      result.current.setQuery({ view: 'grid' });
    });

    // Assert
    expect(mockPush).toHaveBeenCalledWith('/dashboard?view=grid', { scroll: false });
  });

  it('should test applyPatchToParams utility directly to force delete key execution', () => {
    // Arrange
    const baseParams = new URLSearchParams('role=admin&status=active');

    // Act
    const result = applyPatchToParams(baseParams, { page: '1' }, ['role']);

    // Assert
    expect(result.toString()).toBe('status=active&page=1');
  });
});
