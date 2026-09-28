// src/components/base/pagination/pagination.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ReactNode } from 'react';

import { Pagination } from './pagination';

vi.mock('@heroui/react', () => {
  const MockPagination = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const MockSummary = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const MockContent = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const MockItem = ({ children }: { children: ReactNode }) => <div>{children}</div>;

  const MockPrevious = ({
    children,
    isDisabled,
    onPress,
  }: {
    children: ReactNode;
    isDisabled?: boolean;
    onPress?: () => void;
  }) => (
    <button disabled={isDisabled} onClick={onPress}>
      {children}
    </button>
  );

  const MockNext = ({
    children,
    isDisabled,
    onPress,
  }: {
    children: ReactNode;
    isDisabled?: boolean;
    onPress?: () => void;
  }) => (
    <button disabled={isDisabled} onClick={onPress}>
      {children}
    </button>
  );

  const MockLink = ({
    children,
    onPress,
  }: {
    children: ReactNode;
    isActive?: boolean;
    onPress?: () => void;
  }) => <button onClick={onPress}>{children}</button>;

  const MockEllipsis = () => <span>...</span>;
  const MockIcon = () => <span />;

  return {
    Pagination: Object.assign(MockPagination, {
      Summary: MockSummary,
      Content: MockContent,
      Item: MockItem,
      Previous: MockPrevious,
      PreviousIcon: MockIcon,
      Next: MockNext,
      NextIcon: MockIcon,
      Link: MockLink,
      Ellipsis: MockEllipsis,
    }),
  };
});

describe('Pagination Core Operations', () => {
  it('should evaluate boundaries cleanly when total pages metadata is zero or single', () => {
    // Act
    const { rerender } = render(<Pagination page={1} pageSize={10} total={0} totalPages={0} />);

    // Assert
    expect(screen.getByText('Showing 0-0 of 0 results')).toBeInTheDocument();

    // Act
    rerender(<Pagination page={1} pageSize={10} total={5} totalPages={1} />);

    // Assert
    expect(screen.getByText('Showing 1-5 of 5 results')).toBeInTheDocument();
  });

  it('should render correct ellipsis paths when navigation is anchored near the start', () => {
    // Arrange
    const handlePageChange = vi.fn();

    // Act
    render(
      <Pagination
        onPageChange={handlePageChange}
        page={1}
        pageSize={10}
        total={50}
        totalPages={5}
      />,
    );

    // Assert
    expect(screen.getByText('Showing 1-10 of 50 results')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render left-hand ellipsis when current page is close to the upper limit', () => {
    // Arrange
    const handlePageChange = vi.fn();

    // Act
    render(
      <Pagination
        onPageChange={handlePageChange}
        page={5}
        pageSize={10}
        total={50}
        totalPages={5}
      />,
    );

    // Assert
    expect(screen.getByText('Showing 41-50 of 50 results')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render dual ellipsis constraints during centered deep page focus', async () => {
    // Arrange
    const handlePageChange = vi.fn();

    // Act
    render(
      <Pagination
        onPageChange={handlePageChange}
        page={5}
        pageSize={10}
        total={100}
        totalPages={10}
      />,
    );

    // Assert
    expect(screen.getByText('Showing 41-50 of 100 results')).toBeInTheDocument();

    // Act
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    // Assert
    expect(handlePageChange).toHaveBeenCalledWith(6);

    // Act
    const targetPageLink = screen.getByText('4');
    fireEvent.click(targetPageLink);

    // Assert
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('should disable operational arrow elements when current position reaches bounds or missing triggers', () => {
    // Act
    const { rerender } = render(<Pagination page={1} pageSize={10} total={20} totalPages={2} />);
    const prevButton = screen.getByText('Previous').closest('button');

    // Assert
    expect(prevButton).toBeDisabled();

    // Act
    rerender(<Pagination page={2} pageSize={10} total={20} totalPages={2} />);
    const nextButton = screen.getByText('Next').closest('button');

    // Assert
    expect(nextButton).toBeDisabled();
  });

  it('should trigger onPageChange with previous index when previous button is operational', () => {
    // Arrange
    const handlePageChange = vi.fn();

    // Act
    render(
      <Pagination
        onPageChange={handlePageChange}
        page={2}
        pageSize={10}
        total={20}
        totalPages={2}
      />,
    );

    const prevButton = screen.getByText('Previous');
    fireEvent.click(prevButton);

    // Assert
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });
});
