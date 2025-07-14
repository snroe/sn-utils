import { describe, test, expect } from 'bun:test';
import { deepFreeze } from '../src/index';

describe('deepFreeze', () => {
  test('should return primitive values as-is', () => {
    expect(deepFreeze(42)).toBe(42);
    expect(deepFreeze('hello')).toBe('hello');
    expect(deepFreeze(true)).toBe(true);
  });

  test('should return function as-is without freezing', () => {
    const fn = () => { };
    const frozenFn = deepFreeze(fn);

    expect(frozenFn).toBe(fn);
    // @ts-expect-error
    expect(() => frozenFn()).not.toThrow();
  });

  test('should freeze a plain object', () => {
    const obj = { a: 1, b: { c: 2 } };
    const frozen = deepFreeze(obj);

    // @ts-expect-error - Cannot assign to read only property
    expect(() => (frozen.a = 3)).toThrow();
    // @ts-expect-error
    expect(() => (frozen.b.c = 3)).toThrow();
  });

  test('should freeze array and nested elements', () => {
    const arr = [1, [2, 3]];
    const frozen = deepFreeze(arr);

    // @ts-expect-error
    expect(() => (frozen[0] = 99)).toThrow();

    expect(() => (frozen[1][0] = 99)).toThrow();
  });

  test('should freeze Map and its keys/values', () => {
    const map = new Map([['key', { val: 1 }]]);
    const frozenMap = deepFreeze(map);

    const entry = frozenMap.get('key');
    // @ts-expect-error
    expect(() => (entry.val = 2)).toThrow();

    // Should throw when trying to mutate the Map itself
    // @ts-expect-error
    expect(() => frozenMap.set('newKey', {})).toThrow();
  });

  test('should freeze Set and its values', () => {
    const set = new Set([{ val: 1 }]);
    const frozenSet = deepFreeze(set);

    const value = frozenSet.values().next().value;

    expect(() => (value.val = 2)).toThrow();
    // @ts-expect-error
    expect(() => frozenSet.add({ val: 2 })).toThrow();
  });

  test('should handle circular references', () => {
    const obj: any = {};
    obj.self = obj;

    const frozen = deepFreeze(obj);
    expect(frozen.self).toBe(frozen); // should preserve reference
  });

  test('should not allow deletion or setting properties', () => {
    const obj = { a: 1 };
    const frozen = deepFreeze(obj);
    // @ts-expect-error
    expect(() => delete frozen.a).toThrow();
    // @ts-expect-error
    expect(() => (frozen.b = 2)).toThrow();
  });

  test('should freeze Date objects', () => {
    const date = new Date();
    const frozenDate = deepFreeze(date);

    // @ts-expect-error
    expect(() => (frozenDate.setTime(0))).toThrow();
    expect(frozenDate).toBeInstanceOf(Date);
  });

  test('should freeze RegExp objects', () => {
    const re = /abc/g;
    const frozenRe = deepFreeze(re);

    // @ts-expect-error
    expect(() => (frozenRe.lastIndex = 1)).toThrow();
  });

  test('should freeze object with symbol keys', () => {
    const sym = Symbol('key');
    const obj = { [sym]: 'value' };
    const frozen = deepFreeze(obj);

    // @ts-expect-error
    expect(() => (frozen[sym] = 'new')).toThrow();
  });

  test('should preserve prototype chain when freezing', () => {
    class Parent {
      parentMethod() { }
    }

    class Child extends Parent {
      childMethod() { }
    }

    const obj = new Child();
    const frozen = deepFreeze(obj);

    expect(frozen instanceof Child).toBe(true);
    expect(frozen instanceof Parent).toBe(true);
  });

  test('should return promise as-is', () => {
    const p = Promise.resolve(1);
    const frozen = deepFreeze(p);

    expect(frozen).toBe(p);
  });

  test('should return typed array as-is', () => {
    const arr = new Uint8Array([1, 2, 3]);
    const frozen = deepFreeze(arr);

    expect(frozen).toBe(arr); // 不应冻结或代理
  });

  test('should handle unknown constructor instances', () => {
    class CustomClass {
      value = 42;
    }

    const instance = new CustomClass();
    const frozen = deepFreeze(instance);

    expect(frozen).toBeInstanceOf(CustomClass);
    // @ts-expect-error
    expect(() => (frozen.value = 100)).toThrow();
  });

  test('should cache already frozen objects to prevent infinite recursion', () => {
    const obj: any = {};
    obj.self = obj;

    const frozen = deepFreeze(obj);
    expect(frozen).toBe(frozen.self); // 确保引用一致
  });
});