---
title: Astro 版 YCloud Icons
description: 了解如何在 Astro 应用中使用 YCloud Icons。
nextPage:
  - getting-started
---

<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { astroSidebar } from '../../.vitepress/sidebar/astro'
</script>

<!--@include: ../../../docs/images/package-logos/ycloud-astro.svg -->

# Astro 版 YCloud Icons

YCloud Icons 的 Astro 包可以配合 Astro 的岛屿架构和多框架能力使用。每个图标都是 Astro 组件，并渲染为内联 SVG，适合静态站点和服务端渲染场景。

功能列表：

- **易于使用**：按需导入图标组件，并直接在 Astro 应用中使用。
- **可定制**：通过 props 控制尺寸、颜色等属性。
- **支持 Tree-shaking**：可与 Astro 的组件岛和部分水合机制自然集成。
- **TypeScript 支持**：完整类型定义带来更好的开发体验。

## 概览

<OverviewLinkGrid>
  <OverviewLink v-for="item in astroSidebar[0].items.slice(1)" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### 基础

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in astroSidebar[1].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### 进阶

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in astroSidebar[2].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>
