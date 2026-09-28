'use client';

import { useMemo } from 'react';

import { useDateFilter } from '../../filters/use-date-filter';
import { useTabFilter } from '../../filters/use-tab-filter';
import { normalizeQueryRecord } from '../../shared/normalize-query';

export type DashboardQueryParams = {
  view?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
};

export function useDashboardFilters() {
  const view = useTabFilter({ key: 'view', defaultTab: 'summary' });
  const date = useDateFilter({ resetPageOnChange: false });

  const queryParams = useMemo(
    (): DashboardQueryParams =>
      normalizeQueryRecord({
        view: view.tab,
        period: date.period,
        startDate: date.start,
        endDate: date.end,
      }) as DashboardQueryParams,
    [date.end, date.period, date.start, view.tab],
  );

  return { view, date, queryParams };
}
