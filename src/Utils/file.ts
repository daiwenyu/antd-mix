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

/**
 * 检查文件类型
 * @param file File 文件对象
 * @param accept string 文件类型，使用“,”分割，如：image/png,image/jpeg
 * @returns 
 */
export const checkFileType = (file: File, accept: string) => {
  if (accept) {
    // 整理文件类型
    const acceptList = accept
      .split(',')
      .map((item) => item.trim().toLowerCase());
    const fileType = file.type.toLowerCase();
    return acceptList.includes(fileType);
  }
  return true;
};
