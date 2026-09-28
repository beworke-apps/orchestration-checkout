'use client';

import { useCallback, useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import type {
  SortDefaults,
  SortDirection,
  SortQueryKeys,
  TableSortDescriptor,
} from '@/types/query';

import { parseQueryEnum, parseQueryString } from '../core/use-query-parser';
import { useQueryTransaction } from '../core/use-query-transaction';
import { DEFAULT_SORT_DIRECTION_KEY, DEFAULT_SORT_FIELD_KEY } from '../shared/constants';

const SORT_DIRECTIONS = ['asc', 'desc'] as const;

export type UseSortFilterOptions = SortQueryKeys &
  SortDefaults & {
    resetPageOnChange?: boolean;
  };

function mapTableDirection(direction: TableSortDescriptor['direction']): SortDirection {
  return direction === 'ascending' ? 'asc' : 'desc';
}

export function useSortFilter(options: UseSortFilterOptions = {}) {
  const fieldKey = options.fieldKey ?? DEFAULT_SORT_FIELD_KEY;
  const directionKey = options.directionKey ?? DEFAULT_SORT_DIRECTION_KEY;
  const resetPageOnChange = options.resetPageOnChange ?? true;

  const searchParams = useSearchParams();
  const { updateQuery } = useQueryTransaction();

  const field = useMemo(
    () => parseQueryString(searchParams.get(fieldKey)) ?? options.field,
    [fieldKey, options.field, searchParams],
  );

  const direction = useMemo(
    () => parseQueryEnum(searchParams.get(directionKey), SORT_DIRECTIONS) ?? options.direction,
    [directionKey, options.direction, searchParams],
  );

  const setSort = useCallback(
    (nextField: string | undefined, nextDirection?: SortDirection) => {
      updateQuery(
        {
          [fieldKey]: nextField ?? null,
          [directionKey]: nextDirection ?? null,
        },
        { resetPage: resetPageOnChange, scroll: false },
      );
    },
    [directionKey, fieldKey, resetPageOnChange, updateQuery],
  );

  const setSortFromDescriptor = useCallback(
    (descriptor: TableSortDescriptor) => {
      setSort(String(descriptor.column), mapTableDirection(descriptor.direction));
    },
    [setSort],
  );

  const clearSort = useCallback(() => {
    updateQuery(
      { [fieldKey]: null, [directionKey]: null },
      { resetPage: resetPageOnChange, scroll: false },
    );
  }, [directionKey, fieldKey, resetPageOnChange, updateQuery]);

  return {
    field,
    direction,
    fieldKey,
    directionKey,
    setSort,
    setSortFromDescriptor,
    clearSort,
  };
}
