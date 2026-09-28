import dayjs from 'dayjs';

import { DEFAULT_ARRAY_SEPARATOR, DEFAULT_DATE_FORMAT } from '../shared/constants';

export function parseQueryString(
  raw: string | null,
  options?: { trim?: boolean; emptyAsUndefined?: boolean },
): string | undefined {
  if (raw === null || raw === '') return undefined;
  const value = options?.trim === false ? raw : raw.trim();
  if (options?.emptyAsUndefined !== false && value === '') return undefined;
  return value;
}

export function parseQueryNumber(
  raw: string | null,
  options?: { min?: number; max?: number; fallback?: number },
): number | undefined {
  if (raw === null || raw === '') return options?.fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return options?.fallback;
  if (options?.min !== undefined && parsed < options.min) return options?.fallback;
  if (options?.max !== undefined && parsed > options.max) return options?.fallback;
  return parsed;
}

export function parseQueryBoolean(raw: string | null): boolean | undefined {
  if (raw === null || raw === '') return undefined;
  if (raw === 'true' || raw === '1') return true;
  if (raw === 'false' || raw === '0') return false;
  return undefined;
}

export function parseQueryArray(raw: string | null, options?: { separator?: string }): string[] {
  if (raw === null || raw === '') return [];
  const separator = options?.separator ?? DEFAULT_ARRAY_SEPARATOR;
  return raw
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseQueryEnum<T extends string>(
  raw: string | null,
  allowed: readonly T[],
): T | undefined {
  if (raw === null || raw === '') return undefined;
  return allowed.includes(raw as T) ? (raw as T) : undefined;
}

export function parseQueryDate(
  raw: string | null,
  format: string = DEFAULT_DATE_FORMAT,
): string | undefined {
  if (raw === null || raw === '') return undefined;
  return dayjs(raw, format, true).isValid() ? raw : undefined;
}

export function parseQueryDateRange(
  params: URLSearchParams,
  keys: { start?: string; end?: string } = {},
): { start: string | undefined; end: string | undefined } {
  const startKey = keys.start ?? 'startDate';
  const endKey = keys.end ?? 'endDate';
  return {
    start: parseQueryDate(params.get(startKey)),
    end: parseQueryDate(params.get(endKey)),
  };
}

/** Stable parser API for client hooks and server parsers. */
export function useQueryParser() {
  return {
    parseString: parseQueryString,
    parseNumber: parseQueryNumber,
    parseBoolean: parseQueryBoolean,
    parseArray: parseQueryArray,
    parseEnum: parseQueryEnum,
    parseDate: parseQueryDate,
    parseDateRange: parseQueryDateRange,
  } as const;
}
