'use client';

import { useMemo } from 'react';

import { useDateFilter } from '../../filters/use-date-filter';
import { useTabFilter } from '../../filters/use-tab-filter';
import { normalizeQueryRecord } from '../../shared/normalize-query';

export type AnalyticsQueryParams = {
  tab?: string;
  startDate?: string;
  endDate?: string;
  period?: string;
};

export function useAnalyticsFilters() {
  const tab = useTabFilter({ key: 'tab', defaultTab: 'overview' });
  const date = useDateFilter({
    startKey: 'startDate',
    endKey: 'endDate',
    periodKey: 'period',
    resetPageOnChange: false,
  });

  const queryParams = useMemo(
    (): AnalyticsQueryParams =>
      normalizeQueryRecord({
        tab: tab.tab,
        startDate: date.start,
        endDate: date.end,
        period: date.period,
      }) as AnalyticsQueryParams,
    [date.end, date.period, date.start, tab.tab],
  );

  return { tab, date, queryParams };
}
