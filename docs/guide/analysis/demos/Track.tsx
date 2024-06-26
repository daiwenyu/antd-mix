import { Button, Space } from 'antd';
import { Track } from 'antd-mix';
import React from 'react';

// App入口文件初始化
Track.init({
  appId: '112233',
  serverUrl: `${AnalysisServer}/pousheng-guard/api/analysis/track`,
  autoReportError: true,
});

export default () => {
  return (
    <Space>
      <Button
        onClick={() => {
          Track.setUserProfile({
            userId: '123321',
            userName: '张三',
          });
        }}
      >
        设置登录用户
      </Button>
      <Button
        onClick={() => {
          Track.eventLog({
            content: '查询用户信息',
            module: '用户管理',
          });
        }}
      >
        事件上报
      </Button>
      <Button
        danger
        onClick={() => {
          JSON.parse('{123}');
        }}
      >
        自动上报错误
      </Button>
    </Space>
  );
};
