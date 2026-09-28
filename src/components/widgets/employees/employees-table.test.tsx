import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import type { Employee } from '@/data/employees';

import { EmployeesTable } from './employees-table';

const { MOCK_ALICE, MOCK_BOB } = vi.hoisted(() => ({
  MOCK_ALICE: 'Alice Smith',
  MOCK_BOB: 'Bob Johnson',
}));

interface MockDataGridProps {
  columns: Array<{ id: string; cell?: (item: Employee) => ReactNode }>;
  data: Employee[];
  getRowId?: (item: Employee) => string;
  onSortChange?: (desc: { column: string; direction: 'ascending' | 'descending' }) => void;
}

vi.mock('@heroui-pro/react', () => {
  const MockDataGrid = ({ columns, data, getRowId, onSortChange }: MockDataGridProps) => {
    if (getRowId && data.length > 0) {
      data.forEach((item) => getRowId(item));
    }

    return (
      <table data-testid="mock-data-grid">
        <thead>
          <tr>
            <th>
              <button
                data-testid="clear-sort-btn"
                onClick={() => onSortChange?.({ column: '', direction: 'ascending' })}
              >
                Clear
              </button>
            </th>
            {columns.map((col) => (
              <th key={col.id}>
                <button
                  data-testid={`sort-btn-${col.id}`}
                  onClick={() => onSortChange?.({ column: col.id, direction: 'descending' })}
                >
                  {col.id}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr data-testid={`row-${item.id}`} key={item.id}>
              {columns.map((col) => (
                <td data-testid={`cell-${item.id}-${col.id}`} key={col.id}>
                  {col.cell ? col.cell(item) : (item[col.id as keyof Employee] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return {
    DataGrid: MockDataGrid,
  };
});

vi.mock('@heroui/react', () => {
  const MockAvatar = ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-avatar">{children}</div>
  );
  const MockImage = ({ alt }: { alt: string }) => <span aria-label={alt} data-testid="mock-img" />;
  const MockFallback = ({ children }: { children: ReactNode }) => <span>{children}</span>;

  const MockButton = ({
    children,
    onClick,
    isIconOnly: _isIconOnly,
    size: _size,
    variant: _variant,
    ...props
  }: {
    children: ReactNode;
    isIconOnly?: boolean;
    onClick?: () => void;
    size?: string;
    variant?: string;
  }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );

  const MockChip = ({ children }: { children: ReactNode }) => <div>{children}</div>;

  const MockSearchField = ({
    children,
    onChange,
  }: {
    children: ReactNode;
    onChange?: (val: string) => void;
  }) => (
    <div data-testid="mock-search-field">
      <input data-testid="search-input-node" onChange={(e) => onChange?.(e.target.value)} />
      {children}
    </div>
  );

  const MockGroup = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const MockIcon = () => <span />;
  const MockInput = () => <span />;
  const MockClear = () => <span />;

  return {
    Avatar: Object.assign(MockAvatar, { Image: MockImage, Fallback: MockFallback }),
    Button: MockButton,
    Chip: MockChip,
    SearchField: Object.assign(MockSearchField, {
      Group: MockGroup,
      SearchIcon: MockIcon,
      Input: MockInput,
      ClearButton: MockClear,
    }),
  };
});

vi.mock('./employees-table-row-actions', () => ({
  RowActions: ({ employeeId }: { employeeId: string }) => (
    <div data-testid={`actions-${employeeId}`} />
  ),
}));

vi.mock('@/data/employees', () => {
  const mockEmployees: Employee[] = [
    {
      id: 'emp-1',
      workerId: 'W001',
      name: MOCK_ALICE,
      email: 'alice@company.com',
      avatar: '/avatar1.png',
      role: 'Developer',
      workerType: 'CLT',
    },
    {
      id: 'emp-2',
      workerId: 'W002',
      name: MOCK_BOB,
      email: 'bob@company.com',
      avatar: '',
      role: 'Designer',
      workerType: 'PJ',
    },
    {
      id: 'emp-3',
      workerId: 'W003',
      name: 'Carlos Mendoza',
      email: 'carlos@company.com',
      avatar: '',
      role: undefined as unknown as string,
      workerType: undefined as unknown as string,
    },
    {
      id: 'emp-4',
      workerId: 'W004',
      name: 'Diana Prince',
      email: 'diana@company.com',
      avatar: '',
      role: undefined as unknown as string,
      workerType: undefined as unknown as string,
    },
  ];

  return {
    EMPLOYEES: mockEmployees,
  };
});

describe('EmployeesTable Search, Sorting and Data Subscriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render core tables headers along with inner descriptive badges and grids', () => {
    // Arrange & Act
    render(<EmployeesTable />);

    // Assert
    expect(screen.getByText('All Employees')).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.getByTestId('mock-data-grid')).toBeInTheDocument();
  });

  it('should process multi-field employee search queries clearing down filtered sub-matrices', async () => {
    // Arrange
    render(<EmployeesTable />);
    const searchInput = screen.getByTestId('search-input-node');

    // Act
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Alice' } });
    });
    // Assert
    expect(screen.getByText(MOCK_ALICE)).toBeInTheDocument();
    expect(screen.queryByText(MOCK_BOB)).not.toBeInTheDocument();

    // Act
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'bob@company.com' } });
    });
    // Assert
    expect(screen.getByText(MOCK_BOB)).toBeInTheDocument();
    expect(screen.queryByText(MOCK_ALICE)).not.toBeInTheDocument();

    // Act
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'W001' } });
    });
    // Assert
    expect(screen.getByText(MOCK_ALICE)).toBeInTheDocument();
    expect(screen.queryByText(MOCK_BOB)).not.toBeInTheDocument();
  });

  it('should switch sort directions executing string comparisons and processing fallbacks cleanly', async () => {
    // Arrange
    render(<EmployeesTable />);
    const sortNameBtn = screen.getByTestId('sort-btn-name');

    // Act
    await act(async () => {
      fireEvent.click(sortNameBtn);
    });

    // Assert
    const rows = screen.getAllByTestId(/row-emp-/);
    expect(rows[0]).toHaveAttribute('data-testid', 'row-emp-4');
  });

  it('should handle sorting fallback for undefined properties and allow clearing sort', async () => {
    // Arrange
    render(<EmployeesTable />);
    const sortRoleBtn = screen.getByTestId('sort-btn-role');
    const clearSortBtn = screen.getByTestId('clear-sort-btn');

    // Act
    await act(async () => {
      fireEvent.click(sortRoleBtn);
    });
    let rows = screen.getAllByTestId(/row-emp-/);
    expect(rows).toHaveLength(4);

    // Act
    await act(async () => {
      fireEvent.click(clearSortBtn);
    });
    rows = screen.getAllByTestId(/row-emp-/);
    expect(rows).toHaveLength(4);
  });

  it('should parse user initial tokens rendering avatar fallback initials accurately', () => {
    // Arrange & Act
    render(<EmployeesTable />);

    // Assert
    expect(screen.getByText('AS')).toBeInTheDocument();
    expect(screen.getByText('BJ')).toBeInTheDocument();
  });
});
