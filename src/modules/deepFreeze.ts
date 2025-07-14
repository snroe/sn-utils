export type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;

export type DeepReadonlyMap<K, V> = Omit<ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>, 'set' | 'delete' | 'clear'>;
export type DeepReadonlySet<E> = Omit<Set<DeepReadonly<E>>, 'add' | 'delete' | 'clear'>;

export type DeepReadonlyObject<T extends object> = { readonly [P in keyof T]: DeepReadonly<T[P]> };

export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Map<infer K, infer V>
  ? DeepReadonlyMap<K, V>
  : T extends Set<infer E>
  ? DeepReadonlySet<E>
  : T extends object
  ? DeepReadonlyObject<T>
  : T;

/**
 * Deep freeze an object, making it and its nested objects immutable.
 * 
 * @param {T} obj The object to be deeply frozen is expected to be a key-value pair object,
 *                where the keys are strings and the values can be anything.
 * @returns {DeepReadonly<T>} Return the object after deep freezing, keeping the same type.
 * @remarks This function performs a deep freeze on the object and all its nested properties.
 *          It also mutates the original object (frozen in place).
 * @example
 * ```ts
 * import { deepFreeze } from '@selize/utils';
 *
 * const obj = { 
 *  list: [1, 2, { nested: new Set([3, 4]) }],
 *  meta: new Map([['version', 1]]),
 * };
 * const frozen = deepFreeze(obj);
 * 
 * frozen.list[2].nested.add(5); // Output: TypeError: Cannot modify a frozen object
 * frozen.meta.set('version', 2); // Output: TypeError: Cannot modify a frozen object
 * ```
 * @see https://utils.selize.snroe.com/functions/deepfreeze.deepfreeze
 */
export const deepFreeze = <T>(obj: T): DeepReadonly<T> => {
  // Defense against non-object input
  if (
    typeof obj !== 'object' ||
    obj === null ||
    obj instanceof Promise ||
    ArrayBuffer.isView(obj)
  ) {
    return obj as DeepReadonly<T>;
  }

  // Prevent duplicate processing.
  const visited = new WeakMap<object, any>();

  /**
   * Create a proxy object to intercept and prevent modifications to the object.
   * 
   * @param {T} target The object to be proxied is declared as any,
   *               because in this context, the object can be of any type.
   * @returns {DeepReadonly<T>} A proxy object that intercepts and prevents modifications to the object.
   */
  const createProxy = <T extends object>(target: T): DeepReadonly<T> => {
    return new Proxy(target, {
      get(target, prop, receiver) {
        const isData = target instanceof Date;
        const isMap = target instanceof Map;
        const isSet = target instanceof Set;

        if (
          isData &&
          ['setTime', 'setFullYear', 'setMonth', 'setDate',
            'setHours', 'setMinutes', 'setSeconds', 'setMilliseconds'].includes(String(prop))
        ) {
          throw new Error("Cannot modify a frozen Date");
        }

        if (
          (isMap && ['set', 'delete', 'clear', 'setPrototypeOf'].includes(String(prop))) ||
          (isSet && ['add', 'delete', 'clear', 'setPrototypeOf'].includes(String(prop)))
        ) {
          throw new Error(`Cannot modify a frozen ${target.constructor.name}`);
        }

        const value = Reflect.get(target, prop);
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target, prop, value) {
        const isRegExp = target instanceof RegExp;

        if (isRegExp && prop === 'lastIndex') {
          throw new Error("Cannot modify a frozen RegExp's lastIndex");
        }
        throw new Error('Cannot modify a frozen object');
      },
      deleteProperty() {
        throw new Error('Cannot modify a frozen object');
      }
    }) as DeepReadonly<T>;
  }

  /**
   * Recursively freeze the current object and all its nested objects using the Depth First Search (DFS) algorithm.
   * 
   * The purpose of this function is to ensure that the object and its nested objects are immutable,
   * even if they were not frozen before.
   * 
   * @param current The type of the object currently being processed is declared as any,
   *                because in this context, the object can be of any type.
   * @returns {DeepReadonly<T>} The object after deep freezing, keeping the same type.
   */
  const freezeRecursive = <T extends object>(current: T): DeepReadonly<T> => {
    // Check whether the current object has already been processed.
    if (visited.has(current)) return visited.get(current);

    if (typeof current !== 'object' || current === null) return current as DeepReadonly<T>;

    // Wrap and proxy special objects (Date / RegExp)
    if (current instanceof Date || current instanceof RegExp) {
      const result = createProxy(current);
      visited.set(current, result);

      return result;
    }

    // Map
    if (current instanceof Map) {
      const frozenMap = new Map();
      const result = createProxy(frozenMap);
      visited.set(current, frozenMap); // Pre-cache to avoid circular references.

      current.forEach((value, key) => {
        frozenMap.set(freezeRecursive(key), freezeRecursive(value));
      });

      return result as DeepReadonly<T>;
    }

    // Set
    if (current instanceof Set) {
      const frozenSet = new Set();
      const result = createProxy(frozenSet);
      visited.set(current, result);

      current.forEach((value) => {
        frozenSet.add(freezeRecursive(value));
      });

      return result as DeepReadonly<T>;
    }

    // Array
    if (Array.isArray(current)) {
      const frozenArray = current.map(item => freezeRecursive(item));
      const result = createProxy(frozenArray) as DeepReadonly<T>;
      visited.set(current, result);
      return result;
    }

    // Plain Object
    if (Object.prototype.toString.call(current) === '[object Object]') {
      const proto = Object.getPrototypeOf(current);
      const frozenObj = Object.create(proto);
      const result = createProxy(frozenObj);
      visited.set(current, result);

      for (const key of Reflect.ownKeys(current)) {
        const rawValue = (current as any)[key];
        (frozenObj as any)[key] = freezeRecursive(rawValue);
      }

      return result;
    }

    // Primitive
    const result = createProxy(current);
    visited.set(current, result);
    return result;
  };

  return freezeRecursive(obj);
};