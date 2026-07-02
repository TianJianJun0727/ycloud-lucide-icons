<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { BusinessIconEntity } from '@theme/types';
import Tooltip from '../base/Tooltip.vue';
import BusinessIconPreview from './BusinessIconPreview.vue';

const props = defineProps<{
  icon: BusinessIconEntity;
  active?: boolean;
}>();

const emit = defineEmits<{
  select: [icon: BusinessIconEntity];
}>();

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const displayName = computed(() =>
  isEnglish.value ? (props.icon.englishName ?? props.icon.displayName) : props.icon.displayName,
);
</script>

<template>
  <Tooltip :title="displayName">
    <button
      type="button"
      class="business-icon-button"
      :class="{ active }"
      :aria-label="displayName"
      @click="emit('select', icon)"
    >
      <BusinessIconPreview :svg="icon.svg" />
    </button>
  </Tooltip>
</template>

<style scoped>
.business-icon-button {
  border: 1px solid transparent;
  border-radius: 6px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  padding: 0;
  transition:
    color 0.25s,
    border-color 0.25s,
    background-color 0.25s;
}

.business-icon-button:hover,
.business-icon-button:focus {
  border-color: var(--vp-button-alt-hover-border);
  background-color: var(--vp-button-alt-hover-bg);
}

.business-icon-button.active {
  border-color: var(--vp-c-brand);
}

.business-icon-button :deep(.business-icon-preview) {
  max-width: 48px;
  max-height: 48px;
}
</style>
