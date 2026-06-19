---
title: 静态资源概览
nextPage:
  - getting-started
---

<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { ycloudStaticSidebar } from '../../.vitepress/sidebar/static'
</script>

<!--@include: ../../../docs/images/package-logos/ycloud.svg -->

# YCloud Icons 静态资源

YCloud Icons 的静态资源和工具不依赖 JavaScript 框架即可使用。这个包提供多种格式，包括独立 SVG 文件、SVG Sprite、Icon Font，以及用于服务端渲染和静态站点生成的 Node.js 工具。

**你可以完成：**

- 将独立 SVG 文件作为图片或 CSS 背景图使用。
- 为基于 CSS 的图标系统实现 Icon Font。
- 创建 SVG Sprite，在静态站点中高效加载图标。
- 在 Node.js 应用和服务端渲染中导入 SVG 字符串。
- 构建不依赖 JavaScript 框架的静态网站和应用。

这个包包含以下 YCloud Icons 实现：

- 独立 SVG 文件
- SVG Sprite
- Icon Font 文件
- 导出 SVG 字符串的 JavaScript 库

## 概览

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudStaticSidebar[0].items.slice(1)" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### SVG 文件和 Sprite

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudStaticSidebar[1].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid >

### Icon Font

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudStaticSidebar[2].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid >

### JavaScript 模块

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudStaticSidebar[3].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid >

### 进阶

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudStaticSidebar[4].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid >
