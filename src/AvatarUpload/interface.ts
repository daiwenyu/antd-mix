import { ImgCropProps } from 'antd-img-crop';
import { UploadProps } from 'antd/es/upload/interface';

export declare type uploadValue = string | Array<string>;

export interface AvatarUploadProps {
  uploadProps: UploadProps;
  imgCropProps?: ImgCropProps;
  response?: (res: any) => string; // 获取返回数据图片url
  disabled?: boolean;
  size?: number | [number | undefined, number | undefined];
  value?: uploadValue;
  onChange?: (imgUrl: uploadValue) => void;
  // formatResult?: (response: any) => any; // Format request results
}
