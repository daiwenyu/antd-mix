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
