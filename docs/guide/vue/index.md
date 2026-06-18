---
title: Vue 版 YCloud Icons
description: YCloud Icons 提供 Vue 图标组件库。每个图标都是独立 Vue 组件，支持 Tree-shaking 和 TypeScript 自动补全。
nextPage:
  - getting-started
---

<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { vueSidebar } from '../../.vitepress/sidebar/vue'
</script>

<!--@include: ../../../docs/images/package-logos/ycloud-vue.svg -->

# Vue 版 YCloud Icons

在 Vue 应用中使用 YCloud Icons 时，每个图标都是一个独立 Vue 组件，方便按需引入、渲染和定制。

功能列表：

- **易于使用**：按需导入图标组件，并直接在 Vue 模板或 JSX 中使用。
- **可定制**：通过 props 控制尺寸、颜色等属性。
- **支持 Tree-shaking**：最终产物只包含你实际使用的图标。
- **TypeScript 支持**：完整类型定义带来更好的开发体验。
- **样式入口**：组件名保持稳定，样式变体通过不同包入口区分。

## 概览

<OverviewLinkGrid>
  <OverviewLink v-for="item in vueSidebar[0].items.slice(1)" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### 基础

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in vueSidebar[1].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### 进阶

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in vueSidebar[2].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>
