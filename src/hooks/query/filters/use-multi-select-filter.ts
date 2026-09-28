'use client';

import { useCallback, useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import type { MultiSelectFilterOptions } from '@/types/query';

import { parseQueryArray } from '../core/use-query-parser';
import { serializeQueryArray } from '../core/use-query-serializer';
import { useQueryTransaction } from '../core/use-query-transaction';
import { DEFAULT_ARRAY_SEPARATOR } from '../shared/constants';

export type UseMultiSelectFilterOptions = MultiSelectFilterOptions & {
  resetPageOnChange?: boolean;
};

export function useMultiSelectFilter(options: UseMultiSelectFilterOptions) {
  const { key } = options;
  const separator = options.separator ?? DEFAULT_ARRAY_SEPARATOR;
  const resetPageOnChange = options.resetPageOnChange ?? true;

  const searchParams = useSearchParams();
  const { updateQuery } = useQueryTransaction();

  const values = useMemo(
    () => parseQueryArray(searchParams.get(key), { separator }),
    [key, searchParams, separator],
  );

  const setValues = useCallback(
    (next: string[]) => {
      updateQuery(
        { [key]: serializeQueryArray(next, { separator }) ?? null },
        { resetPage: resetPageOnChange, scroll: false },
      );
    },
    [key, resetPageOnChange, separator, updateQuery],
  );

  const toggleValue = useCallback(
    (value: string) => {
      const set = new Set(values);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      setValues([...set]);
    },
    [setValues, values],
  );

  const clearValues = useCallback(() => {
    updateQuery({ [key]: null }, { resetPage: resetPageOnChange, scroll: false });
  }, [key, resetPageOnChange, updateQuery]);

  return {
    values,
    setValues,
    toggleValue,
    clearValues,
    hasValue: (value: string) => values.includes(value),
  };
}
