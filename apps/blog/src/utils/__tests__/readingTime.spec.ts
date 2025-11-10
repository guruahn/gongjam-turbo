import { describe, it, expect } from 'vitest';
import { calculateReadingTime, formatReadingTime } from '../readingTime';

describe('readingTime', () => {
  describe('calculateReadingTime', () => {
    it('should return 1 for empty text (minimum)', () => {
      expect(calculateReadingTime('')).toBe(1);
    });

    it('should return 1 for short text (< 200 words)', () => {
      const text = 'word '.repeat(100); // 100 words
      expect(calculateReadingTime(text)).toBe(1);
    });

    it('should calculate reading time for 200 words as 1 minute', () => {
      const text = 'word '.repeat(200); // 200 words
      expect(calculateReadingTime(text)).toBe(1);
    });

    it('should calculate reading time for 400 words as 2 minutes', () => {
      const text = 'word '.repeat(400); // 400 words
      expect(calculateReadingTime(text)).toBe(2);
    });

    it('should round up reading time (250 words -> 2 min)', () => {
      const text = 'word '.repeat(250); // 250 words
      expect(calculateReadingTime(text)).toBe(2);
    });

    it('should remove HTML tags before calculation', () => {
      const textWithHtml = '<p>word</p> '.repeat(200); // 200 words with tags
      expect(calculateReadingTime(textWithHtml)).toBe(1);
    });

    it('should handle text with multiple spaces', () => {
      const text = 'word  word   word'; // 3 words with extra spaces
      expect(calculateReadingTime(text)).toBe(1);
    });

    it('should handle newlines and whitespace', () => {
      const text = 'word\nword\n\nword\t\tword'; // 4 words with various whitespace
      expect(calculateReadingTime(text)).toBe(1);
    });

    it('should handle large text (1000 words = 5 minutes)', () => {
      const text = 'word '.repeat(1000);
      expect(calculateReadingTime(text)).toBe(5);
    });
  });

  describe('formatReadingTime', () => {
    it('should format 1 minute correctly', () => {
      expect(formatReadingTime(1)).toBe('1 min read');
    });

    it('should format 5 minutes correctly', () => {
      expect(formatReadingTime(5)).toBe('5 min read');
    });

    it('should format 10 minutes correctly', () => {
      expect(formatReadingTime(10)).toBe('10 min read');
    });

    it('should format 0 minutes (edge case)', () => {
      expect(formatReadingTime(0)).toBe('0 min read');
    });
  });
});
