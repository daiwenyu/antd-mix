---
title: AvatarUpload 头像上传组件
group:
  title: 数据录入
  order: 1
---

# AvatarUpload

头像上传组件

## 基础使用

<code src="./demo/index.tsx"></code>

<!--
<code src="./demo/index.tsx"></code>

<code src="./demo/index.tsx"></code>

<code src="./demo/index.tsx"></code> -->

## API

| 参数         | 说明                                 | 类型             | 默认值 | 版本 |
| ------------ | ------------------------------------ | ---------------- | ------ | ---- |
| uploadProps  | Upload 组件属性                      |                  |        |      |
| imgCropProps | ImgCrop 组件属性                     |                  |        |      |
| response     | 处理服务端返回数据，应该返回图片地址 | (res) => string  |        |      |
| onChange     | 图片上传修改时触发                   | (imgUrl) => void |        |      |
| size         | 图片大小上限                         | number           |        |      |
