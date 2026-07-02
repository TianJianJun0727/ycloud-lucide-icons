<script setup lang="ts">
import type { BusinessIconEntity } from '@theme/types';
import IconDetailOverlayShell from './IconDetailOverlayShell.vue';
import BusinessIconPreview from './BusinessIconPreview.vue';
import BusinessIconInfo from './BusinessIconInfo.vue';

const props = defineProps<{
  icon: BusinessIconEntity | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

</script>

<template>
  <IconDetailOverlayShell
    :open="!!icon"
    @close="emit('close')"
  >
    <div
      v-if="icon"
      class="business-preview-large"
    >
      <BusinessIconPreview
        id="previewer"
        :svg="icon.svg"
      />
    </div>
    <BusinessIconInfo
      v-if="icon"
      :icon="icon"
      popoverPosition="top"
    />
  </IconDetailOverlayShell>
</template>

<style scoped>
.business-preview-large {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 240px;
  max-width: 240px;
  flex-shrink: 0;
  border-radius: 8px;
  background-color: var(--vp-c-bg-alt);
  background-image:
    linear-gradient(var(--vp-c-divider) 1px, transparent 1px),
    linear-gradient(90deg, var(--vp-c-divider) 1px, transparent 1px);
  background-size: 12px 12px;
}

.business-preview-large :deep(.business-icon-preview) {
  width: calc(var(--customize-size, 24) * 4px);
  height: calc(var(--customize-size, 24) * 4px);
  max-width: 128px;
  max-height: 128px;
}

@media (max-width: 639px) {
  .business-preview-large {
    width: 100%;
    max-width: none;
    margin-bottom: 24px;
  }
}
</style>
