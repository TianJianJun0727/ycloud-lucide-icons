<p align="center">
  <a href="https://github.com/TianJianJun0727/ycloud-icons">
    <img src="https://tianjianjun0727.github.io/ycloud-icons/package-logos/icons.svg" alt="" width="540">
  </a>
</p>

<p align="center">
语言：中文 | [English](./README.en.md)
</p>

<p align="center">
导出 YCloud Icons 图标数据的辅助库。
</p>

<div align="center">
  [![npm](https://img.shields.io/npm/v/@ycloud-web/icons-data?color=blue)](https://www.npmjs.com/package/@ycloud-web/icons-data)
  ![NPM Downloads](https://img.shields.io/npm/dw/@ycloud-web/icons-data)
  [![License](https://img.shields.io/badge/license-ISC-green)](https://tianjianjun0727.github.io/ycloud-icons/license)
</div>

<p align="center">
  <a href="https://tianjianjun0727.github.io/ycloud-icons/guide/">介绍</a>
  ·
  <a href="https://tianjianjun0727.github.io/ycloud-icons/icons/">图标</a>
  ·
  <a href="https://tianjianjun0727.github.io/ycloud-icons/guide/ycloud">文档</a>
  ·
  <a href="https://tianjianjun0727.github.io/ycloud-icons/license">许可证</a>
</p>

# @ycloud-web/icons-data

以支持 tree-shaking 的格式导出 YCloud Icons 图标数据，并提供动态图标导入相关工具函数。

## 安装

```sh
pnpm add @ycloud-web/icons-data@latest
```

```sh
npm install @ycloud-web/icons-data@latest
```

```sh
yarn add @ycloud-web/icons-data@latest
```

```sh
bun add @ycloud-web/icons-data@latest
```

### 版本要求

无框架 peer dependency。

### 用法

```ts
import { House } from '@ycloud-web/icons-data';
import { buildYCloudSvg } from '@ycloud-web/icons-data/build';

const houseSvg = buildYCloudSvg(House, {
  size: 24,
  color: '#111827',
});
```

## 文档

完整文档请访问 [YCloud Icons 文档](https://tianjianjun0727.github.io/ycloud-icons/guide/ycloud)。

## 许可证

YCloud Icons 基于 [Lucide](https://github.com/lucide-icons/lucide) 二次开发，保留上游 ISC 许可证与必要的第三方授权说明。本包在此基础上提供图标数据和动态图标导入相关工具函数。

YCloud Icons 使用 ISC 许可证发布。详见 [LICENSE](https://tianjianjun0727.github.io/ycloud-icons/license)。
