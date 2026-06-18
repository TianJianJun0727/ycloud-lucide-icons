---
title: Vanilla JavaScript 版 YCloud Icons
description: 面向 Vanilla JavaScript 应用的 YCloud Icons 核心包。了解如何在不依赖框架的情况下，为任意 Web 项目添加可缩放矢量图标。
nextPage:
  - getting-started
---

<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { ycloudSidebar } from '../../.vitepress/sidebar/ycloud'
</script>

<!--@include: ../../../docs/images/package-logos/ycloud.svg -->

# Vanilla JavaScript 版 YCloud Icons

面向 Vanilla JavaScript 应用的 YCloud Icons 核心包。这个包可以让你在不依赖框架的情况下，轻松为任意 Web 项目添加可缩放矢量图标。它适合静态网站、旧项目，或需要轻量图标集成并保持最大浏览器兼容性的场景。

**你可以完成：**

- 使用简单的 data 属性将图标添加到 HTML。
- 使用 JavaScript 动态创建并插入 SVG 图标。
- 通过 CSS class 和内联样式自定义图标外观。
- Tree-shake 未使用图标，保持最小包体积。
- 在 Vanilla JS 和 HTML 中使用图标。

YCloud Icons 的设计目标是轻量且易用，适合那些需要图标但不想引入完整框架集成成本的项目。

## 概览

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudSidebar[0].items.slice(1)" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### 基础

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudSidebar[1].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### 进阶

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudSidebar[2].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>
