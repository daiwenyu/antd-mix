import { Button } from 'antd';
import { Analysis } from 'antd-mix';
import React from 'react';

const { Track } = Analysis;

Track.init({
  serverUrl: 'http://localhost:3000/analysis/track',
  debug: true,
  autoReportError: true,
});

export default () => {
  return (
    <Button
      onClick={() => {
        // JSON.parse('{"a": 1}123');
        Track.push({ type: 'click', a: 2 });
      }}
    >
      点击
    </Button>
  );
};
