/** Navigation mode when updating the URL. */
export type QueryNavigateMode = 'push' | 'replace';

export type QueryNavigateOptions = {
  mode?: QueryNavigateMode;
  scroll?: boolean;
};

/** Values accepted in query patches before serialization. */
export type QueryParamInput = string | number | boolean | Date | string[] | null | undefined;

export type QueryPatch = Record<string, QueryParamInput>;

export type QueryTransactionOptions = QueryNavigateOptions & {
  /** Reset page to 1 when applying the patch. */
  resetPage?: boolean;
  /** URL key for page (default: `page`). */
  pageKey?: string;
  /** Page value after reset (default: `1`). */
  resetPageValue?: number | string;
};

export type QuerySchemaField<T> = {
  key: string;
  parse: (raw: string | null, params: URLSearchParams) => T;
  defaultValue?: T;
};

export type QuerySchema<T extends Record<string, unknown>> = {
  [K in keyof T]: QuerySchemaField<T[K]>;
};
