'use client';

import dayjs from 'dayjs';

import { useCallback, useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import type { DateRangeQueryKeys } from '@/types/query';

import { parseQueryDate, parseQueryString } from '../core/use-query-parser';
import { serializeQueryDate } from '../core/use-query-serializer';
import { useQueryTransaction } from '../core/use-query-transaction';
import { DEFAULT_DATE_FORMAT } from '../shared/constants';

export type UseDateFilterOptions = DateRangeQueryKeys & {
  resetPageOnChange?: boolean;
};

export function useDateFilter(options: UseDateFilterOptions = {}) {
  const startKey = options.startKey ?? 'startDate';
  const endKey = options.endKey ?? 'endDate';
  const periodKey = options.periodKey ?? 'period';
  const resetPageOnChange = options.resetPageOnChange ?? true;

  const searchParams = useSearchParams();
  const { updateQuery } = useQueryTransaction();

  const start = useMemo(() => parseQueryDate(searchParams.get(startKey)), [searchParams, startKey]);

  const end = useMemo(() => parseQueryDate(searchParams.get(endKey)), [endKey, searchParams]);

  const period = useMemo(
    () => parseQueryString(searchParams.get(periodKey)),
    [periodKey, searchParams],
  );

  const setDateRange = useCallback(
    (range: { start?: Date | string; end?: Date | string; period?: string | null }) => {
      updateQuery(
        {
          [startKey]: serializeQueryDate(range.start) ?? null,
          [endKey]: serializeQueryDate(range.end) ?? null,
          [periodKey]: range.period ?? null,
        },
        { resetPage: resetPageOnChange, scroll: false },
      );
    },
    [endKey, periodKey, resetPageOnChange, startKey, updateQuery],
  );

  const setPeriod = useCallback(
    (preset: string) => {
      const now = dayjs();
      let startDate: string | undefined;
      let endDate: string | undefined;

      switch (preset) {
        case '7d':
          startDate = now.subtract(7, 'day').format(DEFAULT_DATE_FORMAT);
          endDate = now.format(DEFAULT_DATE_FORMAT);
          break;
        case '30d':
          startDate = now.subtract(30, 'day').format(DEFAULT_DATE_FORMAT);
          endDate = now.format(DEFAULT_DATE_FORMAT);
          break;
        case '90d':
          startDate = now.subtract(90, 'day').format(DEFAULT_DATE_FORMAT);
          endDate = now.format(DEFAULT_DATE_FORMAT);
          break;
        default:
          startDate = undefined;
          endDate = undefined;
      }

      setDateRange({
        ...(startDate !== undefined ? { start: startDate } : {}),
        ...(endDate !== undefined ? { end: endDate } : {}),
        period: preset,
      });
    },
    [setDateRange],
  );

  const clearDateRange = useCallback(() => {
    updateQuery(
      { [startKey]: null, [endKey]: null, [periodKey]: null },
      { resetPage: resetPageOnChange, scroll: false },
    );
  }, [endKey, periodKey, resetPageOnChange, startKey, updateQuery]);

  return {
    start,
    end,
    period,
    startKey,
    endKey,
    periodKey,
    setDateRange,
    setPeriod,
    clearDateRange,
  };
}
