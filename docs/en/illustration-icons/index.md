---
title: Illustrations
description: Browse all YCloud Icons illustrations.
layout: page
outline: 2
sidebar: true
head:
  - - link
    - rel: canonical
      content: https://tianjianjun0727.github.io/ycloud-icons/en/illustration-icons/
---

<script setup>
import { computed, ref } from 'vue'
import { data } from './illustration.data.ts'
import PageContainer from '~/.vitepress/theme/components/PageContainer.vue'
import InputSearch from '~/.vitepress/theme/components/base/InputSearch.vue'
import NoResults from '~/.vitepress/theme/components/icons/NoResults.vue'

const searchQuery = ref('')
const filteredIllustrations = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) return data.illustrations

  return data.illustrations.filter((item) =>
    item.name.includes(query) ||
    item.displayName.toLowerCase().includes(query) ||
    item.componentName.toLowerCase().includes(query) ||
    item.path.toLowerCase().includes(query)
  )
})
</script>

<div class="VPDoc content">
  <PageContainer>
    <div class="illustration-overview">
      <p class="muted">{{ data.illustrations.length }} illustrations. Illustrations keep their original SVG colors and size attributes. Components default to width="100%" height="auto".</p>
      <InputSearch
        v-model="searchQuery"
        :placeholder="`Search ${data.illustrations.length} illustrations...`"
        class="illustration-search"
      />
      <NoResults
        v-if="filteredIllustrations.length === 0"
        :searchQuery="searchQuery"
        :isBrandSearch="false"
        @clear="searchQuery = ''"
      />
      <div class="illustration-grid">
        <a
          v-for="item in filteredIllustrations"
          :key="item.name"
          class="illustration-card"
          :href="`/en/illustration-icons/${item.name}`"
        >
          <span class="illustration-preview" v-html="item.svg" />
          <span class="illustration-name">{{ item.displayName }}</span>
          <span class="illustration-path">{{ item.path }}</span>
        </a>
      </div>
    </div>
  </PageContainer>
</div>

<style scoped>
.illustration-overview {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.muted {
  color: var(--vp-c-text-2);
}

.illustration-search {
  width: 100%;
}

.illustration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.illustration-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: inherit;
  padding: 14px;
  text-decoration: none;
}

.illustration-card:hover {
  border-color: var(--vp-c-brand-1);
}

.illustration-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}

.illustration-preview :deep(svg) {
  max-width: 100%;
  height: auto;
  max-height: 112px;
}

.illustration-name {
  font-weight: 700;
}

.illustration-path {
  overflow: hidden;
  color: var(--vp-c-text-2);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
