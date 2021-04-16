# Upload

## 代码演示

```tsx
/**
 * title: 基础使用
 *
 */

import React from 'react';
import { Upload } from 'ant-nest';

export default () => (
  <Upload
    uploadProps={{
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      listType: 'picture-card',
      maxCount: 1,
    }}
    imgCropProps={{
      rotate: true,
    }}
  />
);
```

```tsx
/**
 * title: 不使用剪裁框
 *
 */

import React from 'react';
import { Upload } from 'ant-nest';

export default () => (
  <Upload
    uploadProps={{
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      listType: 'picture-card',
      maxCount: 1,
      accept: 'image/png',
    }}
    imgCropProps={false}
  />
);
```

```tsx
/**
 * title: 设置图片大小限制
 * desc: 设置图片上限300kb
 */

import React from 'react';
import { Upload } from 'ant-nest';

export default () => (
  <Upload
    size={300}
    uploadProps={{
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      listType: 'picture-card',
      maxCount: 1,
    }}
    imgCropProps={{
      rotate: true,
    }}
  />
);
```

<code src="./demo/form-upload.tsx"></code>

## API

| 参数         | 说明                                                                                   | 类型               | 默认值 | 版本 |
| :----------- | :------------------------------------------------------------------------------------- | :----------------- | :----- | :--- |
| uploadProps  | [Upload 参数](https://ant.design/components/upload-cn/#API)                            | object             |        |      |
| imgCropProps | [ImgCrop 参数](https://www.npmjs.com/package/antd-img-crop)，设置 false 时关闭剪切功能 | object \| false    |        |      |
| size         | 图片大小（单位：kb）                                                                   | number             | -      |      |
| value        | 设置已上传的图片                                                                       | UploadFile         | -      |      |
| onChange     | 上传文件列表发生变化时触发                                                             |                    |        |      |
| response     | 处理上传接口返回的结果，需返回图片连接字符串                                           | (result) => string |        |      |
