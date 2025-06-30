/**
 * 随机一个随机数组项
 * @param array
 * @returns <T> 随机数组项
 * @example
 * ```
 * const item = randArray([1, 2, 3, 4, 5]);
 * console.log(item);
 * ```
 */
export const randArray = <T>(array: Array<T>): T => {
  if (array.length === 0) throw new Error("Array is empty");
  const rand = Math.random() * array.length | 0;
  return array[rand];
};

export const randArrayItems = <T>(array: Array<T>): T[] => {
  if (array.length === 0) throw new Error("Array is empty");
  // const rand = Math.random() * array.length | 0;
  const rand = array.sort(() => Math.random() - 0.5).slice(0, 3);
  return rand
};