import { promisify } from './common';
import { compressImg, downloadFile } from './file';
import { getUrlParams } from './url';
import { isWechat, wxSDK } from './wx';

export { promisify, downloadFile, compressImg, getUrlParams, isWechat, wxSDK };
