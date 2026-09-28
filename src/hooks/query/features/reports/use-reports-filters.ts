'use client';

import { useMemo } from 'react';

import { useDateFilter } from '../../filters/use-date-filter';
import { usePaginationFilter } from '../../filters/use-pagination-filter';
import { useSearchFilter } from '../../filters/use-search-filter';
import { normalizeQueryRecord } from '../../shared/normalize-query';

export type ReportsQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export function useReportsFilters() {
  const pagination = usePaginationFilter();
  const search = useSearchFilter({ key: 'q' });
  const date = useDateFilter();

  const queryParams = useMemo(
    (): ReportsQueryParams =>
      normalizeQueryRecord({
        page: pagination.page,
        pageSize: pagination.limit,
        search: search.search || undefined,
        startDate: date.start,
        endDate: date.end,
      }) as ReportsQueryParams,
    [date.end, date.start, pagination.limit, pagination.page, search.search],
  );

  return { pagination, search, date, queryParams };
}
