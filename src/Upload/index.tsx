import React, { useEffect, useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop, { ImgCropProps } from 'antd-img-crop';
import {
  UploadProps,
  RcFile,
  UploadFile,
  UploadChangeParam,
} from 'antd/es/upload/interface';
import 'antd/es/slider/style';

export declare type uploadValue = string | Array<string>;
export interface AntNestUploadProps {
  uploadProps: UploadProps;
  imgCropProps: ImgCropProps;
  size?: number;
  value?: uploadValue;
  onChange?: (imgUrl: uploadValue) => void;
  response: (res: any) => string | [string]; // 获取返回数据图片url
}

export default (props: AntNestUploadProps) => {
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const {
    uploadProps = {},
    imgCropProps = {},
    size,
    value,
    onChange,
    response,
  } = props;

  const { beforeUpload, maxCount } = uploadProps;

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const triggerChange = (currentFileList: Array<UploadFile>) => {
    if (currentFileList.length <= 1) {
      // 单图片
      onChange?.(
        currentFileList[0]?.response?.url ||
          response?.(currentFileList[0]?.response),
      );
    } else {
      // 图片列表
      onChange?.(
        currentFileList.map((v) => v?.response?.url || response?.(v?.response)),
      );
    }
  };

  const handleBeforeUpload = async (file: RcFile, fileList: Array<RcFile>) => {
    // 大小校验
    if (typeof size === 'number') {
      const { size: fileSize } = file;
      if (fileSize / 1024 > size) {
        message.warning('文件超出大小限制');
        return Promise.reject();
      }
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
    setFileList(newFileList);
    triggerChange(newFileList);
    return Promise.resolve();
  };

  const handleChange = (changeValue: UploadChangeParam) => {
    const { fileList: newFileList } = changeValue;
    setFileList(newFileList);
  };

  useEffect(() => {
    if (fileList.length && fileList.every((v) => v.status === 'done')) {
      triggerChange(fileList);
    }
  }, [fileList]);

  useEffect(() => {
    // 比较value与fileList差别
    const fileListUrl = fileList.map((v) => v?.response?.url).join();
    const valueUrl = Array.isArray(value)
      ? value.join()
      : value
      ? value.toString()
      : '';

    if (fileListUrl !== valueUrl) {
      // 信息不一致，将value刷入fileList
      if (Array.isArray(value)) {
        const newFileList = value.map((v, i) => ({
          uid: i.toString(),
          status: 'done',
          response: { status: 'success', url: v },
          url: v,
        }));
        // @ts-ignore
        setFileList(newFileList);
        return;
      }

      if (value && value.length) {
        // @ts-ignore
        setFileList([
          {
            status: 'done',
            response: { status: 'success', url: value },
            url: value,
          },
        ]);
      }
    }
  }, [value]);

  return (
    <div>
      <ImgCrop {...imgCropProps}>
        <Upload
          {...uploadProps}
          beforeUpload={handleBeforeUpload}
          onChange={handleChange}
          onPreview={handlePreview}
          onRemove={handleRemove}
          fileList={fileList}
        >
          {typeof maxCount === 'number' && fileList.length >= maxCount
            ? null
            : uploadButton}
        </Upload>
      </ImgCrop>
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
