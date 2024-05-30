import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Space, Tooltip, Typography } from 'antd';
import { Analysis } from 'antd-mix';
import React from 'react';

const { Text } = Typography;
const { Track } = Analysis;

Track.init({
  serverUrl: `${GOOCCBY}/analysis/track`,
  debug: true,
  autoReportError: true,
});

export default () => {
  const columns: ProColumns[] = [
    {
      title: '设备序列号',
      dataIndex: ['systemProfile', 'IMEI'],
    },
    {
      title: '生成时间',
      dataIndex: ['systemProfile', 'time'],
      valueType: 'dateTime',
      align: 'center',
    },
    {
      title: '用户信息',
      dataIndex: ['userProfile', 'name'],
      align: 'center',
    },
    {
      title: '页面路径',
      dataIndex: ['systemProfile', 'href'],
      // align: 'center',
    },
    // {
    //   title: '是否为移动设备',
    //   dataIndex: ['systemProfile', 'isMobile'],
    //   align: 'center',
    //   render(dom, entity, index, action, schema) {
    //     return entity.systemProfile?.isMobile ? '是' : '否';
    //   },
    // },
    // {
    //   title: '设备平台',
    //   dataIndex: ['systemProfile', 'platform'],
    //   align: 'center',
    // },
    // {
    //   title: '设备型号',
    //   dataIndex: ['systemProfile', 'model'],
    //   align: 'center',
    // },
    // {
    //   title: 'IP',
    //   dataIndex: ['systemProfile', 'ip'],
    //   align: 'center',
    // },
    {
      title: '事件数据',
      dataIndex: 'eventProfile',
      render(dom, entity, index, action, schema) {
        return (
          <Tooltip title={JSON.stringify(entity.eventProfile)}>
            <Text style={{ width: 200 }} ellipsis>
              {JSON.stringify(entity.eventProfile)}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: '报错信息',
      dataIndex: 'errorProfile',
      render(dom, entity, index, action, schema) {
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
      title: 'UserAgent',
      dataIndex: ['systemProfile', 'userAgent'],
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
            // JSON.parse('{"a": 1}123');
            Track.push({ type: 'click', a: 2 });
          }}
        >
          事件上报
        </Button>
        <Button
          danger
          onClick={() => {
            JSON.parse('{"a": 1}123');
          }}
        >
          错误上报
        </Button>
      </Space>

      <ProTable
        rowKey="_id"
        columns={columns}
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
            data,
            total,
          };
        }}
      />
    </Space>
  );
};
