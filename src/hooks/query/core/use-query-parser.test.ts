import { describe, expect, it } from 'vitest';

import {
  parseQueryArray,
  parseQueryBoolean,
  parseQueryDate,
  parseQueryDateRange,
  parseQueryEnum,
  parseQueryNumber,
  parseQueryString,
  useQueryParser,
} from './use-query-parser';

describe('Query Parsers Utilities', () => {
  describe('parseQueryString', () => {
    it('should trim string by default and return undefined for empty values', () => {
      // Arrange
      const input = '   meu_termo_de_busca   ';

      // Act
      const result = parseQueryString(input);

      // Assert
      expect(result).toBe('meu_termo_de_busca');
    });

    it('should respect trim false option', () => {
      // Arrange
      const input = '  no_trim  ';

      // Act
      const result = parseQueryString(input, { trim: false });

      // Assert
      expect(result).toBe('  no_trim  ');
    });

    it('should return undefined when raw is null or empty', () => {
      // Act & Assert
      expect(parseQueryString(null)).toBeUndefined();
      expect(parseQueryString('')).toBeUndefined();
    });

    it('should return empty string if emptyAsUndefined is explicitly false', () => {
      // Arrange
      const input = '   ';

      // Act
      const result = parseQueryString(input, { emptyAsUndefined: false });

      // Assert
      expect(result).toBe('');
    });

    it('should fallback to default emptyAsUndefined behavior when options are omitted', () => {
      // Arrange
      const input = '   ';

      // Act
      const result = parseQueryString(input);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('parseQueryNumber', () => {
    it('should parse valid numbers and respect boundaries', () => {
      // Arrange
      const input = '42';

      // Act
      const result = parseQueryNumber(input, { min: 10, max: 100 });

      // Assert
      expect(result).toBe(42);
    });

    it('should return fallback when number is out of bounds', () => {
      // Arrange
      const inputUnder = '5';
      const inputOver = '150';
      const config = { min: 10, max: 100, fallback: 99 };

      // Act
      const resultUnder = parseQueryNumber(inputUnder, config);
      const resultOver = parseQueryNumber(inputOver, config);

      // Assert
      expect(resultUnder).toBe(99);
      expect(resultOver).toBe(99);
    });

    it('should return fallback for invalid numbers or NaN', () => {
      // Arrange
      const inputInvalid = 'texto_nao_numerico';

      // Act
      const result = parseQueryNumber(inputInvalid, { fallback: -1 });

      // Assert
      expect(result).toBe(-1);
    });

    it('should return undefined for missing, empty or invalid values if no fallback is provided', () => {
      // Act & Assert
      expect(parseQueryNumber(null)).toBeUndefined();
      expect(parseQueryNumber('')).toBeUndefined();
      expect(parseQueryNumber('not-a-number')).toBeUndefined();
    });
  });

  describe('parseQueryBoolean', () => {
    it('should parse valid true representations', () => {
      // Act & Assert
      expect(parseQueryBoolean('true')).toBe(true);
      expect(parseQueryBoolean('1')).toBe(true);
    });

    it('should parse valid false representations', () => {
      // Act & Assert
      expect(parseQueryBoolean('false')).toBe(false);
      expect(parseQueryBoolean('0')).toBe(false);
    });

    it('should return undefined for invalid boolean formats', () => {
      // Act & Assert
      expect(parseQueryBoolean('not-a-boolean')).toBeUndefined();
      expect(parseQueryBoolean(null)).toBeUndefined();
      expect(parseQueryBoolean('')).toBeUndefined();
    });
  });

  describe('parseQueryArray', () => {
    it('should split string into array and remove empty items', () => {
      // Arrange
      const input = 'react, vue, , angular';

      // Act
      const result = parseQueryArray(input, { separator: ',' });

      // Assert
      expect(result).toEqual(['react', 'vue', 'angular']);
    });

    it('should return empty array for null or empty input', () => {
      // Act & Assert
      expect(parseQueryArray(null)).toEqual([]);
      expect(parseQueryArray('')).toEqual([]);
    });

    it('should fallback to default array separator when no explicit options are passed', () => {
      // Arrange
      const input = 'vendas,marketing,ti';

      // Act
      const result = parseQueryArray(input);

      // Assert
      expect(result).toEqual(['vendas', 'marketing', 'ti']);
    });
  });

  describe('parseQueryEnum', () => {
    const allowedRoles = ['admin', 'employee', 'manager'] as const;

    it('should return the value if it exists in the allowed list', () => {
      // Arrange
      const input = 'employee';

      // Act
      const result = parseQueryEnum(input, allowedRoles);

      // Assert
      expect(result).toBe('employee');
    });

    it('should return undefined if value is not present in allowed list', () => {
      // Arrange
      const input = 'hackerman';

      // Act
      const result = parseQueryEnum(input, allowedRoles);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return undefined if input is null or empty', () => {
      // Act & Assert
      expect(parseQueryEnum(null, allowedRoles)).toBeUndefined();
      expect(parseQueryEnum('', allowedRoles)).toBeUndefined();
    });
  });

  describe('parseQueryDate & parseQueryDateRange', () => {
    it('should validate right dates based on format', () => {
      // Act & Assert
      expect(parseQueryDate('2026-12-31', 'YYYY-MM-DD')).toBe('2026-12-31');
      expect(parseQueryDate('invalid-date')).toBeUndefined();
      expect(parseQueryDate(null)).toBeUndefined();
    });

    it('should parse date ranges from URLSearchParams object with custom keys', () => {
      // Arrange
      const params = new URLSearchParams('startDate=2026-06-01&endDate=2026-06-30');

      // Act
      const result = parseQueryDateRange(params, { start: 'startDate', end: 'endDate' });

      // Assert
      expect(result).toEqual({
        start: '2026-06-01',
        end: '2026-06-30',
      });
    });

    it('should parse date ranges using default keys (startDate/endDate) when options are omitted', () => {
      // Arrange
      const params = new URLSearchParams('startDate=2026-01-01&endDate=2026-01-15');

      // Act
      const result = parseQueryDateRange(params);

      // Assert
      expect(result).toEqual({
        start: '2026-01-01',
        end: '2026-01-15',
      });
    });
  });

  describe('useQueryParser Stable Hook API', () => {
    it('should expose all parse methods correctly', () => {
      // Arrange
      // Act
      const parser = useQueryParser();

      // Assert
      expect(parser.parseString).toBe(parseQueryString);
      expect(parser.parseNumber).toBe(parseQueryNumber);
      expect(parser.parseBoolean).toBe(parseQueryBoolean);
      expect(parser.parseArray).toBe(parseQueryArray);
      expect(parser.parseEnum).toBe(parseQueryEnum);
      expect(parser.parseDate).toBe(parseQueryDate);
      expect(parser.parseDateRange).toBe(parseQueryDateRange);
    });
  });
});
