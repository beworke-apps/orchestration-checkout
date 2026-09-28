import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardToolbar } from './dashboard-toolbar';

describe('DashboardToolbar Component Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    if (typeof Element !== 'undefined' && !Element.prototype.getAnimations) {
      Element.prototype.getAnimations = () => [];
    }
  });

  it('should mount structural control widgets and tab definitions successfully onto the DOM tree', async () => {
    await act(async () => {
      render(<DashboardToolbar />);
    });

    // Assert
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();

    expect(screen.getByText('Sync settings')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByLabelText('Refresh')).toBeInTheDocument();
  });

  it('should execute embedded callback pipelines cleanly when interactive controls are triggered', async () => {
    // Act
    await act(async () => {
      render(<DashboardToolbar />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Sales'));
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Expenses'));
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Overview'));
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Sync settings'));
      fireEvent.click(screen.getByText('Download'));
      fireEvent.click(screen.getByLabelText('Refresh'));
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Assert
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });
});
