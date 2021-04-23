/**
 * title: 结合Form使用
 * desc: 打开控制台查看输出结果
 */

import React from 'react';
import { Form, Button, Space } from 'antd';
import { Upload } from 'ant-nest';

export default () => {
  const [form] = Form.useForm();
  return (
    <Form form={form}>
      <Form.Item
        label="上传图片"
        name="uploadImg"
        initialValue="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Upload
          size={300}
          imgCropProps={{
            rotate: true,
          }}
          uploadProps={{
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            listType: 'picture-card',
            maxCount: 1,
          }}
          response={(res) => res}
        />
      </Form.Item>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            form.setFieldsValue({
              uploadImg:
                'https://gw.alipayobjects.com/zos/rmsportal/nBVXkrFdWHxbZlmMbsaH.svg',
            });
          }}
        >
          设置图片
        </Button>
        <Button
          onClick={() => {
            form.setFieldsValue({
              uploadImg: '',
            });
          }}
        >
          重置图片
        </Button>
      </Space>
    </Form>
  );
};
