---
title: React 版 YCloud Icons
description: YCloud Icons 提供 React 图标组件库。每个图标都是独立 React 组件，支持 Tree-shaking 和 TypeScript 自动补全。
nextPage:
  - getting-started
---

<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { reactSidebar } from '../../.vitepress/sidebar/react'
</script>

<!--@include: ../../../docs/images/package-logos/ycloud-react.svg -->

# React 版 YCloud Icons

在 React 应用中使用 YCloud Icons 时，每个图标都是一个独立组件，并会渲染为优化后的内联 SVG。

功能列表：

- **易于使用**：按需导入图标，并直接在 JSX 中渲染。
- **可定制**：通过 props 控制尺寸、颜色、描边宽度等属性。
- **支持 Tree-shaking**：最终产物只包含你实际导入的图标。
- **TypeScript 支持**：完整类型定义带来更好的开发体验。
- **样式入口**：组件名保持稳定，样式变体通过不同包入口区分。

## 概览

<OverviewLinkGrid>
  <OverviewLink v-for="item in reactSidebar[0].items.slice(1)" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### 基础

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in reactSidebar[1].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### 进阶

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in reactSidebar[2].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>
