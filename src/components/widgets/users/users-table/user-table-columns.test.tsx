import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { User } from '@/store/services';

import UserTableColumns from './user-table-columns';

interface MockTableProps {
  user: User;
}

function MockTable({ user }: MockTableProps) {
  const columns = UserTableColumns();
  return (
    <table>
      <tbody>
        <tr>
          {columns.map((col) => (
            <td data-testid={`cell-${col.id}`} key={col.id}>
              {col.cell ? (col.cell as (item: User) => React.ReactNode)(user) : null}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

describe('UserTableColumns Cell Computation', () => {
  it('should render structural column blocks stripping document symbols and building fallback names initials', () => {
    // Arrange
    const mockUser: User = {
      id: 'usr_01',
      code: '1001',
      name: 'Gustavo Santos',
      email: 'gustavo@agenus.com',
      avatar: undefined,
      document: '123.456.789-00',
      documentType: 'CPF',
    } as unknown as User;

    // Act
    render(<MockTable user={mockUser} />);

    // Assert
    expect(screen.getByText('#1001')).toBeInTheDocument();
    expect(screen.getByLabelText('Copy ID')).toBeInTheDocument();

    // Assert
    expect(screen.getByText('GS')).toBeInTheDocument();
    expect(screen.getByText('gustavo@agenus.com')).toBeInTheDocument();

    // Assert
    expect(screen.getByText('12345678900')).toBeInTheDocument();
    expect(screen.getByText('CPF')).toBeInTheDocument();
  });

  it('should fallback to default hyphens when document or identity fields are missing', () => {
    // Arrange
    const incompleteUser: User = {
      id: 'usr_02',
      code: '1002',
      name: 'Ana',
      email: 'ana@agenus.com',
      avatar: 'avatar-url.png',
      document: undefined,
      documentType: undefined,
    } as unknown as User;

    // Act
    render(<MockTable user={incompleteUser} />);

    // Assert
    const documentCell = screen.getByTestId('cell-document');
    expect(documentCell).toHaveTextContent('-');
  });
});
