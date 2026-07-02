<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { createYCloudIcon } from '@ycloud-web/icons-vue';
import { arrowLeft } from '@data/iconNodes';
import IconButton from '../base/IconButton.vue';

const props = defineProps<{
  fallbackHref: string;
}>();

const { page } = useData();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const label = computed(() => (isEnglish.value ? 'Back' : '返回'));
const BackIcon = createYCloudIcon('ArrowLeft', arrowLeft);

function goBack() {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.location.href = withBase(props.fallbackHref);
}
</script>

<template>
  <IconButton
    type="button"
    class="detail-back-button"
    :aria-label="label"
    :title="label"
    @click="goBack"
  >
    <BackIcon />
  </IconButton>
</template>

<style scoped>
.detail-back-button {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  width: 36px !important;
  height: 36px !important;
  min-width: 36px;
  max-width: 36px;
  margin-bottom: 12px;
  padding: 0 !important;
  color: var(--vp-c-text-1);
  font-size: 18px;
}

.detail-back-button :deep(svg) {
  width: 1em;
  height: 1em;
}
</style>
