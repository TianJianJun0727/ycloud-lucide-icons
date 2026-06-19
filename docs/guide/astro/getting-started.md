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

## 安装

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-astro
```

```sh [yarn]
yarn add @ycloud-web/icons-astro
```

```sh [npm]
npm install @ycloud-web/icons-astro
```

```sh [bun]
bun add @ycloud-web/icons-astro
```

:::

## 导入第一个图标

YCloud Icons 基于 ES Modules 构建，因此可以完整支持 tree-shaking。

Each icon can be imported as an Astro component, which renders an inline SVG element. This way, only the icons that are imported into your project are included in the final bundle. The rest of the icons are tree-shaken away.

```astro
---
import { Camera } from '@ycloud-web/icons-astro';
---

<Camera />
```

## Props

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
