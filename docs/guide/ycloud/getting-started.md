---
title: 快速开始 - YCloud
description: 本指南会帮助你在 Vanilla JavaScript 项目中开始使用 YCloud Icons。
---

<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { reactSidebar } from '../../.vitepress/sidebar/react'
</script>

# 快速开始

本指南会帮助你在 Vanilla JavaScript 项目中开始使用 YCloud Icons。
请先确保你已经准备好项目环境。如果还没有，可以使用 Vite、Parcel 或其他你熟悉的脚手架创建一个新项目。

## 安装

### 包管理器

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons
```

```sh [yarn]
yarn add @ycloud-web/icons
```

```sh [npm]
npm install @ycloud-web/icons
```

```sh [bun]
bun add @ycloud-web/icons
```

:::

## 导入第一个图标

YCloud Icons 基于 ES Modules 构建，因此可以完整支持 tree-shaking。

The `createIcons` function will search for HTMLElements with the attribute `data-ycloud` and replace it with the svg from the given icon name.

### 示例

```html
<!-- Your HTML file -->
<i data-ycloud="menu"></i>
```

```js
import { createIcons, icons } from '@ycloud-web/icons';

// Caution, this will import all the icons and bundle them.
createIcons({ icons });

// Recommended way, to include only the icons you need.
import { createIcons, Menu, ArrowRight, Globe } from '@ycloud-web/icons';

createIcons({
  icons: {
    Menu,
    ArrowRight,
    Globe,
  },
});
```

## Advanced Usage

### Additional Options

In the `createIcons` function you can pass some extra parameters:

- you can pass `nameAttr` to adjust the attribute name to replace icons (default is `data-ycloud`).
- you can pass `attrs` to pass additional custom attributes, for instance CSS classes or stroke options.
- you can pass `root` to provide a custom DOM element the icons should be replaced in (useful when manipulating small sections of a large DOM or elements in the shadow DOM)
- you can pass `inTemplates: true` to also replace icons inside `<template>` tags.

Here is a full example:

```js
import { createIcons } from '@ycloud-web/icons';

createIcons({
  attrs: {
    class: ['my-custom-class', 'icon'],
    'stroke-width': 1,
    stroke: '#333',
  },
  nameAttr: 'data-ycloud', // attribute for the icon name.
  root: element, // DOM element to replace icons in.
  inTemplates: true, // Also replace icons inside <template> tags.
});
```
