'use client';

import { useMemo } from 'react';

import { useSearchParams } from 'next/navigation';

import type { QuerySchema } from '@/types/query';

/**
 * Reads the current URL search params and returns typed state from a schema.
 */
export function useQueryState<T extends Record<string, unknown>>(schema: QuerySchema<T>): T {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const result = {} as T;

    for (const fieldKey of Object.keys(schema) as (keyof T)[]) {
      const field = schema[fieldKey];
      const raw = searchParams.get(field.key);
      const parsed = field.parse(raw, searchParams);
      result[fieldKey] =
        parsed === undefined || parsed === null ? (field.defaultValue as T[keyof T]) : parsed;
    }

    return result;
  }, [schema, searchParams]);
}
