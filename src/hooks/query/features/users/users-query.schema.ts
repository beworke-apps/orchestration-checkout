import type { QuerySchema } from '@/types/query';

import { parseQueryEnum, parseQueryNumber, parseQueryString } from '../../core/use-query-parser';
import type { UsersQueryParams } from './users-query.types';

const USER_SORT_ORDERS = ['asc', 'desc'] as const;

export const usersQuerySchema: QuerySchema<UsersQueryParams> = {
  page: {
    key: 'page',
    defaultValue: 1,
    parse: (raw) => parseQueryNumber(raw, { min: 1, fallback: 1 }),
  },
  pageSize: {
    key: 'pageSize',
    defaultValue: 10,
    parse: (raw) => parseQueryNumber(raw, { min: 1, fallback: 10 }),
  },
  search: {
    key: 'search',
    parse: (raw) => parseQueryString(raw),
  },
  status: {
    key: 'status',
    parse: (raw) => parseQueryString(raw),
  },
  sort: {
    key: 'sort',
    parse: (raw) => parseQueryString(raw),
  },
  order: {
    key: 'order',
    parse: (raw) => parseQueryEnum(raw, USER_SORT_ORDERS),
  },
};
