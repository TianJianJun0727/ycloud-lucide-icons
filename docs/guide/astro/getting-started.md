---
title: 快速开始 - Astro
description: 本指南会帮助你在 Astro 项目中开始使用 YCloud Icons。
---

<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { astroSidebar } from '../../.vitepress/sidebar/astro'
</script>

# 快速开始

本指南会帮助你在 Astro 项目中开始使用 YCloud Icons。
请先确保你已经准备好 Astro 开发环境。如果还没有，可以使用 Vite 或其他你熟悉的 Astro 脚手架创建一个新项目。

## 版本要求

`@ycloud-web/icons-astro` 的最低版本要求：Astro `^4 || ^5 || ^6`。

## 安装

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-astro@latest
```

```sh [yarn]
yarn add @ycloud-web/icons-astro@latest
```

```sh [npm]
npm install @ycloud-web/icons-astro@latest
```

```sh [bun]
bun add @ycloud-web/icons-astro@latest
```

:::

## 导入第一个图标

YCloud Icons 基于 ES Modules 构建，因此可以完整支持 tree-shaking。

每个图标都可以作为 Astro 组件导入，并渲染为内联 SVG 元素。这样最终产物只会包含你实际导入的图标，其余图标会被 tree-shaking 移除。

```astro
---
import { Camera } from '@ycloud-web/icons-astro';
---

<Camera />
```

## 属性

你可以通过以下 props 调整图标外观：

| 名称                  | 类型      | 默认值       |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `stroke-width`        | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |
| `default-class`       | _string_  | ycloud-icon  |

由于图标最终会渲染为 SVG 元素，所有标准 SVG 属性也可以作为 props 传入。可参考 [MDN 上的 SVG Presentation Attributes 列表](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)。

```astro
---
import { Camera } from '@ycloud-web/icons-astro';
---

<Camera color="#ff3e98" size={48} stroke-width={1} />
```

继续阅读下面的内容，了解更多 props 用法和示例：

<OverviewLinkGrid>
  <OverviewLink v-for="item in astroSidebar[1].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>
