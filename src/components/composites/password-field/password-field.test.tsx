import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PasswordField } from './password-field';

describe('PasswordField Logic Bounds', () => {
  it('should initialize with password types masked and toggle visibility states on trigger interaction', () => {
    // Arrange
    const handleMockChange = vi.fn();

    // Act
    render(
      <PasswordField
        label="Password Label"
        onChange={handleMockChange}
        placeholder="Enter credentials"
        value="secret123"
      />,
    );
    const textInput = screen.getByPlaceholderText('Enter credentials');
    const toggleButton = screen.getByLabelText('Show password');

    // Assert
    expect(textInput).toHaveAttribute('type', 'password');
    expect(screen.queryByLabelText('Hide password')).not.toBeInTheDocument();

    // Act
    fireEvent.click(toggleButton);

    // Assert
    expect(textInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
  });

  it('should forward keyboard inputs up to parent triggers and enforce blank placeholder fallbacks', () => {
    // Arrange
    const handleMockChange = vi.fn();

    // Act
    render(<PasswordField label="Default Pass" onChange={handleMockChange} value="" />);
    const textInput = screen.getByLabelText('Default Pass');

    // Assert
    expect(textInput).toHaveAttribute('placeholder', '');

    // Act
    fireEvent.change(textInput, { target: { value: 'myNewPassword' } });

    // Assert
    expect(handleMockChange).toHaveBeenCalledWith('myNewPassword');
  });

  it('should attach and display input validation messages contextually when an error payload is supplied', () => {
    // Arrange
    const errorString = 'Senha deve ter no mínimo 8 caracteres';

    // Act
    render(
      <PasswordField
        errorMessage={errorString}
        label="Validation Field"
        onChange={vi.fn()}
        value="123"
      />,
    );

    // Assert
    expect(screen.getByText(errorString)).toBeInTheDocument();
  });
});
