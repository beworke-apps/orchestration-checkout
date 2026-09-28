import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { useQueryTransaction } from '../core/use-query-transaction';
import { useSearchFilter } from './use-search-filter';

const mockUpdateQuery = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('../core/use-query-transaction', () => ({
  useQueryTransaction: vi.fn(),
}));

vi.mock('use-debounce', () => ({
  useDebouncedCallback: vi.fn((fn) => {
    const callback = Object.assign((...args: unknown[]) => fn(...args), {
      cancel: vi.fn(),
    });
    return callback;
  }),
}));

describe('useSearchFilter Hook', () => {
  const SEARCH_ENTERPRISE = 'enterprise';
  const SEARCH_DEPRECATED_TEST = 'deprecated-test';
  const MOCK_SEARCH_ENTERPRISE_PARAM = 'search=enterprise';

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryTransaction).mockReturnValue({
      updateQuery: mockUpdateQuery,
      setQuery: vi.fn(),
      removeQuery: vi.fn(),
      resetQuery: vi.fn(),
    });
  });

  it('should parse existing query search state from URL using system defaults', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      MOCK_SEARCH_ENTERPRISE_PARAM,
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() => useSearchFilter());

    // Assert
    expect(result.current.search).toBe(SEARCH_ENTERPRISE);
    expect(result.current.inputValue).toBe(SEARCH_ENTERPRISE);
    expect(result.current.isEmpty).toBe(false);
  });

  it('should update immediate input state and pass data down to debounced handlers', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useSearchFilter());

    // Act
    act(() => {
      result.current.onInputChange('gustavo');
    });

    // Assert
    expect(result.current.inputValue).toBe('gustavo');
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { search: 'gustavo' },
      { resetPage: true, scroll: false },
    );
  });

  it('should omit transaction dispatch if input value matches current URL params exactly', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      MOCK_SEARCH_ENTERPRISE_PARAM,
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useSearchFilter());

    // Act
    act(() => {
      result.current.onInputChange('  enterprise  ');
    });

    // Assert
    expect(mockUpdateQuery).not.toHaveBeenCalled();
  });

  it('should commit immediately to the URL parameters when flushSearch is invoked', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useSearchFilter({ resetPageOnChange: false }));

    act(() => {
      result.current.onInputChange(SEARCH_ENTERPRISE);
    });
    mockUpdateQuery.mockClear();

    // Act
    act(() => {
      result.current.flushSearch();
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { search: SEARCH_ENTERPRISE },
      { resetPage: false, scroll: false },
    );
  });

  it('should commit null to the URL parameters when input consists only of empty spaces', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      MOCK_SEARCH_ENTERPRISE_PARAM,
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useSearchFilter());

    act(() => {
      result.current.onInputChange('   ');
    });
    mockUpdateQuery.mockClear();

    // Act
    act(() => {
      result.current.flushSearch();
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { search: null },
      { resetPage: true, scroll: false },
    );
  });

  it('should clear internal state, cancel tasks and map parameters to null on clearSearch call', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      MOCK_SEARCH_ENTERPRISE_PARAM,
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useSearchFilter());

    // Act
    act(() => {
      result.current.clearSearch();
    });

    // Assert
    expect(result.current.inputValue).toBe('');
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { search: null },
      { resetPage: true, scroll: false },
    );
  });

  it('should update immediate inputValue when URL state modifications occur externally', () => {
    // Arrange
    const mockParamsInit = new URLSearchParams('search=old') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParamsInit);
    const { result, rerender } = renderHook(() => useSearchFilter());

    // Act
    const mockParamsNext = new URLSearchParams('search=new') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParamsNext);
    rerender();

    // Assert
    expect(result.current.search).toBe('new');
    expect(result.current.inputValue).toBe('new');
  });

  it('should skip updating inputValue if local edits mismatch the original query path base', () => {
    // Arrange
    const mockParamsInit = new URLSearchParams(
      'search=initial',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParamsInit);
    const { result, rerender } = renderHook(() => useSearchFilter());

    act(() => {
      result.current.onInputChange('local-editing');
    });

    // Act
    const mockParamsNext = new URLSearchParams(
      'search=initial',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParamsNext);
    rerender();

    // Assert
    expect(result.current.inputValue).toBe('local-editing');
  });

  it('should retain current local input state when external search sync triggers while user is actively typing a different string', () => {
    // Arrange
    const mockParamsInit = new URLSearchParams('search=old') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParamsInit);
    const { result, rerender } = renderHook(() => useSearchFilter());

    act(() => {
      result.current.onInputChange('typing-something-new');
    });

    // Act
    const mockParamsNext = new URLSearchParams(
      'search=changed-externally',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParamsNext);
    rerender();

    // Assert
    expect(result.current.search).toBe('changed-externally');
    expect(result.current.inputValue).toBe('typing-something-new');
  });

  it('should maintain deprecated API proxies intact matching structural parameters', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useSearchFilter());

    // Act
    act(() => {
      result.current.setSearch(SEARCH_DEPRECATED_TEST);
    });

    // Assert
    expect(result.current.inputValue).toBe(SEARCH_DEPRECATED_TEST);
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { search: SEARCH_DEPRECATED_TEST },
      { resetPage: true, scroll: false },
    );

    // Act
    mockUpdateQuery.mockClear();
    act(() => {
      result.current.commitSearch();
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { search: SEARCH_DEPRECATED_TEST },
      { resetPage: true, scroll: false },
    );
  });
});
