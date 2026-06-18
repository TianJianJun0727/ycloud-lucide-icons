---
title: YCloud Icons for React
description: YCloud Icons provides a React icon component library. Each icon is available as a standalone React component for tree-shaking and TypeScript autocomplete.
nextPage:
  - getting-started
---

<script setup>
import OverviewLink from '../../.vitepress/theme/components/base/OverviewLink.vue'
import OverviewLinkGrid from '../../.vitepress/theme/components/base/OverviewLinkGrid.vue'
import { reactSidebar } from '../../.vitepress/sidebar/react'
</script>

<!--@include: ../../../docs/images/package-logos/ycloud-react.svg -->

# YCloud Icons for React

YCloud Icons provides a React component library for using icons in your applications. Each icon is available as a standalone component that renders an optimized inline SVG.

List of features:

- **Easy to use** – Import icons and use them directly in JSX.
- **Customizable** – Adjust size, color, stroke width, and other properties via props.
- **Tree-shakable** – Only the icons you import are included in your final bundle.
- **TypeScript support** – Fully typed components for a better developer experience.
- **Style entrypoints** – Component names stay stable, while style variants can be separated by package entrypoints.

## Overview

<OverviewLinkGrid>
  <OverviewLink v-for="item in reactSidebar[0].items.slice(1)" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### Basics

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in reactSidebar[1].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>

### Advanced

{{''}}

<OverviewLinkGrid>
  <OverviewLink v-for="item in reactSidebar[2].items" :key="item.link" :href="item.link" :title="item.text" :desc="item.desc"/>
</OverviewLinkGrid>
