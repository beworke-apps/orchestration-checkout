import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDateFilter } from '../../filters/use-date-filter';
import { useTabFilter } from '../../filters/use-tab-filter';
import { useDashboardFilters } from './use-dashboard-filters';

vi.mock('../../filters/use-date-filter', () => ({
  useDateFilter: vi.fn(),
}));

vi.mock('../../filters/use-tab-filter', () => ({
  useTabFilter: vi.fn(),
}));

describe('useDashboardFilters Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should compose active view parameters and date presets cleanly into a single query record', () => {
    // Arrange
    const mockViewState = {
      tab: 'detailed',
      setTab: vi.fn(),
      clearTab: vi.fn(),
    };

    const mockDateState = {
      start: '2026-06-01',
      end: '2026-06-07',
      period: '30d',
      startKey: 'startDate',
      endKey: 'endDate',
      periodKey: 'period',
      setDateRange: vi.fn(),
      setPeriod: vi.fn(),
      clearDateRange: vi.fn(),
    };

    vi.mocked(useTabFilter).mockReturnValue(mockViewState);
    vi.mocked(useDateFilter).mockReturnValue(mockDateState);

    // Act
    const { result } = renderHook(() => useDashboardFilters());

    // Assert
    expect(useTabFilter).toHaveBeenCalledWith({ key: 'view', defaultTab: 'summary' });
    expect(useDateFilter).toHaveBeenCalledWith({ resetPageOnChange: false });

    expect(result.current.view).toBe(mockViewState);
    expect(result.current.date).toBe(mockDateState);
    expect(result.current.queryParams).toEqual({
      view: 'detailed',
      startDate: '2026-06-01',
      endDate: '2026-06-07',
      period: '30d',
    });
  });
});
