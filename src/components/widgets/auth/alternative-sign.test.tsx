import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AlternativeSign } from './alternative-sign';

describe('AlternativeSign Layout Assembly', () => {
  it('should mount registration options and provider elements cleanly onto the visual tree', () => {
    // Act
    render(<AlternativeSign />);

    // Assert
    expect(screen.getByText('ou')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Criar conta' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Google' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Facebook' })).toBeInTheDocument();
  });
});
