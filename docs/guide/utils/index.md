---
title: Utils 工具类
group:
  title: 工具函数集合
  order: 2
---

# Utils

工具类

## 代码演示

### 判断是否为微信环境

```ts
import { Utils } from 'antd-mix';

const { isWechat } = Utils;
console.log(isWechat); //当前环境是否为微信环境
```

### 引入微信 JS-SDK

```ts
import { Utils } from 'antd-mix';

async function addWxSDK() {
  await Utils.wxSDK({
    version: '1.6.0',
    debug: false,
    appId: '123',
    timestamp: '123',
    nonceStr: '123',
    signature: '123',
    jsApiList: '123',
  });
}
```

## API

| 属性         | 说明                   | 类型                 | 默认值 | 版本 |
| :----------- | :--------------------- | :------------------- | :----- | :--- |
| isWechat     | 判断当前是否为微信环境 | boolean              |        |      |
| wxSDK        | 加载微信 JS-SDK        | (option)=>Promise    |        |      |
| downloadFile | 下载文件               | (href: string)=>void |        |      |


<code src="./demos/utils.tsx" only></code>
