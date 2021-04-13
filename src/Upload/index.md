## Upload

Demo:

```tsx
import React from 'react';
import { Upload } from 'ant-nest';

export default () => (
  <Upload
    uploadProps={{
      disabled: true,
    }}
  />
);
```

### API

| 参数         | 说明                                                        | 类型   | 默认值 | 版本 |
| :----------- | :---------------------------------------------------------- | :----- | :----- | :--- |
| uploadProps  | [Upload 参数](https://ant.design/components/upload-cn/#API) | object |        |      |
| imgCropProps | [ImgCrop 参数](https://www.npmjs.com/package/antd-img-crop) | object |        |      |
