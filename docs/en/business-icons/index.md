---
title: Business icons
description: Browse all YCloud Icons business icons.
layout: page
outline: 2
outlineTitle: Categories
sidebar: true
head:
  - - link
    - rel: canonical
      content: https://tianjianjun0727.github.io/ycloud-icons/en/business-icons/
---

<script setup>
import { data } from './business-icons.data.ts'
import BusinessIconsOverview from '~/.vitepress/theme/components/icons/BusinessIconsOverview.vue'
import PageContainer from '~/.vitepress/theme/components/PageContainer.vue'
</script>

<div class="VPDoc content">
  <PageContainer>
    <BusinessIconsOverview
      :icons="data.icons"
      :categories="data.categories"
    />
  </PageContainer>
</div>
