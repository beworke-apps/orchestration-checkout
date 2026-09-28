import { DataGrid } from '@heroui-pro/react';

import type { UsersListResponse } from '@/store/services';

import UserTableColumns from './user-table-columns';

export default function UserTable({ data }: { data: UsersListResponse['data'] }) {
  const columns = UserTableColumns();
  return (
    <DataGrid
      aria-label="Users"
      columns={columns}
      contentClassName="min-w-[820px]"
      data={data}
      getRowId={(item) => item.id}
      isLoadingMore={true}
      loadMoreContent={<div>Loading more users...</div>}
    />
  );
}
