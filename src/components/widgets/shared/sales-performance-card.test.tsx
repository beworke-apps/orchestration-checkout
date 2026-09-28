import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import { SalesPerformanceCard } from './sales-performance-card';

interface MockNumberValueProps {
  value: number;
  style: 'currency' | 'decimal';
  currency?: string | undefined;
}

vi.mock('@heroui-pro/react', () => {
  const MockBarChart = ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-bar-chart">{children}</div>
  );
  const MockGrid = () => <div />;
  const MockXAxis = () => <div />;
  const MockYAxis = () => <div />;
  const MockBar = () => <div />;
  const MockTooltip = () => <div />;
  const MockTooltipContent = () => <div />;

  const MockNumberValue = ({ value, style, currency }: MockNumberValueProps) => (
    <span data-currency={currency ?? 'none'} data-style={style} data-testid="mock-number-value">
      {value}
    </span>
  );

  const MockTrendChip = ({ children }: { children: ReactNode }) => <span>{children}</span>;

  return {
    BarChart: Object.assign(MockBarChart, {
      Grid: MockGrid,
      XAxis: MockXAxis,
      YAxis: MockYAxis,
      Bar: MockBar,
      Tooltip: MockTooltip,
      TooltipContent: MockTooltipContent,
    }),
    NumberValue: MockNumberValue,
    TrendChip: MockTrendChip,
  };
});

vi.mock('@heroui/react', () => {
  const MockCard = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const MockHeader = ({ children }: { children: ReactNode }) => <header>{children}</header>;
  const MockTitle = ({ children }: { children: ReactNode }) => <h2>{children}</h2>;
  const MockContent = ({ children }: { children: ReactNode }) => <main>{children}</main>;

  const MockSelect = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const MockTrigger = ({ children }: { children: ReactNode }) => <button>{children}</button>;
  const MockValue = () => <span data-testid="mock-select-value" />;
  const MockIndicator = () => <span data-testid="mock-select-indicator" />;
  const MockPopover = ({ children }: { children: ReactNode }) => <div>{children}</div>;

  const MockListBox = ({ children }: { children: ReactNode }) => <ul>{children}</ul>;
  const MockItem = ({ children }: { children: ReactNode }) => <li>{children}</li>;
  const MockItemIndicator = () => <span data-testid="mock-item-indicator" />;

  return {
    Card: Object.assign(MockCard, {
      Header: MockHeader,
      Title: MockTitle,
      Content: MockContent,
    }),
    Select: Object.assign(MockSelect, {
      Trigger: MockTrigger,
      Value: MockValue,
      Indicator: MockIndicator,
      Popover: MockPopover,
    }),
    ListBox: Object.assign(MockListBox, {
      Item: Object.assign(MockItem, {
        ItemIndicator: MockItemIndicator,
      }),
      ItemIndicator: MockItemIndicator,
    }),
  };
});

vi.mock('@/data/sales', () => ({
  SALES_CHART_DATA: [
    { month: 'Jan', sales: 30 },
    { month: 'Feb', sales: 45 },
  ],
  SALES_MINI_KPIS: [
    { label: 'Faturamento Total', value: 25000, currency: 'BRL' },
    { label: 'Volume de Vendas', value: 480, currency: undefined },
  ],
}));

describe('SalesPerformanceCard Layout and Render Branches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render structural context headers and locate charts safely', () => {
    // Act
    render(<SalesPerformanceCard />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Sales Performance' })).toBeInTheDocument();
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    expect(screen.getByText('Faturamento Total')).toBeInTheDocument();
    expect(screen.getByText('Volume de Vendas')).toBeInTheDocument();
  });

  it('should format numeric nodes conditionally assigning props based on input fields properties', () => {
    // Act
    render(<SalesPerformanceCard />);

    const kpiValueNodes = screen.getAllByTestId('mock-number-value');

    // Assert
    expect(kpiValueNodes[0]).toHaveAttribute('data-style', 'currency');
    expect(kpiValueNodes[0]).toHaveAttribute('data-currency', 'BRL');
    expect(kpiValueNodes[0]).toHaveTextContent('25000');

    // Assert
    expect(kpiValueNodes[1]).toHaveAttribute('data-style', 'decimal');
    expect(kpiValueNodes[1]).toHaveAttribute('data-currency', 'none');
    expect(kpiValueNodes[1]).toHaveTextContent('480');
  });
});
