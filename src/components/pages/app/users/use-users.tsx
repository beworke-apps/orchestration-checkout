import { useUsersFilters } from '@/hooks/query/features/users';
import { useGetUsersQuery } from '@/store/services';

export default function useUsers() {
  const filters = useUsersFilters();
  const { data, isLoading, isError, isFetching } = useGetUsersQuery(filters.queryParams);

  return { ...filters, data, isLoading, isError, isFetching };
}
