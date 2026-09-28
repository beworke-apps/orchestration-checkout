'use client';

import { Pagination } from '@/components/composites/pagination/pagination';
import { UserFilter } from '@/components/widgets/users/user-filter/user-filter';
import { UserTable } from '@/components/widgets/users/users-table';

import useUsers from './use-users';

export function UsersPage() {
  const { data, isError, pagination } = useUsers();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 pt-4 pb-10">
      <p className="text-muted text-sm">Manage and track users.</p>

      {isError ? <p className="text-danger text-sm">Failed to load users. Try again.</p> : null}
      <UserFilter />
      <UserTable data={data?.data ?? []} />
      <Pagination
        onPageChange={pagination.setPage}
        page={pagination.page}
        pageSize={data?.meta.pageSize ?? pagination.limit}
        total={data?.meta.total ?? 0}
        totalPages={data?.meta.totalPages ?? 0}
      />
      {status ? <p className="text-muted text-xs">Filter: status={status}</p> : null}
    </div>
  );
}
