'use client';

import { useCallback } from 'react';

import type { QueryPatch, QueryTransactionOptions } from '@/types/query';

import { DEFAULT_PAGE_KEY } from '../shared/constants';
import { useQueryActions } from './use-query-actions';

export function useQueryTransaction(defaults?: { pageKey?: string }) {
  const { mergeQuery, setQuery, removeQuery, resetQuery } = useQueryActions();
  const pageKey = defaults?.pageKey ?? DEFAULT_PAGE_KEY;

  const updateQuery = useCallback(
    (patch: QueryPatch, options?: QueryTransactionOptions) => {
      const finalPatch: QueryPatch = { ...patch };

      if (options?.resetPage) {
        finalPatch[options.pageKey ?? pageKey] = options.resetPageValue ?? 1;
      }

      mergeQuery(finalPatch, {
        ...(options?.mode !== undefined ? { mode: options.mode } : {}),
        ...(options?.scroll !== undefined ? { scroll: options.scroll } : {}),
      });
    },
    [mergeQuery, pageKey],
  );

  return {
    updateQuery,
    setQuery,
    removeQuery,
    resetQuery,
  };
}
