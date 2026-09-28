'use client';

import { useDebouncedCallback } from 'use-debounce';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import type { SearchFilterOptions } from '@/types/query';

import { parseQueryString } from '../core/use-query-parser';
import { useQueryTransaction } from '../core/use-query-transaction';
import { DEFAULT_SEARCH_KEY } from '../shared/constants';

export type UseSearchFilterOptions = SearchFilterOptions & {
  resetPageOnChange?: boolean;
};

/**
 * Search filter with two layers:
 * - `inputValue` / `onInputChange`: immediate UI state (what the user types)
 * - `search`: committed value read from the URL (RTK / API)
 */
export function useSearchFilter(options: UseSearchFilterOptions = {}) {
  const key = options.key ?? DEFAULT_SEARCH_KEY;
  const debounceMs = options.debounceMs ?? 300;
  const resetPageOnChange = options.resetPageOnChange ?? true;

  const searchParams = useSearchParams();
  const { updateQuery } = useQueryTransaction();

  const search = useMemo(() => parseQueryString(searchParams.get(key)) ?? '', [key, searchParams]);

  const [inputValue, setInputValue] = useState(search);
  const lastCommittedRef = useRef(search);

  const commitToUrl = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      const committed = parseQueryString(searchParams.get(key)) ?? '';

      if (trimmed === committed) return;

      updateQuery({ [key]: trimmed || null }, { resetPage: resetPageOnChange, scroll: false });
    },
    [key, resetPageOnChange, searchParams, updateQuery],
  );

  const debouncedCommit = useDebouncedCallback(commitToUrl, debounceMs);

  const onInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      debouncedCommit(value);
    },
    [debouncedCommit],
  );

  const flushSearch = useCallback(() => {
    debouncedCommit.cancel();
    commitToUrl(inputValue);
  }, [commitToUrl, debouncedCommit, inputValue]);

  const clearSearch = useCallback(() => {
    debouncedCommit.cancel();
    setInputValue('');
    updateQuery({ [key]: null }, { resetPage: resetPageOnChange, scroll: false });
  }, [debouncedCommit, key, resetPageOnChange, updateQuery]);

  useEffect(() => {
    const previousCommitted = lastCommittedRef.current;
    lastCommittedRef.current = search;

    if (search === previousCommitted) return;

    setInputValue((current) => {
      if (current === previousCommitted) return search;
      return current;
    });
  }, [search]);

  const isEmpty = search.length === 0;

  return {
    search,
    inputValue,
    isEmpty,
    onInputChange,
    flushSearch,
    clearSearch,
    /** @deprecated Use `onInputChange` */
    setSearch: onInputChange,
    /** @deprecated Use `flushSearch` */
    commitSearch: flushSearch,
  };
}
