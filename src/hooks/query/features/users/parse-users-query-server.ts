import { parseSearchParams } from '../../shared/search-params-server';
import { mapUsersQueryToApi } from './map-users-query-to-api';
import { usersQuerySchema } from './users-query.schema';
import type { UsersQueryParams } from './users-query.types';

type SearchParamsInput = Parameters<typeof parseSearchParams>[0];

export async function parseUsersQueryFromSearchParams(
  searchParams: SearchParamsInput,
): Promise<UsersQueryParams> {
  return parseSearchParams(searchParams, usersQuerySchema);
}

export async function parseUsersApiParamsFromSearchParams(searchParams: SearchParamsInput) {
  const query = await parseUsersQueryFromSearchParams(searchParams);
  return mapUsersQueryToApi(query);
}
