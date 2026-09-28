import { describe, expect, it } from 'vitest';

import { normalizeQueryRecord } from './normalize-query';

describe('normalizeQueryRecord Utility', () => {
  it('should pass primitive types through and sort object keys alphabetically', () => {
    // Arrange
    const dirtyInput = {
      status: 'active',
      page: 1,
      isActive: true,
    };

    // Act
    const result = normalizeQueryRecord(dirtyInput);

    // Assert
    expect(result).toEqual({
      isActive: true,
      page: 1,
      status: 'active',
    });
    expect(Object.keys(result)).toEqual(['isActive', 'page', 'status']);
  });

  it('should ignore values that match empty conditional triggers', () => {
    // Arrange
    const emptyInput = {
      search: '',
      filter: null,
      context: undefined,
      valid: 'passed',
    };

    // Act
    const result = normalizeQueryRecord(emptyInput);

    // Assert
    expect(result).toEqual({
      valid: 'passed',
    });
  });

  it('should serialize native Date objects into ISO string representations', () => {
    // Arrange
    const frozenDate = new Date('2026-06-07T13:00:57.000Z');
    const inputWithDate = {
      createdAt: frozenDate,
    };

    // Act
    const result = normalizeQueryRecord(inputWithDate);

    // Assert
    expect(result).toEqual({
      createdAt: '2026-06-07T13:00:57.000Z',
    });
  });

  it('should retain arrays with elements but skip completely empty arrays', () => {
    // Arrange
    const arrayInput = {
      filledTags: ['rh', 'dev'],
      emptyTags: [],
    };

    // Act
    const result = normalizeQueryRecord(arrayInput);

    // Assert
    expect(result).toEqual({
      filledTags: ['rh', 'dev'],
    });
  });
});
