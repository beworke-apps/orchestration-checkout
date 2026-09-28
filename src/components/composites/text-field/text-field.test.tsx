import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TextField } from './text-field';

describe('TextField Layout Branches', () => {
  it('should render structural text fields embedding conditional prefix and suffix content nodes', () => {
    // Act
    render(
      <TextField
        endContent={<span data-testid="suffix-icon">Verified</span>}
        label="Username"
        placeholder="Enter user"
        startContent={<span data-testid="prefix-icon">@</span>}
      />,
    );

    // Assert
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter user')).toBeInTheDocument();
    expect(screen.getByTestId('prefix-icon')).toBeInTheDocument();
    expect(screen.getByTestId('suffix-icon')).toBeInTheDocument();
  });

  it('should fallback to empty string placeholders when no explicit value property is attached', () => {
    // Act
    render(<TextField label="No Placeholder" />);
    const inputElement = screen.getByLabelText('No Placeholder');

    // Assert
    expect(inputElement).toHaveAttribute('placeholder', '');
  });

  it('should render descriptive error messages cleanly when validation states fail', () => {
    // Arrange
    const errorPayload = 'O campo e-mail é obrigatório';

    // Act
    render(<TextField errorMessage={errorPayload} label="Email" />);

    // Assert
    expect(screen.getByText(errorPayload)).toBeInTheDocument();
  });
});
