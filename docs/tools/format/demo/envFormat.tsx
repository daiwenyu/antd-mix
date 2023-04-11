import { Button, Col, Form, Input, Row } from 'antd';
import React from 'react';
import './index.less';

const { TextArea } = Input;

function StrFormat() {
  const [form] = Form.useForm();

  const formatEnv = (envStr: string) => {
    const envObj = {};
    envStr
      .trim()
      .split('\n')
      .forEach((v) => {
        const result = v.split('-x').pop()?.trim();
        const index = result?.indexOf('=') || 0;
        Object.assign(envObj, {
          [result?.slice(0, index) || '']: result?.slice(index + 1),
        });
      });
    return envObj;
  };

  const formatData = async () => {
    const { envStr, confStr } = await form.validateFields([
      'envStr',
      'confStr',
    ]);
    const envObj = formatEnv(envStr);
    let result = confStr;
    Object.keys(envObj).forEach((key) => {
      result = result.replace(
        new RegExp(`process.env.${key}`, 'g'),
        envObj[key],
      );
    });
    form.setFieldsValue({ formatData: result });
  };

  return (
    <Form form={form} layout="vertical" className="envFormat">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="环境变量"
            name="envStr"
            rules={[{ required: true }]}
          >
            <TextArea rows={24} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="配置文件"
            name="confStr"
            rules={[{ required: true }]}
          >
            <TextArea rows={24} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item>
            <Button type="primary" onClick={formatData}>
              转换
            </Button>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="转换结果" name="formatData">
            <TextArea rows={24} autoSize readOnly />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
export default StrFormat;
