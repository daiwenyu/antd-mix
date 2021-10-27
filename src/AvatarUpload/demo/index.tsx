import React from 'react';
import { Form } from 'antd';
import { AvatarUpload } from 'antd-mix';

export default () => {
  return (
    <Form>
      <Form.Item name="avatar" label="头像" rules={[{ required: true }]}>
        <AvatarUpload
          size={500}
          imgCropProps={{ aspect: 1 / 1 }}
          uploadProps={{
            accept: 'image/jpg,image/jpeg,image/png',
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
          }}
          response={(res: { url: string }) => res.url}
        />
      </Form.Item>
    </Form>
  );
};
