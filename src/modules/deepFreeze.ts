/**
 * Deep freeze an object, making it and its nested objects immutable.
 * 
 * @param {T} obj The object to be deeply frozen is expected to be a key-value pair object,
 *                where the keys are strings and the values can be anything.
 * @returns {Readonly<T>} Return the object after deep freezing, keeping the same type.
 * @remarks This function performs a deep freeze on the object and all its nested properties.
 *          It also mutates the original object (frozen in place).
 * @example
 * ```ts
 * import { deepFreeze } from '@selize/utils';
 *
 * const obj = { a: 1, b: { c: 2 } };
 * const frozen = deepFreeze(obj);
 * console.log("frozen: ", frozen);
 * // Output:
 * // {
 * //   a: 1,
 * //   b: {
 * //     c: 2
 * //   }
 *
 * obj.a = 2;
 * // Output:
 * // TypeError: Cannot assign to read only property 'a' of object '#<Object>'
 * ```
 * @see https://utils.selize.snroe.com/functions/deepfreeze.deepfreeze
 */
export const deepFreeze = <T>(obj: T): Readonly<T> => {
  // Defense against non-object input
  if (typeof obj !== 'object' || obj === null) return obj;

  // Use WeakSet to keep track of processed objects to avoid duplicate processing.
  const memo = new WeakSet();

  /**
   * Recursively freeze the current object and all its nested objects using the Depth First Search (DFS) algorithm.
   * 
   * The purpose of this function is to ensure that the object and its nested objects are immutable,
   * even if they were not frozen before.
   * 
   * @param current The type of the object currently being processed is declared as any,
   *                because in this context, the object can be of any type.
   */
  const dfs = (current: any): void => {
    // Check whether the current object has already been processed to avoid duplicate processing.
    if (memo.has(current)) return;
    memo.add(current);

    // Freeze the current object to make it immutable.
    Object.freeze(current);

    // Traverse all properties of the current object
    for (const key in current) {
      // Ensure that the property is a property of the object itself, not a property on the prototype chain.
      if (Object.prototype.hasOwnProperty.call(current, key)) {
        const value = current[key];
        // If the attribute value is an object (and not empty), then recursively call the dfs function.
        if (typeof value === 'object' && value !== null) {
          dfs(value);
        }
      }
    }
  };

  dfs(obj);
  return obj;
};