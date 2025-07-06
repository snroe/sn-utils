/**
 * 随机返回一个或多个数组元素
 * @param array 输入数组
 * @param count 要返回的元素个数（默认 1）
 * @param allowDuplicates 是否允许重复选取同一个元素（默认 false）
 * @returns T[] 随机选出的元素数组
 */
export const randArrayItems = <T>(
  array: T[],
  count: number = 1,
  allowDuplicates: boolean = false
): T[] => {
  const len = array.length;
  if (len === 0) throw new Error("Array is empty");
  if (count <= 0) return [];
  if (count > len && !allowDuplicates) return [...array];

  const result: T[] = [];
  const usedIndices = new Set<number>();

  while (result.length < count) {
    const index = Math.floor(Math.random() * len);

    if (!usedIndices.has(index)) {
      result.push(array[index]);
      usedIndices.add(index);

      // 如果已用完所有项且不允许重复，停止
      if (!allowDuplicates && usedIndices.size >= len) break;
    } else if (allowDuplicates) {
      result.push(array[index]);
    }
  }

  return result;
};