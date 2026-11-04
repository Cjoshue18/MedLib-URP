import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateTime,
  formatShortDate,
  formatLongDate,
  formatDateForDateTimeLocal,
} from '../dateFormatter';

describe('dateFormatter', () => {
  describe('formatDate', () => {
    it('returns hyphen for null or undefined', () => {
      expect(formatDate(null)).toBe('-');
      expect(formatDate(undefined)).toBe('-');
    });

    it('returns original input for invalid string date', () => {
      expect(formatDate('cadena-invalida')).toBe('cadena-invalida');
    });

    it('returns hyphen for invalid Date object', () => {
      expect(formatDate(new Date('invalid'))).toBe('-');
    });

    it('formats a valid string date correctly', () => {
      const result = formatDate('2025-05-15T12:00:00Z');
      expect(result).toContain('2025');
      expect(result).toContain('15');
    });

    it('formats a valid Date object correctly', () => {
      const result = formatDate(new Date(2025, 4, 15));
      expect(result).toContain('2025');
      expect(result).toContain('15');
    });
  });

  describe('formatDateTime', () => {
    it('returns hyphen for null or undefined', () => {
      expect(formatDateTime(null)).toBe('-');
      expect(formatDateTime(undefined)).toBe('-');
    });

    it('returns original input for invalid string date', () => {
      expect(formatDateTime('fecha-no-valida')).toBe('fecha-no-valida');
    });

    it('returns hyphen for invalid Date object', () => {
      expect(formatDateTime(new Date('invalid'))).toBe('-');
    });

    it('formats a valid date with time', () => {
      const result = formatDateTime(new Date(2025, 4, 15, 14, 30));
      expect(result).toContain('2025');
      expect(result).toContain('15');
      expect(result).toContain(':');
    });
  });

  describe('formatShortDate', () => {
    it('returns hyphen for null or undefined', () => {
      expect(formatShortDate(null)).toBe('-');
      expect(formatShortDate(undefined)).toBe('-');
    });

    it('returns original input for invalid string date', () => {
      expect(formatShortDate('cadena-erronea')).toBe('cadena-erronea');
    });

    it('returns hyphen for invalid Date object', () => {
      expect(formatShortDate(new Date('invalid'))).toBe('-');
    });

    it('formats day and month', () => {
      const result = formatShortDate(new Date(2025, 4, 15));
      expect(result).toContain('15');
      expect(result).toMatch(/\d{1,2}\/\d{1,2}/);
    });
  });

  describe('formatLongDate', () => {
    it('returns hyphen for null or undefined', () => {
      expect(formatLongDate(null)).toBe('-');
      expect(formatLongDate(undefined)).toBe('-');
    });

    it('returns formatted string for valid date', () => {
      const result = formatLongDate(new Date(2025, 4, 15));
      expect(result).toContain('2025');
      expect(result).toContain('15');
    });
  });

  describe('formatDateForDateTimeLocal', () => {
    it('returns empty string for invalid date', () => {
      expect(formatDateForDateTimeLocal('invalido')).toBe('');
    });

    it('returns formatted string with length 16 for valid date', () => {
      const result = formatDateForDateTimeLocal(new Date(2025, 4, 15, 10, 0));
      expect(result).toHaveLength(16);
      expect(result).toContain('2025-05-15');
    });
  });
});
