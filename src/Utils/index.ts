import type { compressAccuratelyConfig } from 'image-conversion';
import { compressAccurately } from 'image-conversion';

declare const wx: any;

export const isWechat = window.navigator.userAgent
  .toLowerCase()
  .includes('micromessenger');

interface WxSDKOption {
  debug?: boolean;
  appId: string;
  timestamp: string;
  nonceStr: string;
  signature: string;
  jsApiList: string[];
  openTagList?: string[];
}
export const wxSDK = (option: WxSDKOption) => {
  return new Promise((resolve, reject) => {
    const { ...configOption } = option;
    wx.config({ ...configOption });
    wx.ready(function () {
      resolve({ success: true });
    });
    wx.error(function (res: any) {
      reject({
        success: false,
        message: res,
      });
    });
  });
};

export const downloadFile = (href: string) => {
  const aEle = document.createElement('a');
  aEle.target = '_blank';
  aEle.href = href;
  aEle.download = '';
  aEle.click();
  aEle.remove();
};

export const getUrlParams = (str?: string) => {
  let paramsStr = window.location.search;
  if (typeof str === 'string') {
    if (str.startsWith('http')) {
      const url = new URL(str);
      paramsStr = url.search;
    } else {
      paramsStr = str;
    }
  }
  const searchParams = new URLSearchParams(paramsStr);
  const params: any = {};
  for (let v of searchParams.entries()) {
    params[v[0]] = v[1];
  }
  return params;
};

export const compressImg = (
  file: Blob,
  config?: number | compressAccuratelyConfig | undefined,
) => compressAccurately(file, config);

export const AsyncFn = (fn, ...args) => {
  return new Promise((resolve) => {
    if (args.length > 0) {
      fn(...args, resolve);
    } else {
      fn(resolve);
    }
  });
};
