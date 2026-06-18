---
title: YCloud for Vanilla JavaScript
description: The core YCloud Icons package for vanilla JavaScript applications. Learn how to add scalable vector icons to any web project without framework dependencies.
nextPage:
  - getting-started
---

<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { ycloudSidebar } from '../../.vitepress/sidebar/ycloud'
</script>

<!--@include: ../../../docs/images/package-logos/ycloud.svg -->

# YCloud for Vanilla JavaScript

The core YCloud Icons package for vanilla JavaScript applications. This package allows you to easily add scalable vector icons to any web project without framework dependencies. Perfect for static websites, legacy applications, or when you need lightweight icon integration with maximum browser compatibility.

**What you can accomplish:**

- Add icons to HTML using simple data attributes
- Dynamically create and insert SVG icons with JavaScript
- Customize icon appearance with CSS classes and inline styles
- Tree-shake unused icons to keep bundle sizes minimal
- Use icons in Vanilla JS with HTML

YCloud is designed to be lightweight and easy to use, making it an excellent choice for projects that require icons without the overhead of a full framework integration.

## Overview

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudSidebar[0].items.slice(1)" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### Basics

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudSidebar[1].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### Advanced

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in ycloudSidebar[2].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>
