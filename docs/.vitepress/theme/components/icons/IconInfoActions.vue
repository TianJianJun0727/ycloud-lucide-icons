<script setup lang="ts">
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue';
import { resolveBrowserHref } from '@theme/utils/navigation';
import CopyCodeButton from './CopyCodeButton.vue';
import CopySVGButton from './CopySVGButton.vue';

const props = defineProps<{
  name: string;
  detailPath: string;
  detailText: string;
  isCurrentDetail?: boolean;
  popoverPosition?: 'top' | 'bottom';
}>();

function openDetail(event: MouseEvent) {
  event.preventDefault();

  const targetHref = resolveBrowserHref(props.detailPath);
  const currentUrl = new URL(window.location.href);
  const targetUrl = new URL(targetHref, currentUrl.origin);

  if (currentUrl.pathname === targetUrl.pathname) {
    window.location.reload();
    return;
  }

  window.location.assign(targetHref);
}
</script>

<template>
  <div class="group buttons">
    <VPButton
      v-if="!isCurrentDetail"
      :href="detailPath"
      :text="detailText"
      @click="openDetail"
    />
    <CopySVGButton
      :name="name"
      :popoverPosition="popoverPosition"
    />
    <CopyCodeButton
      :name="name"
      :popoverPosition="popoverPosition"
    />
  </div>
</template>

<style scoped>
.group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.buttons {
  flex: 0 0 auto;
  margin-top: 24px;
}
</style>
