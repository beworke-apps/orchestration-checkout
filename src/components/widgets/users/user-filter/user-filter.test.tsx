import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';
import React, { Children, isValidElement } from 'react';

import { useUsersFilters } from '@/hooks/query';

import { UserFilter } from './user-filter';

interface MockSearchFieldProps {
  onInputChange?: (value: string) => void;
  onClear?: () => void;
  onSubmit?: () => void;
  placeholder?: string;
}

interface MockMenuProps {
  children?: ReactNode;
  onAction?: (key: string | number) => void;
}

vi.mock('@/hooks/query', () => ({
  useUsersFilters: vi.fn(),
}));

vi.mock('@/components/composites/search-field', () => ({
  QuerySearchField: ({ onInputChange, onClear, onSubmit, placeholder }: MockSearchFieldProps) => (
    <div>
      <input
        data-testid="mock-search-input"
        onChange={(e) => onInputChange?.(e.target.value)}
        placeholder={placeholder}
      />
      <button data-testid="mock-clear-btn" onClick={() => onClear?.()}>
        Clear
      </button>
      <button data-testid="mock-submit-btn" onClick={() => onSubmit?.()}>
        Submit
      </button>
    </div>
  ),
}));

vi.mock('@heroui/react', () => {
  const MockDropdown = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const MockPopover = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const MockItem = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const MockLabel = ({ children }: { children: ReactNode }) => <label>{children}</label>;
  const MockButton = ({ children }: { children: ReactNode }) => <button>{children}</button>;

  const MockMenu = ({ children, onAction }: MockMenuProps) => {
    const childrenArray = Children.toArray(children);
    const isStatusMenu = childrenArray.some(
      (child) =>
        isValidElement(child) &&
        ((child as React.ReactElement<{ id?: unknown }>).props.id === 'all' || child.key === 'all'),
    );

    return (
      <div>
        {children}
        {isStatusMenu && (
          <>
            <button data-testid="sort-all-trigger" onClick={() => onAction?.('all')}>
              All
            </button>
            <button data-testid="sort-active-trigger" onClick={() => onAction?.('active')}>
              Active
            </button>
          </>
        )}
      </div>
    );
  };

  return {
    Button: MockButton,
    Label: MockLabel,
    Dropdown: Object.assign(MockDropdown, {
      Popover: MockPopover,
      Menu: MockMenu,
      Item: MockItem,
    }),
  };
});

describe('UserFilter Layout and URL Actions', () => {
  const mockFilters = {
    search: {
      inputValue: '',
      clearSearch: vi.fn(),
      onInputChange: vi.fn(),
      flushSearch: vi.fn(),
    },
    setStatus: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUsersFilters).mockReturnValue(
      mockFilters as unknown as ReturnType<typeof useUsersFilters>,
    );
  });

  it('should render input components and trigger internal search pipeline functions', () => {
    // Act
    render(<UserFilter />);

    const inputElement = screen.getByTestId('mock-search-input');
    const clearBtn = screen.getByTestId('mock-clear-btn');
    const submitBtn = screen.getByTestId('mock-submit-btn');

    fireEvent.change(inputElement, { target: { value: 'Lucas' } });
    fireEvent.click(clearBtn);
    fireEvent.click(submitBtn);

    // Assert
    expect(mockFilters.search.onInputChange).toHaveBeenCalledWith('Lucas');
    expect(mockFilters.search.clearSearch).toHaveBeenCalled();
    expect(mockFilters.search.flushSearch).toHaveBeenCalled();
  });

  it('should map layout dropdown selections and transform specific action IDs down to hook setters', () => {
    // Act
    render(<UserFilter />);

    const triggerAll = screen.getByTestId('sort-all-trigger');
    const triggerActive = screen.getByTestId('sort-active-trigger');

    fireEvent.click(triggerActive);

    // Assert
    expect(mockFilters.setStatus).toHaveBeenCalledWith('active');

    // Act
    fireEvent.click(triggerAll);

    // Assert
    expect(mockFilters.setStatus).toHaveBeenCalledWith(undefined);
  });
});
