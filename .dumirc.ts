import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  // alias: {
  //   'antd-mix': path.resolve(__dirname, 'src'),
  // },
  themeConfig: {
    name: 'antd-mix',
    footer: `
    <div>
      <a href="https://beian.miit.gov.cn/" target="_blank">滇ICP备16002561号-1</a>
    </div>
    `,
  },
  headScripts: [
    `
    window._AMapSecurityConfig = {
      securityJsCode: "652916bc497d99765f1416faa6a3379e",
    };
    `,
  ],
});
