import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { useQueryState } from './use-query-state';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

describe('useQueryState Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should parse URL parameters correctly based on schema definitions', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      'search=enterprise&limit=10',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    const schema = {
      search: {
        key: 'search',
        parse: (raw: string | null) => raw ?? undefined,
        defaultValue: 'default',
      },
      limit: {
        key: 'limit',
        parse: (raw: string | null) => (raw ? Number(raw) : undefined),
        defaultValue: 20,
      },
    };

    // Act
    const { result } = renderHook(() => useQueryState(schema));

    // Assert
    expect(result.current).toEqual({
      search: 'enterprise',
      limit: 10,
    });
  });

  it('should apply defaultValue when parsed result returns undefined', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    const schema = {
      search: {
        key: 'search',
        parse: () => undefined,
        defaultValue: 'fallback_default',
      },
    };

    // Act
    const { result } = renderHook(() => useQueryState(schema));

    // Assert
    expect(result.current).toEqual({
      search: 'fallback_default',
    });
  });

  it('should apply defaultValue when parsed result returns null', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    const schema = {
      search: {
        key: 'search',
        parse: () => null,
        defaultValue: 'fallback_default_from_null',
      },
    };

    // Act
    const { result } = renderHook(() => useQueryState(schema));

    // Assert
    expect(result.current).toEqual({
      search: 'fallback_default_from_null',
    });
  });
});
