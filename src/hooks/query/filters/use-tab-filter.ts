'use client';

import { useCallback, useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import type { TabFilterOptions } from '@/types/query';

import { parseQueryString } from '../core/use-query-parser';
import { useQueryTransaction } from '../core/use-query-transaction';
import { DEFAULT_TAB_KEY } from '../shared/constants';

export type UseTabFilterOptions = TabFilterOptions & {
  resetPageOnChange?: boolean;
};

export function useTabFilter(options: UseTabFilterOptions = {}) {
  const key = options.key ?? DEFAULT_TAB_KEY;
  const defaultTab = options.defaultTab;
  const resetPageOnChange = options.resetPageOnChange ?? false;

  const searchParams = useSearchParams();
  const { updateQuery } = useQueryTransaction();

  const tab = useMemo(
    () => parseQueryString(searchParams.get(key)) ?? defaultTab,
    [defaultTab, key, searchParams],
  );

  const setTab = useCallback(
    (value: string | undefined) => {
      updateQuery({ [key]: value ?? null }, { resetPage: resetPageOnChange, scroll: false });
    },
    [key, resetPageOnChange, updateQuery],
  );

  const clearTab = useCallback(() => {
    updateQuery({ [key]: null }, { resetPage: resetPageOnChange, scroll: false });
  }, [key, resetPageOnChange, updateQuery]);

  return {
    tab,
    setTab,
    clearTab,
  };
}
