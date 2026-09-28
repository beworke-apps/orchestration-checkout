import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import { SessionsOverTimeCard } from './sessions-over-time-card';

interface MockYAxisProps {
  tickFormatter?: (value: number) => string;
}

vi.mock('@heroui-pro/react', () => {
  const MockLineChart = ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-line-chart">{children}</div>
  );
  const MockGrid = () => <div />;
  const MockXAxis = () => <div />;
  const MockYAxis = ({ tickFormatter }: MockYAxisProps) => {
    if (tickFormatter) {
      return (
        <div data-testid="mock-y-axis">
          <span data-testid="tick-large">{tickFormatter(2500)}</span>
          <span data-testid="tick-small">{tickFormatter(750)}</span>
        </div>
      );
    }
    return <div data-testid="mock-y-axis" />;
  };
  const MockLine = () => <div />;
  const MockTooltip = () => <div />;
  const MockTooltipContent = () => <div />;

  const MockNumberValue = ({ value }: { value: number }) => (
    <span data-testid="total-sum">{value}</span>
  );
  const MockTrendChip = ({ children }: { children: ReactNode }) => <span>{children}</span>;

  return {
    LineChart: Object.assign(MockLineChart, {
      Grid: MockGrid,
      XAxis: MockXAxis,
      YAxis: MockYAxis,
      Line: MockLine,
      Tooltip: MockTooltip,
      TooltipContent: MockTooltipContent,
    }),
    NumberValue: MockNumberValue,
    TrendChip: MockTrendChip,
  };
});

vi.mock('@/data/analytics', () => ({
  SESSIONS_OVER_TIME: [
    { day: '01 Jan', sessions: 1200, users: 1000 },
    { day: '02 Jan', sessions: 1800, users: 1400 },
  ],
}));

describe('SessionsOverTimeCard Math and Formatters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should compute structural aggregation totals from source matrices and paint labels', () => {
    // Act
    render(<SessionsOverTimeCard />);

    // Assert
    expect(screen.getByText('Sessions over time')).toBeInTheDocument();
    expect(screen.getByText('vs. previous 30 days')).toBeInTheDocument();
    expect(screen.getByText('18.3%')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();

    // Assert
    expect(screen.getByTestId('total-sum')).toHaveTextContent('3000');
  });

  it('should process floating thousands separators shifting format branches smoothly', () => {
    // Act
    render(<SessionsOverTimeCard />);

    const largeTickNode = screen.getByTestId('tick-large');
    const smallTickNode = screen.getByTestId('tick-small');

    // Assert
    expect(largeTickNode).toHaveTextContent('2.5k');

    // Assert
    expect(smallTickNode).toHaveTextContent('750');
  });
});
