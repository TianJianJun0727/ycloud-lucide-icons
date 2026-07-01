<script setup lang="ts">
import { computed } from 'vue';
import { useData, useRouter } from 'vitepress';
import type { BusinessIconEntity } from '@theme/types';
import IconButton from '../base/IconButton.vue';
import BusinessIconPreview from './BusinessIconPreview.vue';
import BusinessIconInfo from './BusinessIconInfo.vue';
import { createYCloudIcon } from '@ycloud-web/icons-vue';
import { expand, x } from '@data/iconNodes';
import { resolveBrowserHref, resolveRoutePath } from '@theme/utils/navigation';

const props = defineProps<{
  icon: BusinessIconEntity | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { page } = useData();
const { go } = useRouter();
const isEnglish = computed(() => page.value.relativePath?.startsWith?.('en/') ?? false);
const CloseIcon = createYCloudIcon('Close', x);
const Expand = createYCloudIcon('Expand', expand);

function openDetailPage(iconName: string) {
  const targetHref = resolveBrowserHref(
    `${isEnglish.value ? '/en' : ''}/business-icons/${iconName}`,
  );
  const currentUrl = new URL(window.location.href);
  const targetUrl = new URL(targetHref, currentUrl.origin);

  if (currentUrl.pathname === targetUrl.pathname) {
    window.location.reload();
    return;
  }

  go(resolveRoutePath(targetHref));
}
</script>

<template>
  <Transition
    name="drawer"
    appear
  >
    <div
      v-if="icon"
      class="overlay-container"
    >
      <div class="overlay-panel">
        <nav class="overlay-menu">
          <IconButton @click="openDetailPage(icon.name)">
            <component :is="Expand" />
          </IconButton>
          <IconButton @click="emit('close')">
            <component :is="CloseIcon" />
          </IconButton>
        </nav>

        <div class="business-preview-large">
          <BusinessIconPreview :svg="icon.svg" />
        </div>

        <BusinessIconInfo
          :icon="icon"
          popoverPosition="top"
        />
      </div>
    </div>
  </Transition>
</template>

<style src="./confetti.css" />

<style scoped>
.overlay-container {
  position: fixed;
  inset: auto var(--right, 0) 0 var(--left, 0);
  pointer-events: none;
  z-index: 40;
}

@media (min-width: 960px) {
  .overlay-container {
    --left: var(--vp-sidebar-width);
  }
}

@media (min-width: 1440px) {
  .overlay-container {
    --left: calc((100% - (var(--vp-layout-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px);
    --right: calc(((100% - (var(--vp-layout-max-width) - var(--vp-sidebar-width))) - 272px) / 2);
  }
}

.overlay-panel {
  position: relative;
  display: flex;
  gap: 24px;
  width: 100%;
  height: 288px;
  padding: 24px;
  pointer-events: all;
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-5);
}

.overlay-menu {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
  align-items: center;
}

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

:deep(.business-icon-info) {
  flex-basis: 100%;
  min-width: 0;
  padding-right: 112px;
}

.drawer-enter-active {
  transition:
    opacity 0.5s,
    transform 0.25s ease;
}

.drawer-leave-active {
  transition:
    opacity 0.25s ease,
    transform 1.6s ease-out;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 639px) {
  .overlay-panel {
    display: block;
    height: auto;
  }

  :deep(.business-icon-info) {
    padding-right: 0;
  }

  .business-preview-large {
    width: 100%;
    max-width: none;
    margin-bottom: 24px;
  }
}
</style>
