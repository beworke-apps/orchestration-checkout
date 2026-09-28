import { describe, expect, it } from 'vitest';

import {
  serializeQueryArray,
  serializeQueryDate,
  serializeQueryDateRange,
  serializeQueryEnum,
  serializeQueryPatch,
  serializeQueryValue,
  useQuerySerializer,
} from './use-query-serializer';

describe('Query Serializers Utilities', () => {
  describe('serializeQueryValue', () => {
    it('should return undefined for null or undefined values', () => {
      // Act & Assert
      expect(serializeQueryValue(null)).toBeUndefined();
      expect(serializeQueryValue(undefined)).toBeUndefined();
    });

    it('should serialize booleans into literal strings', () => {
      // Act & Assert
      expect(serializeQueryValue(true)).toBe('true');
      expect(serializeQueryValue(false)).toBe('false');
    });

    it('should serialize numbers into string format', () => {
      // Arrange
      const input = 42;

      // Act
      const result = serializeQueryValue(input);

      // Assert
      expect(result).toBe('42');
    });

    it('should serialize native Date objects using default app format', () => {
      // Arrange
      const inputDate = new Date(2026, 5, 5);

      // Act
      const result = serializeQueryValue(inputDate);

      // Assert
      expect(result).toBe('2026-06-05');
    });

    it('should trim string values and return undefined if string becomes empty', () => {
      // Arrange
      const inputValid = '  meu_termo  ';
      const inputEmpty = '     ';

      // Act
      const resultValid = serializeQueryValue(inputValid);
      const resultEmpty = serializeQueryValue(inputEmpty);

      // Assert
      expect(resultValid).toBe('meu_termo');
      expect(resultEmpty).toBeUndefined();
    });

    it('should delegate to array serialization when value is an array', () => {
      // Arrange
      const input = ['ti', 'vendas'];

      // Act
      const result = serializeQueryValue(input);

      // Assert
      expect(result).toBe('ti,vendas');
    });
  });

  describe('serializeQueryArray', () => {
    it('should clean spaces, filter empty items and join list elements', () => {
      // Arrange
      const input = ['  next  ', '', 'react', '   '];

      // Act
      const result = serializeQueryArray(input, { separator: ';' });

      // Assert
      expect(result).toBe('next;react');
    });

    it('should fallback to default separator when options are missing', () => {
      // Arrange
      const input = ['apple', 'banana'];

      // Act
      const result = serializeQueryArray(input);

      // Assert
      expect(result).toBe('apple,banana');
    });

    it('should return undefined if array contains no valid items after filtering', () => {
      // Arrange
      const input = ['', '   '];

      // Act
      const result = serializeQueryArray(input);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('serializeQueryEnum & serializeQueryDate', () => {
    it('should convert valid enum type to string and handle undefined', () => {
      // Act & Assert
      expect(serializeQueryEnum('admin')).toBe('admin');
      expect(serializeQueryEnum(undefined)).toBeUndefined();
    });

    it('should serialize valid date inputs (Date object or String) and return undefined for invalid ones', () => {
      // Arrange
      const validStr = '2026-12-31';
      const invalidStr = 'not-a-valid-date';

      // Act & Assert
      expect(serializeQueryDate(validStr)).toBe('2026-12-31');
      expect(serializeQueryDate(invalidStr)).toBeUndefined();
      expect(serializeQueryDate(undefined)).toBeUndefined();
      // @ts-expect-error - Forçando envio de tipo parcial para validar comportamento de omissão de chaves
      expect(serializeQueryDate(null)).toBeUndefined();
      expect(serializeQueryDate('')).toBeUndefined();
    });
  });

  describe('serializeQueryDateRange & serializeQueryPatch', () => {
    const DATE_START = '2026-06-01';
    const DATE_END = '2026-06-30';

    it('should only return existing keys inside the serialized date range object', () => {
      // Arrange
      const partialRange = { start: DATE_START, end: undefined };

      // Act
      // @ts-expect-error - Forçando envio de tipo parcial para validar comportamento de omissão de chaves
      const result = serializeQueryDateRange(partialRange);

      // Assert
      expect(result).toEqual({ start: DATE_START });
      expect(result).not.toHaveProperty('end');
    });

    it('should omit start property when it is undefined inside date range object', () => {
      // Arrange
      const partialRange = { start: undefined, end: DATE_END };

      // Act
      // @ts-expect-error - Forçando envio de tipo parcial para validar comportamento de omissão de chaves
      const result = serializeQueryDateRange(partialRange);

      // Assert
      expect(result).toEqual({ end: DATE_END });
      expect(result).not.toHaveProperty('start');
    });

    it('should serialize date range when both values are provided', () => {
      // Arrange
      const completeRange = { start: DATE_START, end: DATE_END };

      // Act
      const result = serializeQueryDateRange(completeRange);

      // Assert
      expect(result).toEqual({ start: DATE_START, end: DATE_END });
    });

    it('should serialize a complex state object into a clean dictionary of strings', () => {
      // Arrange
      const localFiltersState = {
        search: '  Pesquisa Enterprise  ',
        page: 3,
        isActive: true,
        emptyField: '   ',
        tags: ['rh', 'financeiro'],
        ignoredValue: null,
      };

      // Act
      const result = serializeQueryPatch(localFiltersState);

      // Assert
      expect(result).toEqual({
        search: 'Pesquisa Enterprise',
        page: '3',
        isActive: 'true',
        tags: 'rh,financeiro',
      });
    });
  });

  describe('useQuerySerializer Stable Hook API', () => {
    it('should expose all serialize methods correctly', () => {
      // Arrange & Act
      const serializer = useQuerySerializer();

      // Assert
      expect(serializer.serializeValue).toBe(serializeQueryValue);
      expect(serializer.serializeArray).toBe(serializeQueryArray);
      expect(serializer.serializeEnum).toBe(serializeQueryEnum);
      expect(serializer.serializeDate).toBe(serializeQueryDate);
      expect(serializer.serializeDateRange).toBe(serializeQueryDateRange);
      expect(serializer.serializePatch).toBe(serializeQueryPatch);
    });
  });
});
