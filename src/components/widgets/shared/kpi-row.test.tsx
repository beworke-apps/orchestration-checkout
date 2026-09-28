import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import { KpiRow } from './kpi-row';

interface MockKpiValueProps {
  value: number;
  style: 'currency' | 'decimal';
  currency?: string;
}

interface MockKpiTrendProps {
  children: ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

vi.mock('@heroui-pro/react', () => {
  const MockKPI = ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-kpi-card">{children}</div>
  );
  const MockHeader = ({ children }: { children: ReactNode }) => <header>{children}</header>;
  const MockTitle = ({ children }: { children: ReactNode }) => <h3>{children}</h3>;
  const MockContent = ({ children }: { children: ReactNode }) => <main>{children}</main>;

  const MockValue = ({ value, style, currency }: MockKpiValueProps) => (
    <span data-currency={currency ?? 'none'} data-style={style} data-testid="kpi-value-node">
      {value}
    </span>
  );

  const MockTrend = ({ children, trend }: MockKpiTrendProps) => (
    <span data-testid="kpi-trend-node" data-trend={trend}>
      {children}
    </span>
  );

  return {
    KPI: Object.assign(MockKPI, {
      Header: MockHeader,
      Title: MockTitle,
      Content: MockContent,
      Value: MockValue,
      Trend: MockTrend,
    }),
  };
});

vi.mock('@/data/sales', () => ({
  STATS_CARDS: [
    {
      label: 'Receita Total',
      value: 45000,
      trend: 'up' as const,
      trendValue: '+15%',
      currency: 'BRL',
    },
    {
      label: 'Novos Clientes',
      value: 120,
      trend: 'down' as const,
      trendValue: '-2%',
      currency: undefined,
    },
  ],
}));

describe('KpiRow Operational Grid and Formatting Branches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should map standard indicator collections and deploy exact text labels onto the DOM', () => {
    // Act
    render(<KpiRow />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Receita Total' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Novos Clientes' })).toBeInTheDocument();
    expect(screen.getByText('+15%')).toBeInTheDocument();
    expect(screen.getByText('-2%')).toBeInTheDocument();

    const kpiCards = screen.getAllByTestId('mock-kpi-card');
    expect(kpiCards).toHaveLength(2);
  });

  it('should process conditional attributes switching down dynamically to currency or decimal masks', () => {
    // Act
    render(<KpiRow />);

    const valNodes = screen.getAllByTestId('kpi-value-node');
    const trendNodes = screen.getAllByTestId('kpi-trend-node');

    // Assert
    expect(valNodes[0]).toHaveAttribute('data-style', 'currency');
    expect(valNodes[0]).toHaveAttribute('data-currency', 'BRL');
    expect(valNodes[0]).toHaveTextContent('45000');
    expect(trendNodes[0]).toHaveAttribute('data-trend', 'up');

    // Assert
    expect(valNodes[1]).toHaveAttribute('data-style', 'decimal');
    expect(valNodes[1]).toHaveAttribute('data-currency', 'none');
    expect(valNodes[1]).toHaveTextContent('120');
    expect(trendNodes[1]).toHaveAttribute('data-trend', 'down');
  });
});
