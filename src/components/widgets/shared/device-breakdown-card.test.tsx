// src/components/widgets/shared/device-breakdown-card.test.tsx
import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReactElement, ReactNode } from 'react';
import React from 'react';

import { DeviceBreakdownCard } from './device-breakdown-card';

interface MockTooltipProps {
  content: ReactElement<{
    active?: boolean;
    payload?:
      | Array<{
          name?: string;
          payload?: { fill?: string | undefined };
          value?: number | string | undefined;
        }>
      | undefined;
  }>;
}

vi.mock('@heroui-pro/react', () => {
  const MockPieChart = ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-pie-chart">{children}</div>
  );
  const MockPie = ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-pie">{children}</div>
  );
  const MockCell = () => <div data-testid="mock-cell" />;

  const MockTooltip = ({ content }: MockTooltipProps) => {
    const inactiveRender = React.cloneElement(content, { active: false });

    const activeRender = React.cloneElement(content, {
      active: true,
      payload: [{ name: 'Desktop Search', value: 1500, payload: { fill: '#ff0000' } }],
    });

    const missingFillRender = React.cloneElement(content, {
      active: true,
      payload: [{ name: 'No Fill', value: 300, payload: { fill: undefined } }],
    });

    const emptyPayloadRender = React.cloneElement(content, {
      active: true,
      payload: [],
    });

    const undefinedPayloadRender = React.cloneElement(content, {
      active: true,
      payload: undefined,
    });

    return (
      <div data-testid="mock-tooltip-wrapper">
        <div data-testid="tooltip-inactive-zone">{inactiveRender}</div>
        <div data-testid="tooltip-active-zone">{activeRender}</div>
        <div data-testid="tooltip-missing-fill-zone">{missingFillRender}</div>
        <div data-testid="tooltip-empty-payload-zone">{emptyPayloadRender}</div>
        <div data-testid="tooltip-undefined-payload-zone">{undefinedPayloadRender}</div>
      </div>
    );
  };

  const MockChartTooltip = ({ children }: { children: ReactNode }) => (
    <div data-testid="chart-tooltip">{children}</div>
  );
  const MockItem = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const MockIndicator = ({ color }: { color?: string }) => (
    <span data-color={color ?? 'none'} data-testid="indicator-color" />
  );
  const MockLabel = ({ children }: { children: ReactNode }) => <label>{children}</label>;
  const MockValue = ({ children }: { children: ReactNode }) => <span>{children}</span>;

  return {
    PieChart: Object.assign(MockPieChart, {
      Pie: MockPie,
      Cell: MockCell,
      Tooltip: MockTooltip,
    }),
    ChartTooltip: Object.assign(MockChartTooltip, {
      Item: MockItem,
      Indicator: MockIndicator,
      Label: MockLabel,
      Value: MockValue,
    }),
  };
});

vi.mock('@heroui/react', () => {
  const MockCard = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const MockHeader = ({ children }: { children: ReactNode }) => <header>{children}</header>;
  const MockTitle = ({ children }: { children: ReactNode }) => <h2>{children}</h2>;
  const MockDescription = ({ children }: { children: ReactNode }) => <p>{children}</p>;
  const MockContent = ({ children }: { children: ReactNode }) => <main>{children}</main>;

  return {
    Card: Object.assign(MockCard, {
      Header: MockHeader,
      Title: MockTitle,
      Description: MockDescription,
      Content: MockContent,
    }),
  };
});

vi.mock('@/data/analytics', () => ({
  DEVICE_BREAKDOWN: [
    { name: 'Desktop', value: 1500 },
    { name: 'Mobile', value: 450 },
    { name: 'Tablet', value: 50 },
  ],
}));

describe('DeviceBreakdownCard Engine and Custom Tooltips', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render core layout text structures and assert aggregated total session strings', () => {
    // Act
    render(<DeviceBreakdownCard />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Traffic by device' })).toBeInTheDocument();
    expect(screen.getByText('How visitors are reaching your site.')).toBeInTheDocument();
    expect(screen.getByText('2.0k')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
  });

  it('should compute granular mathematical operations inside the legend grid mapping percent ratios', () => {
    // Act
    render(<DeviceBreakdownCard />);

    // Assert
    expect(screen.getByText('Desktop')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();

    const cells = screen.getAllByTestId('mock-cell');
    expect(cells).toHaveLength(3);

    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('450')).toBeInTheDocument();
    expect(screen.getByText('23%')).toBeInTheDocument();

    expect(screen.getByText('Tablet')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('3%')).toBeInTheDocument();

    const allSpans = screen.getAllByText('1.5k');
    const hasLegendSpan = allSpans.some((node) => node.className.includes('text-foreground'));
    expect(hasLegendSpan).toBe(true);
  });

  it('should handle custom embedded tooltip activations clearing branch exceptions securely', () => {
    // Act
    render(<DeviceBreakdownCard />);

    const inactiveZone = screen.getByTestId('tooltip-inactive-zone');
    const activeZone = screen.getByTestId('tooltip-active-zone');
    const missingFillZone = screen.getByTestId('tooltip-missing-fill-zone');
    const emptyPayloadZone = screen.getByTestId('tooltip-empty-payload-zone');
    const undefinedPayloadZone = screen.getByTestId('tooltip-undefined-payload-zone');

    // Assert - Vira a branch da linha 67 (!entry quando active é true mas payload é vazio/undefined)
    expect(inactiveZone).toBeEmptyDOMElement();
    expect(emptyPayloadZone).toBeEmptyDOMElement();
    expect(undefinedPayloadZone).toBeEmptyDOMElement();
    expect(activeZone).not.toBeEmptyDOMElement();

    expect(within(activeZone).getByText('Desktop Search')).toBeInTheDocument();
    expect(within(activeZone).getByText('1.5k')).toBeInTheDocument();

    const indicators = screen.getAllByTestId('indicator-color');
    expect(indicators[0]).toHaveAttribute('data-color', '#ff0000');

    expect(within(missingFillZone).getByText('No Fill')).toBeInTheDocument();
    expect(indicators[1]).toHaveAttribute('data-color', 'none');
  });
});
