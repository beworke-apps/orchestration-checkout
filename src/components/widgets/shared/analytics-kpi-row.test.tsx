import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import { AnalyticsKpiRow } from './analytics-kpi-row';

interface MockKpiValueProps {
  value?: number;
  style?: string;
  maximumFractionDigits?: number;
}

interface MockKpiTrendProps {
  children: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

interface MockKpiChartProps {
  color?: string;
  data?: unknown[];
  height?: number;
  strokeWidth?: number;
}

vi.mock('@heroui-pro/react', () => {
  const MockKPI = ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-kpi-card">{children}</div>
  );
  const MockHeader = ({ children }: { children: ReactNode }) => <header>{children}</header>;
  const MockTitle = ({ children }: { children: ReactNode }) => <h3>{children}</h3>;
  const MockContent = ({ children }: { children: ReactNode }) => <main>{children}</main>;

  const MockValue = ({ value, style, maximumFractionDigits }: MockKpiValueProps) => (
    <span
      data-digits={maximumFractionDigits ?? 0}
      data-style={style ?? 'decimal'}
      data-testid="kpi-value-node"
      data-value={value ?? 'none'}
    />
  );

  const MockTrend = ({ children, trend }: MockKpiTrendProps) => (
    <span data-testid="kpi-trend-node" data-trend={trend ?? 'neutral'}>
      {children}
    </span>
  );

  const MockChart = ({ color, data }: MockKpiChartProps) => (
    <div data-color={color} data-points-count={data?.length ?? 0} data-testid="kpi-chart-node" />
  );

  return {
    KPI: Object.assign(MockKPI, {
      Header: MockHeader,
      Title: MockTitle,
      Content: MockContent,
      Value: MockValue,
      Trend: MockTrend,
      Chart: MockChart,
    }),
  };
});

vi.mock('@/data/analytics', () => ({
  SESSIONS_SPARKLINE: [{ value: 10 }, { value: 20 }],
  USERS_SPARKLINE: [{ value: 5 }, { value: 15 }],
  BOUNCE_SPARKLINE: [{ value: 40 }, { value: 42 }],
  DURATION_SPARKLINE: [{ value: 200 }, { value: 222 }],
}));

describe('AnalyticsKpiRow Layout Engine and Time Parsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all generic KPI blocks from data lists along with specific custom header tags', () => {
    // Act
    render(<AnalyticsKpiRow />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Sessions' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Unique users' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Bounce rate' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Avg. session' })).toBeInTheDocument();

    const kpiCards = screen.getAllByTestId('mock-kpi-card');
    expect(kpiCards).toHaveLength(4);
  });

  it('should forward dynamic analytical object parameters into property binders cleanly', () => {
    // Act
    render(<AnalyticsKpiRow />);

    const valueNodes = screen.getAllByTestId('kpi-value-node');
    const trendNodes = screen.getAllByTestId('kpi-trend-node');
    const chartNodes = screen.getAllByTestId('kpi-chart-node');

    // Assert
    expect(valueNodes[0]).toHaveAttribute('data-value', '84210');
    expect(valueNodes[0]).toHaveAttribute('data-style', 'decimal');
    expect(trendNodes[0]).toHaveAttribute('data-trend', 'up');
    expect(trendNodes[0]).toHaveTextContent('14%');
    expect(chartNodes[0]).toHaveAttribute('data-color', 'var(--color-accent)');

    // Assert
    expect(valueNodes[2]).toHaveAttribute('data-value', '0.413');
    expect(valueNodes[2]).toHaveAttribute('data-style', 'percent');
    expect(trendNodes[2]).toHaveAttribute('data-trend', 'neutral');
    expect(trendNodes[2]).toHaveTextContent('−2.1%');
  });

  it('should parse raw durations calculating minutes and forcing padding layouts on isolated digits', () => {
    // Act
    render(<AnalyticsKpiRow />);

    // Assert
    expect(screen.getByText('3m 42s')).toBeInTheDocument();
    expect(screen.getByText('12%')).toBeInTheDocument();

    const chartNodes = screen.getAllByTestId('kpi-chart-node');
    const hasWarningChart = chartNodes.some(
      (node) => node.getAttribute('data-color') === 'var(--color-warning)',
    );

    expect(hasWarningChart).toBe(true);
  });

  it('should verify module level duration helper padding when single digits are incoming', () => {
    // Act
    render(<AnalyticsKpiRow />);

    const durationSpan = screen.getByText('3m 42s');
    expect(durationSpan).toHaveClass('tabular-nums');
  });
});
