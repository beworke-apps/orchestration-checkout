export type PaginationProps = {
  page: number;

  pageSize: number;

  total: number;

  totalPages: number;

  onPageChange?: (page: number) => void;
};
