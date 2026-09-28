import type { QueryParamInput } from '@/types/query';

/**
 * Stable object for RTK Query cache keys — sorted keys, omits empty values.
 */
export function normalizeQueryRecord(
  input: Record<string, QueryParamInput>,
): Record<string, string | number | boolean | string[]> {
  const result: Record<string, string | number | boolean | string[]> = {};

  for (const key of Object.keys(input).sort()) {
    const value = input[key];
    if (value === undefined || value === null || value === '') continue;
    if (value instanceof Date) {
      result[key] = value.toISOString();
      continue;
    }
    if (Array.isArray(value) && value.length === 0) continue;
    result[key] = value;
  }

  return result;
}
