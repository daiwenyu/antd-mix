import { Button, Form } from 'antd';
import { AvatarUpload } from 'antd-mix';
import React from 'react';

export default () => {
  const onFinish = (values: any) => {
    console.log(values);
  };
  return (
    <Form onFinish={onFinish}>
      <Form.Item name="avatar" label="头像" rules={[{ required: true }]}>
        <AvatarUpload
          size={[100, 500]}
          imgCropProps={{ aspect: 1 / 1 }}
          uploadProps={{
            accept: 'image/jpg,image/jpeg,image/png',
            action:
              'http://member-center-api-t.yysports.com/pousheng-user-web/azure/uploadImg',
          }}
          response={(res: { url: string }) => res.url}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};
