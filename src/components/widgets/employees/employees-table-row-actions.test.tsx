import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RowActions } from './employees-table-row-actions';

describe('Employees RowActions Control Layout', () => {
  it('should embed the exact employee reference and mount accessibility actions onto the DOM', () => {
    // Arrange
    const targetEmployeeId = 'emp_dev_777';

    // Act
    const { container } = render(<RowActions employeeId={targetEmployeeId} />);

    // Assert
    const actionWrapper = container.querySelector('[data-employee-id]');
    expect(actionWrapper).toBeInTheDocument();
    expect(actionWrapper).toHaveAttribute('data-employee-id', targetEmployeeId);

    // Assert
    expect(screen.getByLabelText('View')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete')).toBeInTheDocument();
  });
});
