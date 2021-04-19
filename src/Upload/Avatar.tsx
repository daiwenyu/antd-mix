import React, { useEffect, useState } from 'react';
import { Upload, Modal, message } from 'antd';
import ImgCrop, { ImgCropProps } from 'antd-img-crop';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  UploadProps,
  RcFile,
  UploadFile,
  UploadChangeParam,
} from 'antd/es/upload/interface';
import 'antd/es/slider/style';
import 'antd/es/upload/style';
import 'antd/es/modal/style';

export interface AntNestUploadProps {
  uploadProps: UploadProps;
  imgCropProps: ImgCropProps | false;
  size?: number;
  value?: string;
  onChange?: (imgUrl: string | undefined) => void;
  response: (res: any) => string; // 获取返回数据图片url
}

export default (props: AntNestUploadProps) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<undefined | string>(undefined);

  const {
    uploadProps = {},
    imgCropProps = {},
    size,
    value,
    onChange,
    response,
  } = props;

  const { beforeUpload } = uploadProps;
  const beforeCrop = imgCropProps ? imgCropProps.beforeCrop : null;

  // 文件大小校验
  const checkFileSize = (file: RcFile | File) => {
    if (typeof size === 'number') {
      const { size: fileSize } = file;
      if (fileSize / 1024 > size) {
        message.warning('文件超出大小限制');
        return false;
      }
    }
    return true;
  };

  // 文件类型校验
  const checkFileType = (file: RcFile | File) => {
    if (typeof uploadProps.accept === 'string') {
      const fileTypeList = uploadProps.accept.split(',').map((v) => v.trim());
      if (fileTypeList.includes(file.type) === false) {
        message.warning('文件类型有误');
        return false;
      }
    }
    return true;
  };

  const triggerChange = (currentFileUrl: string | undefined) => {
    onChange?.(currentFileUrl);
  };

  const handleBeforeUpload = async (file: RcFile, fileList: Array<RcFile>) => {
    // 大小校验
    const fileSizeStatus = checkFileSize(file);
    if (!fileSizeStatus) {
      return Promise.reject();
    }

    // 文件类型校验
    const fileTypeStatus = checkFileType(file);
    if (!fileTypeStatus) {
      return Promise.reject();
    }

    if (beforeUpload) {
      return await beforeUpload(file, fileList);
    }

    return Promise.resolve(file);
  };

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.response.url);
    setPreviewVisible(true);
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((v) => v.uid !== file.uid);
    triggerChange(newFileList);
    return Promise.resolve();
  };

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
    if (info.file.status === 'done') {
      setLoading(false);
      setImageUrl(response(info.file.response));
    }
  };

  const handleBeforeCrop = (file: File, fileList: File[]) => {
    // 大小校验
    const fileSizeStatus = checkFileSize(file);
    if (!fileSizeStatus) {
      return false;
    }

    // 文件类型校验
    const fileTypeStatus = checkFileType(file);
    if (!fileTypeStatus) {
      return false;
    }

    beforeCrop?.(file, fileList);
    return true;
  };

  useEffect(() => {
    triggerChange(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    if (value !== imageUrl) {
      setImageUrl(value);
    }
  }, [value]);

  const uploadButton = imageUrl ? (
    <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
  ) : (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const currentUploadProps = {
    ...uploadProps,
    maxCount: 1,
    listType: 'picture-card',
    showUploadList: false,
    beforeUpload: handleBeforeUpload,
    onChange: handleChange,
    onPreview: handlePreview,
    onRemove: handleRemove,
    children: uploadButton,
  };

  return (
    <div>
      {imgCropProps === false ? (
        <Upload {...currentUploadProps} />
      ) : (
        <ImgCrop {...imgCropProps} beforeCrop={handleBeforeCrop}>
          <Upload {...currentUploadProps} />
        </ImgCrop>
      )}

      <Modal
        title="图片预览"
        footer={null}
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};
