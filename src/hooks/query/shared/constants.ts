export const DEFAULT_PAGE_KEY = 'page';
export const DEFAULT_LIMIT_KEY = 'pageSize';
export const DEFAULT_SEARCH_KEY = 'search';
export const DEFAULT_SORT_FIELD_KEY = 'sort';
export const DEFAULT_SORT_DIRECTION_KEY = 'order';
export const DEFAULT_TAB_KEY = 'tab';
export const DEFAULT_ARRAY_SEPARATOR = ',';
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

/** Params preserved when clearing filters (pagination + navigation). */
export const DEFAULT_PRESERVED_QUERY_KEYS = [
  DEFAULT_PAGE_KEY,
  DEFAULT_LIMIT_KEY,
  DEFAULT_TAB_KEY,
] as const;
