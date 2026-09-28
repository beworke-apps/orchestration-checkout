import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import { TrafficSourceCard } from './traffic-source-card';

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
          <span data-testid="tick-large">{tickFormatter(15000)}</span>
          <span data-testid="tick-small">{tickFormatter(500)}</span>
        </div>
      );
    }
    return <div data-testid="mock-y-axis" />;
  };
  const MockLine = () => <div />;
  const MockTooltip = () => <div />;
  const MockTooltipContent = () => <div />;

  return {
    LineChart: Object.assign(MockLineChart, {
      Grid: MockGrid,
      XAxis: MockXAxis,
      YAxis: MockYAxis,
      Line: MockLine,
      Tooltip: MockTooltip,
      TooltipContent: MockTooltipContent,
    }),
  };
});

vi.mock('@/data/traffic', () => ({
  TRAFFIC_DATA: [
    { month: 'Jan', organic: 4000, paidAds: 2400 },
    { month: 'Feb', organic: 3000, paidAds: 1398 },
  ],
}));

describe('TrafficSourceCard Visual and Formatters Bounds', () => {
  it('should render structural chart labels and assert exact total session values', () => {
    // Act
    render(<TrafficSourceCard />);

    // Assert
    expect(screen.getByText('Traffic Source')).toBeInTheDocument();
    expect(screen.getByText('231,856')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('Organic')).toBeInTheDocument();
    expect(screen.getByText('Paid Ads')).toBeInTheDocument();
    expect(screen.getByLabelText('More options')).toBeInTheDocument();
  });

  it('should execute tick formatters processing large metric values down to short scale strings', () => {
    // Act
    render(<TrafficSourceCard />);

    const largeTickNode = screen.getByTestId('tick-large');
    const smallTickNode = screen.getByTestId('tick-small');

    // Assert
    expect(largeTickNode).toHaveTextContent('15k');

    // Assert
    expect(smallTickNode).toHaveTextContent('500');
  });
});
