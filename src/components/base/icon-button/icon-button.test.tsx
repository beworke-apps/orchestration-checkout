import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { IconButton } from './icon-button';

describe('IconButton', () => {
  it('renders with accessible label', () => {
    render(
      <IconButton label="Open menu">
        <span data-testid="icon">•</span>
      </IconButton>,
    );

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeDefined();
  });
});
