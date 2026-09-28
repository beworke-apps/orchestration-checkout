import type { UsersListParams } from '@/store/services/users/users.types';

import { normalizeQueryRecord } from '../../shared/normalize-query';
import type { UsersQueryParams } from './users-query.types';

/** Maps URL state → RTK Query / API params. */
export function mapUsersQueryToApi(query: UsersQueryParams): UsersListParams {
  const params: UsersListParams = {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 10,
  };

  if (query.search) params.filter = query.search;
  if (query.status) params.status = query.status;

  return normalizeQueryRecord(params) as UsersListParams;
}
