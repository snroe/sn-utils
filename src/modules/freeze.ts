/**
 * 深度冻结一个对象，使其及其嵌套对象不可变
 * 
 * @param {T} obj - 要深度冻结的对象，期望是一个键值对对象，键为字符串，值为任意
 * @returns {Readonly<T>} 返回深度冻结后的对象，保持相同的类型
 */
export const deepFreeze = <T>(obj: T): Readonly<T> => {
  // 防御非对象输入
  if (typeof obj !== 'object' || obj === null) return obj;

  // 使用 WeakSet 记录已处理的对象，避免重复处理
  const memo = new WeakSet();

  /**
   * 使用深度优先搜索（DFS）算法递归地冻结当前对象及其所有嵌套对象
   * 这个函数的目的是确保对象及其嵌套对象不可变，即使它们之前没有被冻结
   * 
   * @param current 当前要处理的对象这个参数的类型被声明为 any，因为在此上下文中，对象可以是任何类型
   */
  const dfs = (current: any): void => {
    // 检查当前对象是否已经被处理过，以避免重复处理
    if (memo.has(current)) return;
    memo.add(current);

    // 冻结当前对象，使其不可变
    Object.freeze(current);

    // 遍历当前对象的所有属性
    for (const key in current) {
      // 确保属性是对象自身的属性，而不是原型链上的属性
      if (Object.prototype.hasOwnProperty.call(current, key)) {
        const value = current[key];
        // 如果属性值是对象（且不为空），则递归调用 dfs 函数
        if (typeof value === 'object' && value !== null) {
          dfs(value);
        }
      }
    }
  };

  dfs(obj);
  return obj;
};