---
title: Angular 版 YCloud Icons
description: 一个独立的、基于 signal、无需 zone 的实现，方便你将图标集成到 Angular 项目中。
nextPage:
  - getting-started
---

<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { angularSidebar } from '../../.vitepress/sidebar/angular'
</script>

<!--@include: ../../../docs/images/package-logos/ycloud-angular.svg -->

# Angular 版 YCloud Icons

YCloud Icons 的 Angular 包采用独立组件形态，基于 signal 且不依赖 zone，适合直接集成到 Angular 项目中。

功能列表：

- **易于使用**：以独立 Angular 组件的方式使用图标，并支持依赖注入。
- **可定制**：通过 inputs 或 Angular provider 全局控制尺寸、颜色等属性。
- **支持 Tree-shaking**：最终产物只包含你实际使用的图标。
- **TypeScript 支持**：完整类型定义带来更好的开发体验。

## 概览

<OverviewLinkGrid>
  <OverviewLink v-for="item in angularSidebar[0].items.slice(1)" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### 基础

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in angularSidebar[1].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### 进阶

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in angularSidebar[2].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>
