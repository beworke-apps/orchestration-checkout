'use client';

import { useCallback, useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import type { UsersListParams } from '@/store/services/users/users.types';

import { parseQueryString } from '../../core/use-query-parser';
import { useQueryState } from '../../core/use-query-state';
import { useQueryTransaction } from '../../core/use-query-transaction';
import { usePaginationFilter } from '../../filters/use-pagination-filter';
import { useSearchFilter } from '../../filters/use-search-filter';
import { useSortFilter } from '../../filters/use-sort-filter';
import { stableQueryKey } from '../../shared/stable-query-key';
import { mapUsersQueryToApi } from './map-users-query-to-api';
import { usersQuerySchema } from './users-query.schema';

export function useUsersFilters() {
  const urlState = useQueryState(usersQuerySchema);
  const searchParams = useSearchParams();
  const { updateQuery } = useQueryTransaction();

  const pagination = usePaginationFilter({ pageKey: 'page', limitKey: 'pageSize' });
  const search = useSearchFilter({ key: 'search', resetPageOnChange: true });
  const sort = useSortFilter({
    fieldKey: 'sort',
    directionKey: 'order',
    resetPageOnChange: true,
  });

  const status = useMemo(() => parseQueryString(searchParams.get('status')), [searchParams]);

  const setStatus = useCallback(
    (value: string | undefined) => {
      updateQuery({ status: value ?? null }, { resetPage: true, scroll: false });
    },
    [updateQuery],
  );

  const queryParams = useMemo((): UsersListParams => mapUsersQueryToApi(urlState), [urlState]);

  const queryCacheKey = useMemo(() => stableQueryKey(queryParams), [queryParams]);

  return {
    urlState,
    queryParams,
    queryCacheKey,
    pagination,
    search,
    sort,
    status,
    setStatus,
    updateQuery,
  };
}
