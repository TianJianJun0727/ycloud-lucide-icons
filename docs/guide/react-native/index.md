---
title: React Native 版 YCloud Icons
description: YCloud Icons 提供 React Native 图标组件库，方便你将图标集成到 React Native 应用中。每个图标都是独立 React Native 组件，便于集成和自定义。
nextPage:
  - getting-started
---

<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { reactNativeSidebar } from '../../.vitepress/sidebar/react-native'
</script>

<!--@include: ../../../docs/images/package-logos/ycloud-react-native.svg -->

# React Native 版 YCloud Icons

在 React Native 应用中使用 YCloud Icons 时，每个图标都是一个独立 React Native 组件，方便按需引入、渲染和定制。

功能列表：

- **易于使用**：按需导入图标，并直接在 JSX 中渲染。
- **可定制**：通过 props 控制尺寸、颜色、描边宽度等属性。
- **支持 Tree-shaking**：最终产物只包含你实际导入的图标。
- **TypeScript 支持**：完整类型定义带来更好的开发体验。

## 概览

<OverviewLinkGrid>
  <OverviewLink v-for="item in reactNativeSidebar[0].items.slice(1)" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### 基础

{{''}}

<OverviewLinkGrid>
  <OverviewLink
    v-for="item in reactNativeSidebar[1].items"
    :key="item.link"
    :href="item.link"
    :title="item.text"
    :desc="item.desc"
  />
</OverviewLinkGrid>

### 进阶

{{''}}

<OverviewLinkGrid>
  <OverviewLink
    v-for="item in reactNativeSidebar[2].items"
    :key="item.link"
    :href="item.link"
    :title="item.text"
    :desc="item.desc"
  />
</OverviewLinkGrid>
