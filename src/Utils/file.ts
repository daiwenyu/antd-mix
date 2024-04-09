import type { compressAccuratelyConfig } from 'image-conversion';
import { compressAccurately } from 'image-conversion';

export const downloadFile = (href: string, fileName?: string) => {
  const aEle = document.createElement('a');
  aEle.target = '_blank';
  aEle.href = href;
  aEle.download = fileName || '';
  aEle.click();
  aEle.remove();
};

export const compressImg = (
  file: Blob,
  config?: number | compressAccuratelyConfig | undefined,
) => compressAccurately(file, config);

export const checkFileType = (file: File, accept: string) => {
  if (accept) {
    const acceptList = accept
      .replaceAll('.', '')
      .split(',')
      .map((item) => item.trim().toLowerCase());
    const fileType = file.type.split('/')[1].toLowerCase();
    return acceptList.includes(fileType);
  }
  return true;
};

// export const beforeUpload = async (file: File) => {
//   try {
//     // 判断文件大小
//     if (imgSize) {
//       await checkFileSize(file, imgSize);
//     }
//     // 判断文件类型
//     if (imgType) {
//       await checkFileType(file, imgType);
//     }
//     // 判断图片比例
//     if (imgRatio) {
//       await checkImageRatio(file, imgRatio);
//     }
//   } catch (errMsg: any) {
//     messageApi.error(errMsg);
//     return Promise.reject(errMsg);
//   }
//   return Promise.resolve(file);
// };
