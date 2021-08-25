import React, { useContext, useEffect, useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { AvatarUploadProps } from './interface';
import {
  UploadFile,
  RcFile,
  UploadChangeParam,
} from 'antd/lib/upload/interface';
import 'antd/es/modal/style';
import 'antd/es/slider/style';

// TODO 错误状态提示

// 文件大小校验
export const checkFileSize = (file: RcFile, size?: number) => {
  if (typeof size === 'number') {
    const { size: fileSize } = file;
    if (typeof fileSize === 'number' && fileSize / 1024 > size) {
      message.warning('文件超出大小限制');
      return false;
    }
  }
  return true;
};

// 文件类型校验
export const checkFileType = (file: RcFile, accept: string) => {
  if (!accept.includes(file.type)) {
    message.warning('文件类型有误');
    return false;
  }
  return true;
};

const changeImgType = (file: RcFile, encoderOptions = 1) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = document.createElement('img');
      // @ts-ignore
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        // @ts-ignore
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(resolve, 'image/jpeg', encoderOptions);
      };
    };
  });
};

export default function (props: AvatarUploadProps): React.ReactNode {
  const { size, value, onChange, response, imgCropProps, uploadProps } = props;

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleBeforeUpload = async (file: RcFile, fileList: RcFile[]) => {
    // 文件类型校验
    if (uploadProps.accept && !checkFileType(file, uploadProps.accept)) {
      return Promise.reject();
    }

    // 大小校验
    if (size && !checkFileSize(file, size)) {
      if (imgCropProps) {
        // @ts-ignore 当使用图片剪裁插件且图片格式为png时，进行转码
        file = await changeImgType(file, (size * 1024) / file.size);
      } else {
        return Promise.reject();
      }
    }

    return Promise.resolve(file);
  };

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      const imgUrl = response(info.file.response);
      setLoading(false);
      setImageUrl(imgUrl);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  useEffect(() => {}, [value]);

  useEffect(() => {
    if (imageUrl !== value) {
      onChange?.(imageUrl);
    }
  }, [imageUrl]);

  return (
    <ImgCrop {...imgCropProps}>
      <Upload
        {...uploadProps}
        listType="picture-card"
        showUploadList={false}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
        ) : (
          uploadButton
        )}
      </Upload>
    </ImgCrop>
  );
}
