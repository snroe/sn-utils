import { describe, test, expect } from 'bun:test';
import { deepFreeze } from '../src/index';

describe('deepFreeze', () => {
  test('should freeze a plain object', () => {
    const obj = { a: 1, b: 2 };
    const frozen = deepFreeze(obj);

    expect(Object.isFrozen(frozen)).toBe(true);
    // @ts-expect-error - 修改只读属性应该抛出错误
    expect(() => (frozen.a = 3)).toThrow();
  });

  test('should deeply freeze nested objects', () => {
    const obj = { a: { b: { c: 1 } } };
    const frozen = deepFreeze(obj);

    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.a)).toBe(true);
    expect(Object.isFrozen(frozen.a.b)).toBe(true);
  });

  test('should not modify the original object reference', () => {
    const obj = { a: { b: 1 } };
    const frozen = deepFreeze(obj);

    expect(frozen).toBe(obj);
    expect(frozen.a).toBe(obj.a);
  });

  test('should handle arrays correctly', () => {
    const obj = { arr: [1, { a: 2 }] };
    const frozen = deepFreeze(obj);

    expect(Object.isFrozen(frozen.arr)).toBe(true);
    expect(Object.isFrozen(frozen.arr[1])).toBe(true);
  });

  test('should ignore non-object input', () => {
    const num = 42;
    const str = 'hello';
    const bool = true;

    expect(deepFreeze(num)).toBe(num);
    expect(deepFreeze(str)).toBe(str);
    expect(deepFreeze(bool)).toBe(bool);
  });

  test('should prevent adding new properties', () => {
    const obj = { a: 1 };
    const frozen = deepFreeze(obj);

    // @ts-expect-error - 添加新属性应该失败
    expect(() => (frozen.b = 2)).toThrow();
    expect(frozen).not.toHaveProperty('b');
  });

  test('should handle circular references', () => {
    const obj: any = { a: 1 };
    obj.self = obj;

    const frozen = deepFreeze(obj);

    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.self)).toBe(true);
    expect(frozen.self).toBe(frozen);
  });

  test('should not freeze WeakMap/Map/Set and other built-in types', () => {
    const map = new Map();
    const set = new Set();
    const date = new Date();

    expect(deepFreeze(map)).toBe(map);
    expect(deepFreeze(set)).toBe(set);
    expect(deepFreeze(date)).toBe(date);
  });
});