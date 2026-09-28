export type PaginationQueryState = {
  page: number;
  limit: number;
};

export type PaginationQueryKeys = {
  pageKey?: string;
  limitKey?: string;
};

export type PaginationDefaults = {
  page?: number;
  limit?: number;
};
