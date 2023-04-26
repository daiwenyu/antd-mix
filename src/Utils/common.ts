// 将无固定参数个数的回掉函数以Promise形式执行
export const promisify = (fn: (...params: any[]) => void, ...args: any[]) => {
  return new Promise((resolve) => {
    if (args.length > 0) {
      fn(...args, resolve);
    } else {
      fn(resolve);
    }
  });
};

/**
 * 将数组内某个字段的值转换为对象组
 * @param array
 * @param key
 * @returns
 */
export function arrayToObj(array: any[], key: string) {
  return array.reduce((obj, item) => {
    obj[item[key]] = item;
    return obj;
  }, {});
}
