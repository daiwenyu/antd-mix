import type { compressAccuratelyConfig } from 'image-conversion';
import { compressAccurately } from 'image-conversion';

export const downloadFile = (href: string) => {
  const aEle = document.createElement('a');
  aEle.target = '_blank';
  aEle.href = href;
  aEle.download = '';
  aEle.click();
  aEle.remove();
};

export const compressImg = (
  file: Blob,
  config?: number | compressAccuratelyConfig | undefined,
) => compressAccurately(file, config);
