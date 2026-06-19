---
title: 快速开始 - Solid
description: 本指南会帮助你在 Solid 项目中开始使用 YCloud Icons。
---

<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { solidSidebar } from '../../.vitepress/sidebar/solid'
</script>

# 快速开始

本指南会帮助你在 Solid 项目中开始使用 YCloud Icons。
请确保已经准备好 Solid 开发环境。如果还没有，可以使用 Create Solid App、Vite 或其他你偏好的 Solid 脚手架创建新项目。

## 安装

::: code-group

```sh [pnpm]
pnpm add @ycloud-web/icons-solid
```

```sh [yarn]
yarn add @ycloud-web/icons-solid
```

```sh [npm]
npm install @ycloud-web/icons-solid
```

```sh [bun]
bun add @ycloud-web/icons-solid
```

:::

## 导入第一个图标

YCloud Icons 基于 ES Modules 构建，因此可以完整支持 tree-shaking。

每个图标都可以作为 Solid component 导入，并渲染为内联 SVG 元素。这样最终产物只会包含你实际导入的图标，其余未使用的图标会被构建工具移除。

```jsx
import { Camera } from '@ycloud-web/icons-solid';

// 使用
const App = () => {
  return <Camera />;
};

export default App;
```

## Props

你可以通过以下 props 调整图标外观：

| 名称                  | 类型      | 默认值       |
| --------------------- | --------- | ------------ |
| `size`                | _number_  | 24           |
| `color`               | _string_  | currentColor |
| `strokeWidth`         | _number_  | 2            |
| `absoluteStrokeWidth` | _boolean_ | false        |

由于图标最终会渲染为 SVG 元素，所有标准 SVG 属性也可以作为 props 传入。可参考 [MDN 上的 SVG Presentation Attributes 列表](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)。

```jsx
// 使用
const App = () => {
  return (
    <Camera
      size={48}
      color="red"
      strokeWidth={1}
    />
  );
};
```

继续阅读下面的内容，了解更多 props 用法和示例：

<OverviewLinkGrid>
  <OverviewLink v-for="item in solidSidebar[1].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>
