import { Button, Space } from 'antd';
import { CurrentUser, Track } from 'antd-mix';
import React, { useEffect } from 'react';

export default () => {
  async function init() {
    await CurrentUser.init({
      menuNameMap: {
        'menu.guide': '分析',
        'menu.guide.analysis': '用户分析',
      },
      routes: [
        {
          access: 'guide',
          name: 'guide',
          path: '/guide',
          routes: [
            {
              name: 'analysis',
              access: 'guide_analysis',
              path: '/guide/analysis',
            },
          ],
        },
      ],
    });

    await Track.init({
      appId: '112233',
      serverUrl: `${AnalysisServer}/pousheng-guard/api/analysis/track`,
      autoReportError: true,
    });
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Space>
      <Button
        onClick={() => {
          Track.visitLog();
        }}
      >
        自动执行上报
      </Button>
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
