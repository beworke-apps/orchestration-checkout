import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDateFilter } from '../../filters/use-date-filter';
import { useTabFilter } from '../../filters/use-tab-filter';
import { useAnalyticsFilters } from './use-analytics-filters';

vi.mock('../../filters/use-date-filter', () => ({
  useDateFilter: vi.fn(),
}));

vi.mock('../../filters/use-tab-filter', () => ({
  useTabFilter: vi.fn(),
}));

describe('useAnalyticsFilters Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should compose active tab and date ranges cleanly into a single query parameters object', () => {
    // Arrange
    const mockTabState = {
      tab: 'performance',
      setTab: vi.fn(),
      clearTab: vi.fn(),
    };

    const mockDateState = {
      start: '2026-06-01',
      end: '2026-06-07',
      period: '7d',
      startKey: 'startDate',
      endKey: 'endDate',
      periodKey: 'period',
      setDateRange: vi.fn(),
      setPeriod: vi.fn(),
      clearDateRange: vi.fn(),
    };

    vi.mocked(useTabFilter).mockReturnValue(mockTabState);
    vi.mocked(useDateFilter).mockReturnValue(mockDateState);

    // Act
    const { result } = renderHook(() => useAnalyticsFilters());

    // Assert
    expect(useTabFilter).toHaveBeenCalledWith({ key: 'tab', defaultTab: 'overview' });
    expect(useDateFilter).toHaveBeenCalledWith({
      startKey: 'startDate',
      endKey: 'endDate',
      periodKey: 'period',
      resetPageOnChange: false,
    });

    expect(result.current.tab).toBe(mockTabState);
    expect(result.current.date).toBe(mockDateState);
    expect(result.current.queryParams).toEqual({
      tab: 'performance',
      startDate: '2026-06-01',
      endDate: '2026-06-07',
      period: '7d',
    });
  });
});
