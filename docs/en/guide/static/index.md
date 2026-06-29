---
title: Overview
nextPage:
  - getting-started
---

<script setup>
import OverviewLink from '../../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { ycloudStaticSidebar } from '../../../.vitepress/sidebar/static'
</script>

<!--@include: ../../../docs/images/package-logos/ycloud.svg -->

# YCloud Static Assets

Static assets and utilities for YCloud icons that work without JavaScript frameworks. This package provides multiple formats including generic SVG files, business SVG files, SVG sprites, generic icon fonts, business icon fonts, and Node.js utilities for server-side rendering and static site generation.

**What you can accomplish:**

- Use generic or business SVG files as images or CSS background images
- Implement generic and business icon fonts for CSS-based icon systems
- Create SVG sprites for efficient icon loading in static sites
- Import SVG strings in Node.js applications and server-side rendering
- Build static websites and applications without JavaScript framework dependencies

This package includes the following implementations of YCloud icons:

- Generic SVG files
- Business SVG files
- SVG sprite
- Generic icon font files
- Business icon font files
- A JavaScript library exporting SVG strings

## Overview

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudStaticSidebar[0].items.slice(1)" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### SVG Files & Sprite

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudStaticSidebar[1].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid >

### Icon Font

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudStaticSidebar[2].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid >

### Javascript modules

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudStaticSidebar[3].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid >
