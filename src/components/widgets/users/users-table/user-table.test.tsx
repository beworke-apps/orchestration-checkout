import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { UsersListResponse } from '@/store/services';

import UserTable from './user-table';

interface MockDataGridProps {
  data: Array<{ id: string; name: string }>;
  getRowId?: (item: { id: string }) => string;
}

vi.mock('@heroui-pro/react', () => {
  const MockDataGrid = ({ data, getRowId }: MockDataGridProps) => {
    if (getRowId && data.length > 0) {
      data.forEach((item) => getRowId(item));
    }

    return (
      <table data-testid="mock-data-grid">
        <tbody>
          {data.map((item) => (
            <tr data-testid={`row-${item.id}`} key={item.id}>
              <td>{item.name}</td>
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

vi.mock('./user-table-columns', () => ({
  default: vi.fn(() => [{ id: 'name', header: 'Name' }]),
}));

describe('UserTable Rendering and Row Keys', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render grid elements and execute row identifier callback loops cleanly', () => {
    // Arrange
    const mockData = [
      { id: 'usr_1', name: 'John Doe' },
      { id: 'usr_2', name: 'Jane Smith' },
    ];

    // Act
    render(<UserTable data={mockData as unknown as UsersListResponse['data']} />);

    // Assert
    expect(screen.getByTestId('mock-data-grid')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
