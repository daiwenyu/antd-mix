import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'antd-mix',
    footer: `
    <div>
      <a href="https://beian.miit.gov.cn/" target="_blank">滇ICP备16002561号-1</a>
    </div>
    `,
  },
});
