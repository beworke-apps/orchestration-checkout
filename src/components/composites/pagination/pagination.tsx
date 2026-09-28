'use client';

import { Pagination as PaginationComponent } from '@heroui/react';

import type { PaginationProps } from './pagination.type';

export function Pagination({
  page,

  pageSize = 10,

  total = 0,

  totalPages = 0,

  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 0) return pages;

    if (totalPages === 1) return [1];

    pages.push(1);

    if (page > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, page - 1);

    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);

    return pages;
  };

  const goToPage = (next: number) => {
    onPageChange?.(next);
  };

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;

  const endItem = Math.min(page * pageSize, total);

  return (
    <PaginationComponent className="w-full">
      <PaginationComponent.Summary>
        Showing {startItem}-{endItem} of {total} results
      </PaginationComponent.Summary>

      <PaginationComponent.Content>
        <PaginationComponent.Item>
          <PaginationComponent.Previous
            isDisabled={page <= 1 || !onPageChange}
            onPress={() => goToPage(page - 1)}
          >
            <PaginationComponent.PreviousIcon />

            <span>Previous</span>
          </PaginationComponent.Previous>
        </PaginationComponent.Item>

        {getPageNumbers().map((p, i) =>
          p === 'ellipsis' ? (
            <PaginationComponent.Item key={`ellipsis-${i}`}>
              <PaginationComponent.Ellipsis />
            </PaginationComponent.Item>
          ) : (
            <PaginationComponent.Item key={p}>
              <PaginationComponent.Link isActive={p === page} onPress={() => goToPage(p)}>
                {p}
              </PaginationComponent.Link>
            </PaginationComponent.Item>
          ),
        )}

        <PaginationComponent.Item>
          <PaginationComponent.Next
            isDisabled={page >= totalPages || !onPageChange}
            onPress={() => goToPage(page + 1)}
          >
            <span>Next</span>

            <PaginationComponent.NextIcon />
          </PaginationComponent.Next>
        </PaginationComponent.Item>
      </PaginationComponent.Content>
    </PaginationComponent>
  );
}
