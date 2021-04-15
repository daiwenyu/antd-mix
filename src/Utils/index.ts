export const isWechat = window.navigator.userAgent
  .toLowerCase()
  .includes('micromessenger');

interface WxSDKOption {
  version: string;
  debug: boolean;
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
    const Script = document.createElement('script');
    Script.type = 'text/javascript';
    Script.src = `//res.wx.qq.com/open/js/jweixin-${version}.js`;
    Script.onload = async () => {
      try {
        window.wx.config({
          debug,
          appId,
          timestamp,
          nonceStr,
          signature,
          jsApiList,
        });
        return resolve(true);
      } catch (e) {
        console.log(e);
        return reject(false);
      }
    };
    document.body.appendChild(Script);
  });
};
