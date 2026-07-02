<script setup lang="ts">
import type { IllustrationEntity } from '@theme/types';
import IconDetailOverlayShell from './IconDetailOverlayShell.vue';
import IllustrationInfo from './IllustrationInfo.vue';
import IllustrationPreview from './IllustrationPreview.vue';

defineProps<{
  illustration: IllustrationEntity | null;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <IconDetailOverlayShell
    :open="!!illustration"
    layout="page"
    @close="emit('close')"
  >
    <div
      v-if="illustration"
      class="illustration-preview-large"
    >
      <IllustrationPreview :svg="illustration.svg" />
    </div>
    <IllustrationInfo
      v-if="illustration"
      :illustration="illustration"
      popoverPosition="top"
    />
  </IconDetailOverlayShell>
</template>

<style scoped>
.illustration-preview-large {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  max-width: 240px;
  height: 240px;
  flex: 0 0 240px;
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
}

.illustration-preview-large :deep(svg) {
  width: min(100%, 200px);
  height: auto;
  max-width: 200px;
  max-height: 180px;
}

@media (max-width: 639px) {
  .illustration-preview-large {
    width: 100%;
    max-width: none;
    height: 160px;
    margin-bottom: 16px;
  }
}
</style>
