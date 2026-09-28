// src/components/widgets/dashboard/top-pages-card/top-pages-card.test.tsx
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import type { TopPage } from '@/data/analytics';

import { TopPagesCard } from './top-pages-card';

interface MockDataGridProps {
  columns: Array<{
    id: string;
    cell?: (item: TopPage) => ReactNode;
  }>;
  data: TopPage[];
  getRowId?: (item: TopPage) => string;
}

vi.mock('@heroui-pro/react', () => {
  const MockDataGrid = ({ columns, data, getRowId }: MockDataGridProps) => {
    if (getRowId && data.length > 0) {
      data.forEach((item) => getRowId(item));
    }

    return (
      <table data-testid="mock-data-grid">
        <tbody>
          {data.map((item) => (
            <tr data-testid={`row-${item.id}`} key={item.id}>
              {columns.map((col) => (
                <td data-testid={`cell-${item.id}-${col.id}`} key={col.id}>
                  {col.cell ? col.cell(item) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const MockNumberValue = ({ value }: { value: number }) => (
    <span data-testid="mock-number-value">{value}</span>
  );

  const MockTrendChip = ({ children }: { children: ReactNode }) => (
    <span data-testid="mock-trend-chip">{children}</span>
  );

  return {
    DataGrid: MockDataGrid,
    NumberValue: MockNumberValue,
    TrendChip: MockTrendChip,
  };
});

vi.mock('@/data/analytics', () => {
  const mockPages: TopPage[] = [
    {
      id: '1',
      path: '/dashboard',
      views: 1500,
      avgTimeSeconds: 64,
      bounceRate: 45.5,
      trend: 'up' as const,
      trendValue: '+12%',
    },
    {
      id: '2',
      path: '/sales',
      views: 850,
      avgTimeSeconds: 135,
      bounceRate: 50.0,
      trend: 'down' as const,
      trendValue: '-4%',
    },
  ];

  return {
    TOP_PAGES: mockPages,
  };
});

describe('TopPagesCard Layout Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render descriptive section headers and layout structure clean', () => {
    // Act
    render(<TopPagesCard />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Top pages' })).toBeInTheDocument();
    expect(screen.getByText('Most-viewed pages over the selected period.')).toBeInTheDocument();
    expect(screen.getByTestId('mock-data-grid')).toBeInTheDocument();
  });

  it('should parse column definitions executing structural cell computation maps and duration padding', () => {
    // Act
    render(<TopPagesCard />);

    // Assert - ID 1
    expect(screen.getByText('/dashboard')).toBeInTheDocument();
    expect(screen.getByText('1500')).toBeInTheDocument();
    expect(screen.getByText('1m 04s')).toBeInTheDocument();
    expect(screen.getByText('0.455')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();

    // Assert - ID 2
    expect(screen.getByText('/sales')).toBeInTheDocument();
    expect(screen.getByText('850')).toBeInTheDocument();
    expect(screen.getByText('2m 15s')).toBeInTheDocument();
    expect(screen.getByText('0.5')).toBeInTheDocument();
    expect(screen.getByText('-4%')).toBeInTheDocument();
  });
});
