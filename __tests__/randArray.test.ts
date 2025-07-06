import { describe, test, expect } from 'bun:test';
import { randArrayItems } from '../src/index';

describe('randArrayItems', () => {
  test('should return exactly N unique items by default', () => {
    const result = randArrayItems([1, 2, 3, 4, 5], 3);
    expect(result).toHaveLength(3);
    expect(new Set(result).size).toBe(3);
  });

  test('should allow duplicates when enabled', () => {
    const result = randArrayItems([1, 2, 3], 5, true);
    expect(result).toHaveLength(5);
  });

  test('should return all items if count exceeds length', () => {
    const result = randArrayItems([1, 2, 3], 10);
    expect(result).toHaveLength(3);
  });

  test('should throw on empty array', () => {
    expect(() => randArrayItems([], 2)).toThrow();
  });
});