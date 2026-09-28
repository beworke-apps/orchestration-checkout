import type { QuerySchema } from '@/types/query';

type SearchParamsInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>;

async function resolveSearchParamsInput(input: SearchParamsInput): Promise<URLSearchParams> {
  if (input instanceof URLSearchParams) return input;

  const resolved = input instanceof Promise ? await input : input;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(resolved)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
    } else {
      params.set(key, value);
    }
  }

  return params;
}

/** Parse URL search params on the server (RSC / route handlers). */
export async function parseSearchParams<T extends Record<string, unknown>>(
  input: SearchParamsInput,
  schema: QuerySchema<T>,
): Promise<T> {
  const params = await resolveSearchParamsInput(input);
  const result = {} as T;

  for (const fieldKey of Object.keys(schema) as (keyof T)[]) {
    const field = schema[fieldKey];
    const raw = params.get(field.key);
    const parsed = field.parse(raw, params);
    result[fieldKey] =
      parsed === undefined || parsed === null ? (field.defaultValue as T[keyof T]) : parsed;
  }

  return result;
}
