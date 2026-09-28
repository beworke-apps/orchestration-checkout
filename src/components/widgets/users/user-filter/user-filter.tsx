'use client';

import { Calendar, Funnel } from '@gravity-ui/icons';

import { Button, Dropdown, Label } from '@heroui/react';

import { QuerySearchField } from '@/components/composites/search-field';
import { useUsersFilters } from '@/hooks/query';

const STATUS_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
] as const;

export function UserFilter() {
  const filters = useUsersFilters();
  const { search, setStatus } = filters;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <QuerySearchField
        inputValue={search.inputValue}
        name="users-search"
        onClear={search.clearSearch}
        onInputChange={search.onInputChange}
        onSubmit={search.flushSearch}
        placeholder="Search users..."
      />

      <Dropdown>
        <Button size="sm" variant="secondary">
          <Funnel className="size-4" />
          Status
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu
            onAction={(key) => {
              const id = String(key);
              setStatus(id === 'all' ? undefined : id);
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <Dropdown.Item id={option.id} key={option.id} textValue={option.label}>
                <Label>{option.label}</Label>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      <Dropdown>
        <Button size="sm" variant="secondary">
          <Calendar className="size-4" />
          Date range
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu>
            <Dropdown.Item id="7d" textValue="Last 7 days">
              <Label>Last 7 days</Label>
            </Dropdown.Item>
            <Dropdown.Item id="30d" textValue="Last 30 days">
              <Label>Last 30 days</Label>
            </Dropdown.Item>
            <Dropdown.Item id="90d" textValue="Last 90 days">
              <Label>Last 90 days</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
