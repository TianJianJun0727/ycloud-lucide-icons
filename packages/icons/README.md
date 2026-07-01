<p align="center">
  <a href="https://github.com/TianJianJun0727/ycloud-icons">
    <img src="https://tianjianjun0727.github.io/ycloud-icons/package-logos/ycloud.svg" alt="YCloud Icons Web 图标库。" width="540">
  </a>
</p>

<p align="center">
语言：中文 | <a href="./README.en.md">English</a>
</p>

<p align="center">
面向 Web 和 JavaScript 应用的 YCloud Icons 图标库。
</p>

<div align="center">

[![npm](https://img.shields.io/npm/v/@ycloud-web/icons?color=blue)](https://www.npmjs.com/package/@ycloud-web/icons)
![NPM Downloads](https://img.shields.io/npm/dw/@ycloud-web/icons)
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

# @ycloud-web/icons

面向 Web 和 JavaScript 应用的 YCloud Icons 核心包。

## 安装

```sh
pnpm add @ycloud-web/icons@latest
```

```sh
npm install @ycloud-web/icons@latest
```

```sh
yarn add @ycloud-web/icons@latest
```

```sh
bun add @ycloud-web/icons@latest
```

### 版本要求

无框架 peer dependency。

### CDN

```html
<!-- 开发版本 -->
<script src="https://unpkg.com/@ycloud-web/icons@latest/dist/umd/icons.js"></script>

<!-- 生产版本 -->
<script src="https://unpkg.com/@ycloud-web/icons@latest"></script>
```

CDN 方式会暴露全局变量 `ycloud`：

```html
<i data-ycloud="menu"></i>

<script>
  ycloud.createIcons();
</script>
```

## 文档

完整文档见 [tianjianjun0727.github.io/ycloud-icons](https://tianjianjun0727.github.io/ycloud-icons/guide/ycloud)。

## 许可证

YCloud Icons 基于 [Lucide](https://github.com/lucide-icons/lucide) 二次开发，保留上游 ISC 许可证与必要的第三方授权说明。本包在此基础上提供面向 Web 和 JavaScript 应用的核心运行时。

YCloud Icons 基于 ISC 许可证发布。详见 [LICENSE](https://tianjianjun0727.github.io/ycloud-icons/license)。
