<p align="center">
  <a href="https://github.com/TianJianJun0727/ycloud-icons">
    <img src="https://tianjianjun0727.github.io/ycloud-icons/package-logos/ycloud-static.svg" alt="面向 Web 应用的 YCloud Icons 静态资源包" width="540">
  </a>
</p>

<p align="center">
语言：中文 | <a href="./README.en.md">English</a>
</p>

<p align="center">
面向 Web 应用的 YCloud Icons 静态资源包。
</p>

<div align="center">

[![npm](https://img.shields.io/npm/v/@ycloud-web/icons-static?color=blue)](https://www.npmjs.com/package/@ycloud-web/icons-static)
![NPM Downloads](https://img.shields.io/npm/dw/@ycloud-web/icons-static)
[![License](https://img.shields.io/badge/license-ISC-green)](https://tianjianjun0727.github.io/ycloud-icons/license)

</div>

<p align="center">
  <a href="https://tianjianjun0727.github.io/ycloud-icons/guide/">介绍</a>
  ·
  <a href="https://tianjianjun0727.github.io/ycloud-icons/icons/">图标</a>
  ·
  <a href="https://tianjianjun0727.github.io/ycloud-icons/guide/static">文档</a>
  ·
  <a href="https://tianjianjun0727.github.io/ycloud-icons/license">许可证</a>
</p>

# YCloud Static

这个包包含以下 YCloud Icons 静态资源实现：

- 所有 SVG 文件
- 包含 SVG 字符串的 JavaScript 库
- Icon Font
- SVG sprite

> 想了解 YCloud Icons？请阅读[项目介绍](https://github.com/TianJianJun0727/ycloud-icons#ycloud-icons)。

## 为什么使用 @ycloud-web/icons-static？

这个包适合非常明确的静态资源场景，例如在 JavaScript 项目中使用 Icon Font、SVG sprite、普通 SVG 文件或 CommonJS SVG 字符串。

> [!WARNING]
> 除非你确实需要静态资源，否则不建议在生产 Web 应用中优先使用 SVG sprite 或 Icon Font。更推荐使用对应框架包，让构建工具可以 tree-shaking 未使用的图标：`@ycloud-web/icons`、`@ycloud-web/icons-react`、`@ycloud-web/icons-vue`、`@ycloud-web/icons-svelte`、`@ycloud-web/icons-solid`、`@ycloud-web/icons-preact`、`@ycloud-web/icons-react-native`、`@ycloud-web/icons-angular` 和 `@ycloud-web/icons-astro`。

## 安装

```sh
pnpm add @ycloud-web/icons-static@latest
```

```sh
npm install @ycloud-web/icons-static@latest
```

```sh
yarn add @ycloud-web/icons-static@latest
```

```sh
bun add @ycloud-web/icons-static@latest
```

### 版本要求

无框架 peer dependency。

## 文档

完整文档请访问 [YCloud Icons 文档](https://tianjianjun0727.github.io/ycloud-icons/guide/static)。

## 许可证

YCloud Icons 基于 [Lucide](https://github.com/lucide-icons/lucide) 二次开发，保留上游 ISC 许可证与必要的第三方授权说明。本包在此基础上提供独立 SVG、SVG Sprite、Icon Font 和 SVG 字符串等静态资源。

YCloud Icons 使用 ISC 许可证发布。详见 [LICENSE](https://tianjianjun0727.github.io/ycloud-icons/license)。
