---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
markdownStyles: false
title: YCloud Icons
titleTemplate: false

head:
  - - link
    - rel: canonical
      content: https://tianjianjun0727.github.io/ycloud-icons/

hero:
  name: |
    YCloud Icons
  text: 多框架 SVG 图标基础设施
  tagline: 基于同一份图标源，提供强类型 React 组件、Vue 与多框架包、静态资源以及可 Tree-shaking 的图标数据。
  image:
    src: /favicon.svg
    alt: YCloud Icons
  actions:
    - theme: brand
      text: 浏览图标
      link: icons/
    - theme: alt
      text: 快速开始
      link: guide/
    - theme: alt
      text: GitHub
      link: https://github.com/TianJianJun0727/ycloud-icons

features:
  - title: 轻量高效
    details: 图标以优化后的 SVG 形式交付，按需引入、按需打包，适合在不同规模的前端项目中复用。
    icon: |
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F56565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ycloud ycloud-expand"><path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"></path><path d="M3 16.2V21m0 0h4.8M3 21l6-6"></path><path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"></path><path d="M3 7.8V3m0 0h4.8M3 3l6 6"></path></svg>
  - title: 清晰一致
    details: 遵循统一的设计约束，保证图标风格、可读性和使用体验稳定一致。
    icon: |
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F56565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ycloud ycloud-aperture"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" x2="20.05" y1="8" y2="17.94"></line><line x1="9.69" x2="21.17" y1="8" y2="8"></line><line x1="7.38" x2="13.12" y1="12" y2="2.06"></line><line x1="9.69" x2="3.95" y1="16" y2="6.06"></line><line x1="14.31" x2="2.83" y1="16" y2="16"></line><line x1="16.62" x2="10.88" y1="12" y2="21.94"></line></svg>
  - title: 可定制
    details: 支持通过属性或 CSS 调整颜色、尺寸、描边宽度等外观。
    icon: |
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F56565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ycloud ycloud-palette"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>
  - title: 多框架包
    details: React、Vue、Svelte、Solid、Preact、React Native、Angular、Astro 与静态资源都来自同一份图标源。
    icon: |
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F56565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ycloud ycloud-package-check"><path d="m16 16 2 2 4-4"></path><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path><path d="M16.5 9.4 7.55 4.24"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" x2="12" y1="22" y2="12"></line></svg>
  - title: 支持 Tree-shaking
    details: 应用只会打包实际导入的图标，避免未使用图标进入最终产物。
    icon: |
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F56565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ycloud ycloud-tree-deciduous"><path d="M8 19h8a4 4 0 0 0 3.8-2.8 4 4 0 0 0-1.6-4.5c1-1.1 1-2.7.4-4-.7-1.2-2.2-2-3.6-1.7a3 3 0 0 0-3-3 3 3 0 0 0-3 3c-1.4-.2-2.9.5-3.6 1.7-.7 1.3-.5 2.9.4 4a4 4 0 0 0-1.6 4.5A4 4 0 0 0 8 19Z"></path><path d="M12 19v3"></path></svg>
  - title: 公有或私有发布
    details: 仓库支持 npm Trusted Publishing，后续也可以平滑切换到内部 npm 仓库。
    icon: |
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F56565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ycloud ycloud-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
---

<script setup>
import HomePackagesSection from './.vitepress/theme/components/home/HomePackagesSection.vue'
import HomeIconCustomizer from './.vitepress/theme/components/home/HomeIconCustomizer.vue'
</script>

<HomePackagesSection />
<HomeIconCustomizer />
