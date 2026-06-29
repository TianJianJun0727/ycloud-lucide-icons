<script setup lang="ts">
defineProps<{
  svg: string;
  size?: number;
}>();
</script>

<template>
  <div
    class="business-icon-preview"
    :style="size ? { '--business-preview-size': `${size}px` } : undefined"
    v-html="svg"
  />
</template>

<style scoped>
.business-icon-preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--business-preview-size, calc(var(--customize-size, 24) * 1px));
  height: var(--business-preview-size, calc(var(--customize-size, 24) * 1px));
  color: var(--customize-color, var(--vp-c-text-1));
}

.business-icon-preview :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
</style>
