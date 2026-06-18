---
title: YCloud Icons 是什么？
description: YCloud Icons 是面向多框架项目的 SVG 图标工具链。
---

# YCloud Icons 是什么？

YCloud Icons 是一套多框架 SVG 图标工具链。它从同一份图标源生成可 Tree-shaking 的图标数据、强类型 React 组件、Vue 组件，以及其他常见前端运行时的包。

## 图标源

当前阶段提供基础 outline 图标集和包工程能力。filled 等风格会在转换质量可靠后由规范化 SVG 源自动生成；不可靠的图标可以保留显式覆盖。

## 按需加载

图标包以 ES Module 形式输出。业务项目只导入实际使用的图标，未使用图标会被打包工具 Tree-shaking 掉。

## 支持的 10 类包

YCloud Icons 按 Lucide 官方覆盖范围支持 10 类包/用法：

- Core JavaScript: `@ycloud-web/icons`
- React: `@ycloud-web/icons-react`
- Vue: `@ycloud-web/icons-vue`
- Svelte: `@ycloud-web/icons-svelte`
- Solid: `@ycloud-web/icons-solid`
- Preact: `@ycloud-web/icons-preact`
- React Native: `@ycloud-web/icons-react-native`
- Angular: `@ycloud-web/icons-angular`
- Astro: `@ycloud-web/icons-astro`
- Static assets: `@ycloud-web/icons-static`

继续阅读：[安装指南](./installation.md)。
