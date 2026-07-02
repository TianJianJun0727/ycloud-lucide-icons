<script setup lang="ts">
defineProps<{
  svg: string;
}>();
</script>

<template>
  <div
    class="illustration-preview"
    v-html="svg"
  />
</template>

<style scoped>
.illustration-preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.illustration-preview :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
