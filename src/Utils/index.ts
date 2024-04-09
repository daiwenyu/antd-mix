import { promisify } from './common';
import { checkFileType, compressImg, downloadFile } from './file';
import { getUrlParams } from './url';
import { isWechat, wxSDK } from './wx';

export {
  checkFileType,
  compressImg,
  downloadFile,
  getUrlParams,
  isWechat,
  promisify,
  wxSDK,
};
