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

/**
 * 检测当前浏览器内核版本是否大于等于指定的Chrome内核版本
 * @param minVersion 指定的Chrome内核版本
 * @returns 是否大于等于指定版本
 */
export function checkChromeVersion(minVersion: number) {
  const ua = navigator.userAgent.toLowerCase();
  const chromeVersion = ua.match(/chrom(e|ium)\/([0-9]+)\./);
  if (chromeVersion && chromeVersion[2]) {
    return parseInt(chromeVersion[2], 10) >= minVersion;
  }
  return false;
}

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @returns 随机字符串
 */
export function generateRandomString(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
