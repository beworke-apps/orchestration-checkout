import { Copy } from '@gravity-ui/icons';

import { useMemo } from 'react';

import type { DataGridColumn } from '@heroui-pro/react';
import { Avatar } from '@heroui/react';

import { IconButton } from '@/components/base';
import type { User } from '@/store/services';

export default function UserTableColumns() {
  const columns = useMemo<DataGridColumn<User>[]>(
    () => [
      {
        accessorKey: 'id',
        allowsSorting: true,
        cell: (item) => (
          <div className="flex items-center gap-2">
            <p className="font-medium uppercase tabular-nums">#{item.code}</p>
            <IconButton aria-label="Copy ID" label="Copy ID" size="sm" variant="ghost">
              <Copy />
            </IconButton>
          </div>
        ),
        header: 'ID',
        id: 'id',
        isRowHeader: true,
        minWidth: 140,
      },
      {
        accessorKey: 'name',
        cell: (item) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <Avatar.Image alt={item.name} src={item.avatar ?? ''} />
              <Avatar.Fallback>
                {item.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </Avatar.Fallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-medium">{item.name}</span>
              <span className="text-muted text-xs">{item.email}</span>
            </div>
          </div>
        ),
        header: 'Name',
        id: 'name',
        minWidth: 220,
      },

      {
        accessorKey: 'document',
        allowsSorting: true,
        cell: (item) => (
          <div className="flex flex-col gap-1">
            <span className="leading-1 tabular-nums">
              {item.document?.replace(/\D/g, '') ?? '-'}
            </span>
            <span className="text-muted leading-1 tabular-nums">{item.documentType ?? '-'}</span>
          </div>
        ),
        header: 'Document',
        id: 'document',
        minWidth: 120,
      },
      {
        align: 'end',
        cell: () => <div></div>,
        header: 'Actions',
        id: 'actions',
        minWidth: 140,
      },
    ],
    [],
  );
  return columns;
}
