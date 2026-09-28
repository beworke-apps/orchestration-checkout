'use client';

import { useCallback, useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { QueryNavigateOptions, QueryParamInput, QueryPatch } from '@/types/query';

import { DEFAULT_PRESERVED_QUERY_KEYS } from '../shared/constants';
import { serializeQueryPatch } from './use-query-serializer';

export function applyPatchToParams(
  base: URLSearchParams,
  patch: Record<string, QueryParamInput>,
  removeKeys: string[] = [],
): URLSearchParams {
  const next = new URLSearchParams(base.toString());
  const serialized = serializeQueryPatch(patch);

  for (const key of removeKeys) {
    next.delete(key);
  }

  for (const [key, value] of Object.entries(serialized)) {
    next.set(key, value);
  }

  for (const key of Object.keys(patch)) {
    if (patch[key] === null || patch[key] === undefined) {
      next.delete(key);
    }
  }

  return next;
}

export function useQueryActions() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramsSnapshot = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const buildUrl = useCallback(
    (params: URLSearchParams) => {
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname],
  );

  const navigate = useCallback(
    (params: URLSearchParams, options?: QueryNavigateOptions) => {
      const url = buildUrl(params);
      const scroll = options?.scroll ?? false;
      if (options?.mode === 'replace') {
        router.replace(url, { scroll });
      } else {
        router.push(url, { scroll });
      }
    },
    [buildUrl, router],
  );

  const setQuery = useCallback(
    (patch: QueryPatch, options?: QueryNavigateOptions) => {
      const next = applyPatchToParams(paramsSnapshot, patch);
      navigate(next, options);
    },
    [navigate, paramsSnapshot],
  );

  const removeQuery = useCallback(
    (keys: string | string[], options?: QueryNavigateOptions) => {
      const next = new URLSearchParams(paramsSnapshot.toString());
      const list = Array.isArray(keys) ? keys : [keys];
      for (const key of list) next.delete(key);
      navigate(next, options);
    },
    [navigate, paramsSnapshot],
  );

  const mergeQuery = useCallback(
    (patch: QueryPatch, options?: QueryNavigateOptions) => {
      const next = applyPatchToParams(paramsSnapshot, patch);
      navigate(next, options);
    },
    [navigate, paramsSnapshot],
  );

  const resetQuery = useCallback(
    (
      preserveKeys: string[] = [...DEFAULT_PRESERVED_QUERY_KEYS],
      options?: QueryNavigateOptions,
    ) => {
      const next = new URLSearchParams();
      for (const key of preserveKeys) {
        const value = paramsSnapshot.get(key);
        if (value !== null) next.set(key, value);
      }
      navigate(next, options);
    },
    [navigate, paramsSnapshot],
  );

  return {
    pathname,
    searchParams,
    paramsSnapshot,
    buildUrl,
    setQuery,
    removeQuery,
    mergeQuery,
    resetQuery,
  };
}
