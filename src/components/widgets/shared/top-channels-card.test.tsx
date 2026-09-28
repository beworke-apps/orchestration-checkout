import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import { TopChannelsCard } from './top-channels-card';

interface MockXAxisProps {
  tickFormatter?: (value: number) => string;
}

vi.mock('@heroui-pro/react', () => {
  const MockBarChart = ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-bar-chart">{children}</div>
  );
  const MockGrid = () => <div />;
  const MockXAxis = ({ tickFormatter }: MockXAxisProps) => {
    if (tickFormatter) {
      return (
        <div data-testid="mock-x-axis">
          <span data-testid="tick-large">{tickFormatter(8000)}</span>
          <span data-testid="tick-small">{tickFormatter(350)}</span>
        </div>
      );
    }
    return <div data-testid="mock-x-axis" />;
  };
  const MockYAxis = () => <div />;
  const MockBar = () => <div />;
  const MockTooltip = () => <div />;
  const MockTooltipContent = () => <div />;

  return {
    BarChart: Object.assign(MockBarChart, {
      Grid: MockGrid,
      XAxis: MockXAxis,
      YAxis: MockYAxis,
      Bar: MockBar,
      Tooltip: MockTooltip,
      TooltipContent: MockTooltipContent,
    }),
  };
});

vi.mock('@/data/analytics', () => ({
  CHANNEL_BREAKDOWN: [
    { channel: 'Organic Search', sessions: 95000 },
    { channel: 'Direct', sessions: 45000 },
  ],
}));

describe('TopChannelsCard Layout and Formatters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render structural metadata headers cleanly onto the view context', () => {
    // Act
    render(<TopChannelsCard />);

    // Assert
    expect(screen.getByText('Top channels')).toBeInTheDocument();
    expect(screen.getByText('Sessions by acquisition channel.')).toBeInTheDocument();
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
  });

  it('should transform numeric scale values mapping branches from thousands to formatted strings', () => {
    // Act
    render(<TopChannelsCard />);

    const largeTick = screen.getByTestId('tick-large');
    const smallTick = screen.getByTestId('tick-small');

    // Assert
    expect(largeTick).toHaveTextContent('8k');

    // Assert
    expect(smallTick).toHaveTextContent('350');
  });
});
