import dayjs from 'dayjs';

import type { QueryParamInput } from '@/types/query';

import { DEFAULT_ARRAY_SEPARATOR, DEFAULT_DATE_FORMAT } from '../shared/constants';

export function serializeQueryValue(value: QueryParamInput): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (value instanceof Date) return dayjs(value).format(DEFAULT_DATE_FORMAT);
  if (Array.isArray(value)) return serializeQueryArray(value);
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

export function serializeQueryArray(
  values: string[],
  options?: { separator?: string },
): string | undefined {
  const filtered = values.map((v) => v.trim()).filter(Boolean);
  if (filtered.length === 0) return undefined;
  return filtered.join(options?.separator ?? DEFAULT_ARRAY_SEPARATOR);
}

export function serializeQueryEnum<T extends string>(value: T | undefined): string | undefined {
  return value ? String(value) : undefined;
}

export function serializeQueryDate(
  value: Date | string | undefined,
  format: string = DEFAULT_DATE_FORMAT,
): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format(format) : undefined;
}

export function serializeQueryDateRange(range: { start?: Date | string; end?: Date | string }): {
  start?: string | undefined;
  end?: string | undefined;
} {
  const start = serializeQueryDate(range.start);
  const end = serializeQueryDate(range.end);
  return {
    ...(start !== undefined ? { start } : {}),
    ...(end !== undefined ? { end } : {}),
  };
}

export function serializeQueryPatch(
  patch: Record<string, QueryParamInput>,
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(patch)) {
    const serialized = serializeQueryValue(value);
    if (serialized !== undefined) result[key] = serialized;
  }

  return result;
}

/** Stable serializer API for client hooks. */
export function useQuerySerializer() {
  return {
    serializeValue: serializeQueryValue,
    serializeArray: serializeQueryArray,
    serializeEnum: serializeQueryEnum,
    serializeDate: serializeQueryDate,
    serializeDateRange: serializeQueryDateRange,
    serializePatch: serializeQueryPatch,
  } as const;
}
