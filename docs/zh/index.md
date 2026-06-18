---
layout: home
markdownStyles: false
title: YCloud Icons
titleTemplate: false

head:
  - - link
    - rel: canonical
      content: https://tianjianjun0727.github.io/ycloud-icons/zh/

hero:
  name: |
    YCloud Icons
  text: 多框架 SVG 图标基础设施
  tagline: 一套图标源同时输出 React、Vue、多框架组件、静态资源和可 Tree-shaking 的图标数据。
  image:
    src: /favicon.svg
    alt: YCloud Icons
  actions:
    - theme: brand
      text: 浏览图标
      link: /icons/
    - theme: alt
      text: 快速开始
      link: /zh/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/TianJianJun0727/ycloud-icons

features:
  - title: 组件化体验
    details: React、Vue 等框架都以真实组件方式使用图标，保留类型提示、自动补全和重构体验。
  - title: 按需加载
    details: 基于 ES Module 输出，业务项目只打包实际导入的图标。
  - title: 多框架包
    details: 对齐 Lucide 官方覆盖范围，支持 Core JS、React、Vue、Svelte、Solid、Preact、React Native、Angular、Astro 和 Static。
  - title: 自动化发布
    details: 支持 GitHub Actions、npm Trusted Publishing 和后续内网 registry 扩展。
---

<script setup>
import HomePackagesSection from '../.vitepress/theme/components/home/HomePackagesSection.vue'
import HomeIconCustomizer from '../.vitepress/theme/components/home/HomeIconCustomizer.vue'
</script>

<HomePackagesSection />
<HomeIconCustomizer />
