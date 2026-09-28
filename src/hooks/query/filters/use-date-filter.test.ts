import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { useQueryTransaction } from '../core/use-query-transaction';
import { useDateFilter } from './use-date-filter';

const mockUpdateQuery = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('../core/use-query-transaction', () => ({
  useQueryTransaction: vi.fn(),
}));

describe('useDateFilter Hook', () => {
  const DATE_START_MOCK = '2026-06-01';
  const DATE_END_MOCK = '2026-06-10';
  const DATE_TODAY_MOCK = '2026-06-05';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 5));

    vi.mocked(useQueryTransaction).mockReturnValue({
      updateQuery: mockUpdateQuery,
      setQuery: vi.fn(),
      removeQuery: vi.fn(),
      resetQuery: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should read and parse existing date parameters from URL using default keys', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      'startDate=2026-01-01&endDate=2026-01-15&period=custom',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() => useDateFilter());

    // Assert
    expect(result.current.start).toBe('2026-01-01');
    expect(result.current.end).toBe('2026-01-15');
    expect(result.current.period).toBe('custom');
    expect(result.current.startKey).toBe('startDate');
    expect(result.current.endKey).toBe('endDate');
    expect(result.current.periodKey).toBe('period');
  });

  it('should support customized search keys and handle undefined options securely', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      'from=2026-02-01&to=2026-02-28',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);

    // Act
    const { result } = renderHook(() =>
      useDateFilter({ startKey: 'from', endKey: 'to', periodKey: 'rangeType' }),
    );

    // Assert
    expect(result.current.start).toBe('2026-02-01');
    expect(result.current.end).toBe('2026-02-28');
    expect(result.current.startKey).toBe('from');
    expect(result.current.endKey).toBe('to');
    expect(result.current.periodKey).toBe('rangeType');
  });

  it('should process and serialize input values correctly inside setDateRange', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useDateFilter({ resetPageOnChange: false }));

    // Act
    act(() => {
      result.current.setDateRange({
        start: new Date(2026, 5, 1),
        end: DATE_END_MOCK,
        period: 'custom-range',
      });
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { startDate: DATE_START_MOCK, endDate: DATE_END_MOCK, period: 'custom-range' },
      { resetPage: false, scroll: false },
    );
  });

  it('should fallback period to null inside setDateRange when property is absent', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useDateFilter());

    // Act
    act(() => {
      result.current.setDateRange({
        start: DATE_START_MOCK,
        end: DATE_END_MOCK,
      });
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { startDate: DATE_START_MOCK, endDate: DATE_END_MOCK, period: null },
      { resetPage: true, scroll: false },
    );
  });

  it('should compute and append correct past boundaries for 7d preset mode', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useDateFilter());

    // Act
    act(() => {
      result.current.setPeriod('7d');
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { startDate: '2026-05-29', endDate: DATE_TODAY_MOCK, period: '7d' },
      { resetPage: true, scroll: false },
    );
  });

  it('should compute and append correct past boundaries for 30d preset mode', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useDateFilter());

    // Act
    act(() => {
      result.current.setPeriod('30d');
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { startDate: '2026-05-06', endDate: DATE_TODAY_MOCK, period: '30d' },
      { resetPage: true, scroll: false },
    );
  });

  it('should compute and append correct past boundaries for 90d preset mode', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useDateFilter());

    // Act
    act(() => {
      result.current.setPeriod('90d');
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { startDate: '2026-03-07', endDate: DATE_TODAY_MOCK, period: '90d' },
      { resetPage: true, scroll: false },
    );
  });

  it('should map keys to null to clean presets inside default switch branch case', () => {
    // Arrange
    const mockParams = new URLSearchParams('') as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useDateFilter());

    // Act
    act(() => {
      result.current.setPeriod('all-time');
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { startDate: null, endDate: null, period: 'all-time' },
      { resetPage: true, scroll: false },
    );
  });

  it('should nullify all filter parameters on clearDateRange execution', () => {
    // Arrange
    const mockParams = new URLSearchParams(
      'startDate=2026-01-01',
    ) as unknown as ReadonlyURLSearchParams;
    vi.mocked(useSearchParams).mockReturnValue(mockParams);
    const { result } = renderHook(() => useDateFilter());

    // Act
    act(() => {
      result.current.clearDateRange();
    });

    // Assert
    expect(mockUpdateQuery).toHaveBeenCalledWith(
      { startDate: null, endDate: null, period: null },
      { resetPage: true, scroll: false },
    );
  });
});
