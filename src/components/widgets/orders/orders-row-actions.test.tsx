import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { OrdersRowActions } from './orders-row-actions';

describe('OrdersRowActions Control Layout', () => {
  it('should embed the exact order reference and mount accessibility actions onto the DOM', () => {
    // Arrange
    const targetOrderId = 'ord_chavez_999';

    // Act
    const { container } = render(<OrdersRowActions orderId={targetOrderId} />);

    // Assert
    const actionWrapper = container.querySelector('[data-order-id]');
    expect(actionWrapper).toBeInTheDocument();
    expect(actionWrapper).toHaveAttribute('data-order-id', targetOrderId);

    // Assert
    expect(screen.getByLabelText('View order')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit order')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete order')).toBeInTheDocument();
  });
});
