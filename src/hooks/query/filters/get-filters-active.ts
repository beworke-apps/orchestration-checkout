'use client';

import { useCallback, useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import type { ActiveFilterItem } from '@/types/query';

import { useQueryTransaction } from '../core/use-query-transaction';
import { DEFAULT_PRESERVED_QUERY_KEYS } from '../shared/constants';

export type UseFiltersActiveOptions = {
  excludeKeys?: string[];
};

export function useFiltersActive(options: UseFiltersActiveOptions = {}) {
  const searchParams = useSearchParams();
  const { updateQuery } = useQueryTransaction();

  const excluded = useMemo(
    () => new Set([...DEFAULT_PRESERVED_QUERY_KEYS, ...(options.excludeKeys ?? [])]),
    [options.excludeKeys],
  );

  const filters = useMemo(() => {
    const items: ActiveFilterItem[] = [];

    for (const [key, value] of searchParams.entries()) {
      if (excluded.has(key)) continue;
      for (const part of value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)) {
        items.push({ key, value: part });
      }
    }

    return items;
  }, [excluded, searchParams]);

  const removeFilter = useCallback(
    (key: string, valueToRemove?: string) => {
      const current = searchParams.get(key);
      if (!current) return;

      if (valueToRemove && current.includes(',')) {
        const next = current
          .split(',')
          .map((v) => v.trim())
          .filter((v) => v !== valueToRemove);
        updateQuery({ [key]: next.length ? next.join(',') : null }, { resetPage: true });
        return;
      }

      updateQuery({ [key]: null }, { resetPage: true });
    },
    [searchParams, updateQuery],
  );

  const clearAllFilters = useCallback(() => {
    const patch: Record<string, null> = {};
    for (const key of new Set(searchParams.keys())) {
      if (!excluded.has(key)) patch[key] = null;
    }
    updateQuery(patch, { resetPage: true });
  }, [excluded, searchParams, updateQuery]);

  return {
    filters,
    hasActiveFilters: filters.length > 0,
    removeFilter,
    clearAllFilters,
  };
}
