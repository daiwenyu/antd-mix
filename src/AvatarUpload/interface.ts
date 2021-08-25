import { UploadProps } from 'antd/es/upload/interface';
import { ImgCropProps } from 'antd-img-crop';

export declare type uploadValue = string | Array<string>;

export interface AvatarUploadProps {
  uploadProps: UploadProps;
  imgCropProps: ImgCropProps | false;
  response: (res: any) => string; // 获取返回数据图片url
  size?: number;
  value?: uploadValue;
  name?: string;
  onChange?: (imgUrl: uploadValue) => void;
}
