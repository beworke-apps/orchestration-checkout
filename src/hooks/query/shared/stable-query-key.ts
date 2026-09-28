import { normalizeQueryRecord } from './normalize-query';

/** JSON string suitable as RTK Query `serializeQueryArgs` input. */
export function stableQueryKey(params: Record<string, unknown>): string {
  const normalized = normalizeQueryRecord(
    params as Record<string, string | number | boolean | string[] | null | undefined>,
  );
  return JSON.stringify(normalized);
}
