import type { compressAccuratelyConfig } from 'image-conversion';
import { compressAccurately } from 'image-conversion';

export const isWechat = window.navigator.userAgent
  .toLowerCase()
  .includes('micromessenger');

interface WxSDKOption {
  version?: string;
  debug?: boolean;
  appId: string;
  timestamp: string;
  nonceStr: string;
  signature: string;
  jsApiList: string[];
}
export const wxSDK = (option: WxSDKOption) => {
  return new Promise((resolve, reject) => {
    const {
      version = '1.6.0',
      debug = false,
      appId,
      timestamp,
      nonceStr,
      signature,
      jsApiList,
    } = option;
    const scriptMap = document.getElementsByTagName('script');
    const scriptList = Array.from(scriptMap);
    const loadedWxSDK = scriptList.some((v) =>
      v.src.includes('res.wx.qq.com/open/js/jweixin'),
    );
    const configWxSDK = () => {
      wx.config({
        debug,
        appId,
        timestamp,
        nonceStr,
        signature,
        jsApiList,
      });
      wx.ready(function () {
        resolve({ success: true });
      });
      wx.error(function (res: any) {
        reject({
          success: false,
          message: res,
        });
      });
    };
    if (loadedWxSDK === false) {
      const Script = document.createElement('script');
      Script.type = 'text/javascript';
      Script.src = `//res.wx.qq.com/open/js/jweixin-${version}.js`;
      Script.onload = () => {
        configWxSDK();
      };
      document.body.appendChild(Script);
    } else {
      configWxSDK();
    }
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

export const getUrlParams = (paramsStr?: string) => {
  const searchParams = new URLSearchParams(paramsStr || window.location.search);
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
