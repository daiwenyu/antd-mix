import React, { useEffect, useState } from 'react';
import { Upload, Modal, message } from 'antd';
import { UploadProps } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop, { ImgCropProps } from 'antd-img-crop';
import 'antd/es/slider/style';

export interface AntNestUploadProps {
  uploadProps: UploadProps;
  imgCropProps: ImgCropProps;
}

export default (props: AntNestUploadProps) => {
  const [fileList, setFileList] = useState([]);

  const { uploadProps, imgCropProps } = props;

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div>
      <ImgCrop {...imgCropProps}>
        <Upload {...uploadProps} listType="picture-card">
          {fileList.length < 2 && uploadButton}
        </Upload>
      </ImgCrop>
      <Modal></Modal>
    </div>
  );
};
