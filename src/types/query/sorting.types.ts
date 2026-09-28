export type SortDirection = 'asc' | 'desc';

export type SortQueryState = {
  field: string | undefined;
  direction: SortDirection | undefined;
};

export type SortQueryKeys = {
  fieldKey?: string;
  directionKey?: string;
};

export type SortDefaults = {
  field?: string;
  direction?: SortDirection;
};

/** HeroUI / React Aria table sort descriptor shape. */
export type TableSortDescriptor = {
  column: string | number;
  direction: 'ascending' | 'descending';
};
