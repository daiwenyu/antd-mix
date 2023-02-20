import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  outputPath: 'docs-dist',
  alias: {
    'antd-mix': path.resolve(__dirname, 'src'),
  },
});
