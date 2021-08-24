import React from 'react';
import { AvatarUpload } from 'ant-nest';

export default () => {
  return (
    <AvatarUpload
      size={10 * 1024}
      imgCropProps={{}}
      uploadProps={{
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      }}
      response={(res: { url: string }) => res.url}
    />
  );
};
