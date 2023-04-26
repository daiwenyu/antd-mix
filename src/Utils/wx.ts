declare const wx: any;

export const isWechat = window.navigator.userAgent
  .toLowerCase()
  .includes('micromessenger');

export interface WxSDKOption {
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
