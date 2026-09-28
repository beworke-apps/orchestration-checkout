export type DateRangeQueryState = {
  start: string | undefined;
  end: string | undefined;
};

export type DateRangeQueryKeys = {
  startKey?: string;
  endKey?: string;
  periodKey?: string;
};

export type SearchFilterOptions = {
  key?: string;
  debounceMs?: number;
};

export type MultiSelectFilterOptions = {
  key: string;
  separator?: string;
};

export type TabFilterOptions = {
  key?: string;
  defaultTab?: string;
};

export type ActiveFilterItem = {
  key: string;
  value: string;
  label?: string;
};
