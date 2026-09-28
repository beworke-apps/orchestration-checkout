'use client';

import { useCallback, useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import type { PaginationDefaults, PaginationQueryKeys } from '@/types/query';

import { parseQueryNumber } from '../core/use-query-parser';
import { useQueryTransaction } from '../core/use-query-transaction';
import { DEFAULT_LIMIT_KEY, DEFAULT_PAGE_KEY } from '../shared/constants';

export type UsePaginationFilterOptions = PaginationQueryKeys &
  PaginationDefaults & {
    resetPageOnLimitChange?: boolean;
  };

export function usePaginationFilter(options: UsePaginationFilterOptions = {}) {
  const pageKey = options.pageKey ?? DEFAULT_PAGE_KEY;
  const limitKey = options.limitKey ?? DEFAULT_LIMIT_KEY;
  const defaultPage = options.page ?? 1;
  const defaultLimit = options.limit ?? 10;
  const resetPageOnLimitChange = options.resetPageOnLimitChange ?? true;

  const searchParams = useSearchParams();
  const { updateQuery } = useQueryTransaction({ pageKey });

  const page = useMemo(
    () => parseQueryNumber(searchParams.get(pageKey), { min: 1, fallback: defaultPage }) as number,
    [defaultPage, pageKey, searchParams],
  );

  const limit = useMemo(
    () =>
      parseQueryNumber(searchParams.get(limitKey), { min: 1, fallback: defaultLimit }) as number,
    [defaultLimit, limitKey, searchParams],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      updateQuery({ [pageKey]: nextPage }, { scroll: false });
    },
    [pageKey, updateQuery],
  );

  const setLimit = useCallback(
    (nextLimit: number) => {
      updateQuery(
        {
          [limitKey]: nextLimit,
          ...(resetPageOnLimitChange ? { [pageKey]: 1 } : {}),
        },
        { scroll: false },
      );
    },
    [limitKey, pageKey, resetPageOnLimitChange, updateQuery],
  );

  const nextPage = useCallback(() => setPage(page + 1), [page, setPage]);
  const previousPage = useCallback(() => setPage(Math.max(1, page - 1)), [page, setPage]);

  const resetPagination = useCallback(() => {
    updateQuery({ [pageKey]: defaultPage, [limitKey]: defaultLimit }, { scroll: false });
  }, [defaultLimit, defaultPage, limitKey, pageKey, updateQuery]);

  return {
    page,
    limit,
    pageKey,
    limitKey,
    setPage,
    setLimit,
    nextPage,
    previousPage,
    resetPagination,
  };
}
