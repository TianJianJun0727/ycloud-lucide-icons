---
title: 什么是 YCloud Icons？
description: 了解 YCloud Icons：面向 React、Vue 以及其他前端技术栈的多框架 SVG 图标工具集。
nextPage:
  - installation
---

# 什么是 YCloud Icons？

YCloud Icons 是一个多框架 SVG 图标工具集。它基于同一份图标源，提供可 Tree-shaking 的图标数据、强类型 React 组件、Vue 组件，以及面向常见前端运行时的包。

## 可用图标

YCloud Icons 当前提供基础 outline 图标集和多框架包基础设施。filled 等风格变体属于后续路线，应在转换足够可靠后从标准化 SVG 源自动生成。

### 完整图标集

图标源保存在仓库中，并由构建流水线进行标准化处理。各框架包消费生成后的图标数据和组件，从而保持一致。

## 代码优化

除了设计，代码体积同样重要。图标这类资源可能显著增加 Web 项目的带宽和包体积。YCloud Icons 使用 SVG 优化和 ES Module 入口；经过 Tree-shaking 后，应用只会携带实际导入的图标。

## 无障碍

图标可以在不依赖文字的情况下传达含义，帮助用户快速理解界面信息。

但并不是所有用户都能轻松理解图标。更多说明请阅读[如何以无障碍方式使用 YCloud Icons](./accessibility.md)。

## 官方包

YCloud Icons 覆盖 10 种包类型：[Core JavaScript](./ycloud/index.md)、[React](./react/index.md)、[Vue](./vue/index.md)、[Svelte](./svelte/index.md)、[Solid](./solid/index.md)、[Preact](./preact/index.md)、[React Native](./react-native/index.md)、[Angular](./angular/index.md)、[Astro](./astro/index.md) 和 [Static assets](./static/index.md)。
