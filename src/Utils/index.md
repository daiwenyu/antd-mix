## Utils

工具类

### 代码演示

```tsx
/**
 * title: 判断是否为微信环境
 *
 */

import React from 'react';
import { Utils } from 'ant-nest';

export default () => <div>当前{Utils.isWechat ? '是' : '不是'}微信环境</div>;
```

### API

| 属性     | 说明                   | 类型    | 默认值 | 版本 |
| :------- | :--------------------- | :------ | :----- | :--- |
| isWechat | 判断当前是否为微信环境 | boolean |        |      |
