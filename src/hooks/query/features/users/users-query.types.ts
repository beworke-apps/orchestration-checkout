import type { UsersListParams } from '@/store/services/users/users.types';

/** URL query schema for the Users feature (source of truth in the URL). */
export type UsersQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};

export type UsersQueryToApiParams = UsersListParams;
