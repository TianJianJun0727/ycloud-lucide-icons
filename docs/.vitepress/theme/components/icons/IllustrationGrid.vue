<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { IllustrationEntity } from '@theme/types';
import IllustrationPreview from './IllustrationPreview.vue';
import Tooltip from '../base/Tooltip.vue';

defineProps<{
  illustrations: IllustrationEntity[];
  activeIllustration?: string;
}>();

const emit = defineEmits<{
  select: [illustration: IllustrationEntity];
}>();

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);

function getDisplayName(illustration: IllustrationEntity) {
  return isEnglish.value
    ? (illustration.englishName ?? illustration.displayName)
    : illustration.displayName;
}
</script>

<template>
  <div class="illustration-grid">
    <Tooltip
      v-for="illustration in illustrations"
      :key="illustration.name"
      :title="getDisplayName(illustration)"
    >
      <button
        type="button"
        class="illustration-card"
        :class="{ active: activeIllustration === illustration.name }"
        :aria-label="getDisplayName(illustration)"
        @click="emit('select', illustration)"
      >
        <span class="illustration-preview-wrap">
          <IllustrationPreview :svg="illustration.svg" />
        </span>
        <span class="illustration-name">{{ getDisplayName(illustration) }}</span>
      </button>
    </Tooltip>
  </div>
</template>

<style scoped>
.illustration-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
}

.illustration-card {
  display: grid;
  grid-template-rows: 1fr auto;
  box-sizing: border-box;
  width: 100%;
  height: 190px;
  min-width: 0;
  gap: 12px;
  padding: 14px;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition:
    border-color 0.25s,
    background-color 0.25s;
}

.illustration-card:hover,
.illustration-card:focus,
.illustration-card.active {
  border-color: var(--vp-c-brand);
}

.illustration-card:hover,
.illustration-card:focus {
  background: var(--vp-c-bg-soft);
}

.illustration-preview-wrap {
  display: grid;
  align-items: center;
  justify-content: center;
  place-items: center;
  width: 100%;
  min-height: 0;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}

.illustration-preview-wrap :deep(svg) {
  width: min(80%, 180px);
  height: auto;
  max-width: 100%;
  max-height: 112px;
}

.illustration-name {
  overflow: hidden;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 959px) {
  .illustration-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 639px) {
  .illustration-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
