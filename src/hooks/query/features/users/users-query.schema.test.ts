import { describe, expect, it } from 'vitest';

import { usersQuerySchema } from './users-query.schema';

describe('usersQuerySchema Configurations', () => {
  it('should verify precise static metadata keys and fallback value bounds', () => {
    // Assert
    expect(usersQuerySchema.page?.key).toBe('page');
    expect(usersQuerySchema.page?.defaultValue).toBe(1);

    expect(usersQuerySchema.pageSize?.key).toBe('pageSize');
    expect(usersQuerySchema.pageSize?.defaultValue).toBe(10);

    expect(usersQuerySchema.search?.key).toBe('search');
    expect(usersQuerySchema.status?.key).toBe('status');
    expect(usersQuerySchema.sort?.key).toBe('sort');
    expect(usersQuerySchema.order?.key).toBe('order');
  });

  describe('Field Parser Executions', () => {
    it('should parse valid numbers and handle fallbacks for numeric boundaries', () => {
      // Arrange
      const dummyParams = new URLSearchParams();

      // Act & Assert
      expect(usersQuerySchema.page?.parse('5', dummyParams)).toBe(5);
      expect(usersQuerySchema.page?.parse('invalid', dummyParams)).toBe(1);

      expect(usersQuerySchema.pageSize?.parse('25', dummyParams)).toBe(25);
      expect(usersQuerySchema.pageSize?.parse('-10', dummyParams)).toBe(10);
    });

    it('should forward structural text queries natively across string filters', () => {
      // Arrange
      const dummyParams = new URLSearchParams();

      // Act & Assert
      expect(usersQuerySchema.search?.parse('gustavo', dummyParams)).toBe('gustavo');
      expect(usersQuerySchema.status?.parse('active', dummyParams)).toBe('active');
      expect(usersQuerySchema.sort?.parse('createdAt', dummyParams)).toBe('createdAt');
    });

    it('should enforce strict enum sorting directions and resolve invalid strings to undefined', () => {
      // Arrange
      const dummyParams = new URLSearchParams();

      // Act & Assert
      expect(usersQuerySchema.order?.parse('asc', dummyParams)).toBe('asc');
      expect(usersQuerySchema.order?.parse('desc', dummyParams)).toBe('desc');
      expect(usersQuerySchema.order?.parse('invalid-direction', dummyParams)).toBeUndefined();
    });
  });
});
