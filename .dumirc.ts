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
  scripts: [
    `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "mihjfy3yk6");
    `,
  ],
  define: {
    AnalysisServer:
      process.env.NODE_ENV === 'production'
        ? 'https://venus.gooccby.com'
        : 'http://localhost:3000',
  },
});
