import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  outputPath: 'docs-dist',
  alias: {
    'antd-mix': path.resolve(__dirname, 'src'),
  },
  themeConfig: {
    name: 'antd-mix',
    footer: false,
  },
  headScripts: [
    `
    window._AMapSecurityConfig = {
      securityJsCode: "652916bc497d99765f1416faa6a3379e",
    };
    `,
  ],
});
