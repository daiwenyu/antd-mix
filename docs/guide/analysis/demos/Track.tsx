declare global {
  const GOOCCBY: string;
  interface Window {
    Guard: typeof Track;
  }
}

import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Space, Tooltip, Typography } from 'antd';
import { Analysis, Utils } from 'antd-mix';
import Bowser from 'bowser';
import React from 'react';

const { generateRandomString } = Utils;
const { Text } = Typography;
const { Track } = Analysis;
window.Guard = Track;
window.Guard.init({
  serverUrl: `${GOOCCBY}/analysis/track`,
  debug: true,
  autoReportError: true,
});

export default () => {
  const columns: ProColumns[] = [
    {
      title: '设备序列号',
      dataIndex: ['systemProfile', 'IMEI'],
      fixed: 'left',
      width: 160,
    },
    {
      title: '生成时间',
      dataIndex: ['systemProfile', 'time'],
      valueType: 'dateTime',
      align: 'center',
      fixed: 'left',
      width: 170,
    },
    {
      title: '账号',
      dataIndex: ['userProfile', 'id'],
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: ['userProfile', 'userName'],
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: ['userProfile', 'email'],
      align: 'center',
    },
    {
      title: '页面路径',
      dataIndex: ['systemProfile', 'href'],
    },
    {
      title: '事件类型',
      dataIndex: ['eventProfile', 'type'],
      align: 'center',
      valueEnum: {
        click: '点击',
        view: '浏览',
      },
    },
    {
      title: '事件数据',
      dataIndex: 'eventProfile',
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        if (!entity.eventProfile) {
          return '-';
        }
        const { type, ...rest } = entity?.eventProfile || {};
        return JSON.stringify(rest);
      },
    },
    {
      title: '报错信息',
      dataIndex: 'errorProfile',
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        if (!entity.errorProfile) {
          return '-';
        }
        return (
          <Tooltip title={JSON.stringify(entity.errorProfile)}>
            <Text style={{ width: 200 }} ellipsis>
              {JSON.stringify(entity.errorProfile)}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: '浏览器信息',
      dataIndex: ['systemProfile', 'browser'],
      align: 'center',
    },
    {
      title: '设备平台',
      dataIndex: ['systemProfile', 'platform'],
    },
    {
      title: '设备系统',
      dataIndex: ['systemProfile', 'os'],
    },
    {
      title: 'UserAgent',
      dataIndex: ['systemProfile', 'userAgent'],
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <Tooltip title={entity.systemProfile.userAgent}>
            <Text style={{ width: 200 }} ellipsis>
              {entity.systemProfile.userAgent}
            </Text>
          </Tooltip>
        );
      },
    },
  ];
  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <Space>
        <Button
          onClick={() => {
            window.Guard.setUserProfile({
              id: '123321',
              userName: '张三',
              email: 'dwy@qq.com',
            });
          }}
        >
          设置登录用户
        </Button>
        <Button
          onClick={() => {
            const data: any = {};
            for (let i = 0; i < Math.ceil(Math.random() * 3); i++) {
              data[generateRandomString(Math.ceil(Math.random() * 8))] =
                generateRandomString(Math.random() * 8);
            }
            window.Guard.push({
              type: 'click',
              ...data,
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

      <ProTable
        rowKey="_id"
        bordered
        columns={columns}
        size="small"
        scroll={{ x: 'max-content' }}
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        request={async (params) => {
          const res = await fetch(
            `${GOOCCBY}/analysis/getAll?${new URLSearchParams(params)}`,
          );
          const { data = [], total = 0 } = (await res.json()) || {};
          return {
            success: true,
            data: data.map((item: any) => {
              const browserInfo = Bowser.parse(item.systemProfile.userAgent);
              return {
                ...item,
                systemProfile: {
                  ...item.systemProfile,
                  os: JSON.stringify(browserInfo.os),
                  browser: JSON.stringify(browserInfo.browser),
                  platform: JSON.stringify(browserInfo.platform),
                },
              };
            }),
            total,
          };
        }}
      />
    </Space>
  );
};
