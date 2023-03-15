import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Image, message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { compressImg, downloadFile } from '../Utils';
import './index.less';
import { AvatarUploadProps } from './interface';
// import 'antd/es/image/style';
// import 'antd/es/modal/style';
// import 'antd/es/slider/style';
// import 'antd/es/upload/style';

// TODO 错误状态提示
// 表单组件包裹时将错误信息推送至form显示

// 文件大小校验
export const checkFileSize = (file: RcFile, size: any) => {
  const { size: fileSize } = file;
  if (typeof fileSize === 'number') {
    if (typeof size === 'number' && fileSize / 1024 > size) {
      message.warning('文件超出大小限制');
      return false;
    }
    if (Array.isArray(size) && size.length) {
      const minSize = size[0];
      const maxSize = size[1];
      // const errmsgSingle = ``;
      // const errmsgDouble = ``;
      if (minSize && fileSize / 1024 < minSize) {
        message.warning(
          `文件需大于${minSize > 1024 ? `${minSize / 1024}m` : `${minSize}k`}`,
        );
        return false;
      }
      if (maxSize && fileSize / 1024 > maxSize) {
        message.warning(
          `文件需小于${minSize > 1024 ? `${minSize / 1024}m` : `${minSize}k`}`,
        );
        return false;
      }
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

function AvatarPreview(props: { src: any; onDelete: any; disabled: boolean }) {
  const [visible, setVisible] = useState(false);
  const { src, onDelete, disabled } = props;
  return (
    <div className="pictureBox">
      <div className="pictureMask">
        <EyeOutlined onClick={() => setVisible(true)} />
        <DownloadOutlined
          onClick={() => {
            downloadFile(src);
          }}
        />
        {!disabled && <DeleteOutlined onClick={onDelete} />}
      </div>
      <div style={{ display: 'none' }}>
        <Image
          src={src}
          preview={{
            visible,
            onVisibleChange: (currentVisible) => {
              if (currentVisible === false) {
                setVisible(false);
              }
            },
          }}
        />
      </div>
      <img className="uploadedImg" src={src} alt="avatar" />
    </div>
  );
}

export default function (props: AvatarUploadProps) {
  const {
    size,
    value,
    disabled = false,
    onChange,
    response,
    imgCropProps,
    uploadProps,
  } = props;

  const [id] = useState(uuidv4());
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>('');

  const handleBeforeUpload = async (file: RcFile) => {
    // 文件类型校验
    if (uploadProps.accept && !checkFileType(file, uploadProps.accept)) {
      return Promise.reject();
    }

    if (imgCropProps) {
      let imgMaxSize = size;
      if (Array.isArray(size)) {
        imgMaxSize = size[1];
      }
      // {
      //   size: 500,
      // }
      if (imgMaxSize) {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        file = await compressImg(file, imgMaxSize);
      }
    } else {
      if (!checkFileSize(file, size)) {
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
      const imgUrl = response?.(info.file.response) || '';
      setLoading(false);
      onChange?.(imgUrl);
      // setImageUrl(imgUrl);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // @ts-ignore
  useEffect(() => setImageUrl(value), [value]);

  return (
    <div id={id}>
      {imageUrl ? (
        <AvatarPreview
          disabled={disabled}
          src={imageUrl}
          onDelete={() => {
            onChange?.('');
          }}
        />
      ) : (
        <ImgCrop {...imgCropProps}>
          <Upload
            disabled={disabled}
            {...uploadProps}
            listType="picture-card"
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
            onChange={handleChange}
          >
            {uploadButton}
          </Upload>
        </ImgCrop>
      )}
    </div>
  );
}
